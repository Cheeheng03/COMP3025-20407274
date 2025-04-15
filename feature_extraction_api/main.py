from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from features_extraction import calculate_all_features

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/extract-features', methods=['POST'])
def extract_features_endpoint():
    data = request.get_json()
    if not data or "walletAddress" not in data:
        return jsonify({"error": "Missing walletAddress in request body"}), 400

    wallet_address = data["walletAddress"]
    try:
        # Calculate features using your pipeline
        features = calculate_all_features(wallet_address)
        # Build a JSON response that includes the wallet address and the features
        response = {
            "walletAddress": wallet_address,
            "features": features
        }
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app on port 8001
    app.run(host='0.0.0.0', port=8001, debug=True)