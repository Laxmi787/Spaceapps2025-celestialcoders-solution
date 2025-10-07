from flask import Flask, request, jsonify, send_from_directory
import os
import numpy as np
import joblib   # safer for sklearn models

# Path for React build folder
static_folder_path = os.path.join(os.path.dirname(__file__), 'dist')
app = Flask(__name__, static_folder=static_folder_path, static_url_path='')

# --- Load ML model and scaler safely ---
try:
    model_path = os.path.join(os.path.dirname(__file__), 'exoplanet_model3.pkl')
    scaler_path = os.path.join(os.path.dirname(__file__), 'scaler3.pkl')

    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)

    app.logger.info("✅ Model and scaler loaded successfully!")
except Exception as e:
    app.logger.error(f"❌ Error loading model files: {e}")
    model = None
    scaler = None


# --- Test route to verify server + model ---
@app.route('/test', methods=['GET'])
def test():
    if model is not None and scaler is not None:
        return jsonify({"status": "ok", "message": "Model and scaler loaded successfully!"})
    else:
        return jsonify({"status": "error", "message": "Model or scaler not loaded."}), 500


# --- Prediction endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    if model is None or scaler is None:
        return jsonify({'error': 'Model or scaler not loaded properly on the server.'}), 500

    try:
        data = request.get_json()

        # Validate input format
        if not data or 'features' not in data or not isinstance(data['features'], list):
            return jsonify({'error': 'Invalid input: "features" key missing or not a list.'}), 400

        features = np.array(data['features']).reshape(1, -1)
        scaled_features = scaler.transform(features)
        prediction = model.predict(scaled_features)[0]

        return jsonify({'prediction': int(prediction)})

    except Exception as e:
        app.logger.error(f"Prediction error: {e}")
        return jsonify({'error': 'An unexpected error occurred during prediction.'}), 500


# --- Serve React frontend ---
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        return send_from_directory(static_folder_path, 'index.html')


# --- Local run block (Render ignores this, used only in local dev) ---
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
