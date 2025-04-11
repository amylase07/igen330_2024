from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import base64
import cv2
import numpy as np
from PIL import Image
import io
import os
import time
import torch
from llava_local_inference import describe_clothing, describe_clothing_in_sentence, combine_descriptions, recommend_outfit
import uuid
import random
import json

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_DIR = "./temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Serve static files (HTML, JS, CSS, images)
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    if os.path.exists(path):
        return send_from_directory('.', path)
    return send_from_directory('.', 'index.html')

def process_image(image_data, clothing_id="frontend_input"):
    try:
        print("[INFO] Starting image processing...")

        if ',' in image_data:
            image_data = image_data.split(',')[1]
            print("[DEBUG] Stripped base64 header.")

        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        print("[INFO] Image successfully decoded and converted to RGB.")

        # Save the image temporarily
        timestamp = int(time.time())
        filename = f"{clothing_id}_{timestamp}.jpg"
        image_path = os.path.join(UPLOAD_DIR, filename)
        image.save(image_path)
        print(f"[INFO] Image saved at: {image_path}")

        # Run the LLaVA inference pipeline
        print("[INFO] Running describe_clothing...")
        formatted = describe_clothing(image_path, clothing_id)

        print("[INFO] Running describe_clothing_in_sentence...")
        sentence = describe_clothing_in_sentence(image_path)

        print("[INFO] Combining descriptions...")
        combined = combine_descriptions(formatted, sentence)

        print("[SUCCESS] Image processing complete.")

        return {
            "status": "success",
            "text_data": combined,
            "message": "Description generated successfully"
        }

    except Exception as e:
        print(f"[ERROR] Exception in process_image: {e}")
        return {
            "status": "error",
            "message": str(e)
        }

@app.route('/process_image', methods=['POST'])
def handle_image():
    try:
        print("[INFO] Received request to /process_image")
        data = request.get_json()

        if not data or 'image' not in data:
            print("[ERROR] No image data in request")
            return jsonify({
                "status": "error",
                "message": "No image data provided"
            }), 400

        clothing_id = data.get("clothing_id", "frontend_input")
        print(f"[DEBUG] clothing_id: {clothing_id}")

        result = process_image(data['image'], clothing_id)
        print("[INFO] Sending response for /process_image")
        return jsonify(result)

    except Exception as e:
        print(f"[ERROR] Exception in /process_image: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/save_text_data', methods=['POST'])
def save_text_data():
    try:
        print("[INFO] Received request to /save_text_data")
        data = request.get_json()

        if not data or 'text_data' not in data:
            print("[ERROR] No text_data in request")
            return jsonify({
                "status": "error",
                "message": "No text data provided"
            }), 400

        print("[DEBUG] text_data received:", data['text_data'])

        return jsonify({
            "status": "success",
            "message": "Text data saved successfully"
        })

    except Exception as e:
        print(f"[ERROR] Exception in /save_text_data: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/create_outfits', methods=['POST'])
def create_outfits():
    try:
        print("[INFO] Received request to /create_outfits")
        data = request.json

        if not data or 'occasion' not in data or 'gender' not in data or 'weather' not in data:
            print("[ERROR] Missing required fields in request")
            return jsonify({
                "status": "error",
                "message": "Occasion, gender, and weather are required"
            }), 400

        weather = data.get('weather')
        gender = data.get('gender')
        occasion = data.get('occasion')
        print(f"[DEBUG] weather: {weather}, gender: {gender}, occasion: {occasion}")

        # Call the AI function to recommend an outfit
        description, prompt = recommend_outfit(weather=weather, occasion=occasion, gender=gender)

        # Split the description to exclude the prompt
        outfit_description = description.split("\nPrompt:")[0].strip() if "\nPrompt:" in description else description.strip()

        # Pick a random image from imageRepo
        image_folder = './igen330_2024/imageRepo'
        image_files = [f for f in os.listdir(image_folder) if f.endswith(('.jpg', '.jpeg', '.png'))]
        
        if not image_files:
            print("[ERROR] No images found in imageRepo")
            return jsonify({'status': 'error', 'message': 'No images found'}), 500

        selected_image = random.choice(image_files)
        image_path = f'./imageRepo/{selected_image}'
        print(f"[INFO] Selected image: {image_path}")

        return jsonify({
            'status': 'success',
            'text': outfit_description,
            'image': image_path
        })

    except Exception as e:
        print(f"[ERROR] Exception in /create_outfits: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
@app.route('/save_outfit', methods=['POST'])
def save_outfit():
    try:
        print("[INFO] Received request to /save_outfit")
        data = request.get_json()

        if not data or 'image' not in data or 'attributes' not in data:
            print("[ERROR] Missing required fields in request")
            return jsonify({
                "status": "error",
                "message": "Image and attributes are required"
            }), 400

        outfit_data = {
            "image": data['image'],
            "attributes": data['attributes']
        }
        print(f"[DEBUG] Outfit data to save: {outfit_data}")

        # Ensure outfits.json file exists
        file_path = "./outfits.json"
        if not os.path.exists(file_path):
            with open(file_path, 'w') as f:
                json.dump([], f)

        # Read existing outfits
        with open(file_path, 'r') as f:
            outfits = json.load(f)

        # Add the new outfit
        outfits.append(outfit_data)

        # Write updated outfits back to the file
        with open(file_path, 'w') as f:
            json.dump(outfits, f, indent=2)

        print("[INFO] Outfit saved successfully")
        return jsonify({
            "status": "success",
            "message": "Outfit saved successfully"
        })

    except Exception as e:
        print(f"[ERROR] Exception in /save_outfit: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/get_saved_outfits', methods=['GET'])
def get_saved_outfits():
    try:
        print("[INFO] Received request to /get_saved_outfits")
        file_path = "./outfits.json"

        if not os.path.exists(file_path):
            print("[INFO] outfits.json does not exist, returning empty list")
            return jsonify([])

        with open(file_path, 'r') as f:
            outfits = json.load(f)

        print(f"[INFO] Returning {len(outfits)} saved outfits")
        return jsonify(outfits)

    except Exception as e:
        print(f"[ERROR] Exception in /get_saved_outfits: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/delete_outfit', methods=['POST'])
def delete_outfit():
    try:
        print("[INFO] Received request to /delete_outfit")
        data = request.get_json()

        if not data or 'image' not in data:
            print("[ERROR] Missing required fields in request")
            return jsonify({
                "status": "error",
                "message": "Image path is required"
            }), 400

        image_path = data['image']
        print(f"[DEBUG] Deleting outfit with image: {image_path}")

        file_path = "./outfits.json"
        if not os.path.exists(file_path):
            print("[INFO] outfits.json does not exist")
            return jsonify({
                "status": "error",
                "message": "No outfits to delete"
            }), 404

        # Read existing outfits
        with open(file_path, 'r') as f:
            outfits = json.load(f)

        # Find and remove the outfit with the matching image path
        initial_length = len(outfits)
        outfits = [outfit for outfit in outfits if outfit['image'] != image_path]

        if len(outfits) == initial_length:
            print("[INFO] No outfit found with the given image path")
            return jsonify({
                "status": "error",
                "message": "Outfit not found"
            }), 404

        # Write updated outfits back to the file
        with open(file_path, 'w') as f:
            json.dump(outfits, f, indent=2)

        print("[INFO] Outfit deleted successfully")
        return jsonify({
            "status": "success",
            "message": "Outfit deleted successfully"
        })

    except Exception as e:
        print(f"[ERROR] Exception in /delete_outfit: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    
    
if __name__ == '__main__':
    print("[INFO] Starting Flask server on port 3000...")
    app.run(host='0.0.0.0', port=3000, debug=True)