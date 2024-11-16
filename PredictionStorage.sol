// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract PredictionStorage {

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
    function getPrediction(uint256 id) public view returns (
        uint256, uint256, uint256, uint256, string memory, uint256
    ) {
        Prediction memory pred = predictions[id];
        return (
            pred.id,
            pred.stockPrice,
            pred.marketTrend,
            pred.riskFactor,
            pred.predictionResult,
            pred.timestamp
        );
    }
}
