# --- Import Libraries ---
import numpy as np
import pandas as pd

def clean_dataset(input_path='../dataset/raw/features.csv', output_path='../dataset/processed/cleaned_features.csv'):
    # --- Step 1: Load Data ---
    df = pd.read_csv(input_path)

    # Strip any leading/trailing spaces from column names
    df.columns = df.columns.str.strip()

    # Temporarily Drop Wallet Address Column for Calculations
    wallet_address_column = df['Wallet Address'] if 'Wallet Address' in df.columns else None
    df = df.drop(columns=['Wallet Address'], errors='ignore')

    # --- Step 2: Clean Data ---

    # 1. Replace Infinity, -Infinity in Average Health Factor with the Maximum Finite Value
    max_health_factor = df['Average Health Factor'][np.isfinite(df['Average Health Factor'])].max()
    df['Average Health Factor'] = df['Average Health Factor'].replace(['Infinity', np.inf, -np.inf], max_health_factor).astype(float)

    # 2. Replace Infinity, -Infinity in All Numeric Columns with the Maximum Finite Value of Each Column
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        max_value = df[col][np.isfinite(df[col])].max()
        df[col] = df[col].replace([np.inf, -np.inf], max_value)

    # 3. Replace Zero in Average Health Factor with 1 (Neutral Point)
    df['Average Health Factor'] = df['Average Health Factor'].replace(0, 1)

    # 4. Fill NaN Values with Median of Each Numeric Column
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())

    # --- Step 3: Save Cleaned Data ---
    # Add Wallet Address Back
    if wallet_address_column is not None:
        df['Wallet Address'] = wallet_address_column

        # Reorder the Columns to Keep Wallet Address as the First Column
        cols = ['Wallet Address'] + [col for col in df.columns if col != 'Wallet Address']
        df = df[cols]

    # Save the Cleaned Data
    df.to_csv(output_path, index=False)
    print(f"[INFO] Cleaned dataset saved as '{output_path}'")
