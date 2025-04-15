import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import FicoGauge from "../components/FicoGauge";
import landingbg from '../assets/images/creditscorebg.jpg';

// Your OnChainCreditScore contract address and ABI
const CREDIT_SCORE_CONTRACT_ADDRESS = "0x267541AA8acCC84Bc1c864Dc2B39dd1b2C6C4c9E";
const CREDIT_SCORE_CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "wallet", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "creditScore", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "CreditScoreStored",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "wallet", "type": "address" }
    ],
    "name": "getCreditScores",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "creditScore", "type": "uint256" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct OnChainCreditScore.CreditRecord[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const CreateCreditScorePage = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [creditScore, setCreditScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Connect to MetaMask and set the wallet address
  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const address = accounts[0];
        console.log("Connected wallet address:", address);
        setWalletAddress(address);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask and try again.");
    }
  };

  // Detect account changes
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          console.log("Account changed:", accounts[0]);
          setWalletAddress(accounts[0]);
        } else {
          console.log("No accounts found");
          setWalletAddress("");
        }
      });
    }
  }, []);

  // Subscribe to the CreditScoreStored event for dynamic UI updates
  useEffect(() => {
    if (typeof window.ethereum !== "undefined" && walletAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        CREDIT_SCORE_CONTRACT_ADDRESS,
        CREDIT_SCORE_CONTRACT_ABI,
        provider
      );

      // Handler for the CreditScoreStored event
      const handleCreditScoreStored = async (wallet, score, timestamp) => {
        console.log("Event received:", wallet, score.toString(), timestamp.toString());
        // Ensure the event is for the currently connected wallet
        if (wallet.toLowerCase() === walletAddress.toLowerCase()) {
          try {
            // Fetch all records to get the latest score
            const records = await contract.getCreditScores(wallet);
            if (records.length > 0) {
              const latestRecord = records[records.length - 1];
              setCreditScore(Number(latestRecord.creditScore));
            }
          } catch (err) {
            console.error("Error fetching credit scores:", err);
          }
        }
      };

      // Subscribe to the event
      contract.on("CreditScoreStored", handleCreditScoreStored);

      // Clean up the listener when component unmounts or walletAddress changes
      return () => {
        contract.off("CreditScoreStored", handleCreditScoreStored);
      };  
    }
  }, [walletAddress]);

  // Handle form submission: extract features, send to AI adapter, and then prompt contract call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1) Call Python API to extract features.
      const response = await fetch('http://5.189.130.12:8001/extract-features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });
      const data = await response.json();
      console.log("Features fetched:", data);

      if (!data || !data.features) {
        console.error("No features returned from the Python API.");
        setLoading(false);
        return;
      }
      setFeatures(data.features);

      // 2) Prepare data in the required format for the AI adapter.
      const preparedData = {
        id: "1",
        data: {
          "Transaction Frequency": data.features.TransactionFrequency,
          "Transaction Volume (ETH)": data.features.TransactionVolume,
          "Largest Transaction (ETH)": data.features.LargestTransaction,
          "Average Transaction Value (ETH)": data.features.AverageTransactionValue,
          "Liquidation Event Count": data.features.LiquidationEventCount,
          "Average Health Factor": data.features.AverageHealthFactor,
          "Collateral Utilization": data.features.CollateralUtilization,
          "Total Outstanding Debt (USD)": data.features.TotalOutstandingDebt,
          "Average Debt Size (USD)": data.features.AverageDebtSize,
          "Debt-to-Asset Ratio": data.features.DebtToAssetRatio,
          "Repayment Activity Proxy": data.features.RepaymentActivityProxy,
          "Earnings Efficiency": data.features.EarningsEfficiency,
          "Protocol Diversity": data.features.ProtocolDiversity,
          "Lending Protocol Count": data.features.LendingProtocolCount,
          "Liquidity Provision Count": data.features.LiquidityProvisionCount,
          "Token Swap Count": data.features.TokenSwapCount,
          "Wallet Age (Days)": data.features.WalletAgeInDays,
          "DeFi Engagement Duration (Days)": data.features.DeFiEngagementDurationInDays,
          "walletAddress": data.features.walletAddress || walletAddress
        }
      };

      // 3) Send the prepared data to the AI adapter.
      const adapterResponse = await fetch('http://5.189.130.12:8080/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preparedData),
      });
      const adapterData = await adapterResponse.json();
      console.log("AI Adapter response:", adapterData);

      // Check if the adapter indicates success.
      if (adapterData.jobRunID && adapterData.data) {
        console.log("AI adapter indicates success. Job ID:", adapterData.jobRunID);
        console.log("Returned data:", adapterData.data);

        // 4) Prompt the user to sign a transaction to call the contract.
        if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          // Switch to Sepolia network if not already on it.
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0xaa36a7" }], // Sepolia chain ID in hex (0xaa36a7 = 11155111)
            });
            console.log("Switched to Sepolia network.");
          } catch (switchError) {
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0xaa36a7",
                      chainName: "Sepolia Testnet",
                      rpcUrls: ["https://rpc.sepolia.org"],
                      nativeCurrency: {
                        name: "Sepolia ETH",
                        symbol: "ETH",
                        decimals: 18,
                      },
                      blockExplorerUrls: ["https://sepolia.etherscan.io"],
                    },
                  ],
                });
                console.log("Sepolia network added to MetaMask.");
              } catch (addError) {
                console.error("Failed to add Sepolia network:", addError);
                alert("Please add the Sepolia network to MetaMask and try again.");
                setLoading(false);
                return;
              }
            } else {
              console.error("Failed to switch network:", switchError);
              alert("Please switch to the Sepolia network in MetaMask and try again.");
              setLoading(false);
              return;
            }
          }

          // Define your contract address and ABI.
          const contractAddress = "0x433f3363634651fbef0Fd49Bf6409f5DFC0359f5";
          const contractABI = [
            {
              "inputs": [],
              "name": "requestEventListener",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }
          ];

          // Create the contract instance.
          const contract = new ethers.Contract(contractAddress, contractABI, signer);

          try {
            // Call the contract function to request the event listener.
            const tx = await contract.requestEventListener();
            console.log("Transaction sent. Waiting for confirmation...", tx);
            const receipt = await tx.wait();
            console.log("Transaction confirmed:", receipt);
            alert("Transaction successful! Event listener requested.");
          } catch (txError) {
            console.error("Error calling requestEventListener:", txError);
            alert("Transaction failed. Please try again.");
          }
        } else {
          alert("MetaMask is not installed. Please install MetaMask and try again.");
        }
      } else {
        console.warn("AI adapter did not return expected success:", adapterData);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
    setLoading(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Render a summary snippet (only Transaction History) when features are available.
  const renderSummary = () => {
    if (!features) return null;
    return (
      <div className="text-gray-800 text-sm">
        <h4 className="font-bold">Transaction History:</h4>
        <p>Frequency: {features.TransactionFrequency}</p>
        <p>Volume (ETH): {features.TransactionVolume}</p>
        <p className="mt-2 italic">Click to expand for full details...</p>
      </div>
    );
  };

  // Render full details of extracted features.
  const renderFullFeatures = () => {
    if (!features) return null;
    return (
      <div className="text-gray-800 text-sm">
        <h4 className="font-bold mb-2">1. Transaction History:</h4>
        <p>Transaction Frequency: {features.TransactionFrequency}</p>
        <p>Transaction Volume (ETH): {features.TransactionVolume}</p>
        <p>Largest Transaction (ETH): {features.LargestTransaction}</p>
        <p>Average Transaction Value (ETH): {features.AverageTransactionValue}</p>

        <h4 className="font-bold mt-4 mb-2">2. Liquidation History:</h4>
        <p>Liquidation Event Count: {features.LiquidationEventCount}</p>
        <p>Average Health Factor: {features.AverageHealthFactor}</p>
        <p>Collateral Utilization: {features.CollateralUtilization}</p>

        <h4 className="font-bold mt-4 mb-2">3. Debt and Repayments:</h4>
        <p>Total Outstanding Debt (USD): {features.TotalOutstandingDebt}</p>
        <p>Average Debt Size (USD): {features.AverageDebtSize}</p>
        <p>Debt-to-Asset Ratio: {features.DebtToAssetRatio}</p>
        <p>Repayment Activity Proxy: {features.RepaymentActivityProxy}</p>
        <p>Earnings Efficiency: {features.EarningsEfficiency}</p>

        <h4 className="font-bold mt-4 mb-2">4. Credit Mix:</h4>
        <p>Protocol Diversity: {features.ProtocolDiversity}</p>
        <p>Lending Protocol Count: {features.LendingProtocolCount}</p>
        <p>Liquidity Provision Count: {features.LiquidityProvisionCount}</p>
        <p>Token Swap Count: {features.TokenSwapCount}</p>

        <h4 className="font-bold mt-4 mb-2">5. Length of Credit History:</h4>
        <p>Wallet Age (Days): {features.WalletAgeInDays}</p>
        <p>DeFi Engagement Duration (Days): {features.DeFiEngagementDurationInDays}</p>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col xl:flex-row bg-cover bg-center overflow-auto"
      style={{ backgroundImage: `url(${landingbg})` }}
    >
      {/* Left Section: FicoGauge with dynamic creditScore */}
      <div className="flex-1 flex items-center justify-center p-4">
        <FicoGauge score={creditScore} />
      </div>

      {/* Right Section: Wallet Options & Form */}
      <div className="flex-1 p-8 m-12 bg-white bg-opacity-65 rounded-lg shadow-lg flex flex-col justify-start transition-all duration-300">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 text-center mb-4">
            You can either connect your wallet using MetaMask or manually enter a wallet address.
          </p>
          <div className="flex flex-col items-center space-y-6">
            {/* Connect Wallet Button */}
            <button
              onClick={handleConnectWallet}
              className="relative bg-[#4ec7b3] font-bold py-2 px-4 rounded-full w-40 overflow-hidden group"
            >
              <span className="relative z-10 bg-black text-transparent bg-clip-text font-neue-machina font-bold group-hover:text-white transition-colors duration-500">
                Connect Wallet
              </span>
              <span className="rounded-full absolute inset-0 bg-gradient-to-r from-[#00E4BF] via-blue-400 to-purple-600 transition-transform duration-500 transform translate-x-full group-hover:translate-x-0 z-0"></span>
            </button>

            {/* Wallet Address Input */}
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter Wallet Address (0x...)"
              className="w-80 p-3 border rounded-md focus:outline-none text-gray-700 text-center"
            />

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="relative bg-[#4ec7b3] font-bold py-2 px-4 rounded-full w-40 overflow-hidden group"
            >
              <span className="relative z-10 bg-black text-transparent bg-clip-text font-neue-machina font-bold group-hover:text-white transition-colors duration-500">
                {loading ? "Processing..." : "Submit"}
              </span>
              <span className="rounded-full absolute inset-0 bg-gradient-to-r from-[#00E4BF] via-blue-400 to-purple-600 transition-transform duration-500 transform translate-x-full group-hover:translate-x-0 z-0"></span>
            </button>
          </div>
        </div>

        {/* Extracted Features Section (displayed as a collapsible dropdown below the submit button) */}
        {features && (
          <div className="mt-8">
            <div
              className="flex items-center justify-between cursor-pointer border-b pb-2"
              onClick={toggleExpand}
            >
              <h3 className="text-2xl font-semibold text-gray-800">
                Extracted Features
              </h3>
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="mt-4">
              {isExpanded ? renderFullFeatures() : renderSummary()}
            </div>
          </div>
        )}

        <div className="mt-8 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Aggregated Credit Score</h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-700 text-xl font-semibold">
              <strong>Score:</strong> {creditScore || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCreditScorePage;
