# Models API Service

This service hosts three different machine learning models for credit score prediction:
1. CatBoost Model
2. Random Forest Model
3. Gradient Boosting Model

Each model is served as a separate Flask API endpoint, allowing for easy integration with the credit scoring system.

## Project Structure

```
models_api_service/
├── catboost_model/
│   ├── app.py
│   ├── catboost_credit_score_model.pkl
│   ├── scaler.pkl
│   └── requirements.txt
├── randomforest_model/
│   ├── app.py
│   ├── random_forest_credit_score_model.pkl
│   ├── scaler.pkl
│   └── requirements.txt
└── gradientboost_model/
    ├── app.py
    ├── gradient_boosting_credit_score_model.pkl
    ├── scaler.pkl
    └── requirements.txt
```

## Local Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Installation Steps

1. **Create and activate virtual environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

2. **Install dependencies for each model**
```bash
# CatBoost Model
cd catboost_model
pip install -r requirements.txt

# Random Forest Model
cd ../randomforest_model
pip install -r requirements.txt

# Gradient Boosting Model
cd ../gradientboost_model
pip install -r requirements.txt
```

### Running Models Locally

Each model runs on a different port to avoid conflicts:

1. **CatBoost Model** (Port 5003)
```bash
cd catboost_model
python app.py
```

2. **Random Forest Model** (Port 5001)
```bash
cd randomforest_model
python app.py
```

3. **Gradient Boosting Model** (Port 5002)
```bash
cd gradientboost_model
python app.py
```

### Testing Local Endpoints

Each model provides two endpoints:
- `/keepalive` (GET): Health check endpoint
- `/predict` (POST): Prediction endpoint

Example API calls:
```bash
# Health check
curl http://localhost:5003/keepalive

# Prediction
curl -X POST http://localhost:5003/predict \
  -H "Content-Type: application/json" \
  -d '{"Transaction Frequency": 123, "Transaction Volume (ETH)": 45.67}'
```

## Server Deployment (Simple Setup)

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation Steps

1. **Copy model files to server**
```bash
# Copy all model directories to your server
```

2. **Install dependencies for each model**
```bash
# CatBoost Model
cd catboost_model
pip install -r requirements.txt

# Random Forest Model
cd ../randomforest_model
pip install -r requirements.txt

# Gradient Boosting Model
cd ../gradientboost_model
pip install -r requirements.txt
```

### Running Models on Server

Each model runs on a different port to avoid conflicts:

1. **CatBoost Model** (Port 5003)
```bash
cd catboost_model
python app.py
```

2. **Random Forest Model** (Port 5001)
```bash
cd randomforest_model
python app.py
```

3. **Gradient Boosting Model** (Port 5002)
```bash
cd gradientboost_model
python app.py
```

### Testing Server Endpoints

```bash
# Health check
curl http://your_server_ip:5003/keepalive

# Prediction
curl -X POST http://your_server_ip:5003/predict \
  -H "Content-Type: application/json" \
  -d '{"Transaction Frequency": 123, "Transaction Volume (ETH)": 45.67}'
```

## API Documentation

### CatBoost Model (Port 5003)
- Endpoint: `/predict`
- Method: POST
- Input: JSON with feature values
- Output: JSON with prediction

### Random Forest Model (Port 5001)
- Endpoint: `/predict`
- Method: POST
- Input: JSON with feature values
- Output: JSON with prediction

### Gradient Boosting Model (Port 5002)
- Endpoint: `/predict`
- Method: POST
- Input: JSON with feature values
- Output: JSON with prediction
