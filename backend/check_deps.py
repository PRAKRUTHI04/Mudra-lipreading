import torch
import face_alignment
import cv2
import dlib
import numpy as np

print("Checking dependencies...")
try:
    print(f"Torch version: {torch.__version__}")
    print(f"CUDA available: {torch.cuda.is_available()}")
    fa = face_alignment.FaceAlignment(face_alignment.LandmarksType.TWO_D, device='cpu')
    print("face-alignment: OK")
    print(f"OpenCV version: {cv2.__version__}")
    print(f"dlib version: {dlib.__version__}")
except Exception as e:
    print(f"Error: {e}")
