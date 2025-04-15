import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from imblearn.over_sampling import SMOTE
from collections import Counter
import matplotlib.pyplot as plt
import seaborn as sns

def oversample_data(input_path='../dataset/processed/pseudo_labelled_dataset.csv', output_path='../dataset/completed/macro_credit_scores.csv'):
    # Load Data
    df = pd.read_csv(input_path)
    df = df.drop(columns=['Wallet Address'], errors='ignore')
    numeric_cols = df.select_dtypes(include=[np.number]).columns

    # Normalize Data
    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(df[numeric_cols])

    # Apply SMOTE to the entire dataset
    # Adjust `k_neighbors` to avoid errors if any class has fewer samples
    smote = SMOTE(random_state=42, k_neighbors=3)
    X_resampled, y_resampled = smote.fit_resample(X_scaled, df['FICO Range'])

    # Visualize Class Distribution
    plt.figure(figsize=(12, 6))
    sns.countplot(x=y_resampled, hue=y_resampled, palette='viridis', order=np.unique(y_resampled), dodge=False)
    plt.title('Class Distribution After SMOTE')
    plt.xlabel('FICO Score Range')
    plt.ylabel('Count')
    plt.legend([], [], frameon=False)  # Hide the legend manually
    plt.grid(True)
    plt.show()

    # Save the Augmented Dataset
    # Convert y_resampled to DataFrame and Concatenate with Resampled Features
    augmented_df = pd.DataFrame(X_resampled, columns=numeric_cols)
    augmented_df['FICO Range'] = y_resampled

    # Save to CSV
    augmented_df.to_csv(output_path, index=False)
    print(f"[INFO] Oversampled dataset saved as '{output_path}'")
