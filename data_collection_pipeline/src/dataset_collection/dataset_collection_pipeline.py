import csv
import os
import time
from datetime import datetime, timezone
import requests
from moralis import evm_api
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Moralis API Key from .env file
API_KEY = os.getenv("MORALIS_API_KEY")

# Input and Output CSV Files
WALLETS_CSV = "../dataset/wallets/wallets.csv"
FEATURES_CSV = "../dataset/raw/features.csv"

# Wallet methods indicating repayments, liquidate, and other interactions
WALLET_METHODS_REPAY = [
    "repay", "repayborrow", "repayWithPermit", "repayBorrowBehalf",
    "paybackDebt", "burnSynths", "repayDebt", "repayLoan", "repayTroves",
    "repayStableDebt", "repayVariableDebt", "repayFor", "repayCollateralizedDebt"
]

WALLET_METHODS_LIQUIDATE = [
    "liquidationCall", "liquidateBorrow", "liquidate",
    "liquidateDelinquentAccount", "liquidateTroves", "liquidatePosition",
    "bite", "redeemCollateral", "adjustTrove", "closeTrove",
    "seize", "forceClosePosition", "liquidateAccount"
]

WALLET_METHODS_HISTORY = [
    "deposit", "supply", "withdraw", "borrow", "repay", "repayborrow", "flashLoan", "flash",
    "swapBorrowRateMode", "setUserUseReserveAsCollateral", "configureReserveAsCollateral",
    "setCollateralConfiguration", "approveDelegation", "delegateCredit", "lockCollateral",
    "freeCollateral", "enterMarkets", "exitMarket", "mint", "redeem", "redeemUnderlying",
    "increaseAllowance", "repayWithPermit", "liquidationCall", "liquidateBorrow", "liquidate",
    "repayBorrowBehalf", "generateDebt", "paybackDebt", "swap", "swapExactTokensForTokens",
    "flashMint", "collateralSwap", "addLiquidity", "removeLiquidity"
]

# Function to fetch wallet net worth
def fetch_wallet_net_worth(wallet_address):
    params = {
        "chains": ["eth"],
        "exclude_spam": True,
        "exclude_unverified_contracts": True,
        "address": wallet_address,
    }
    try:
        result = evm_api.wallets.get_wallet_net_worth(api_key=API_KEY, params=params)
        return float(result.get("total_networth_usd", 0))
    except Exception as e:
        print(f"Error fetching wallet net worth: {e}")
        return 0.0

# Function to fetch wallet transactions
def fetch_wallet_transactions(wallet_address):
    params = {"chain": "eth", "address": wallet_address, "limit": 100}
    transactions = []
    cursor = None

    while True:
        if cursor:
            params["cursor"] = cursor
        try:
            result = evm_api.transaction.get_wallet_transactions_verbose(api_key=API_KEY, params=params)
            transactions.extend(result.get("result", []))
            cursor = result.get("cursor")
            if not cursor:
                break
        except Exception as e:
            print(f"Error fetching transactions: {e}")
            break

    return transactions

# Function to read wallets from CSV
def read_wallets_from_csv():
    wallets = []
    with open(WALLETS_CSV, "r") as file:
        reader = csv.reader(file)
        next(reader, None)  # Skip header
        for row in reader:
            if row:
                wallets.append(row[0])
    return wallets

# Function to save features to CSV
def save_features_to_csv(wallet, features):
    file_exists = os.path.isfile(FEATURES_CSV)

    headers = [
        "Wallet Address", "Transaction Frequency", "Transaction Volume (ETH)", "Largest Transaction (ETH)",
        "Average Transaction Value (ETH)", "Liquidation Event Count", "Average Health Factor",
        "Collateral Utilization", "Total Outstanding Debt (USD)", "Average Debt Size (USD)",
        "Debt-to-Asset Ratio", "Repayment Activity Proxy", "Earnings Efficiency",
        "Protocol Diversity", "Lending Protocol Count", "Liquidity Provision Count",
        "Token Swap Count", "Wallet Age (Days)", "DeFi Engagement Duration (Days)"
    ]

    with open(FEATURES_CSV, "a", newline="") as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(headers)
        writer.writerow([
            wallet,
            features["TransactionFrequency"], features["TransactionVolume"], features["LargestTransaction"],
            features["AverageTransactionValue"], features["LiquidationEventCount"], features["AverageHealthFactor"],
            features["CollateralUtilization"], features["TotalOutstandingDebt"], features["AverageDebtSize"],
            features["DebtToAssetRatio"], features["RepaymentActivityProxy"], features["EarningsEfficiency"],
            features["ProtocolDiversity"], features["LendingProtocolCount"], features["LiquidityProvisionCount"],
            features["TokenSwapCount"], features["WalletAgeInDays"], features["DeFiEngagementDurationInDays"]
        ])
    print(f"[INFO] Processed and saved: {wallet}")

# Main function to process wallets
def process_wallets():
    wallets = read_wallets_from_csv()
    for wallet in wallets:
        print(f"[INFO] Processing wallet: {wallet}")
        features = fetch_wallet_data(wallet)
        if features:
            save_features_to_csv(wallet, features)
            time.sleep(1)

# Fetch wallet data
def fetch_wallet_data(wallet_address):
    try:
        features = calculate_all_features(wallet_address)
        return features
    except Exception as e:
        print(f"[ERROR] Failed to process wallet {wallet_address}: {e}")
        return None

if __name__ == "__main__":
    process_wallets()

def fetch_transaction_data(wallet_address):
    """
    Fetch transaction data for a wallet using Moralis API with pagination.

    Args:
        wallet_address (str): Wallet address to retrieve transactions for.

    Returns:
        list: List of all transactions from the API response.
    """
    params = {
        "chain": "eth",
        "order": "DESC",
        "address": wallet_address,
        "limit": 100,
    }

    transactions = []
    cursor = None

    while True:
        if cursor:
            params["cursor"] = cursor

        try:
            result = evm_api.wallets.get_wallet_history(api_key=API_KEY, params=params)
            transactions.extend(result.get("result", []))
            cursor = result.get("cursor")

            # Break if no more pages
            if not cursor:
                break

        except Exception as e:
            print(f"Error fetching transaction data: {e}")
            break

    return transactions

def fetch_defi_positions(wallet_address):
    """
    Fetch DeFi positions for a wallet to analyze borrowing and collateral.
    """
    params = {"chain": "eth", "address": wallet_address}
    try:
        result = evm_api.wallets.get_defi_positions_summary(api_key=API_KEY, params=params)
        return result if isinstance(result, list) else []
    except Exception as e:
        print(f"Error fetching DeFi positions: {e}")
        return []


# functions used to engineer liquidation history features
def calculate_liquidation_event_count(wallet_address):
    """
    Calculate the total number of liquidation events based on transaction data
    using the WALLET_METHODS_LIQUIDATE list.
    """
    transactions = fetch_wallet_transactions(wallet_address)
    liquidation_count = 0

    for tx in transactions:
        decoded_call = tx.get("decoded_call", {})  # Extract the decoded call details
        if isinstance(decoded_call, dict):  # Ensure it's a dictionary
            method = decoded_call.get("label", "").lower()
            if any(liquidation_method in method for liquidation_method in WALLET_METHODS_LIQUIDATE):
                liquidation_count += 1

    return liquidation_count

def calculate_average_health_and_apy(positions):
    """
    Calculate average health factor and average APY.
    For extremely high health factors, replace with 'Infinity'.
    """
    health_factors, apys = [], []
    for position_data in positions:
        account_data = position_data.get("account_data", {})
        health_factor = account_data.get("health_factor")
        net_apy = account_data.get("net_apy")

        # Handle extremely high health factors
        if health_factor:
            if health_factor > 1e6:  # Threshold for 'Infinity'
                health_factors.append(float('inf'))  # Represent as infinity
            else:
                health_factors.append(health_factor)

        if net_apy is not None:
            apys.append(net_apy)

    # Average health factor (convert infinity back to string for output)
    avg_health_factor = sum(hf for hf in health_factors if hf != float('inf')) / len(health_factors) if health_factors else 0
    avg_health_factor_display = "Infinity" if any(hf == float('inf') for hf in health_factors) else round(avg_health_factor, 4)

    # Average APY
    avg_apy = sum(apys) / len(apys) if apys else None

    return {
        "AverageHealthFactor": avg_health_factor_display,
        "AverageAPY": avg_apy,
    }

def calculate_collateral_utilization(positions):
    """
    Calculate Collateral Utilization as the ratio of borrowed value to collateral deposited.

    Args:
        positions (list): List of DeFi positions.

    Returns:
        float: Ratio of borrowed value to collateral deposited.
    """
    total_borrowed = 0.0
    total_collateral = 0.0

    for position_data in positions:
        position = position_data.get("position", {})
        position_details = position.get("position_details", {})
        balance_usd = position.get("balance_usd", 0)

        # Collateral deposited
        if position_details.get("is_enabled_as_collateral", False):
            total_collateral += balance_usd

        # Borrowed value
        if position_details.get("is_debt", False):
            total_borrowed += balance_usd

    # Avoid division by zero
    if total_collateral == 0:
        return 0.0

    collateral_utilization = total_borrowed / total_collateral
    return round(collateral_utilization, 4)

# functions used to engineer debt and repayments features
def calculate_total_outstanding_debt(positions):
    total_outstanding_debt = 0
    for position_data in positions:
        position = position_data.get("position", {})
        position_details = position.get("position_details", {})
        if position_details.get("is_debt", False):
            balance_usd = position.get("balance_usd", 0)
            total_outstanding_debt += balance_usd
    return round(total_outstanding_debt, 2)

def calculate_repayment_activity_proxy(wallet_address):
    """
    Calculate the total number of repayment transactions.
    """
    transactions = fetch_wallet_transactions(wallet_address)
    repayment_count = 0
    for tx in transactions:
        decoded_call = tx.get("decoded_call")  # No default here
        if isinstance(decoded_call, dict):  # Ensure decoded_call is a dictionary
            method = decoded_call.get("label", "").lower()
            if any(method in wm for wm in WALLET_METHODS_REPAY):
                repayment_count += 1
    return repayment_count

def calculate_earnings_efficiency(positions):
    """
    Calculate Earnings Efficiency as the ratio of projected yearly profit to total collateral supplied.

    Args:
        positions (list): List of DeFi positions.

    Returns:
        float: Earnings efficiency ratio.
    """
    total_yearly_earnings = 0.0
    total_collateral_value = 0.0

    for position_data in positions:
        position = position_data.get("position", {})
        position_details = position.get("position_details", {})
        projected_earnings = position_details.get("projected_earnings_usd", {})

        # Sum projected yearly earnings
        yearly_earning = projected_earnings.get("yearly", 0)
        total_yearly_earnings += yearly_earning

        # Sum collateral value
        if position_details.get("is_enabled_as_collateral", False):
            total_collateral_value += position.get("balance_usd", 0)

    # Avoid division by zero
    if total_collateral_value == 0:
        return 0.0

    earnings_efficiency = total_yearly_earnings / total_collateral_value
    return round(earnings_efficiency, 4)

# functions used to engineer credit mix features
def calculate_protocol_diversity(defi_positions):
    """
    Calculate the number of unique DeFi protocols interacted with.

    Args:
        defi_positions (list): List of DeFi positions.

    Returns:
        int: Count of unique protocol names.
    """
    protocol_names = set()
    for position_data in defi_positions:
        protocol_name = position_data.get("protocol_name", "")
        if protocol_name:
            protocol_names.add(protocol_name)

    return len(protocol_names)

def calculate_lending_protocol_count(defi_positions):
    """
    Calculate the number of lending/borrowing protocols used.

    Args:
        defi_positions (list): List of DeFi positions.

    Returns:
        int: Count of unique lending protocols with `is_debt = true`.
    """
    lending_protocols = set()
    for position_data in defi_positions:
        position = position_data.get("position", {})
        position_details = position.get("position_details", {})

        if position_details.get("is_debt", False):
            protocol_name = position_data.get("protocol_name", "")
            if protocol_name:
                lending_protocols.add(protocol_name)

    return len(lending_protocols)

def calculate_liquidity_provision_count(defi_positions):
    """
    Calculate the total number of liquidity pool positions held.

    Args:
        defi_positions (list): List of DeFi positions.

    Returns:
        int: Count of positions indicating liquidity provision.
    """
    liquidity_positions_count = 0
    for position_data in defi_positions:
        position = position_data.get("position", {})
        position_details = position.get("position_details", {})

        # Check if the position has attributes related to liquidity pools
        if (
                position_details.get("liquidity", 0) > 0 or
                position_details.get("reserves") or
                position_details.get("pool_address") or
                position_details.get("share_of_pool", 0) > 0
        ):
            liquidity_positions_count += 1

    return liquidity_positions_count


def calculate_token_swap_count(wallet_address):
    """
    Calculate the number of token swaps conducted (buy or sell) using Moralis API.

    Args:
        wallet_address (str): Wallet address to analyze.

    Returns:
        int: Count of swap events with transactionType 'buy' or 'sell'.
    """
    url = f"https://deep-index.moralis.io/api/v2.2/wallets/{wallet_address}/swaps"
    params = {"chain": "eth", "order": "DESC", "limit": 100}
    headers = {
        "Accept": "application/json",
        "X-API-Key": API_KEY
    }
    swap_count = 0
    cursor = None

    while True:
        if cursor:
            params["cursor"] = cursor

        try:
            # API call using requests
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            result = response.json()

            swaps = result.get("result", [])
            for swap in swaps:
                transaction_type = swap.get("transactionType", "").lower()
                if transaction_type in ["buy", "sell"]:
                    swap_count += 1

            cursor = result.get("cursor")
            if not cursor:
                break  # Exit loop if no more data
        except Exception as e:
            print(f"Error fetching swaps: {e}")
            break

    return swap_count

# functions used to engineer length of credit History
def fetch_wallet_creation_date(wallet_address):
    """
    Get the wallet's first transaction date to determine wallet creation date.
    """
    params = {
        "chain": "eth",
        "order": "ASC",  # Oldest transaction first
        "address": wallet_address,
        "limit": 1
    }
    try:
        result = evm_api.wallets.get_wallet_history(api_key=API_KEY, params=params)
        first_tx = result.get("result", [])
        if first_tx:
            timestamp = first_tx[0]["block_timestamp"]
            return datetime.fromisoformat(timestamp.replace("Z", "")).replace(tzinfo=timezone.utc)
    except Exception as e:
        print(f"Error fetching wallet creation date: {e}")
    return None

def calculate_defi_engagement_duration(wallet_address):
    """
    Calculate the total engagement duration with DeFi protocols.
    """
    first_interaction = fetch_oldest_lending_interaction(wallet_address)
    if first_interaction:
        today = datetime.now(timezone.utc)
        duration = (today - first_interaction).days
        return duration
    return 0

def fetch_oldest_lending_interaction(wallet_address):
    """
    Find the timestamp of the first lending/borrowing protocol interaction.
    """
    params = {
        "chain": "eth",
        "address": wallet_address,
        "limit": 100,
        "order": "ASC"
    }

    transactions = []
    cursor = None

    while True:
        if cursor:
            params["cursor"] = cursor
        try:
            result = evm_api.transaction.get_wallet_transactions_verbose(api_key=API_KEY, params=params)
            transactions.extend(result.get("result", []))
            cursor = result.get("cursor")
            if not cursor:
                break
        except Exception as e:
            print(f"Error fetching transactions: {e}")
            break

    for tx in transactions:
        decoded_call = tx.get("decoded_call", {})
        if decoded_call:
            method = decoded_call.get("label", "").lower()
            if method in WALLET_METHODS_HISTORY:
                return datetime.fromisoformat(tx["block_timestamp"].replace("Z", "")).replace(tzinfo=timezone.utc)
    return None

def calculate_all_features(wallet_address):
    # Fetch shared data
    transactions = fetch_transaction_data(wallet_address)
    defi_positions = fetch_defi_positions(wallet_address)
    creation_date = fetch_wallet_creation_date(wallet_address)

    # Transaction History
    if transactions and creation_date:
        today = datetime.now(timezone.utc)
        wallet_age_months = max(1, (today.year - creation_date.year) * 12 + (today.month - creation_date.month))
        transaction_frequency = len(transactions) / wallet_age_months
        transaction_volume = sum(int(tx.get("value", 0)) / 10**18 for tx in transactions)  # Convert from Wei to ETH
        largest_transaction = max(int(tx.get("value", 0)) / 10**18 for tx in transactions)
        average_transaction_value = transaction_volume / len(transactions) if len(transactions) > 0 else 0

        transaction_history = {
            "TransactionFrequency": round(transaction_frequency, 2),
            "TransactionVolume": round(transaction_volume, 4),
            "LargestTransaction": round(largest_transaction, 4),
            "AverageTransactionValue": round(average_transaction_value, 4),
        }
    else:
        transaction_history = {
            "TransactionFrequency": 0,
            "TransactionVolume": 0,
            "LargestTransaction": 0,
            "AverageTransactionValue": 0,
        }

    # Liquidation History
    if defi_positions:
        liquidation_event_count = calculate_liquidation_event_count(wallet_address)

        avg_health_data = calculate_average_health_and_apy(defi_positions)

        collateral_utilization = calculate_collateral_utilization(defi_positions)

        liquidation_history = {
            "LiquidationEventCount": liquidation_event_count,
            **avg_health_data,
            "CollateralUtilization": collateral_utilization,
        }
    else:
        liquidation_history = {
            "LiquidationEventCount": 0,
            "AverageHealthFactor": 0.0,
            "CollateralUtilization": 0.0,
        }

    # Debt and Repayments
    if defi_positions:
        total_outstanding_debt = calculate_total_outstanding_debt(defi_positions)
        avg_debt_size = total_outstanding_debt / max(1, len(defi_positions))
        debt_to_asset_ratio = round(total_outstanding_debt / max(1, fetch_wallet_net_worth(wallet_address)), 4)
        repayment_activity_proxy = calculate_repayment_activity_proxy(wallet_address)
        earnings_efficiency = calculate_earnings_efficiency(defi_positions)

        debt_and_repayments = {
            "TotalOutstandingDebt": total_outstanding_debt,
            "AverageDebtSize": avg_debt_size,
            "DebtToAssetRatio": debt_to_asset_ratio,
            "RepaymentActivityProxy": repayment_activity_proxy,
            "EarningsEfficiency": earnings_efficiency,
        }
    else:
        debt_and_repayments = {
            "TotalOutstandingDebt": 0,
            "AverageDebtSize": 0,
            "DebtToAssetRatio": 0.0,
            "RepaymentActivityProxy": 0,
            "EarningsEfficiency": 0.0,
        }

    # Credit Mix
    if defi_positions:
        protocol_diversity = calculate_protocol_diversity(defi_positions)
        lending_protocol_count = calculate_lending_protocol_count(defi_positions)
        liquidity_provision_count = calculate_liquidity_provision_count(defi_positions)
        token_swap_count = calculate_token_swap_count(wallet_address)

        credit_mix = {
            "ProtocolDiversity": protocol_diversity,
            "LendingProtocolCount": lending_protocol_count,
            "LiquidityProvisionCount": liquidity_provision_count,
            "TokenSwapCount": token_swap_count,
        }
    else:
        credit_mix = {
            "ProtocolDiversity": 0,
            "LendingProtocolCount": 0,
            "LiquidityProvisionCount": 0,
            "TokenSwapCount": 0,
        }

    # Length of Credit History
    if creation_date:
        wallet_age = (datetime.now(timezone.utc) - creation_date).days
        defi_engagement_duration = calculate_defi_engagement_duration(wallet_address)

        length_of_credit_history = {
            "WalletAgeInDays": wallet_age,
            "DeFiEngagementDurationInDays": defi_engagement_duration,
        }
    else:
        length_of_credit_history = {
            "WalletAgeInDays": 0,
            "DeFiEngagementDurationInDays": 0,
        }

    # Combine all categories
    features = {
        **transaction_history,
        **liquidation_history,
        **debt_and_repayments,
        **credit_mix,
        **length_of_credit_history,
    }

    return features


# Function to read existing wallet addresses to prevent duplicate writes
def get_existing_wallets():
    existing_wallets = set()
    if os.path.isfile(FEATURES_CSV):
        with open(FEATURES_CSV, "r", newline="") as file:
            reader = csv.reader(file)
            next(reader, None)  # Skip header
            for row in reader:
                if row:
                    existing_wallets.add(row[0])  # First column is Wallet Address
    return existing_wallets