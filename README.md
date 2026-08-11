# 🚀 INVENTRA — Enterprise AI-Powered Inventory & SaaS ERP Platform

Inventra is an enterprise-grade, full-stack **AI-powered Inventory Management & SaaS ERP System** engineered with React, Express, MongoDB Atlas, Google Gemini AI (`gemini-2.5-flash`), and a Python `scikit-learn` Machine Learning demand forecasting engine.

---

## 🤖 AI Features Matrix

- **🤖 AI Inventory Assistant (`/ai-assistant`)**: Natural language chat assistant to query live inventory, sales, low stock alerts, and customer metrics.
- **🧠 Natural Language Analytics**: Converts business questions (*"Show top 5 products by revenue this month"*) into MongoDB aggregation pipelines via intent classification.
- **📊 AI Business Insights**: Executive AI dashboard card generating live operational bullet points (`📈`, `🔥`, `⚠️`, `📦`, `📉`).
- **📈 Demand Forecasting**: Machine Learning time-series regression model (`scikit-learn` Ridge Regressor) predicting demand for **7 days**, **14 days**, and **30 days** horizons.
- **🚨 Stockout Prediction**: Calculates estimated stockout countdowns and risk levels (`HIGH`, `MEDIUM`, `LOW`) based on current stock vs. daily demand velocity.
- **📦 Smart Restocking**: Calculates recommended purchase order quantities using $\text{Current Stock} + \text{Demand Forecast} + \text{Safety Stock} + \text{Lead Time}$.
- **🚨 Statistical Anomaly Detection**: Z-Score and Interquartile Range (IQR) detection flagging sales volume spikes, rapid inventory drops, and order surges **without relying on LLMs for numerical logic**.
- **💡 AI Business Recommendations**: Actionable insights categorizing product actions (*Restock*, *Monitor*, *Reduce Inventory*), supplier optimization (*Best Supplier*, *Lowest Price*, *Fastest Delivery*), and sales velocity (*Best-Selling*, *Slow-Moving*).

---

## 🏗️ System Architecture & Data Flow

```text
                 Vercel
                   │
                   ▼
            React Frontend
                   │ (JWT Auth Header)
                   ▼
             Express Backend API (/api/ai/*)
             /                   \
            /                     \
           ▼                       ▼
     MongoDB Atlas               Google Gemini AI API
   (Tenant Isolation)             (Intent Synthesizer)
           │
           ▼
     Python ML API (scikit-learn Ridge Regressor)
```

---

## 🔐 AI Security & Intent Control Architecture

```text
User Question ➔ Express API ➔ Intent Resolver ➔ Controlled MongoDB Aggregation ➔ Data Context ➔ Gemini AI ➔ Formatted Answer
```

1. **API Keys**: Kept strictly in backend server environment variables (`GEMINI_API_KEY`). Never exposed to React.
2. **Route Protection**: All `/api/ai/*` endpoints are protected with `authenticateUser` JWT middleware and rate limiting.
3. **No Direct Execution**: The AI model **never receives direct database handles or raw query execution rights**. All database reads are executed via controlled backend pipelines.

---

## 🧪 Verification & AI Test Protocols Passed

- **Assistant Protocols**: Normal questions, unknown queries, empty prompts, unauthorized requests, and long prompts.
- **Forecasting Protocols**: Multi-year historical datasets, new SKUs, zero sales velocity, and missing date intervals.
- **Restocking Protocols**: Low stock threshold, high stock buffer, missing supplier vendor, and high demand surges.
- **Anomaly Detection Protocols**: Normal Gaussian activity, extreme outlier surges, and zero-data states.

---

## 📡 AI API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/ai/chat` | Intent-driven AI Assistant chatbot query |
| `POST` | `/api/ai/analytics` | Natural Language to MongoDB aggregation parser |
| `GET` | `/api/ai/insights` | Executive AI Business Insights bullet-points generator |
| `GET` | `/api/ai/forecast?days=30` | Machine Learning 7/14/30-day demand forecast |
| `GET` | `/api/ai/stockout-risk` | SKU Stockout Risk countdown and alert level classification |
| `GET` | `/api/ai/restock-recommendations` | Smart restocking purchase order quantity calculator |
| `GET` | `/api/ai/anomalies` | Statistical Z-score anomaly detection scanner |
| `GET` | `/api/ai/recommendations` | Product, Supplier, and Sales AI recommendations engine |
| `POST` | `/api/ai/seed-history` | Time-series historical order dataset seeder |

---

## 🛠️ Environment Variables Configuration

### Client (`client/.env`)
```env
VITE_API_URL=https://inventory-management-backend-8g0j7m3w8-divyanshu-s-project20.vercel.app/api
```

### Server (`server/.env`)
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/inventory_db
JWT_SECRET=super_secret_jwt_key_inventra_saas_2026
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_google_gemini_api_key
CLIENT_URL=https://inventory-management-client-project.vercel.app
```

---

## 👨‍💻 Developed by Divyanshu Kumar
Repository: [Divyanshu-Kumar20/Inventory-Management](https://github.com/Divyanshu-Kumar20/Inventory-Management)
