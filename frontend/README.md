# Web3 Wallet Credit Score Frontend

This React application provides a user interface for interacting with the Web3 Wallet Credit Score system. It allows users to connect their wallets, view their credit scores, and understand the factors affecting their scores.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── FicoGauge.js
│   │   └── NewsSlider.js
│   ├── pages/
│   │   ├── Landing.js
│   │   └── CreditScore.js
│   ├── charts/
│   ├── assets/
│   └── testdata/
├── public/
└── package.json
```

## Application Flow

1. **User Authentication**
   - Users connect their MetaMask wallet
   - Application verifies wallet connection
   - Handles account changes and network switching

2. **Feature Extraction**
   - Calls Feature Extraction API (`http://5.189.130.12:8001`)
   - Retrieves wallet metrics and transaction data
   - Processes and formats data for AI model

3. **Credit Score Calculation**
   - Sends formatted data to AI Adapter (`http://5.189.130.12:8080`)
   - Receives credit score prediction
   - Displays score and contributing factors

4. **On-Chain Storage**
   - Interacts with smart contract on Sepolia testnet
   - Stores credit score on blockchain
   - Handles transaction signing and confirmation

## API Interactions

### 1. Feature Extraction API
```javascript
// Request
POST http://5.189.130.12:8001/extract-features
{
    "walletAddress": "0x..."
}

// Response
{
    "walletAddress": "0x...",
    "features": {
        "TransactionFrequency": 123,
        "TransactionVolume": 45.67,
        // ... other features
    }
}
```

### 2. AI Adapter API
```javascript
// Request
POST http://5.189.130.12:8080/
{
    "id": "1",
    "data": {
        "Transaction Frequency": 123,
        "Transaction Volume (ETH)": 45.67,
        // ... formatted features
    }
}

// Response
{
    "jobRunID": "...",
    "data": {
        "walletAddress": "0x...",
        "creditScore": 750
    }
}
```

### 3. Smart Contract Interaction
```javascript
// Contract Address: 0x267541AA8acCC84Bc1c864Dc2B39dd1b2C6C4c9E
// Network: Sepolia Testnet
// Functions:
// - getCreditScores(address)
// Events:
// - CreditScoreStored(address, uint256, uint256)
```

## Setup and Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Configuration**
Create a `.env` file:
```
REACT_APP_CONTRACT_ADDRESS=0x267541AA8acCC84Bc1c864Dc2B39dd1b2C6C4c9E
REACT_APP_FEATURE_API_URL=http://5.189.130.12:8001
REACT_APP_AI_ADAPTER_URL=http://5.189.130.12:8080
```

3. **Run Development Server**
```bash
npm start
```

## Key Components

### 1. CreditScore.js
- Main page for credit score calculation
- Handles wallet connection
- Manages API calls and contract interactions
- Displays results and visualizations

### 2. FicoGauge.js
- Visual representation of credit score
- Interactive gauge component
- Score range indicators

## Deployment

1. **Build Production Version**
```bash
npm run build
```

2. **Deploy to Hosting Service**
- Configure environment variables
- Set up SSL
- Configure CORS
