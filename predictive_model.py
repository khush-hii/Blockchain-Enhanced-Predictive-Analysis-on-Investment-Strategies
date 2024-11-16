# You can use a simple decision logic or machine learning model here
def predict(investment_price, market_trend, risk_factor, economic_indicators):
    # Example of simple rule-based prediction
    if market_trend > 50 and risk_factor < 50 and economic_indicators > 50:
        return "Good Investment"
    else:
        return "Bad Investment"
