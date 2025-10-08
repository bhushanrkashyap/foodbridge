# Required libraries:
# pip install Flask flask-cors google-generativeai pillow

import os
import json
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# --- Configuration ---
# Paste your Google Gemini API key here:
GEMINI_API_KEY = "AIzaSyBK-2vS01ai7aAyJb2EjzWs2SJfYSvE7-c"

if GEMINI_API_KEY == "YOUR_API_KEY_HERE" or not GEMINI_API_KEY:
    raise ValueError("❌ GEMINI_API_KEY not set. Please replace 'YOUR_API_KEY_HERE' with your actual key.")

# Configure Gemini SDK
genai.configure(api_key=GEMINI_API_KEY)

# --- Routes ---
@app.route("/ping")
def ping():
    """Health check endpoint"""
    return jsonify({"message": "Backend is working!"})


@app.route("/analyze", methods=["POST"])
def analyze():
    """Analyzes a food image to identify type, freshness, and deliverability."""
    if 'image' not in request.files:
        return jsonify({"error": "No image file uploaded."}), 400

    image_file = request.files['image']
    if not image_file.filename:
        return jsonify({"error": "No file selected."}), 400

    # Add this check before using model
    if model is None:
        return jsonify({"error": "No valid Gemini vision model is initialized. Please check /models and update the model name in the code."}), 500

    try:
        # Read the uploaded image
        image_bytes = image_file.read()
        food_image = Image.open(io.BytesIO(image_bytes))

        # Define prompt for AI
        prompt = (
            "Analyze this food image. Respond ONLY with a single JSON object, no extra text. "
            "The JSON should contain: "
            "'food_type' (string), "
            "'freshness' (e.g., 'Fresh', 'Stale', 'Expired'), "
            "and 'deliverability' ('Deliverable' or 'Non-deliverable' with a reason). "
            "Example: {\"food_type\":\"Apple\",\"freshness\":\"Fresh\",\"deliverability\":\"Deliverable - Looks clean and ripe.\"}"
        )

        # Send request to Gemini model
        response = model.generate_content([prompt, food_image])

        # Clean and parse JSON response
        response_text = response.text.strip().replace("```json", "").replace("```", "")
        result = json.loads(response_text)

        return jsonify({
            "food_type": result.get("food_type", "Unknown"),
            "freshness": result.get("freshness", "Unknown"),
            "advice": result.get("deliverability", "Unknown")
        })

    except json.JSONDecodeError:
        print(f"⚠️ Invalid JSON from model: {response.text}")
        return jsonify({"error": "AI response was not valid JSON."}), 500
    except Exception as e:
        print(f"❌ Error in /analyze: {e}")
        return jsonify({"error": "Unexpected error during analysis."}), 500


@app.route("/models")
def models():
    """List available models for your API key."""
    try:
        available_models = [
            {"name": m.name, "methods": getattr(m, "supported_generation_methods", [])}
            for m in genai.list_models()
        ]
        return jsonify({"models": available_models})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- Model Initialization ---
model = None
try:
    # Dynamically select a valid model that supports image input and generateContent
    available_models = [
        m for m in genai.list_models()
        if "generateContent" in getattr(m, "supported_generation_methods", [])
    ]
    # Try to find a model with 'vision' or 'image' in its name
    for m in available_models:
        if "vision" in m.name or "image" in m.name:
            model = genai.GenerativeModel(m.name)
            print(f"✅ Using model: {m.name}")
            break
    if model is None and available_models:
        # Fallback: use the first available model (may not support images)
        model = genai.GenerativeModel(available_models[0].name)
        print(f"⚠️ Using fallback model: {available_models[0].name}")
    if model is None:
        print("❌ No valid Gemini model found for your API key.")
except Exception as e:
    print(f"❌ Error creating model: {e}")
    model = None


# --- Main Execution ---
if __name__ == "__main__":
    if not model:
        print("--- WARNING: Starting server without a valid model. /analyze will fail. ---")
    app.run(debug=True, port=5000)


#AIzaSyBK-2vS01ai7aAyJb2EjzWs2SJfYSvE7-c