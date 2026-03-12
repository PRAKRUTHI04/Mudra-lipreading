import os
import sys
import json
import glob
import random
from pathlib import Path

import torch
import numpy as np
import cv2

# Ensure we can import from lipreading locally
root_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(root_dir)

try:
    from lipreading.model import Lipreading
    from preprocessing.transform import warp_img, cut_patch, apply_transform
    import face_alignment
    from torchvision.transforms.functional import to_tensor
except Exception as e:
    print(f"Error importing modules: {e}")
    sys.exit(1)

# Check for GPU
device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f"Using device: {device}")

STD_SIZE = (256, 256)
STABLE_PNTS_IDS = [33, 36, 39, 42, 45]
START_IDX = 48
STOP_IDX = 68
CROP_WIDTH = CROP_HEIGHT = 96

def load_model_from_config(config_path, num_classes):
    with open(config_path, 'r') as fp:
        config = json.load(fp)
    tcn_options = {
        'num_layers': config['tcn_num_layers'],
        'kernel_size': config['tcn_kernel_size'],
        'dropout': config['tcn_dropout'],
        'dwpw': config['tcn_dwpw'],
        'width_mult': config['tcn_width_mult'],
    }
    return Lipreading(
        num_classes=num_classes,
        tcn_options=tcn_options,
        backbone_type=config['backbone_type'],
        relu_type=config['relu_type'],
        width_mult=config['width_mult'],
        extract_feats=False,
    )

def landmarks_interpolate(landmarks):
    valid_frames_idx = [idx for idx, _ in enumerate(landmarks) if _ is not None]
    if not valid_frames_idx:
        return None
    for idx in range(1, len(valid_frames_idx)):
        if valid_frames_idx[idx] - valid_frames_idx[idx-1] == 1:
            continue
        else:
            # Linear interpolation
            start_idx = valid_frames_idx[idx-1]
            stop_idx = valid_frames_idx[idx]
            start_landmarks = landmarks[start_idx]
            stop_landmarks = landmarks[stop_idx]
            delta = stop_landmarks - start_landmarks
            for i in range(1, stop_idx - start_idx):
                landmarks[start_idx + i] = start_landmarks + i / float(stop_idx - start_idx) * delta
    # Corner case: keep frames at the beginning or at the end failed to be detected.
    landmarks[:valid_frames_idx[0]] = [landmarks[valid_frames_idx[0]]] * valid_frames_idx[0]
    landmarks[valid_frames_idx[-1]:] = [landmarks[valid_frames_idx[-1]]] * (len(landmarks) - valid_frames_idx[-1])
    return landmarks

def test_video(model, fa, mean_face_landmarks, video_path, vocab, device='cpu'):
    cap = cv2.VideoCapture(video_path)
    frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    cap.release()
    
    if not frames:
        return None, 0.0

    # 1. Detect Landmarks for all frames
    raw_landmarks = []
    for frame in frames:
        all_lms = fa.get_landmarks(frame)
        raw_landmarks.append(all_lms[0] if all_lms else None)
    
    # 2. Interpolate Landmarks
    interpolated_lms = landmarks_interpolate(raw_landmarks)
    if not interpolated_lms:
        return None, 0.0
    
    # 3. Temporal Smoothing (Windowed Mean)
    # Matching crop_mouth_from_video.py logic
    from collections import deque
    window_margin = 12
    q_frame = deque()
    q_landmarks = deque()
    
    sequence = []
    for i in range(len(frames)):
        q_frame.append(frames[i])
        q_landmarks.append(interpolated_lms[i])
        
        if len(q_frame) == window_margin:
            smoothed_lms = np.mean(q_landmarks, axis=0)
            cur_frame = q_frame.popleft()
            cur_lms = q_landmarks.popleft()
            
            trans_frame, trans = warp_img(
                smoothed_lms[STABLE_PNTS_IDS, :], mean_face_landmarks[STABLE_PNTS_IDS, :], cur_frame, STD_SIZE)
            trans_landmarks = trans(cur_lms)
            patch = cut_patch(
                trans_frame, trans_landmarks[START_IDX:STOP_IDX], CROP_HEIGHT // 2, CROP_WIDTH // 2)
            sequence.append(patch)
            
    # Handle remaining frames in queue (drain the buffer)
    # Based on official implementation: once the window is full, the last transform is reused.
    while q_frame:
        cur_frame = q_frame.popleft()
        cur_lms = q_landmarks.popleft()
        trans_frame = apply_transform(trans, cur_frame, STD_SIZE)
        trans_landmarks = trans(cur_lms)
        patch = cut_patch(
            trans_frame, trans_landmarks[START_IDX:STOP_IDX], CROP_HEIGHT // 2, CROP_WIDTH // 2)
        sequence.append(patch)
        
    if not sequence:
        return None, 0.0

    # 4. Preparing Tensors (Standard & Flipped for TTA)
    # sequence is [H, W, 3] list
    gray_sequence = [cv2.cvtColor(p, cv2.COLOR_RGB2GRAY) for p in sequence]
    tensors = [to_tensor(p) for p in gray_sequence]
    frames_tensor = torch.stack(tensors, dim=1).to(device) # (1, T, 96, 96)
    
    # Preprocessing
    # Center Crop 96x96 -> 88x88
    frames_tensor = frames_tensor[:, :, 4:92, 4:92]
    # Normalization
    mean, std = 0.421, 0.165
    frames_tensor = (frames_tensor - mean) / std
    
    # Horizontal Flip TTA
    # frames_tensor shape: (1, T, 88, 88)
    flipped_tensor = torch.flip(frames_tensor, dims=[3])
    
    input_batch = torch.stack([frames_tensor, flipped_tensor], dim=0) # (2, 1, T, 88, 88)
    
    with torch.no_grad():
        logits = model(input_batch, lengths=[len(sequence)]*2)
        probs = torch.nn.functional.softmax(logits, dim=-1) # (2, NumClasses)
        avg_probs = torch.mean(probs, dim=0).detach().cpu().numpy()
        
    top = np.argmax(avg_probs)
    conf = float(avg_probs[top])
    
    if top < len(vocab):
        predicted_word = vocab[top]
    else:
        predicted_word = f"Index_{top}"
        
    return predicted_word, conf

def main():
    model_config_path = os.path.join(root_dir, 'models', 'model_config.json')
    val_dataset_dir = r"D:\lrw\lipread_mp4"
    
    if not os.path.exists(model_config_path):
        print(f"Cannot find model config at {model_config_path}")
        return
        
    with open(model_config_path, 'r') as f:
        config_data = json.load(f)
        
    fa = face_alignment.FaceAlignment(face_alignment.LandmarksType.TWO_D, device=device)
    mean_face_path = os.path.join(root_dir, 'preprocessing', 'words_mean_face.npy')
    if not os.path.exists(mean_face_path):
        mean_face_path = os.path.join(root_dir, 'preprocessing', '20words_mean_face.npy')
    
    try:
        mean_face_landmarks = np.load(mean_face_path)
    except Exception as e:
        print(f"Error loading mean face: {e}")
        return

    results = []
    cases_per_model = 30
    models_list = config_data.get('models', [])
    
    print(f"Testing a total of {len(models_list) * cases_per_model} cases across {len(models_list)} models ({cases_per_model} each).\n")

    summary_conclusions = []

    for m_info in models_list:
        model_file = m_info['modelName']
        num_classes = m_info['numClasses']
        vocab_file = m_info['wordsList']
        config_file = m_info['configFile']
        display_name = m_info['displayName']
        
        print(f"--- Testing Model: {display_name} ({model_file}) ---")
        
        vocab_path = os.path.join(root_dir, 'labels', vocab_file)
        if not os.path.exists(vocab_path):
            print(f"Vocab file missing: {vocab_path}")
            continue
            
        with open(vocab_path, 'r') as vf:
            vocab = [w.strip() for w in vf.readlines() if w.strip()]
            
        full_model_path = os.path.join(root_dir, 'models', model_file)
        full_config_path = os.path.join(root_dir, 'configs', config_file)
        
        try:
            model = load_model_from_config(full_config_path, num_classes)
            checkpoint = torch.load(full_model_path, map_location=device)
            if 'model_state_dict' in checkpoint:
                model.load_state_dict(checkpoint['model_state_dict'])
            else:
                model.load_state_dict(checkpoint)
            model = model.to(device)
            model.eval()
        except Exception as e:
            print(f"Failed to load model {model_file}: {e}")
            continue
            
        # Sample test cases
        selected_cases = []
        sample_pool = list(vocab)
        while len(selected_cases) < cases_per_model and sample_pool:
            hw = random.choice(sample_pool)
            test_videos = glob.glob(os.path.join(val_dataset_dir, hw, 'test', '*.mp4'))
            if not test_videos:
                test_videos = glob.glob(os.path.join(val_dataset_dir, hw, 'val', '*.mp4'))
            if test_videos:
                selected_cases.append((hw, random.choice(test_videos)))
            else:
                sample_pool.remove(hw)
                
        print(f"Selected {len(selected_cases)} random videos for this model.")
        
        model_pass_count = 0
        model_total_count = 0
        
        for target_word, v_path in selected_cases:
            try:
                pred, conf = test_video(model, fa, mean_face_landmarks, v_path, vocab, device=device)
                passed = (pred is not None and target_word.lower() == pred.lower())
                if passed:
                    model_pass_count += 1
                model_total_count += 1
                
                res = {
                    "Model": display_name,
                    "Target Word": target_word,
                    "Predicted": pred if pred else "None",
                    "Passed": "Pass" if passed else "Fail",
                    "Confidence": f"{conf:.2f}"
                }
                results.append(res)
                print(f"[{'PASS' if passed else 'FAIL'}] Target: {target_word} | Pred: {pred} | Conf: {conf:.2f}")
            except Exception as e:
                print(f"Error testing {target_word} at {v_path}: {e}")
        
        summary_conclusions.append({
            "Model": display_name,
            "Passed": model_pass_count,
            "Failed": model_total_count - model_pass_count,
            "Total": model_total_count
        })
                
    
    print("\n\n### Detailed Test Results\n")
    print("| Model | Target Word | Predicted | Result | Confidence |")
    print("|---|---|---|---|---|")
    for r in results:
        print(f"| {r['Model']} | {r['Target Word']} | {r['Predicted']} | {r['Passed']} | {r['Confidence']} |")
    
    print("\n\n### Conclusion (Summary per Model)\n")
    print("| Model | Passed | Failed | Total | Accuracy |")
    print("|---|---|---|---|---|")
    for s in summary_conclusions:
        accuracy = (s['Passed'] / s['Total'] * 100) if s['Total'] > 0 else 0
        print(f"| {s['Model']} | {s['Passed']} | {s['Failed']} | {s['Total']} | {accuracy:.1f}% |")

if __name__ == "__main__":
    main()
