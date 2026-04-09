import argparse
import json
from collections import deque
from contextlib import contextmanager
from pathlib import Path

import cv2
import face_alignment
import numpy as np
import torch
from torchvision.transforms.functional import to_tensor

import sys
import os

# Add the project root to sys.path so we can import from lipreading
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from lipreading.model import Lipreading
from preprocessing.transform import warp_img, cut_patch, apply_transform, normalize_fps, normalize_sequence_length, landmarks_interpolate

# Constants
STD_SIZE = (256, 256)
STABLE_PNTS_IDS = [33, 36, 39, 42, 45]
START_IDX = 48
STOP_IDX = 68
CROP_WIDTH = CROP_HEIGHT = 96

@contextmanager
def VideoCapture(*args, **kwargs):
    cap = cv2.VideoCapture(*args, **kwargs)
    try:
        yield cap
    finally:
        cap.release()

def load_model_config(config_path: Path, num_classes):
    with config_path.open() as fp:
        config = json.load(fp)
    tcn_options = {
        'num_layers': config['tcn_num_layers'],
        'kernel_size': config['tcn_kernel_size'],
        'dropout': config['tcn_dropout'],
        'dwpw': config['tcn_dwpw'],
        'width_mult': config['tcn_width_mult'],
    }
    return Lipreading(
        num_classes=int(num_classes),
        tcn_options=tcn_options,
        backbone_type=config['backbone_type'],
        relu_type=config['relu_type'],
        width_mult=config['width_mult'],
        extract_feats=False,
    )

def main():
    parser = argparse.ArgumentParser(description='Run Lip Reading Prediction on a video file.')
    parser.add_argument('--video-path', type=str, required=True, help='Path to the video file.')
    parser.add_argument('--model-name', type=str, choices=['10', '20', '500'], default='500', 
                        help='Select model: 10, 20, or 500 word model.')
    parser.add_argument('--device', type=str, default='cuda' if torch.cuda.is_available() else 'cpu', 
                        help='Device to run on (cuda or cpu).')
    args = parser.parse_args()

    # Model Mapping
    models_info = {
        '20': {
            'modelName': '20-words-120-epochs.tar',
            'configFile': 'lrw_resnet18_mstcn.json',
            'wordsList': '20WordsSortedList.txt',
            'numClasses': 20
        },
        '500': {
            'modelName': 'lrw_resnet18_mstcn_adamw_s3.pth.tar',
            'configFile': 'lrw_resnet18_mstcn.json',
            'wordsList': '500WordsSortedList.txt',
            'numClasses': 500
        },
        '10': {
            'modelName': 'initial-10-words-model.tar',
            'configFile': 'lrw_resnet18_mstcn.json',
            'wordsList': '10WordsSortedList.txt',
            'numClasses': 500 # Initial 10 words model actually has 500 classes in config
        }
    }

    selected_model = models_info[args.model_name]
    
    # Correct paths relative to this script
    base_dir = Path(__file__).parent
    config_path = base_dir / 'configs' / selected_model['configFile']
    model_path = base_dir / 'models' / selected_model['modelName']
    words_path = base_dir / 'labels' / selected_model['wordsList']
    mean_face_path = base_dir / 'preprocessing' / 'words_mean_face.npy'

    print(f"--- Running Prediction ---")
    print(f"Video: {args.video_path}")
    print(f"Model: {selected_model['modelName']}")
    print(f"Device: {args.device}")

    # Load Vocab
    with words_path.open() as fp:
        vocab = [line.strip() for line in fp.readlines()]

    # Load Face Alignment
    # Using TWO_D to avoid potential LandMarksType errors
    try:
        fa = face_alignment.FaceAlignment(face_alignment.LandmarksType.TWO_D, device=args.device)
    except AttributeError:
        # Fallback for different face_alignment versions
        fa = face_alignment.FaceAlignment(face_alignment.LandmarksType._2D, device=args.device)

    # Load Model
    model = load_model_config(config_path, selected_model['numClasses'])
    checkpoint = torch.load(model_path, map_location=args.device)
    if 'model_state_dict' in checkpoint:
        model.load_state_dict(checkpoint['model_state_dict'])
    else:
        model.load_state_dict(checkpoint)
    model = model.to(args.device)
    model.eval()

    # Load mean face landmarks
    mean_face_landmarks = np.load(mean_face_path)

    # Processing Video
    with VideoCapture(args.video_path) as cap:
        original_fps = cap.get(cv2.CAP_PROP_FPS)
        frames = []
        while True:
            ret, frame = cap.read()
            if not ret: break
            frames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        
        if not frames:
            print("Error: No frames in video.")
            return

        print(f"Original: {len(frames)} frames @ {original_fps:.2f} FPS")

        # Automated Normalization
        if original_fps > 0:
            frames = normalize_fps(frames, original_fps, target_fps=25)
        
        # Only PAD if shorter than 29. Do NOT crop if longer,
        # because the sliding window logic will handle longer sequences.
        if len(frames) < 29:
            frames = normalize_sequence_length(frames, target_length=29)
        
        print(f"Normalized: {len(frames)} frames @ 25 FPS")

        # Detect Landmarks for all normalized frames
        raw_landmarks = []
        print("Detecting landmarks...")
        for i, frame in enumerate(frames):
            all_lms = fa.get_landmarks(frame)
            raw_landmarks.append(all_lms[0] if all_lms else None)
            if (i+1) % 10 == 0:
                print(f"  Processed {i+1}/{len(frames)} frames...")

        # Interpolate missing landmarks
        interpolated_lms = landmarks_interpolate(raw_landmarks)
        if not interpolated_lms:
            print("Error: No face detected in any frame.")
            return

        # 1. Temporal Smoothing (Windowed Mean)
        # Use standard window_margin=12 for matches training/preprocessing standard
        SMOOTHING_WINDOW = 12
        smoothed_all_lms = []
        for i in range(len(interpolated_lms)):
            start = max(0, i - SMOOTHING_WINDOW // 2)
            end = min(len(interpolated_lms), i + SMOOTHING_WINDOW // 2 + 1)
            smoothed_all_lms.append(np.mean(interpolated_lms[start:end], axis=0))
    
        # 2. Patch Extraction for ALL frames
        print("Extracting patches and enhancing contrast (CLAHE)...")
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        all_patches = []
        for i in range(len(frames)):
            trans_f, trans = warp_img(smoothed_all_lms[i][STABLE_PNTS_IDS,:], 
                                     mean_face_landmarks[STABLE_PNTS_IDS,:], 
                                     frames[i], STD_SIZE)
            patch = cut_patch(trans_f, trans(interpolated_lms[i])[START_IDX:STOP_IDX], 
                             CROP_HEIGHT//2, CROP_WIDTH//2)
            
            # CLAHE for better features
            patch_gray = cv2.cvtColor(patch, cv2.COLOR_RGB2GRAY)
            patch_clahe = clahe.apply(patch_gray)
            patch = cv2.cvtColor(patch_clahe, cv2.COLOR_GRAY2RGB)

            all_patches.append(patch)
    
        # 3. Sliding Window Inference (Hyper-Density)
        WINDOW_T = 29
        STEP = 1 # Maximum density scan
        
        n_patches = len(all_patches)
        window_indices = list(range(0, n_patches - WINDOW_T + 1, STEP))
        if n_patches >= WINDOW_T and (n_patches - WINDOW_T) not in window_indices:
            window_indices.append(n_patches - WINDOW_T)
            
        if not window_indices:
            window_indices = [0]
    
        print(f"Analyzing {len(window_indices)} windows (Hyper-Inference/Temporal Averaging)...")

        all_windows_probs = []
        for start_idx in window_indices:
            window = all_patches[start_idx : start_idx + WINDOW_T]
            
            with torch.no_grad():
                # Prepare base tensor for 6-way TTA
                tensors = [to_tensor(cv2.cvtColor(p, cv2.COLOR_RGB2GRAY)) for p in window]
                base_tensor = torch.stack(tensors, dim=1).to(args.device)
                base_tensor = (base_tensor - 0.421) / 0.165

                # 6-way TTA (Center + 2 Jitters + Flips)
                offsets = [(4, 92, 4, 92), (2, 90, 2, 90), (6, 94, 6, 94)]
                
                window_probs = []
                for dy1, dy2, dx1, dx2 in offsets:
                    variant = base_tensor[:, :, dy1:dy2, dx1:dx2].unsqueeze(0)
                    # Original
                    logits = model(variant, lengths=[WINDOW_T])
                    window_probs.append(torch.nn.functional.softmax(logits, dim=-1)[0].cpu().numpy())
                    # Flipped
                    flipped = torch.flip(variant, dims=[4])
                    logits_f = model(flipped, lengths=[WINDOW_T])
                    window_probs.append(torch.nn.functional.softmax(logits_f, dim=-1)[0].cpu().numpy())
                
                all_windows_probs.append(np.mean(window_probs, axis=0))
        
        # --- Class Masking & Final Averaging ---
        final_probs = np.mean(all_windows_probs, axis=0)
        
        mask = np.zeros_like(final_probs)
        num_vocab_words = len(vocab)
        mask[:num_vocab_words] = 1.0
        final_probs = final_probs * mask
        # ---------------------
    
        top_idx = np.argmax(final_probs)
        best_conf = float(final_probs[top_idx])
        best_word = vocab[top_idx] if top_idx < len(vocab) else f"Idx_{top_idx}"

        print(f"\n==============================")
        print(f"FINAL AVERAGED PREDICTION: {best_word}")
        print(f"CONFIDENCE: {best_conf:.4f}")
        print(f"==============================\n")

if __name__ == '__main__':
    main()
