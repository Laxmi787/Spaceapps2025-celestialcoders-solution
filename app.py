from flask import Flask, request, jsonify, send_from_directory
import os
import pickle
import numpy as np

# Path for React build folder
static_folder_path = os.path.join(os.path.dirname(__file__), 'dist')
app = Flask(__name__, static_folder=static_folder_path, static_url_path='')

# Load ML model and scaler
model_path = os.path.join(os.path.dirname(__file__), 'exoplanet_model.pkl')
scaler_path = os.path.join(os.path.dirname(__file__), 'scaler.pkl')

with open(model_path, 'rb') as f:
    model = pickle.load(f)

with open(scaler_path, 'rb') as f:
    scaler = pickle.load(f)


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        features = np.array(data['features']).reshape(1, -1)
        scaled_features = scaler.transform(features)
        prediction = model.predict(scaled_features)[0]

        return jsonify({'prediction': int(prediction)})
    except Exception as e:
        return jsonify({'error': str(e)})


# Serve React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        return send_from_directory(static_folder_path, 'index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)


