⚡ Intelligent API Monitoring & Alert System

An advanced, full-stack API monitoring and automated incident response platform. This application integrates automated batch normalization, rule-based anomaly detection, real-time root-cause analysis powered by Google's Gemini models (gemini-3.8-flash), MongoDB Atlas persistence, automated email dispatching via Nodemailer, and a modern, interactive React operator dashboard.

✨ Features

Autonomous API Health Monitoring: Evaluates API performance across latency thresholds, HTTP status codes (5xx server failures and 4xx client errors), and payload validity (missing or zero records).

Batch & Single Input Processing: Supports both single metric JSON payloads and multi-item batch arrays through input normalization at the /monitor REST endpoint.

Auto-Resolution Engine: Automatically updates active anomalies to a Resolved state when a subsequent healthy check (status 200, normal latency, valid records) is received for that endpoint.

Gemini AI Root-Cause Analysis: Integrates the official @google/genai SDK (gemini-3.8-flash) to generate concise, human-readable operational alerts and root-cause summaries with built-in production resiliency and fallback handling.

Database Persistence: Stores active anomalies, metric logs, and AI summaries directly in MongoDB Atlas using robust Mongoose schemas.

Automated Incident Email Alerts: Instantly dispatches automated email notifications to administrators via Nodemailer upon detecting an anomaly.

Interactive Operator Dashboard: Modern React (Vite) interface featuring real-time auto-refresh polling, dynamic risk classification filtering (HIGH, MEDIUM, LOW), and incident lifecycle management (marking alerts resolved or deleting logs).

🛠️ Tech Stack & Packages

Backend Stack (backend/package.json)

Runtime & Framework: Node.js, Express.js

Database: MongoDB Atlas via mongoose ODM

AI Integration: @google/genai SDK utilizing the gemini-3.8-flash model

Alerting & Email: nodemailer

Utilities: dotenv (environment variables), cors (cross-origin resource sharing), nodemon (development hot-reloading)

Frontend Stack (frontend/package.json)

Library: React 18, React DOM

Build Tool & Server: Vite

📁 Repository Structure

Care_Guide_Task/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # MongoDB connection setup
│   │   ├── controllers/
│   │   │   ├── alertController.js    # CRUD handlers for fetching, resolving, and deleting alerts
│   │   │   └── monitorController.js  # Batch normalization, health pipeline, & Gemini AI integration
│   │   ├── models/
│   │   │   └── Alert.js              # Mongoose schema for anomaly storage
│   │   ├── routes/
│   │   │   ├── alertRoutes.js        # REST routes (/alerts)
│   │   │   └── monitorRoutes.js      # Core monitoring route (/monitor)
│   │   ├── services/
│   │   │   ├── anomalyDetector.js    # Anomaly evaluation engine
│   │   │   └── emailService.js       # Nodemailer email dispatching service
│   │   ├── app.js                    # Express app middleware configuration
│   │   └── server.js                 # Server entry point
│   ├── .env.example                  # Template for environment variables (tracked)
│   ├── .env                          # Local environment variables (ignored in Git)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AlertTable.jsx        # Table grid showing risks, AI summaries, and actions
    │   │   ├── Dashboard.jsx         # Main container with state management, polling, and risk filters
    │   │   └── SummaryCards.jsx      # Top metric cards for quick operational overview
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json


⚙️ Installation & Setup Instructions

1. Clone the Repository

git clone https://github.com/your-username/Care_Guide_Task.git
cd Care_Guide_Task


2. Backend Setup

Navigate to the backend directory and install dependencies:

cd backend
npm install


Configure environment variables:
Create a .env file in the backend/ directory (you can copy .env.example if available):

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/api_monitor?retryWrites=true&wmode=majority
GEMINI_API_KEY=your_google_gemini_api_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
SLOW_RESPONSE_MS=3000


⚠️ Note: Make sure to replace the dummy credentials with your real MongoDB connection URI, Google Gemini API Key, and Email App Password.

3. Frontend Setup

Navigate to the frontend directory and install dependencies:

cd ../frontend
npm install


▶️ Run Instructions

1. Start the Backend Server

From the backend directory, run:

npm run dev


The Express server will start on http://localhost:5000 (or your configured PORT) and connect to MongoDB Atlas.

2. Start the Frontend Dashboard

In a separate terminal window, navigate to the frontend directory and run:

npm run dev


Open your browser and navigate to the local Vite dev server URL (typically http://localhost:5173).

🧪 Testing API Monitoring Endpoint (/monitor)

You can send both single objects or batch JSON arrays to POST http://localhost:5000/monitor.

Single Metric / Anomaly Example:

{
  "api_name": "AppointmentAPI",
  "response_time_ms": 5500,
  "status_code": 500,
  "records_returned": 0
}


Batch Processing Example:

[
  {
    "api_name": "PatientLookupAPI",
    "response_time_ms": 450,
    "status_code": 404,
    "records_returned": 0
  },
  {
    "api_name": "BillingServiceAPI",
    "response_time_ms": 150,
    "status_code": 200,
    "records_returned": 12
  }
]


📜 License & Copyright
© All rights reserved to Asaduzzaman Shihab.