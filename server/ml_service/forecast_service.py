"""
Inventra AI — Predictive Demand Forecasting ML Service
Framework: Python, Pandas, NumPy, scikit-learn
Model: Time-Series Linear/Ridge Regression with Lag & Moving Average Features
"""

import sys
import json
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler

def run_demand_forecast(sales_data_json, forecast_days=30):
    try:
        raw_data = json.loads(sales_data_json) if isinstance(sales_data_json, str) else sales_data_json
        if not raw_data or len(raw_data) == 0:
            return {"status": "error", "message": "Insufficient data"}

        df = pd.DataFrame(raw_data)
        if 'date' not in df.columns or 'quantity' not in df.columns:
            return {"status": "error", "message": "Missing required date/quantity columns"}

        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date').reset_index(drop=True)

        # Aggregate daily sales
        daily_df = df.groupby('date')['quantity'].sum().reset_index()
        
        # Feature Engineering: Lag 1, Lag 7, 7-day Rolling Mean, Day of Week, Day Index
        daily_df['day_index'] = (daily_df['date'] - daily_df['date'].min()).dt.days
        daily_df['day_of_week'] = daily_df['date'].dt.dayofweek
        daily_df['lag_1'] = daily_df['quantity'].shift(1).fillna(method='bfill')
        daily_df['lag_7'] = daily_df['quantity'].shift(7).fillna(method='bfill')
        daily_df['rolling_7_mean'] = daily_df['quantity'].rolling(7, min_periods=1).mean()

        X = daily_df[['day_index', 'day_of_week', 'lag_1', 'lag_7', 'rolling_7_mean']]
        y = daily_df['quantity']

        # Train scikit-learn Ridge Regression Baseline Model
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        model = Ridge(alpha=1.0)
        model.fit(X_scaled, y)

        # Generate Future Forecast Horizons (7, 14, 30 days)
        last_date = daily_df['date'].max()
        last_day_index = daily_df['day_index'].max()
        
        future_dates = [last_date + pd.Timedelta(days=i) for i in range(1, forecast_days + 1)]
        predictions = []

        curr_lag1 = daily_df['quantity'].iloc[-1]
        curr_lag7 = daily_df['quantity'].iloc[-7] if len(daily_df) >= 7 else curr_lag1
        curr_rolling = daily_df['rolling_7_mean'].iloc[-1]

        for i, fdate in enumerate(future_dates, 1):
            f_day_index = last_day_index + i
            f_day_of_week = fdate.dayofweek
            
            feat = np.array([[f_day_index, f_day_of_week, curr_lag1, curr_lag7, curr_rolling]])
            feat_scaled = scaler.transform(feat)
            pred_qty = max(0, round(float(model.predict(feat_scaled)[0]), 2))

            predictions.append({
                "date": fdate.strftime('%Y-%m-%d'),
                "predictedDemand": pred_qty
            })

            # Update rolling lag
            curr_lag1 = pred_qty

        # Calculate totals for 7, 14, 30 day horizons
        pred_7_days = sum(p['predictedDemand'] for p in predictions[:7])
        pred_14_days = sum(p['predictedDemand'] for p in predictions[:14])
        pred_30_days = sum(p['predictedDemand'] for p in predictions[:30])

        return {
            "status": "success",
            "model": "scikit-learn Ridge Regressor (v1.2)",
            "horizons": {
                "days_7": round(pred_7_days, 1),
                "days_14": round(pred_14_days, 1),
                "days_30": round(pred_30_days, 1)
            },
            "dailyForecast": predictions
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == '__main__':
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
        with open(input_file, 'r') as f:
            data = json.load(f)
        result = run_demand_forecast(data.get('salesData', []), data.get('forecastDays', 30))
        print(json.dumps(result))
    else:
        print(json.dumps({"status": "ready", "engine": "scikit-learn demand forecasting"}))
