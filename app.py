from flask import Flask, request, jsonify
import yfinance as yf  # Importing the Yahoo Finance library for fetching stock data
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route('/')
def home():
    return "Welcome to the Prediction API!"


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    company_name = data['companyName']
    investment_money = data['investmentMoney']
    market_trend = data['marketTrend']
    risk_factor = data['riskFactor']
    economic_indicators = data['economicIndicators']
    
    # Fetch the stock data using Yahoo Finance
    stock_data = yf.Ticker(company_name)
    stock_info = stock_data.history(period="1d")
    close_price = stock_info['Close'].iloc[-1]  # Get the latest close price
    
    # Example prediction logic based on the formula you provided
    prediction_score = (investment_money * market_trend * 0.4) - (risk_factor * economic_indicators * 0.3)

    # Determine the investment decision
    if prediction_score > close_price * 1.1:
        prediction_result = "Good Investment"
    elif prediction_score < close_price * 0.9:
        prediction_result = "Bad Investment"
    else:
        prediction_result = "Neutral Investment"

    # Prepare the result
    result = {
        "prediction_result": prediction_result,
        "prediction_score": prediction_score,
        "live_stock_data": {
            "close_price": close_price,
            "company_name": company_name
        },
        "user_inputs": {
            "investment_money": investment_money,
            "risk_factor": risk_factor,
            "market_trend": market_trend,
            "economic_indicators": economic_indicators
        }
    }
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
