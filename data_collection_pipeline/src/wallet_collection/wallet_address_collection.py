import requests
import csv
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Etherscan API Key from .env file
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")


# Lending Protocol Contracts (Aave, Compound, MakerDAO)
LENDING_PROTOCOLS = {
    "AaveV3_LendingPool": "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
    "Compound_Pool": "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
    "MakerDAO_Pool": "0x83F20F44975D03b1b09e64809B757c47f942BEeA",
}

# File to store addresses
CSV_FILE = "../dataset/wallets/wallets.csv"
MAX_WALLETS_TOTAL = 2000  # Limit to 2000 wallets across all protocols
BLOCK_LOOKBACK = 100000000  # Fetch interactions from the last 100,000 blocks


def get_latest_block():
    """Fetch the latest Ethereum block number dynamically."""
    url = f"https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey={ETHERSCAN_API_KEY}"
    response = requests.get(url).json()
    return int(response["result"], 16)  # Convert hex to integer


def fetch_interactions(protocol_name, contract_address, latest_block, remaining_limit):
    """
    Fetch up to the remaining limit of addresses that have interacted with a protocol in the last BLOCK_LOOKBACK blocks.
    """
    from_block = latest_block - BLOCK_LOOKBACK
    url = f"https://api.etherscan.io/api?module=account&action=txlist&address={contract_address}&startblock={from_block}&endblock={latest_block}&sort=desc&apikey={ETHERSCAN_API_KEY}"

    response = requests.get(url)
    data = response.json()

    if data["status"] != "1":
        print(f"[ERROR] Could not fetch transactions for {protocol_name}: {data.get('message')}")
        return []

    addresses = set()

    for tx in data["result"]:
        addresses.add(tx["from"].lower())
        addresses.add(tx["to"].lower())

        if len(addresses) >= remaining_limit:
            break  # Stop if we reach the remaining limit

    print(f"[INFO] Collected {len(addresses)} addresses from {protocol_name}")
    return list(addresses)


def save_addresses_to_csv(addresses):
    """
    Save addresses to a CSV file.
    """
    with open(CSV_FILE, "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["Address"])
        for address in addresses:
            writer.writerow([address])

    print(f"[INFO] Saved {len(addresses)} addresses to {CSV_FILE}")


def main():
    """
    Main function to fetch addresses from multiple lending protocols and save them to a CSV file.
    """
    latest_block = get_latest_block()
    print(f"[INFO] Fetching transactions from block {latest_block - BLOCK_LOOKBACK} to {latest_block}...")

    all_addresses = set()
    remaining_limit = MAX_WALLETS_TOTAL

    for protocol_name, contract_address in LENDING_PROTOCOLS.items():
        if remaining_limit <= 0:
            break  # Stop if we have already collected the maximum number of wallets

        addresses = fetch_interactions(protocol_name, contract_address, latest_block, remaining_limit)
        all_addresses.update(addresses)  # Merge unique addresses
        remaining_limit = MAX_WALLETS_TOTAL - len(all_addresses)  # Update the remaining limit

    save_addresses_to_csv(all_addresses)
    print(f"[SUCCESS] Collected and saved {len(all_addresses)} unique addresses from multiple lending protocols.")


if __name__ == "__main__":
    main()
