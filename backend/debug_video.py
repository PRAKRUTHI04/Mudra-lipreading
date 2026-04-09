import os
import cv2
import torch
import numpy as np
import face_alignment
from collections import deque
from pathlib import Path

# --- Constants (Matching the model requirements) ---
STD_SIZE = (256, 256)
STABLE_PNTS_IDS = [33, 36, 39, 42, 45]
START_IDX = 48
STOP_IDX = 68
CROP_WIDTH = CROP_HEIGHT = 96

# Re-importing from local preprocessing if possible
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from preprocessing.transform import warp_img, cut_patch, landmarks_interpolate

def main(video_path):
    # Setup
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Using device: {device}")
    fa = face_alignment.FaceAlignment(face_alignment.LandmarksType.TWO_D, device=device)
    
    mean_face_path = os.path.join(os.path.dirname(__file__), 'preprocessing', 'words_mean_face.npy')
    mean_face_landmarks = np.load(mean_face_path)
    
    # Load video
    cap = cv2.VideoCapture(video_path)
    frames = []
    while True:
        ret, frame = cap.read()
        if not ret: break
        frames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    cap.release()
    
    if not frames:
        print("Error: Could not read video.")
        return

    print(f"Processing {len(frames)} frames for mouth extraction...")
    
    # 1. Landmark detection
    raw_landmarks = []
    for i, frame in enumerate(frames):
        lms = fa.get_landmarks(frame)
        raw_landmarks.append(lms[0] if lms else None)
    
    interpolated_lms = landmarks_interpolate(raw_landmarks)
    if not interpolated_lms:
        print("Error: No face detected.")
        return

    # 2. Smoothing
    SMOOTHING_WINDOW = 12
    smoothed_all_lms = []
    for i in range(len(interpolated_lms)):
        start = max(0, i - SMOOTHING_WINDOW // 2)
        end = min(len(interpolated_lms), i + SMOOTHING_WINDOW // 2 + 1)
        smoothed_all_lms.append(np.mean(interpolated_lms[start:end], axis=0))

    # 3. Alignment and Cropping
    save_dir = "debug_mouth_crops"
    os.makedirs(save_dir, exist_ok=True)
    print(f"Saving mouth crops to: {os.path.abspath(save_dir)}")
    
    for i in range(len(frames)):
        trans_f, trans = warp_img(smoothed_all_lms[i][STABLE_PNTS_IDS,:], 
                                 mean_face_landmarks[STABLE_PNTS_IDS,:], 
                                 frames[i], STD_SIZE)
        patch = cut_patch(trans_f, trans(interpolated_lms[i])[START_IDX:STOP_IDX], 
                         CROP_HEIGHT//2, CROP_WIDTH//2)
        
        # Save patch
        cv2.imwrite(os.path.join(save_dir, f"mouth_{i:03d}.jpg"), cv2.cvtColor(patch, cv2.COLOR_RGB2BGR))

    print("\nDONE! Please check the 'debug_mouth_crops' folder.")
    print("If the mouth is not centered, blurry, or very small, the AI will not be accurate.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python debug_video.py <video_path>")
    else:
        main(sys.argv[1])
