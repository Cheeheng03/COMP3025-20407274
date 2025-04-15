# Import Libraries
import pandas as pd
import random
import matplotlib.pyplot as plt
import seaborn as sns


# Function to Generate Synthetic Wallet Address
def generate_wallet_address():
    # Fixed part: '0x000000000000syntheticwallet'
    fixed_part = '0x000000000000syntheticwallet'
    # Random part: 4 hexadecimal characters
    random_part = ''.join(random.choices('0123456789abcdef', k=4))
    # Combine both parts
    return fixed_part + random_part

# Function to Generate Synthetic Instances
def generate_synthetic_instances():
    synthetic_data = []

    # --- Step 1: Set Constant Base Values ---
    base_values = {
        'Transaction Frequency': 12.0,
        'Transaction Volume (ETH)': 500.0,
        'Largest Transaction (ETH)': 50.0,
        'Average Transaction Value (ETH)': 2.5,
        'Collateral Utilization': 0.5,
        'Repayment Activity Proxy': 20.0,
        'Earnings Efficiency': 0.05,
        'Protocol Diversity': 2.0,
        'Lending Protocol Count': 1.0,
        'Liquidity Provision Count': 0.5,
        'Token Swap Count': 5.0,
        'Wallet Age (Days)': 730.0,
        'DeFi Engagement Duration (Days)': 365.0
    }

    # --- Group 1: Varying Average Health Factor (200 Instances) ---
    for _ in range(200):
        wallet_address = generate_wallet_address()
        avg_health_factor = round(random.uniform(0.1, 3), 4)

        # Consistent Pattern: High Health Factor → Low Debt, Low Debt-to-Asset Ratio
        if avg_health_factor > 1.5:
            total_outstanding_debt = round(random.uniform(0, 50000), 2)
            debt_to_asset_ratio = round(random.uniform(0, 0.5), 4)
            repayment_activity_proxy = round(random.uniform(50, 100), 2)  # Higher Repayment for High Health Factor
        else:
            total_outstanding_debt = round(random.uniform(50000, 200000), 2)
            debt_to_asset_ratio = round(random.uniform(0.5, 2), 4)
            repayment_activity_proxy = round(random.uniform(0, 50), 2)   # Lower Repayment for Low Health Factor

        avg_debt_size = round(total_outstanding_debt / (base_values['Transaction Frequency'] + 1), 2)

        synthetic_data.append([
            wallet_address, base_values['Transaction Frequency'], base_values['Transaction Volume (ETH)'],
            base_values['Largest Transaction (ETH)'], base_values['Average Transaction Value (ETH)'],
            0, avg_health_factor, base_values['Collateral Utilization'],
            total_outstanding_debt, avg_debt_size, debt_to_asset_ratio,
            repayment_activity_proxy, base_values['Earnings Efficiency'],
            base_values['Protocol Diversity'], base_values['Lending Protocol Count'],
            base_values['Liquidity Provision Count'], base_values['Token Swap Count'],
            base_values['Wallet Age (Days)'], base_values['DeFi Engagement Duration (Days)']
        ])

    # --- Group 2: Varying Repayment Activity Proxy (200 Instances) ---
    for _ in range(200):
        wallet_address = generate_wallet_address()
        repayment_activity_proxy = round(random.uniform(0, 100), 2)

        # Consistent Pattern: High Repayment Activity → High Health Factor, Low Debt
        if repayment_activity_proxy >= 50:
            total_outstanding_debt = round(random.uniform(0, 50000), 2)
            avg_health_factor = round(random.uniform(1.5, 3), 4)
        else:
            total_outstanding_debt = round(random.uniform(50000, 200000), 2)
            avg_health_factor = round(random.uniform(0.1, 1.5), 4)

        avg_debt_size = round(total_outstanding_debt / (base_values['Transaction Frequency'] + 1), 2)
        debt_to_asset_ratio = round(total_outstanding_debt / (base_values['Transaction Volume (ETH)'] + 1), 4)

        synthetic_data.append([
            wallet_address, base_values['Transaction Frequency'], base_values['Transaction Volume (ETH)'],
            base_values['Largest Transaction (ETH)'], base_values['Average Transaction Value (ETH)'],
            0, avg_health_factor, base_values['Collateral Utilization'],
            total_outstanding_debt, avg_debt_size, debt_to_asset_ratio, repayment_activity_proxy,
            base_values['Earnings Efficiency'], base_values['Protocol Diversity'],
            base_values['Lending Protocol Count'], base_values['Liquidity Provision Count'],
            base_values['Token Swap Count'], base_values['Wallet Age (Days)'],
            base_values['DeFi Engagement Duration (Days)']
        ])

    # --- Group 3: Varying Liquidation Events (200 Instances) ---
    for _ in range(200):
        wallet_address = generate_wallet_address()
        liquidation_event_count = random.randint(0, 5)

        # Exponential Penalty: Higher Liquidation Event → Exponentially Lower Health Factor
        if liquidation_event_count == 0:
            avg_health_factor = round(random.uniform(1.5, 3), 4)
            total_outstanding_debt = 0
            debt_to_asset_ratio = 0
            repayment_activity_proxy = round(random.uniform(50, 100),
                                             2)  # High Repayment Activity for no liquidation
        else:
            # Exponential Decay for Health Factor
            avg_health_factor = round(3 * (0.5 ** liquidation_event_count), 4)

            # Exponential Growth for Debt and Debt-to-Asset Ratio
            total_outstanding_debt = round(random.uniform(10000, 200000) * (2 ** liquidation_event_count), 2)
            debt_to_asset_ratio = round(random.uniform(0.5, 2) * liquidation_event_count, 4)

            # Decreasing Repayment Activity with Higher Liquidation Events
            repayment_activity_proxy = round(100 / (liquidation_event_count + 1), 2)

        avg_debt_size = round(total_outstanding_debt / (base_values['Transaction Frequency'] + 1), 2)

        synthetic_data.append([
            wallet_address, base_values['Transaction Frequency'], base_values['Transaction Volume (ETH)'],
            base_values['Largest Transaction (ETH)'], base_values['Average Transaction Value (ETH)'],
            liquidation_event_count, avg_health_factor, base_values['Collateral Utilization'],
            total_outstanding_debt, avg_debt_size, debt_to_asset_ratio, repayment_activity_proxy,
            base_values['Earnings Efficiency'], base_values['Protocol Diversity'],
            base_values['Lending Protocol Count'], base_values['Liquidity Provision Count'],
            base_values['Token Swap Count'], base_values['Wallet Age (Days)'],
            base_values['DeFi Engagement Duration (Days)']
        ])

    # Convert to DataFrame
    columns = [
        'Wallet Address', 'Transaction Frequency', 'Transaction Volume (ETH)',
        'Largest Transaction (ETH)', 'Average Transaction Value (ETH)', 'Liquidation Event Count',
        'Average Health Factor', 'Collateral Utilization', 'Total Outstanding Debt (USD)',
        'Average Debt Size (USD)', 'Debt-to-Asset Ratio', 'Repayment Activity Proxy',
        'Earnings Efficiency', 'Protocol Diversity', 'Lending Protocol Count',
        'Liquidity Provision Count', 'Token Swap Count', 'Wallet Age (Days)',
        'DeFi Engagement Duration (Days)'
    ]
    synthetic_df = pd.DataFrame(synthetic_data, columns=columns)

    return synthetic_df

def generate_synthetic_data(input_path='../dataset/processed/cleaned_features.csv', output_path='../dataset/processed/complete_dataset.csv'):
    # Generate synthetic data
    synthetic_df = generate_synthetic_instances()

    # Load existing cleaned dataset
    existing_df = pd.read_csv(input_path)
    print(f"[INFO] Original dataset size: {len(existing_df)}")

    # Combine original and synthetic instances
    complete_df = pd.concat([existing_df, synthetic_df], ignore_index=True)
    print(f"[INFO] Complete dataset size after adding synthetic instances: {len(complete_df)}")

    # Save the combined dataset
    complete_df.to_csv(output_path, index=False)
    print(f"[INFO] Complete dataset saved as '{output_path}'")

