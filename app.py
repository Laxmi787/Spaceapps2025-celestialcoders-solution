from flask import Flask, request, jsonify, send_from_directory
import os
import pickle
import numpy as np
import xgboost as xgb  # ✅ for XGBoost models

# Path to your React build folder
static_folder_path = os.path.join(os.path.dirname(__file__), 'dist')
app = Flask(__name__, static_folder=static_folder_path, static_url_path='')

# --- Load model and scaler safely ---
try:
    model_path = os.path.join(os.path.dirname(__file__), 'exoplanet_model3.pkl')
    scaler_path = os.path.join(os.path.dirname(__file__), 'scaler3.pkl')

    with open(model_path, 'rb') as f:
        model = pickle.load(f)

    with open(scaler_path, 'rb') as f:
        scaler = pickle.load(f)

    app.logger.info("✅ Model and Scaler loaded successfully.")

except Exception as e:
    app.logger.error(f"❌ Error loading model files: {e}")
    model = None
    scaler = None


# --- Prediction Route ---
@app.route('/predict', methods=['POST'])
def predict():
    if model is None or scaler is None:
        return jsonify({'error': 'Model or scaler not loaded properly on the server.'}), 500

    try:
        data = request.get_json()

        # Validate input
        if not data or 'features' not in data or not isinstance(data['features'], list):
            return jsonify({'error': 'Invalid input: "features" key missing or not a list.'}), 400

        features = np.array(data['features']).reshape(1, -1)
        scaled_features = scaler.transform(features)

        # Convert to DMatrix (for XGBoost)
        dmatrix = xgb.DMatrix(scaled_features)

        # Get prediction
        prediction = model.predict(dmatrix)
        predicted_class = int(np.round(prediction[0]))

        return jsonify({'prediction': predicted_class})
    except Exception as e:
        app.logger.error(f"Prediction error: {e}")
        return jsonify({'error': 'An unexpected error occurred during prediction.'}), 500


# --- Serve the React app (Frontend) ---
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        return send_from_directory(static_folder_path, 'index.html')


# --- Run Locally (Render uses gunicorn) ---
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
