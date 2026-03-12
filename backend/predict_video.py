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
from lipreading.preprocessing.transform import warp_img, cut_patch

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
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        print(f"Total Frames: {total_frames} (FPS: {fps:.2f})")
        
        queue = []
        
        frame_idx = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            all_landmarks = fa.get_landmarks(frame_rgb)
            
            if all_landmarks:
                landmarks = all_landmarks[0]
                trans_frame, trans = warp_img(
                    landmarks[STABLE_PNTS_IDS, :], mean_face_landmarks[STABLE_PNTS_IDS, :], frame_rgb, STD_SIZE)
                trans_landmarks = trans(landmarks)
                patch = cut_patch(
                    trans_frame, trans_landmarks[START_IDX:STOP_IDX], CROP_HEIGHT // 2, CROP_WIDTH // 2)
                
                patch_gray = cv2.cvtColor(patch, cv2.COLOR_RGB2GRAY)
                patch_torch = to_tensor(patch_gray).to(args.device)
                queue.append(patch_torch)
            
            frame_idx += 1
            if frame_idx % 10 == 0:
                print(f"Processed {frame_idx}/{total_frames} frames...", end='\r')

        print(f"\nProcessing complete. Running inference...")

        if len(queue) > 0:
            with torch.no_grad():
                # Shape expected: (1, 1, T, H, W)
                model_input = torch.stack(queue, dim=1).unsqueeze(0)
                logits = model(model_input, lengths=[len(queue)])
                probs = torch.nn.functional.softmax(logits, dim=-1)
                probs = probs[0].cpu().numpy()
                
                top_idx = np.argmax(probs)
                prediction = vocab[top_idx]
                confidence = probs[top_idx]
                
                print(f"\n==============================")
                print(f"PREDICTION: {prediction}")
                print(f"CONFIDENCE: {confidence:.4f}")
                print(f"==============================\n")
        else:
            print("No faces detected in the video.")

if __name__ == '__main__':
    main()
