import os
import sys
import json
from flask import Flask, redirect, request, jsonify
from werkzeug.utils import secure_filename
import torch
from typing import Optional

# Backend root directory (Mudra-main/backend)
root_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(root_dir)

# Try to load the inference engine.
INFERENCE_IMPORT_ERROR: Optional[str] = None
try:
    from inference import LipreadingInference  # type: ignore
except Exception as e:
    LipreadingInference = None  # type: ignore
    INFERENCE_IMPORT_ERROR = str(e)
    print(f"Error loading LipreadingInference: {e}")

app = Flask(__name__)

# Allow the React frontend to call this API (optional dependency)
try:
    from flask_cors import CORS  # type: ignore
    CORS(app, resources={r"/*": {"origins": "*"}})
except ModuleNotFoundError:
    pass

app.config['UPLOAD_FOLDER'] = os.path.join(root_dir, 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

MODELS = []
engines = {'cpu': None, 'cuda': None}
if LipreadingInference is not None:
    # Cache inference engine per device
    engines = {
        'cpu': LipreadingInference(root_dir, device='cpu'),
        'cuda': LipreadingInference(root_dir, device='cuda') if torch.cuda.is_available() else None
    }

    config_path = os.path.join(root_dir, 'models', 'model_config.json')
    if os.path.exists(config_path):
        with open(config_path, 'r') as f:
            config_data = json.load(f)
        MODELS = config_data.get('models', [])

@app.route('/')
def index():
    # Redirect to the Vite dev server URL
    return redirect("http://localhost:8080")

@app.route('/models')
def get_models():
    return jsonify({"models": MODELS})

@app.route('/predict', methods=['POST'])
def run_predict():
    if LipreadingInference is None:
        return jsonify({
            "error": "Inference code is not available.",
            "details": INFERENCE_IMPORT_ERROR,
            "hint": "Ensure the `lipreading/`, `preprocessing/`, `models/`, `labels/`, and `configs/` folders are present in the backend folder."
        }), 500

    if 'video' not in request.files:
        return jsonify({"error": "No video file"}), 400
    
    video = request.files['video']
    model_idx = int(request.form.get('model_idx', 0))
    device_type = request.form.get('hardware', 'cpu') # 'cpu' or 'cuda'
    
    if not torch.cuda.is_available() and device_type == 'cuda':
        device_type = 'cpu'
        
    filename = secure_filename(video.filename)
    video_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    video.save(video_path)
    
    try:
        if not MODELS:
            return jsonify({"error": "No models configured. Missing models/model_config.json"}), 500

        engine = engines[device_type]
        if engine is None:
            return jsonify({"error": "Selected hardware (CUDA) not available"}), 400
            
        engine.load_model(MODELS[model_idx])
        word, conf = engine.predict(video_path)
        
        return jsonify({
            "word": word,
            "confidence": f"{conf:.2f}",
            "model": MODELS[model_idx]['displayName'],
            "hardware": device_type
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(video_path):
            os.remove(video_path)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000, use_reloader=False)
