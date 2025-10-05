import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import joblib

# Point to the build folder of your React app
static_folder_path = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist')

app = Flask(__name__, static_folder=static_folder_path)
CORS(app)

# --- Define the exact feature columns the models were trained on ---
FEATURE_NAMES = [
    'koi_period', 'koi_time0bk', 'koi_impact', 'koi_duration',
    'koi_depth', 'koi_prad', 'koi_teq', 'koi_insol',
    'koi_model_snr', 'koi_steff', 'koi_slogg', 'koi_srad',
    'koi_kepmag', 'koi_fpflag_nt', 'koi_fpflag_ss',
    'koi_fpflag_co', 'koi_fpflag_ec'
]

# --- Load Models and Scalers ---
try:
    model_rf = joblib.load('exoplanet_model.pkl')
    scaler_rf = joblib.load('scaler.pkl')
    model_xgb = joblib.load('exoplanet_model3.pkl')
    scaler_xgb = joblib.load('scaler3.pkl')
    print("All models and scalers loaded successfully!")
except Exception as e:
    print(f"Error loading models or scalers: {e}")
    model_rf, scaler_rf, model_xgb, scaler_xgb = None, None, None, None


# --- API Endpoint for Predictions ---
@app.route('/predict', methods=['POST'])
def predict():
    if not all([model_rf, scaler_rf, model_xgb, scaler_xgb]):
        return jsonify({'error': 'One or more models/scalers failed to load on the server.'}), 500

    data = request.get_json()
    features = data.get('features')
    model_type = data.get('model_type', 'rf')

    if not features:
        return jsonify({'error': 'No feature data was provided.'}), 400

    try:
        df = pd.DataFrame(features)

        missing_cols = [col for col in FEATURE_NAMES if col not in df.columns]
        if missing_cols:
            return jsonify({'error': f'Missing required columns: {", ".join(missing_cols)}'}), 400

        df_reordered = df[FEATURE_NAMES]

        prediction, confidence = [], []

        if model_type == 'rf':
            scaled_features = scaler_rf.transform(df_reordered)
            prediction = model_rf.predict(scaled_features)
            probabilities = model_rf.predict_proba(scaled_features)
            confidence = probabilities.max(axis=1)
        elif model_type == 'xgb':
            scaled_features = scaler_xgb.transform(df_reordered)
            prediction = model_xgb.predict(scaled_features)
            probabilities = model_xgb.predict_proba(scaled_features)
            confidence = probabilities.max(axis=1)
        else:
            return jsonify({'error': 'Invalid model type specified.'}), 400

        return jsonify({'prediction': prediction.tolist(), 'confidence': confidence.tolist()})

    except Exception as e:
        print(f"An error occurred during prediction: {e}")
        return jsonify({'error': str(e)}), 500


# --- Routes to Serve the Frontend ---
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


# This part is only for the `flask run` command, not for Waitress.
if __name__ == '__main__':
    app.run(debug=True)