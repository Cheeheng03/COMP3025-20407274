# Web3 Wallet Credit Score System

This project implements a decentralized credit scoring system for Web3 wallets, leveraging blockchain technology and machine learning to assess wallet behavior and generate credit scores.

## System Architecture

The system consists of several interconnected components that work together to provide a comprehensive credit scoring solution:

1. **Data Collection Pipeline** (`/data_collection_pipeline`)
   - Collects wallet transaction data
   - Generates ground truth labels
   - Implements semi-supervised learning
   - [Component README](data_collection_pipeline/README.md)

2. **AI Model Training** (`/ai_model_training`)
   - Trains CatBoost, Random Forest, and Gradient Boosting models
   - Performs hyperparameter tuning
   - Evaluates model performance
   - [Component README](ai_model_training/README.md)

3. **Feature Extraction API** (`/feature_extraction_api`)
   - Extracts wallet metrics and features
   - Processes transaction data
   - Provides standardized feature format
   - [Component README](feature_extraction_api/README.md)

4. **Models API Service** (`/models_api_service`)
   - Hosts trained ML models
   - Provides prediction endpoints
   - Handles model inference
   - [Component README](models_api_service/README.md)

5. **Smart Contracts** (`/smart_contracts`)
   - Stores credit scores on-chain
   - Manages Chainlink job execution
   - Handles operator permissions
   - [Component README](smart_contracts/README.md)

6. **Chainlink External Adapters** (`/chainlink_external_adapters`)
   - Connects smart contracts to external APIs
   - Handles data formatting
   - Manages API responses
   - [Component README](chainlink_external_adapters/README.md)

7. **Frontend Application** (`/frontend`)
   - Provides user interface
   - Connects to MetaMask
   - Displays credit scores
   - [Component README](frontend/README.md)

## System Flow

1. **Data Collection and Processing**
   ```
   Wallet Transactions → Data Collection Pipeline → Feature Extraction API
   ```

2. **Model Training and Deployment**
   ```
   Processed Data → AI Model Training → Models API Service
   ```

3. **Credit Score Generation**
   ```
   Feature Extraction API → Models API Service → Smart Contracts
   ```

4. **User Interaction**
   ```
   Frontend → Smart Contracts → Chainlink Adapters → External APIs
   ```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- MetaMask wallet
- Sepolia testnet ETH
- Foundry (for smart contract testing)

### Environment Setup

1. **Clone the repository**
```bash
git clone [repository-url]
```

2. **Set up individual components**
Follow the setup instructions in each component's README:
- [Data Collection Pipeline Setup](data_collection_pipeline/README.md#setup)
- [AI Model Training Setup](ai_model_training/README.md#setup)
- [Feature Extraction API Setup](feature_extraction_api/README.md#setup)
- [Models API Service Setup](models_api_service/README.md#setup)
- [Smart Contracts Setup](smart_contracts/README.md#setup)
- [Chainlink Adapters Setup](chainlink_external_adapters/README.md#setup)
- [Frontend Setup](frontend/README.md#setup)

## Running the System

1. **Start Data Collection Pipeline**
```bash
cd data_collection_pipeline
python main.py
```

2. **Start Feature Extraction API**
```bash
cd feature_extraction_api
python app.py
```

3. **Start Models API Service**
```bash
cd models_api_service
# Start each model service
cd catboost_model && python app.py
cd ../randomforest_model && python app.py
cd ../gradientboost_model && python app.py
```

4. **Deploy Smart Contracts**
```bash
cd smart_contracts
npx hardhat run scripts/deploy.js --network sepolia
```

5. **Start Frontend Application**
```bash
cd frontend
npm start
```

## Development Workflow

1. **Data Collection and Processing**
   - Collect wallet transaction data
   - Process and clean data
   - Generate features

2. **Model Development**
   - Train and evaluate models
   - Deploy models to API service
   - Test model performance

3. **Smart Contract Development**
   - Write and test contracts
   - Deploy to testnet
   - Verify contracts

4. **Frontend Development**
   - Implement UI components
   - Connect to smart contracts
   - Test user interactions

