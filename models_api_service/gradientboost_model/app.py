import pandas as pd
import joblib
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load Gradient Boosting model and scaler
gbm_model = joblib.load('gradient_boosting_credit_score_model.pkl')
scaler = joblib.load('scaler.pkl')

CREDIT_SCORE_MIN = 300
CREDIT_SCORE_MAX = 850

@app.route('/keepalive', methods=['GET'])
def api_health():
    return jsonify({"Message": "Gradient Boosting API is live"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        json_ = request.json
        if not json_:
            return jsonify({"Error": "No input data provided"}), 400

        input_df = pd.DataFrame([json_])
        input_scaled = scaler.transform(input_df)

        prediction_norm = gbm_model.predict(input_scaled)
        prediction = CREDIT_SCORE_MIN + (prediction_norm * (CREDIT_SCORE_MAX - CREDIT_SCORE_MIN))
        rounded_prediction = round(prediction[0])

        return jsonify({"Gradient Boosting Prediction": rounded_prediction}), 200

    except Exception as e:
        return jsonify({"Error": str(e)}), 500

if __name__ == "__main__":
    # Run on port 5002
    app.run(debug=True, host='0.0.0.0', port=5002)

