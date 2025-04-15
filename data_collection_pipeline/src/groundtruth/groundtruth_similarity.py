import pandas as pd

# Load both datasets
heuristic_df = pd.read_csv("../dataset/groundtruth/heuristic_groundtruth.csv")
clustered_df = pd.read_csv("../dataset/processed/clustered_wallets.csv")

# Remove synthetic rows (if 'Wallet Address' exists)
if 'Wallet Address' in heuristic_df.columns:
    heuristic_df = heuristic_df[~heuristic_df['Wallet Address'].str.contains("synthetic", na=False)]

# Align lengths: take only first 2000 rows from both
heuristic_clusters = heuristic_df['GroundTruthCluster'].iloc[:2000].reset_index(drop=True)
existing_clusters = clustered_df['Cluster'].iloc[:2000].reset_index(drop=True)

# Compare
comparison_df = pd.DataFrame({
    'Heuristic': heuristic_clusters,
    'Existing': existing_clusters
})
comparison_df['Match'] = comparison_df['Heuristic'] == comparison_df['Existing']

# Calculate similarity
similarity = comparison_df['Match'].mean() * 100

# Output
print(f"[INFO] Cluster similarity between heuristic and existing labels = {similarity:.2f}%")

