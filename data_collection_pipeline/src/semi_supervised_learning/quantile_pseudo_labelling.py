import pandas as pd
from sklearn.cluster import KMeans
from scipy.spatial import distance
import scipy.stats as stats
import numpy as np

def pseudo_label_data(input_path='../dataset/processed/clustered_wallets.csv', output_path='../dataset/processed/pseudo_labelled_dataset.csv', fico_mapping_path='../dataset/processed/cluster_fico_mapping.csv'):
    # Load Data
    df = pd.read_csv(input_path)
    df = df.drop(columns=['Wallet Address'], errors='ignore')
    numeric_cols = df.select_dtypes(include=[np.number]).columns[:-2]
    X = df[numeric_cols]
    clusters = df['Cluster']

    # Load Cluster Centers
    kmeans = KMeans(n_clusters=5, random_state=42)
    kmeans.fit(X)
    cluster_centers = kmeans.cluster_centers_

    # Dynamically Load FICO Ranges from Mapping File
    fico_mapping_df = pd.read_csv(fico_mapping_path)
    fico_ranges = {}
    for _, row in fico_mapping_df.iterrows():
        cluster = row['Cluster']
        # Extract only the numeric part of the FICO Range (e.g., '800-850' from 'Exceptional (800-850)')
        numeric_range = row['FICO Range'].split('(')[-1].strip(')')
        fico_min, fico_max = map(int, numeric_range.split('-'))
        fico_ranges[cluster] = (fico_min, fico_max)

    # Calculate Distance from Cluster Center
    df['Distance'] = [
        distance.euclidean(row, cluster_centers[int(cluster)])
        for row, cluster in zip(X.values, clusters)
    ]

    # Quantile Normalization
    def calculate_quantile_rank(distances):
        ranks = stats.rankdata(distances, method='average')
        quantiles = 1 - ((ranks - 1) / (len(distances) - 1))
        return quantiles

    # Calculate quantile rank for each cluster
    df['Quantile Rank'] = df.groupby('Cluster')['Distance'].transform(calculate_quantile_rank)

    # Map Quantiles to FICO Range
    def map_quantile_to_fico(cluster, quantile):
        fico_min, fico_max = fico_ranges[cluster]
        return int(fico_min + quantile * (fico_max - fico_min))

    df['Credit Score'] = df.apply(lambda row: map_quantile_to_fico(row['Cluster'], row['Quantile Rank']), axis=1)

    # Drop intermediate columns
    df = df.drop(columns=['Distance', 'Quantile Rank'])

    # Save the Pseudo-Labeled Dataset
    df.to_csv(output_path, index=False)
    print(f"[INFO] Pseudo-labelled dataset saved as '{output_path}'")
