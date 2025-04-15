// adapter_input.js
const { Requester } = require('@chainlink/external-adapter')

// Global variable to store the latest user-supplied input.
let latestInput = null;

const createRequest = (input, callback) => {
  const jobRunID = input.id || '1';
  console.log(`[${jobRunID}] Raw input:`, JSON.stringify(input));

  // Check if the caller provided new input data.
  if (input.data && Object.keys(input.data).length > 0) {
    // Extract the user-supplied values (no defaults are applied).
    const inputData = {
      "Transaction Frequency": input.data["Transaction Frequency"],
      "Transaction Volume (ETH)": input.data["Transaction Volume (ETH)"],
      "Largest Transaction (ETH)": input.data["Largest Transaction (ETH)"],
      "Average Transaction Value (ETH)": input.data["Average Transaction Value (ETH)"],
      "Liquidation Event Count": input.data["Liquidation Event Count"],
      "Average Health Factor": input.data["Average Health Factor"],
      "Collateral Utilization": input.data["Collateral Utilization"],
      "Total Outstanding Debt (USD)": input.data["Total Outstanding Debt (USD)"],
      "Average Debt Size (USD)": input.data["Average Debt Size (USD)"],
      "Debt-to-Asset Ratio": input.data["Debt-to-Asset Ratio"],
      "Repayment Activity Proxy": input.data["Repayment Activity Proxy"],
      "Earnings Efficiency": input.data["Earnings Efficiency"],
      "Protocol Diversity": input.data["Protocol Diversity"],
      "Lending Protocol Count": input.data["Lending Protocol Count"],
      "Liquidity Provision Count": input.data["Liquidity Provision Count"],
      "Token Swap Count": input.data["Token Swap Count"],
      "Wallet Age (Days)": input.data["Wallet Age (Days)"],
      "DeFi Engagement Duration (Days)": input.data["DeFi Engagement Duration (Days)"],
      "walletAddress": input.data.walletAddress
    };
    // Update the global variable with the new input.
    latestInput = inputData;
    console.log(`[${jobRunID}] Updated latestInput:`, JSON.stringify(latestInput));
  } else {
    console.log(`[${jobRunID}] No new input provided; using stored input:`, JSON.stringify(latestInput));
  }

  // Build the response using the stored input.
  const response = {
    jobRunID,
    success: true,    // This flag tells the Chainlink job that valid input is available
    data: latestInput
  };

  console.log(`[${jobRunID}] Final response:`, JSON.stringify(response));
  callback(200, Requester.success(jobRunID, response));
};

// Wrappers for various deployment platforms
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data);
  });
};

exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data);
  });
};

exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    });
  });
};

module.exports.createRequest = createRequest;
