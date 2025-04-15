import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import seaborn as sns

def perform_clustering(input_path='../dataset/processed/complete_dataset.csv', output_path='../dataset/processed/clustered_wallets.csv'):
    # Load and Clean Data
    df = pd.read_csv(input_path)
    df = df.drop(columns=['Wallet Address'], errors='ignore')
    df['Average Health Factor'] = df['Average Health Factor'].replace(['Infinity', np.inf, -np.inf], 999999).astype(float)
    df.replace([np.inf, -np.inf], 999999, inplace=True)

    df['Average Health Factor'] = df['Average Health Factor'].replace(0, 1)

    # Fill NaN with the median
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())

    # --- Fix Negative or Zero Values ---
    epsilon = 1e-6  # Small positive constant

    # List of columns that cannot be negative but can be zero
    non_negative_cols = [
        'Transaction Frequency', 'Transaction Volume (ETH)', 'Largest Transaction (ETH)',
        'Average Transaction Value (ETH)', 'Liquidation Event Count', 'Collateral Utilization',
        'Protocol Diversity', 'Lending Protocol Count', 'Liquidity Provision Count',
        'Token Swap Count', 'Wallet Age (Days)', 'DeFi Engagement Duration (Days)'
    ]

    # Replace zeros with epsilon for non-negative columns
    for col in non_negative_cols:
        df[col] = np.where(df[col] > 0, df[col], epsilon)

    # For ratio-based features, replace negatives with epsilon (if negatives are not logically valid)
    ratio_features = [
        'Debt-to-Asset Ratio', 'Repayment Activity Proxy'
    ]

    for col in ratio_features:
        df[col] = np.where(df[col] > 0, df[col], epsilon)

    # Clean Data Before Log Transformation
    df_log = df.copy()

    # Apply Log Transformation
    for col in numeric_cols:
        df_log[col] = np.log1p(np.where(df_log[col] > 0, df_log[col], epsilon))

    # Impute Remaining NaNs with Median
    df_log[numeric_cols] = df_log[numeric_cols].fillna(df_log[numeric_cols].median())

    # Final check for NaNs
    if df_log.isna().sum().sum() > 0:
        raise ValueError("NaN values found after log transformation and imputation.")

    # Normalization
    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(df_log[numeric_cols])

    # Apply K-means with Optimal Number of Clusters
    kmeans = KMeans(n_clusters=5, random_state=42)
    clusters = kmeans.fit_predict(X_scaled)

    # Add Cluster Labels
    df['Cluster'] = clusters

    # PCA for 2D Visualization
    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X_scaled)

    # Visualize Clusters in 2D
    plt.figure(figsize=(12, 8))
    sns.scatterplot(x=X_pca[:, 0], y=X_pca[:, 1], hue=clusters, palette='viridis')
    plt.xlabel('PCA Component 1')
    plt.ylabel('PCA Component 2')
    plt.title('2D Visualization of Clusters')
    plt.legend(title='Cluster')
    plt.grid(True)
    plt.show()

    ############################################################################
    #           RISK SCORE BASED FICO MAPPING (NO "Credit Score" COLUMN)         #
    ############################################################################

    # Define key metrics to build a risk score
    key_metrics = [
        'Average Health Factor',             # higher is better
        'Liquidation Event Count',           # higher is worse
        'Total Outstanding Debt (USD)',      # higher is worse
        'Debt-to-Asset Ratio'                # higher is worse
    ]

    # 1. Compute the average values of these metrics per cluster
    cluster_summary = df.groupby('Cluster')[key_metrics].mean()

    # 2. Normalize each metric in cluster_summary to [0, 1]
    temp = cluster_summary.copy()
    scaler_metrics = MinMaxScaler()
    temp[key_metrics] = scaler_metrics.fit_transform(temp[key_metrics])

    # 3. Invert the detrimental metrics so that higher is always "better"
    detrimental = ['Liquidation Event Count', 'Total Outstanding Debt (USD)', 'Debt-to-Asset Ratio']
    for col in detrimental:
        temp[col] = 1 - temp[col]

    # 4. Create a simple combined "risk score"
    #    Higher risk_score means the cluster is less risky (better)
    temp['risk_score'] = (
        temp['Average Health Factor'] +
        temp['Liquidation Event Count'] +
        temp['Total Outstanding Debt (USD)'] +
        temp['Debt-to-Asset Ratio']
    )

    # 5. Sort clusters by risk_score in descending order
    #    cluster_order[0] is the highest score (least risky) and cluster_order[-1] is the most risky.
    ranking = temp['risk_score'].sort_values(ascending=False)
    cluster_order = ranking.index.tolist()

    # 6. Define your FICO ranges from best to worst
    fico_labels_desc = [
        'Exceptional (800-850)',
        'Very Good (740-799)',
        'Good (670-739)',
        'Fair (580-669)',
        'Poor (300-579)'
    ]

    # 7. Map clusters to FICO ranges based on the risk_score ranking
    cluster_to_fico = {cluster_order[i]: fico_labels_desc[i] for i in range(len(cluster_order))}

    # 8. Apply the mapping to your DataFrame
    df['FICO Range'] = df['Cluster'].map(cluster_to_fico)

    # Save the FICO mapping to a CSV file
    fico_mapping_df = pd.DataFrame({
        'Cluster': cluster_order,
        'FICO Range': [fico_labels_desc[i] for i in range(len(cluster_order))]
    })
    fico_mapping_df.to_csv('../dataset/processed/cluster_fico_mapping.csv', index=False)
    print(f"[INFO] Cluster-to-FICO mapping saved as '../dataset/processed/cluster_fico_mapping.csv'")

    ############################################################################
    #                   END OF RISK-BASED FICO MAPPING LOGIC                   #
    ############################################################################

    # Save clustered wallets
    df.to_csv(output_path, index=False)
    print(f"[INFO] Clustered dataset saved as '{output_path}'")
