from flask import Flask, request, jsonify, send_from_directory
import os
import pickle
import numpy as np

# Path for React build folder
static_folder_path = os.path.join(os.path.dirname(__file__), 'dist')
app = Flask(__name__, static_folder=static_folder_path, static_url_path='')

# Load ML model and scaler
# Using a try-except block here is good practice in case files are missing
try:
    model_path = os.path.join(os.path.dirname(__file__), 'exoplanet_model.pkl')
    scaler_path = os.path.join(os.path.dirname(__file__), 'scaler.pkl')

    with open(model_path, 'rb') as f:
        model = pickle.load(f)

    with open(scaler_path, 'rb') as f:
        scaler = pickle.load(f)
except FileNotFoundError as e:
    # Log the error if a model file is missing during startup
    app.logger.error(f"Error loading model files: {e}")
    model = None
    scaler = None


@app.route('/predict', methods=['POST'])
def predict():
    # Check if models were loaded correctly on startup
    if model is None or scaler is None:
        return jsonify({'error': 'Model or scaler not loaded properly on the server.'}), 500

    try:
        data = request.get_json()
        
        # --- SUGGESTION 1: Input Validation ---
        if not data or 'features' not in data or not isinstance(data['features'], list):
            return jsonify({'error': 'Invalid input: "features" key missing or not a list.'}), 400

        features = np.array(data['features']).reshape(1, -1)
        
        # You could even add a check for the number of features
        # expected_features = 10 # Replace with the actual number your model expects
        # if features.shape[1] != expected_features:
        #     return jsonify({'error': f'Invalid input: Expected {expected_features} features, got {features.shape[1]}.'}), 400

        scaled_features = scaler.transform(features)
        prediction = model.predict(scaled_features)[0]

        return jsonify({'prediction': int(prediction)})
    except Exception as e:
        app.logger.error(f"Prediction error: {e}") # Log the error for debugging
        # --- SUGGESTION 2: More Specific Error Response ---
        return jsonify({'error': 'An unexpected error occurred during prediction.'}), 500


# Serve React app (This part is perfect, no changes needed)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        return send_from_directory(static_folder_path, 'index.html')


# This block is for local development. Gunicorn on Render will ignore this.
if __name__ == '__main__':
    # Using port from environment variable is good practice, with a default
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
