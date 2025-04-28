# Web3 Wallet Credit Score Data Collection Pipeline

This pipeline collects, processes, and prepares data for training credit score prediction models for Web3 wallets. The pipeline follows this sequence:

1. **Wallet Collection** - Gathers wallet addresses for analysis
2. **Dataset Collection** - Collects wallet transaction data and calculates features
3. **Ground Truth Generation** - Creates labeled data using heuristic rules
4. **Semi-Supervised Learning** - Enhances the dataset with synthetic data and pseudo-labels

## Project Structure

```
data_collection_pipeline/
├── src/
│   ├── wallet_collection/
│   │   └── wallet_address_collection.py
│   ├── dataset_collection/
│   │   └── dataset_collection_pipeline.py
│   ├── groundtruth/
│   │   ├── groundtruth.py
│   │   └── groundtruth_similarity.py
│   ├── semi_supervised_learning/
│   │   ├── pipeline.py
│   │   ├── dataset_cleaning.py
│   │   ├── synthetic_data.py
│   │   ├── clustering.py
│   │   ├── quantile_pseudo_labelling.py
│   │   └── oversampling.py
│   └── dataset/
│       ├── wallets/
│       ├── raw/
│       ├── groundtruth/
│       └── processed/
```

## Pipeline Components

### 1. Wallet Collection
The wallet collection component (`wallet_collection/`) is the first step in the pipeline. It:
- Gathers wallet addresses from various DeFi protocols
- Filters for active wallets
- Saves addresses to `dataset/wallets/wallets.csv`

### 2. Dataset Collection
The dataset collection component (`dataset_collection_pipeline.py`) processes the collected wallet addresses using the Moralis API. It calculates various features including:

- Transaction metrics:
  - Transaction frequency
  - Transaction volume (ETH)
  - Largest transaction (ETH)
  - Average transaction value (ETH)

- DeFi interaction metrics:
  - Liquidation event count
  - Average health factor
  - Collateral utilization
  - Protocol diversity

- Debt metrics:
  - Total outstanding debt (USD)
  - Average debt size (USD)
  - Debt-to-asset ratio
  - Repayment activity proxy

- Time-based metrics:
  - Wallet age (days)
  - DeFi engagement duration (days)

### 3. Ground Truth Generation
The ground truth generation component (`groundtruth/`) creates labeled data using heuristic rules based on:

- Average Health Factor (weighted heavily)
- Liquidation Events (strong penalty factor)
- Total Outstanding Debt (moderate penalizer)
- Debt-to-Asset Ratio (heavily penalized)
- Repayment Activity Proxy
- Earnings Efficiency

Labels are assigned to five categories:
- 0: Exceptional (score ≥ 12)
- 1: Poor (score < 2)
- 2: Very Good (8 ≤ score < 12)
- 3: Fair (2 ≤ score < 5)
- 4: Good (5 ≤ score < 8)

### 4. Semi-Supervised Learning
The semi-supervised learning component enhances the dataset through these steps:

1. **Dataset Cleaning** (`dataset_cleaning.py`)
   - Handles missing values
   - Removes outliers
   - Normalizes features

2. **Synthetic Data Generation** (`synthetic_data.py`)
   - Creates synthetic samples for underrepresented classes
   - Uses SMOTE and other techniques

3. **Clustering** (`clustering.py`)
   - Identifies natural clusters in the data
   - Helps in pseudo-labeling

4. **Quantile Pseudo-Labeling** (`quantile_pseudo_labelling.py`)
   - Assigns labels to unlabeled data
   - Uses quantile-based thresholds

5. **Oversampling** (`oversampling.py`)
   - Balances class distribution
   - Uses various sampling techniques

## Setup and Usage

### Prerequisites
- Python 3.8+
- Moralis API key
- Required Python packages (install using `pip install -r requirements.txt`)

### Environment Setup
1. Create a `.env` file with your Moralis API key:
```
MORALIS_API_KEY=your_api_key_here
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

### Running the Pipeline

1. **Collect Wallet Addresses**
```bash
python src/wallet_collection/wallet_address_collection.py
```

2. **Collect Wallet Data**
```bash
python src/dataset_collection/dataset_collection_pipeline.py
```

3. **Generate Ground Truth**
```bash
python src/groundtruth/groundtruth.py
```

4. **Run Semi-Supervised Learning Pipeline**
```bash
python src/semi_supervised_learning/pipeline.py
```

## Output Files

The pipeline generates these files in sequence:

1. **Wallet Addresses** (`dataset/wallets/wallets.csv`)
   - List of collected wallet addresses

2. **Raw Features** (`dataset/raw/features.csv`)
   - Contains all collected wallet features

3. **Ground Truth** (`dataset/groundtruth/heuristic_groundtruth.csv`)
   - Contains wallet addresses with heuristic scores and cluster labels

4. **Processed Dataset** (`dataset/processed/`)
   - Cleaned and enhanced dataset ready for model training
