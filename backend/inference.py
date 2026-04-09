import os
import sys
import json
import torch
import numpy as np
import cv2
from collections import deque
import face_alignment
from torchvision.transforms.functional import to_tensor

# Add parent directory to path to allow importing lipreading
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from lipreading.model import Lipreading
from preprocessing.transform import warp_img, cut_patch, apply_transform, normalize_fps, normalize_sequence_length, landmarks_interpolate

class LipreadingInference:
    def __init__(self, root_dir, device='cpu'):
        self.root_dir = root_dir
        self.device = device
        self.std_size = (256, 256)
        self.stable_pnts_ids = [33, 36, 39, 42, 45]
        self.start_idx, self.stop_idx = 48, 68
        self.crop_width = self.crop_height = 96
        self.window_margin = 14  # Slightly wider smoothing window for stabler lip tracks
        self.mean_face_path = os.path.join(root_dir, 'preprocessing', 'words_mean_face.npy')
        self.mean_face_lms = np.load(self.mean_face_path)
        self.fa = None # Lazy load
        self.current_model = None
        self.current_vocab = None
        self.current_model_name = None

    def _get_fa(self):
        if self.fa is None:
            self.fa = face_alignment.FaceAlignment(face_alignment.LandmarksType.TWO_D, device=self.device)
        return self.fa

    def load_model(self, model_info):
        model_name = model_info['modelName']
        if self.current_model_name == model_name:
            return

        # ── Step 1: load the checkpoint first ──────────────────────────────
        ckpt_path = os.path.join(self.root_dir, 'models', model_name)
        ckpt = torch.load(ckpt_path, map_location=self.device, weights_only=False)
        state_dict = ckpt['model_state_dict'] if 'model_state_dict' in ckpt else ckpt

        # ── Step 2: Slice weights if checkpoint is larger than config dictates ────
        desired_classes = model_info['numClasses']
        for key in ['tcn.tcn_output.weight', 'tcn.mb_ms_tcn.weight']:
            if key in state_dict:
                ckpt_classes = state_dict[key].shape[0]
                if ckpt_classes > desired_classes:
                    print(f"Slicing {key} from {ckpt_classes} down to {desired_classes}")
                    state_dict[key] = state_dict[key][:desired_classes, :]
                    bias_key = key.replace('.weight', '.bias')
                    if bias_key in state_dict:
                        state_dict[bias_key] = state_dict[bias_key][:desired_classes]
                break

        # ── Step 3: build the model with the exact config num_classes ─
        config_path = os.path.join(self.root_dir, 'configs', model_info['configFile'])
        with open(config_path, 'r') as fp:
            config = json.load(fp)

        tcn_options = {
            'num_layers': config['tcn_num_layers'],
            'kernel_size': config['tcn_kernel_size'],
            'dropout': config['tcn_dropout'],
            'dwpw': config['tcn_dwpw'],
            'width_mult': config['tcn_width_mult'],
        }

        model = Lipreading(
            num_classes=desired_classes,

            tcn_options=tcn_options,
            backbone_type=config['backbone_type'],
            relu_type=config['relu_type'],
            width_mult=config['width_mult'],
        ).to(self.device)

        model.load_state_dict(state_dict)
        model.eval()

        # ── Step 4: load the vocabulary that exactly matches desired_classes ─
        VOCAB_MAP = {
            10:  '10WordsSortedList.txt',
            20:  '20WordsSortedList.txt',
            500: '500WordsSortedList.txt',
        }
        words_file = VOCAB_MAP.get(desired_classes, model_info['wordsList'])
        if words_file != model_info['wordsList']:
            print(f"[INFO] Auto-selected vocab '{words_file}' for {desired_classes} classes "
                  f"(config said '{model_info['wordsList']}').")

        vocab_path = os.path.join(self.root_dir, 'labels', words_file)
        with open(vocab_path, 'r') as f:
            self.current_vocab = [w.strip() for w in f.readlines() if w.strip()]

        self.current_model = model
        self.current_model_name = model_name

    def predict(self, video_path):
        cap = cv2.VideoCapture(video_path)
        original_fps = cap.get(cv2.CAP_PROP_FPS)
        frames = []
        while True:
            ret, frame = cap.read()
            if not ret: break
            frames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        cap.release()
        
        if not frames: return "Error: No frames", 0.0

        # Automated FPS Normalization
        if original_fps > 0:
            frames = normalize_fps(frames, original_fps, target_fps=25)
        
        # Only PAD if shorter than 29. Do NOT crop if longer,
        # because the sliding window logic will handle longer sequences.
        if len(frames) < 29:
            frames = normalize_sequence_length(frames, target_length=29)

        fa = self._get_fa()
        raw_lms = [fa.get_landmarks(f)[0] if fa.get_landmarks(f) else None for f in frames]
        interpolated_lms = landmarks_interpolate(raw_lms)
        if not interpolated_lms: return "Error: No face detected", 0.0
        
        # 1. Temporal Smoothing over ALL frames
        # Use window_margin=12 (matches training/preprocessing standard)
        SMOOTHING_WINDOW = 12
        smoothed_all_lms = []
        for i in range(len(interpolated_lms)):
            start = max(0, i - SMOOTHING_WINDOW // 2)
            end = min(len(interpolated_lms), i + SMOOTHING_WINDOW // 2 + 1)
            smoothed_all_lms.append(np.mean(interpolated_lms[start:end], axis=0))
        
        # 2. Patch Extraction for ALL frames
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        all_patches = []
        for i in range(len(frames)):
            trans_f, trans = warp_img(smoothed_all_lms[i][self.stable_pnts_ids,:], 
                                     self.mean_face_lms[self.stable_pnts_ids,:], 
                                     frames[i], self.std_size)
            patch = cut_patch(trans_f, trans(interpolated_lms[i])[self.start_idx:self.stop_idx], 
                             self.crop_height//2, self.crop_width//2)
            
            # Apply CLAHE to improve contrast for custom lighting
            patch_gray = cv2.cvtColor(patch, cv2.COLOR_RGB2GRAY)
            patch_clahe = clahe.apply(patch_gray)
            patch = cv2.cvtColor(patch_clahe, cv2.COLOR_GRAY2RGB) # Keep consistency
            
            all_patches.append(patch)
        
        # 3. Sliding Window Inference (High Density)
        # 3. Sliding Window Inference (Hyper-Density)
        WINDOW_T = 29
        STEP = 1 # Scan EVERY frame for maximum alignment probability
        best_word = "Uncertain"
        best_conf = 0.0
        
        n_patches = len(all_patches)
        window_indices = list(range(0, n_patches - WINDOW_T + 1, STEP))
        if n_patches >= WINDOW_T and (n_patches - WINDOW_T) not in window_indices:
            window_indices.append(n_patches - WINDOW_T)
        
        if not window_indices:
            window_indices = [0]
            
        print(f"DEBUG: Analyzing {len(window_indices)} windows (Hyper-Inference/10-way TTA)...")

        # Aggregated probabilities across all windows
        all_windows_probs = []
        
        for start_idx in window_indices:
            window = all_patches[start_idx : start_idx + WINDOW_T]
            tensors = [to_tensor(cv2.cvtColor(p, cv2.COLOR_RGB2GRAY)) for p in window]
            base_tensor = torch.stack(tensors, dim=1).to(self.device)
            base_tensor = (base_tensor - 0.421) / 0.165

            # 6-way TTA (Center, Jitter Corners, Flip) - for speed during averaging
            offsets = [(4, 92, 4, 92), (2, 90, 2, 90), (6, 94, 6, 94)]
            
            window_probs = []
            with torch.no_grad():
                for dy1, dy2, dx1, dx2 in offsets:
                    variant = base_tensor[:, :, dy1:dy2, dx1:dx2].unsqueeze(0)
                    # Original
                    logits = self.current_model(variant, lengths=[WINDOW_T])
                    window_probs.append(torch.nn.functional.softmax(logits, dim=-1).cpu().numpy())
                    # Flipped
                    flipped = torch.flip(variant, dims=[4])
                    logits_f = self.current_model(flipped, lengths=[WINDOW_T])
                    window_probs.append(torch.nn.functional.softmax(logits_f, dim=-1).cpu().numpy())
            
            # Average for this window
            avg_window_probs = np.mean(window_probs, axis=0)[0]
            all_windows_probs.append(avg_window_probs)
        
        # --- Class Masking ---
        # Instead of max, we take the average across all segments to find the most "stable" word
        final_probs = np.mean(all_windows_probs, axis=0)
        
        mask = np.zeros_like(final_probs)
        num_vocab_words = len(self.current_vocab)
        mask[:num_vocab_words] = 1.0
        final_probs = final_probs * mask
        # ---------------------

        top_idx = np.argmax(final_probs)
        best_conf = float(final_probs[top_idx])
        best_word = self.current_vocab[top_idx] if top_idx < len(self.current_vocab) else f"Idx_{top_idx}"
        
        # Diagnostics
        print(f"DEBUG: Final Averaged decision: {best_word} ({best_conf:.4f})")
        
        CONFIDENCE_THRESHOLD = 0.05 # Lowered for debugging
        if best_conf < CONFIDENCE_THRESHOLD:
            return "Uncertain (low confidence)", best_conf

        return best_word, best_conf
