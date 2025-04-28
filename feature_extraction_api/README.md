# Web3 Wallet Feature Extraction API

This API service extracts and calculates various features from Web3 wallet addresses using the Moralis API. It provides a REST endpoint that accepts a wallet address and returns a comprehensive set of features useful for credit scoring.

## Features

The API calculates the following metrics:

1. **Transaction Metrics**
   - Transaction Frequency
   - Transaction Volume (ETH)
   - Largest Transaction (ETH)
   - Average Transaction Value (ETH)

2. **DeFi Interaction Metrics**
   - Liquidation Event Count
   - Average Health Factor
   - Collateral Utilization
   - Protocol Diversity

3. **Debt Metrics**
   - Total Outstanding Debt (USD)
   - Average Debt Size (USD)
   - Debt-to-Asset Ratio
   - Repayment Activity Proxy

4. **Time-based Metrics**
   - Wallet Age (Days)
   - DeFi Engagement Duration (Days)

## Project Structure

```
feature_extraction_api/
├── main.py              # Flask application and API endpoints
├── features_extraction.py # Core feature calculation logic
├── requirements.txt     # Python dependencies
└── .env                 # Environment variables (create this)
```

## Prerequisites

- Python 3.8+
- Moralis API key
- Required Python packages (listed in requirements.txt)

## Local Development Setup

1. **Create Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. **Install Dependencies**
```bash
pip install -r requirements.txt
```

3. **Create .env File**
```bash
API_KEY=your_moralis_api_key_here
```

4. **Run Locally**
```bash
python main.py
```
The API will be available at `http://localhost:8001`

## Server Deployment

### Using Docker

1. **Build Docker Image**
```bash
docker build -t feature-extraction-api .
```

2. **Run Container**
```bash
docker run -p 8001:8001 -e API_KEY=your_moralis_api_key feature-extraction-api
```

### Using Gunicorn (Production)

1. **Install Gunicorn**
```bash
pip install gunicorn
```

2. **Run with Gunicorn**
```bash
gunicorn -w 4 -b 0.0.0.0:8001 main:app
```

## API Usage

### Endpoint
```
POST /extract-features
```

### Request Body
```json
{
    "walletAddress": "0x..."
}
```

### Response
```json
{
    "walletAddress": "0x...",
    "features": {
        "TransactionFrequency": 123,
        "TransactionVolume": 45.67,
        "LargestTransaction": 12.34,
        "AverageTransactionValue": 3.45,
        "LiquidationEventCount": 0,
        "AverageHealthFactor": 2.5,
        "CollateralUtilization": 0.75,
        "TotalOutstandingDebt": 1000.00,
        "AverageDebtSize": 500.00,
        "DebtToAssetRatio": 0.5,
        "RepaymentActivityProxy": 0.8,
        "ProtocolDiversity": 3,
        "WalletAgeInDays": 365,
        "DeFiEngagementDurationInDays": 180
    }
}
```

## Environment Variables

- `API_KEY`: Moralis API key (required)
- `PORT`: Port to run the API on (default: 8001)
