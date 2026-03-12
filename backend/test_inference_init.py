import os
import sys
import torch

# Add backend to path
root_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(root_dir)

try:
    print("Testing LipreadingInference initialization...")
    from inference import LipreadingInference
    
    # Passing root_dir as the lipreading_root
    engine = LipreadingInference(root_dir, device='cpu')
    print("Inference engine initialized successfully!")
    
    # Check if we can load model config
    config_path = os.path.join(root_dir, 'models', 'model_config.json')
    if os.path.exists(config_path):
        import json
        with open(config_path, 'r') as f:
            config = json.load(f)
            print(f"Loaded config with {len(config['models'])} models.")
            
            # Test loading the first model (metadata only)
            model_info = config['models'][0]
            print(f"Target model: {model_info['displayName']}")
    else:
        print(f"Error: Model config not found at {config_path}")

except Exception as e:
    print(f"Error during initialization: {e}")
    import traceback
    traceback.print_exc()
