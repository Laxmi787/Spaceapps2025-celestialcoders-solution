import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import joblib

# --- Serve frontend from dist folder (same level as backend) ---
static_folder_path = os.path.join(os.path.dirname(__file__), '..', 'dist')

app = Flask(__name__, static_folder=static_folder_path)
CORS(app)

FEATURE_NAMES = [
    'koi_period', 'koi_time0bk', 'koi_impact', 'koi_duration',
    'koi_depth', 'koi_prad', 'koi_teq', 'koi_insol',
    'koi_model_snr', 'koi_steff', 'koi_slogg', 'koi_srad',
    'koi_kepmag', 'koi_fpflag_nt', 'koi_fpflag_ss',
    'koi_fpflag_co', 'koi_fpflag_ec'
]

try:
    model_rf = joblib.load('exoplanet_model.pkl')
    scaler_rf = joblib.load('scaler.pkl')
    model_xgb = joblib.load('exoplanet_model3.pkl')
    scaler_xgb = joblib.load('scaler3.pkl')
    print("✅ Models and scalers loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models/scalers: {e}")
    model_rf = scaler_rf = model_xgb = scaler_xgb = None

@app.route('/predict', methods=['POST'])
def predict():
    if not all([model_rf, scaler_rf, model_xgb, scaler_xgb]):
        return jsonify({'error': 'Model or scaler failed to load on server.'}), 500

    data = request.get_json()
    features = data.get('features')
    model_type = data.get('model_type', 'rf')

    if not features:
        return jsonify({'error': 'No feature data provided.'}), 400

    try:
        df = pd.DataFrame(features)
        missing_cols = [col for col in FEATURE_NAMES if col not in df.columns]
        if missing_cols:
            return jsonify({'error': f'Missing columns: {", ".join(missing_cols)}'}), 400

        df = df[FEATURE_NAMES]
        if model_type == 'rf':
            scaled = scaler_rf.transform(df)
            preds = model_rf.predict(scaled)
            conf = model_rf.predict_proba(scaled).max(axis=1)
        elif model_type == 'xgb':
            scaled = scaler_xgb.transform(df)
            preds = model_xgb.predict(scaled)
            conf = model_xgb.predict_proba(scaled).max(axis=1)
        else:
            return jsonify({'error': 'Invalid model type.'}), 400

        return jsonify({'prediction': preds.tolist(), 'confidence': conf.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- Serve frontend ---
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    full_path = os.path.join(app.static_folder, path)
    if path != "" and os.path.exists(full_path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
