# Chainlink External Adapters

This directory contains two external adapters that work together to provide credit score predictions for Web3 wallets:

1. **ExternalAdapter** - Aggregates predictions from multiple AI models
2. **AIInputExternalAdapter** - Handles input data management for the prediction system

## Architecture Overview

The system consists of two main components:

1. **AIInputExternalAdapter**
   - Acts as an input data store
   - Accepts wallet metrics and transaction data
   - Maintains the latest input data for predictions
   - Required fields include:
     - Transaction Frequency
     - Transaction Volume (ETH)
     - Largest Transaction (ETH)
     - Average Transaction Value (ETH)
     - Liquidation Event Count
     - Average Health Factor
     - Collateral Utilization
     - Total Outstanding Debt (USD)
     - Average Debt Size (USD)
     - Debt-to-Asset Ratio
     - Repayment Activity Proxy
     - Earnings Efficiency
     - Protocol Diversity
     - Lending Protocol Count
     - Liquidity Provision Count
     - Token Swap Count
     - Wallet Age (Days)
     - DeFi Engagement Duration (Days)
     - walletAddress

2. **ExternalAdapter**
   - Aggregates predictions from three AI models:
     - Random Forest (port 5001)
     - Gradient Boosting (port 5002)
     - CatBoost (port 5003)
   - Calculates final credit score by averaging predictions
   - Returns both individual and aggregated scores

## Deployment Instructions

### Prerequisites
- Node.js (v14 or higher)
- Docker (optional, for containerized deployment)
- Access to the AI model servers (or local instances)

### Local Deployment

1. **AIInputExternalAdapter**
```bash
cd AIInputExternalAdapter
npm install
node app.js
```

2. **ExternalAdapter**
```bash
cd ExternalAdapter
npm install
node app.js
```

### Docker Deployment

1. **AIInputExternalAdapter**
```bash
cd AIInputExternalAdapter
docker build -t ai-input-adapter .
docker run -p 8080:8080 ai-input-adapter
```

2. **ExternalAdapter**
```bash
cd ExternalAdapter
docker build -t credit-score-adapter .
docker run -p 8081:8081 credit-score-adapter
```

### Environment Configuration

1. Create `.envrc` file in each adapter directory:
```bash
# AIInputExternalAdapter/.envrc
PORT=8080

# ExternalAdapter/.envrc
PORT=8081
MODEL_SERVER_1=http://localhost:5001
MODEL_SERVER_2=http://localhost:5002
MODEL_SERVER_3=http://localhost:5003
```


## API Endpoints

### AIInputExternalAdapter
- **POST** `/` - Submit new wallet data
- **GET** `/` - Retrieve latest stored data

### ExternalAdapter
- **POST** `/` - Get credit score prediction
  - Input: Wallet address and metrics
  - Output: Aggregated credit score and individual model predictions

## Testing

Each adapter includes a test directory with sample requests:
```bash
# Test AIInputExternalAdapter
cd AIInputExternalAdapter/test
node test.js

# Test ExternalAdapter
cd ExternalAdapter/test
node test.js
```
