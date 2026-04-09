import cv2
import numpy as np                                                               
from skimage import transform as tf

# -- Landmark interpolation:
def linear_interpolate(landmarks, start_idx, stop_idx):
    start_landmarks = landmarks[start_idx]
    stop_landmarks = landmarks[stop_idx]
    delta = stop_landmarks - start_landmarks
    for idx in range(1, stop_idx-start_idx):
        landmarks[start_idx+idx] = start_landmarks + idx/float(stop_idx-start_idx) * delta
    return landmarks

def landmarks_interpolate(landmarks):
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

# -- Face Transformation
def warp_img(src, dst, img, std_size):
    tform = tf.estimate_transform('similarity', src, dst)  # find the transformation matrix
    warped = tf.warp(img, inverse_map=tform.inverse, output_shape=std_size)  # wrap the frame image
    warped = warped * 255  # note output from wrap is double image (value range [0,1])
    warped = warped.astype('uint8')
    return warped, tform

def apply_transform(transform, img, std_size):
    warped = tf.warp(img, inverse_map=transform.inverse, output_shape=std_size)
    warped = warped * 255  # note output from wrap is double image (value range [0,1])
    warped = warped.astype('uint8')
    return warped

# -- Crop
def cut_patch(img, landmarks, height, width, threshold=5):

    center_x, center_y = np.mean(landmarks, axis=0)

    if center_y - height < 0:                                                
        center_y = height                                                    
    if center_y - height < 0 - threshold:                                    
        raise Exception('too much bias in height')                           
    if center_x - width < 0:                                                 
        center_x = width                                                     
    if center_x - width < 0 - threshold:                                     
        raise Exception('too much bias in width')                            
                                                                             
    if center_y + height > img.shape[0]:                                     
        center_y = img.shape[0] - height                                     
    if center_y + height > img.shape[0] + threshold:                         
        raise Exception('too much bias in height')                           
    if center_x + width > img.shape[1]:                                      
        center_x = img.shape[1] - width                                      
    if center_x + width > img.shape[1] + threshold:                          
        raise Exception('too much bias in width')                            
                                                                             
    cutted_img = np.copy(img[ int(round(center_y) - round(height)): int(round(center_y) + round(height)),
                         int(round(center_x) - round(width)): int(round(center_x) + round(width))])
    return cutted_img

# -- RGB to GRAY
def convert_bgr2gray(data):
    return np.stack([cv2.cvtColor(_, cv2.COLOR_BGR2GRAY) for _ in data], axis=0)

def normalize_fps(frames, original_fps, target_fps=25):
    if not frames: return []
    if abs(original_fps - target_fps) < 0.1:
        return frames
    
    duration = len(frames) / original_fps
    target_n_frames = int(max(1, round(duration * target_fps)))
    
    # Resample frames using linear interpolation of indices
    indices = np.linspace(0, len(frames) - 1, target_n_frames).astype(int)
    return [frames[i] for i in indices]

def normalize_sequence_length(frames, target_length=29):
    n = len(frames)
    if n == target_length:
        return frames
    if n > target_length:
        # Center crop: take the middle target_length frames
        start = (n - target_length) // 2
        return frames[start : start + target_length]
    else:
        # Pad by repeating the last frame
        if not frames: return []
        last_frame = frames[-1]
        padding = [last_frame] * (target_length - n)
        return frames + padding
