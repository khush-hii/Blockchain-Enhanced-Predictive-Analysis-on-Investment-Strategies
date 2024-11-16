const web3 = new Web3(window.ethereum);
let contract;
let account;
let predictionId = 1;

const predictionContractAddress = "0x407560ce8e379ad247aa4013cd6a8522442cf8f8"; // Replace with your contract address
const predictionABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getPrediction",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "predictions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stockPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "marketTrend",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "riskFactor",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "economicIndicators",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "predictionResult",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stockPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "marketTrend",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "riskFactor",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "economicIndicators",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "predictionResult",
				"type": "string"
			}
		],
		"name": "storePrediction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

window.onload = async function () {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed. Please install MetaMask and try again.');
        return;
    }

    // Request account access from MetaMask
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        web3.eth.defaultAccount = window.ethereum.selectedAddress;
        contract = new web3.eth.Contract(predictionABI, predictionContractAddress);
        account = web3.eth.defaultAccount;
    } catch (error) {
        alert('Error connecting to MetaMask. Please check if MetaMask is installed and unlocked.');
        console.error(error);
        return;
    }

    // Check if connected to the right network (e.g., Sepolia or Rinkeby)
    const chainId = await web3.eth.getChainId();
    if (chainId !== 11155111) { // Replace with the correct chainId (11155111 is Sepolia)
        alert('Please switch to the correct network (Sepolia) on MetaMask.');
        return;
    }

    // Handle Prediction Button Click
    document.getElementById("predictBtn").onclick = async function () {
        const companyName = document.getElementById("companyName").value;
        const investmentMoney = parseFloat(document.getElementById("investmentPrice").value);
        const marketTrend = parseInt(document.getElementById("marketTrend").value);
        const riskFactor = parseInt(document.getElementById("riskFactor").value);
        const economicIndicators = parseInt(document.getElementById("economicIndicators").value);

        // Call backend API to get prediction and stock data
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                companyName: companyName,
                investmentMoney: investmentMoney,
                marketTrend: marketTrend,
                riskFactor: riskFactor,
                economicIndicators: economicIndicators
            })
        });

        if (!response.ok) {
            console.error("Error fetching prediction data:", response.statusText);
            return;
        }

        let result;
        try {
            result = await response.json();
        } catch (e) {
            console.error("Failed to parse JSON:", e);
            return;
        }

        document.getElementById("predictionResult").innerText = `Prediction: ${result.prediction_result}`;
        document.getElementById("stockPrice").innerText = `Stock Price: ${result.live_stock_data.close_price}`;

        // Show the "Store on Blockchain" button after prediction is received
        document.getElementById("storeBlockchainBtn").style.display = "block";

        // Store prediction data for blockchain interaction
        const stockPrice = result.live_stock_data.close_price;
        const predictionResult = result.prediction_result;

        // Save prediction on blockchain when button is clicked
        document.getElementById("storeBlockchainBtn").onclick = async function () {
            const roundedStockPrice = Math.round(stockPrice);
            await storePrediction(roundedStockPrice, marketTrend, riskFactor, economicIndicators, predictionResult);
        };
    };
};

// Store prediction on the blockchain
async function storePrediction(stockPrice, marketTrend, riskFactor, economicIndicators, predictionResult) {
    const id = predictionId++;
    try {
        await contract.methods.storePrediction(
            id,
            stockPrice,
            marketTrend,
            riskFactor,
            economicIndicators,
            predictionResult
        ).send({ from: account })
        .on('transactionHash', function (hash) {
            console.log('Transaction sent with hash: ' + hash);
        })
        .on('receipt', function (receipt) {
            console.log('Transaction receipt: ', receipt);
            alert('Prediction successfully stored on the blockchain!');
        })
        .on('error', function (error) {
            console.error("Error storing prediction on blockchain:", error);
            alert('Error storing prediction on the blockchain!');
        });
    } catch (error) {
        console.error("Error storing prediction on blockchain:", error);
        alert('Error storing prediction on the blockchain!');
    }
}
