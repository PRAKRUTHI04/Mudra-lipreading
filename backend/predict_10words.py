import os
import sys
import torch

# Ensure we can import from lipreading locally
root_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(root_dir)

from lipreading.inference import LipreadingInference

# --- Configuration for 10-Word Model ---
MODEL_INFO = {
    "modelName": "initial-10-words-model.tar",
    "configFile": "lrw_resnet18_mstcn.json",
    "wordsList": "10WordsSortedList.txt",
    "numClasses": 500
}

def main(video_path):
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    engine = LipreadingInference(root_dir, device=device)
    
    print(f"Loading model: {MODEL_INFO['modelName']} on {device}...")
    engine.load_model(MODEL_INFO)
    
    print(f"Analyzing video: {video_path}...")
    word, conf = engine.predict(video_path)
    
    print(f"\nFinal Prediction: {word}")
    print(f"Confidence Level: {conf:.2f}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python predict_10words.py <video_path>")
    else:
        main(sys.argv[1])
