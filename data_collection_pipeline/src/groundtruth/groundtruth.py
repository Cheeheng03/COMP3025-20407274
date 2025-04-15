import pandas as pd
import os

# Load dataset
df = pd.read_csv("../dataset/raw/features.csv")

# Filter real wallets only
df = df[~df['Wallet Address'].str.contains("synthetic", na=False)]

def calculate_ground_truth_score(row):
    score = 0

    # 🔹 Average Health Factor (KMeans ranked cluster 0 > 2 > 4 > 3 > 1)
    if row['Average Health Factor'] >= 1e5:
        score += 5  # Cluster 0
    elif row['Average Health Factor'] >= 1000:
        score += 3
    elif row['Average Health Factor'] >= 10:
        score += 2
    elif row['Average Health Factor'] >= 1:
        score += 1
    else:
        score -= 2  # Cluster 1 behavior

    # 🔹 Liquidation Events — strongest penalty factor
    if row['Liquidation Event Count'] == 0:
        score += 3
    elif row['Liquidation Event Count'] <= 1:
        score += 1
    else:
        score -= 4

    # 🔹 Total Outstanding Debt — moderate penalizer
    if row['Total Outstanding Debt (USD)'] > 50000:
        score -= 5
    elif row['Total Outstanding Debt (USD)'] > 1000:
        score -= 3
    elif row['Total Outstanding Debt (USD)'] > 0:
        score -= 1
    else:
        score += 2

    # 🔹 Debt-to-Asset Ratio — heavily penalized
    if row['Debt-to-Asset Ratio'] > 50:
        score -= 3
    elif row['Debt-to-Asset Ratio'] > 10:
        score -= 2
    elif row['Debt-to-Asset Ratio'] > 1:
        score -= 1
    else:
        score += 2

    # 🔹 Repayment Activity Proxy — useful for separating clusters 1 vs 3
    if row['Repayment Activity Proxy'] > 100:
        score -= 2
    elif row['Repayment Activity Proxy'] > 10:
        score -= 1
    else:
        score += 1

    # 🔹 Earnings Efficiency — key separator for cluster 0 vs 1
    if row['Earnings Efficiency'] > 100:
        score += 4
    elif row['Earnings Efficiency'] > 10:
        score += 2
    elif row['Earnings Efficiency'] > 0:
        score += 1
    elif row['Earnings Efficiency'] < -100:
        score -= 3
    else:
        score -= 1

    return score

# Apply heuristic scoring
df['HeuristicScore'] = df.apply(calculate_ground_truth_score, axis=1)

# 🔁 Map score to ground truth label
def score_to_label(score):
    if score >= 12:
        return 0  # Exceptional
    elif score >= 8:
        return 2  # Very Good
    elif score >= 5:
        return 4  # Good
    elif score >= 2:
        return 3  # Fair
    else:
        return 1  # Poor

df['GroundTruthCluster'] = df['HeuristicScore'].apply(score_to_label)

# Ensure the groundtruth directory exists
output_dir = "../dataset/groundtruth"
os.makedirs(output_dir, exist_ok=True)

# Save result to the groundtruth directory
output_file = os.path.join(output_dir, "heuristic_groundtruth.csv")
df[['Wallet Address', 'HeuristicScore', 'GroundTruthCluster']].to_csv(output_file, index=False)
print(f"[✅] Ground truth labels saved to '{output_file}'")
