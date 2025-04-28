# Web3 Wallet Credit Score Prediction Models

This project contains three different machine learning models for predicting Web3 wallet credit scores:
1. CatBoost Regressor
2. Random Forest Regressor
3. Gradient Boost Regressor

## Project Structure

```
ai_model_training/
├── dataset/                    # Contains the training data
│   └── macro_credit_scores.csv # Main dataset
├── models/                     # Directory for saved models
├── catboost_info/             # CatBoost model information
├── venv/                      # Virtual environment
├── Catboost_Credit_Score.ipynb
├── Random_Forest_Credit_Scoring.ipynb
├── Gradient_Boost_Credit_Scoring.ipynb
└── requirements.txt
```

## Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows:
```bash
.\venv\Scripts\activate
```
- Linux/Mac:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Models

The project contains three Jupyter notebooks, each implementing a different model:

1. **CatBoost Credit Score Model** (`Catboost_Credit_Score.ipynb`)
   - Implements a CatBoost regressor with hyperparameter tuning
   - Uses RandomizedSearchCV for optimal parameter selection
   - Evaluates model performance using R2 score and MSE
   - Generates feature importance plots

2. **Random Forest Credit Score Model** (`Random_Forest_Credit_Scoring.ipynb`)
   - Implements a Random Forest regressor with hyperparameter tuning
   - Uses RandomizedSearchCV for optimal parameter selection
   - Evaluates model performance using R2 score and MSE
   - Generates feature importance plots

3. **Gradient Boost Credit Score Model** (`Gradient_Boost_Credit_Scoring.ipynb`)
   - Implements a Gradient Boosting regressor with hyperparameter tuning
   - Uses RandomizedSearchCV for optimal parameter selection
   - Evaluates model performance using R2 score and MSE
   - Generates feature importance plots

To run any of these models:

1. Start Jupyter Notebook:
```bash
jupyter notebook
```

2. Open the desired notebook file
3. Run the cells in sequence

## Data Requirements

The models expect a CSV file named `macro_credit_scores.csv` in the `dataset/` directory with the following structure:
- Features: Various wallet metrics and transaction data
- Target: 'Credit Score' column
- Optional columns: 'Cluster', 'FICO Range' (these will be dropped if present)

## Model Outputs

Each model will:
1. Perform hyperparameter tuning
2. Train the best model
3. Evaluate performance using R2 score and MSE
4. Generate feature importance plots
5. Save the trained model to the `models/` directory

## Dependencies

The project requires the following Python packages (specified in requirements.txt):
- pandas==2.1.4
- numpy==1.26.2
- catboost==1.2.4
- scikit-learn==1.3.2
- seaborn==0.13.0
- matplotlib==3.8.2
- joblib==1.3.2 