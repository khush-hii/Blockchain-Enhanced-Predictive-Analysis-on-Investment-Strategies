// Define the structure for the Prediction
struct Prediction {
    uint256 id;
    uint256 stockPrice;
    uint256 marketTrend;
    uint256 riskFactor;
    uint256 economicIndicators;
    string predictionResult;
    uint256 timestamp;
}

// Mapping to store predictions by ID
mapping(uint256 => Prediction) public predictions;

// Function to store a prediction
function storePrediction(
    uint256 id, 
    uint256 stockPrice, 
    uint256 marketTrend, 
    uint256 riskFactor, 
    uint256 economicIndicators, 
    string memory predictionResult
) public {
    // Store the prediction in the mapping
    predictions[id] = Prediction(id, stockPrice, marketTrend, riskFactor, economicIndicators, predictionResult, block.timestamp);
}

// Function to retrieve a prediction by ID
function getPrediction(uint256 id) public view returns (Prediction memory) {
    return predictions[id];
}
