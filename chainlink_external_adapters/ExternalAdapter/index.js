// adapter_aggregate.js
const { Requester } = require('@chainlink/external-adapter')

const customError = (data) => {
  if (!data || data.Response === 'Error') return true
  return false
}

const createRequest = (input, callback) => {
  const jobRunID = input.id || '1'
  console.log(`[${jobRunID}] Raw input:`, JSON.stringify(input))

  // Extract inputData from input.data.inputData, or fallback to input.data.
  let inputData = input.data && input.data.inputData
  if (!inputData && input.data) {
    console.log(`[${jobRunID}] input.data.inputData not found, using input.data instead`)
    inputData = input.data
  }
  
  // If inputData is a string, try parsing it as JSON.
  if (typeof inputData === 'string') {
    try {
      inputData = JSON.parse(inputData)
      console.log(`[${jobRunID}] Successfully parsed inputData string.`)
    } catch (err) {
      console.error(`[${jobRunID}] Failed to parse inputData string:`, err)
      callback(500, Requester.errored(jobRunID, "Failed to parse inputData string"))
      return
    }
  }
  
  // If there's a nested "data" property, extract the features.
  if (inputData && typeof inputData === 'object' && inputData.data !== undefined) {
    console.log(`[${jobRunID}] Found nested data, extracting actual features.`)
    inputData = inputData.data
  }
  
  // Save walletAddress separately, then remove it from inputData.
  const walletAddress = inputData.walletAddress || ""
  if (walletAddress) {
    delete inputData.walletAddress
    console.log(`[${jobRunID}] Removed walletAddress from inputData for model calls.`)
  }
  
  // Remove the "result" key if it exists.
  if (inputData && inputData.hasOwnProperty("result")) {
    delete inputData.result
    console.log(`[${jobRunID}] Removed "result" key from inputData for model calls.`)
  }
  
  console.log(`[${jobRunID}] Final inputData sent to models:`, JSON.stringify(inputData))
  
  // Define the endpoints for each AI model's API
  const rfUrl = 'http://5.189.130.12:5001/predict' // Random Forest
  const gbUrl = 'http://5.189.130.12:5002/predict' // Gradient Boosting
  const cbUrl = 'http://5.189.130.12:5003/predict' // CatBoost
  
  // Helper function to call an API endpoint
  const getPrediction = (url) => {
    const config = {
      url,
      method: 'POST',
      data: inputData
    }
    console.log(`[${jobRunID}] Calling ${url} with data:`, JSON.stringify(inputData))
    return Requester.request(config, customError)
  }
  
  // Call all three endpoints concurrently
  Promise.all([
    getPrediction(rfUrl),
    getPrediction(gbUrl),
    getPrediction(cbUrl)
  ])
  .then(results => {
    console.log(`[${jobRunID}] Received prediction responses:`, results.map(r => r.data))
    
    // Extract prediction values; adjust keys if necessary
    const rfResult = results[0].data["Random Forest Prediction"]
    const gbResult = results[1].data["Gradient Boosting Prediction"]
    const cbResult = results[2].data["CatBoost Prediction"]
    
    if (rfResult === undefined || gbResult === undefined || cbResult === undefined) {
      callback(500, Requester.errored(jobRunID, "Missing prediction data from one or more models"))
      return
    }
    
    // Aggregate the predictions using a simple average
    const aggregatedScore = Math.round((rfResult + gbResult + cbResult) / 3)
    
    // Build the final response object: wrap data in a "data" field.
    const response = {
      data: {
        walletAddress,
        aggregatedCreditScore: aggregatedScore
      },
      result: aggregatedScore,
      jobRunID: jobRunID
    }
    
    console.log(`[${jobRunID}] Final aggregated response:`, JSON.stringify(response))
    callback(200, Requester.success(jobRunID, response))
  })
  .catch(error => {
    console.error(`[${jobRunID}] Error during prediction aggregation:`, error)
    callback(500, Requester.errored(jobRunID, error))
  })
}

// Wrappers for various deployment platforms
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

module.exports.createRequest = createRequest
