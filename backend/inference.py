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
from preprocessing.transform import warp_img, cut_patch, apply_transform

class LipreadingInference:
    def __init__(self, root_dir, device='cpu'):
        self.root_dir = root_dir
        self.device = device
        self.std_size = (256, 256)
        self.stable_pnts_ids = [33, 36, 39, 42, 45]
        self.start_idx, self.stop_idx = 48, 68
        self.crop_width = self.crop_height = 96
        self.window_margin = 12
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
            num_classes=model_info['numClasses'],
            tcn_options=tcn_options,
            backbone_type=config['backbone_type'],
            relu_type=config['relu_type'],
            width_mult=config['width_mult'],
        ).to(self.device)
        
        ckpt_path = os.path.join(self.root_dir, 'models', model_name)
        ckpt = torch.load(ckpt_path, map_location=self.device)
        model.load_state_dict(ckpt['model_state_dict'] if 'model_state_dict' in ckpt else ckpt)
        model.eval()
        
        vocab_path = os.path.join(self.root_dir, 'labels', model_info['wordsList'])
        with open(vocab_path, 'r') as f:
            self.current_vocab = [w.strip() for w in f.readlines() if w.strip()]
            
        self.current_model = model
        self.current_model_name = model_name

    def landmarks_interpolate(self, landmarks):
        valid_frames_idx = [idx for idx, _ in enumerate(landmarks) if _ is not None]
        if not valid_frames_idx: return None
        for idx in range(1, len(valid_frames_idx)):
            if valid_frames_idx[idx] - valid_frames_idx[idx-1] > 1:
                start_idx, stop_idx = valid_frames_idx[idx-1], valid_frames_idx[idx]
                start_lms, stop_lms = landmarks[start_idx], landmarks[stop_idx]
                delta = stop_lms - start_lms
                for i in range(1, stop_idx - start_idx):
                    landmarks[start_idx + i] = start_lms + i / float(stop_idx - start_idx) * delta
        landmarks[:valid_frames_idx[0]] = [landmarks[valid_frames_idx[0]]] * valid_frames_idx[0]
        landmarks[valid_frames_idx[-1]:] = [landmarks[valid_frames_idx[-1]]] * (len(landmarks) - valid_frames_idx[-1])
        return landmarks

    def predict(self, video_path):
        cap = cv2.VideoCapture(video_path)
        frames = []
        while True:
            ret, frame = cap.read()
            if not ret: break
            frames.append(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        cap.release()
        
        if not frames: return "Error: No frames", 0.0

        fa = self._get_fa()
        raw_lms = [fa.get_landmarks(f)[0] if fa.get_landmarks(f) else None for f in frames]
        interpolated_lms = self.landmarks_interpolate(raw_lms)
        if not interpolated_lms: return "Error: No face detected", 0.0
        
        q_frame, q_lms, sequence = deque(), deque(), []
        last_trans = None
        
        for i in range(len(frames)):
            q_frame.append(frames[i])
            q_lms.append(interpolated_lms[i])
            if len(q_frame) == self.window_margin:
                smoothed_lms = np.mean(q_lms, axis=0)
                cur_f, cur_l = q_frame.popleft(), q_lms.popleft()
                trans_f, trans = warp_img(smoothed_lms[self.stable_pnts_ids,:], self.mean_face_lms[self.stable_pnts_ids,:], cur_f, self.std_size)
                last_trans = trans
                sequence.append(cut_patch(trans_f, trans(cur_l)[self.start_idx:self.stop_idx], self.crop_height//2, self.crop_width//2))
                
        while q_frame:
            cur_f, cur_l = q_frame.popleft(), q_lms.popleft()
            trans_f = apply_transform(last_trans, cur_f, self.std_size)
            sequence.append(cut_patch(trans_f, last_trans(cur_l)[self.start_idx:self.stop_idx], self.crop_height//2, self.crop_width//2))

        # Tensors + TTA
        tensors = [to_tensor(cv2.cvtColor(p, cv2.COLOR_RGB2GRAY)) for p in sequence]
        frames_tensor = torch.stack(tensors, dim=1).to(self.device)[:, :, 4:92, 4:92]
        frames_tensor = (frames_tensor - 0.421) / 0.165
        
        input_batch = torch.stack([frames_tensor, torch.flip(frames_tensor, dims=[3])], dim=0)
        with torch.no_grad():
            logits = self.current_model(input_batch, lengths=[len(sequence)]*2)
            probs = torch.nn.functional.softmax(logits, dim=-1)
            avg_probs = torch.mean(probs, dim=0).cpu().numpy()
            
        top = np.argmax(avg_probs)
        word = self.current_vocab[top] if top < len(self.current_vocab) else f"Index_{top}"
        return word, float(avg_probs[top])
