# ⚡ Intelligent API Monitoring & Alert System

An advanced, full-stack API monitoring and automated incident response platform. This application integrates automated anomaly detection, real-time root-cause analysis powered by Google's Gemini models, database persistence, automated email dispatching, and a modern, interactive React operator dashboard.

✨ **Features**

- **Autonomous Anomaly Detection**: Evaluates incoming API requests and flags performance breakdowns based on status codes (such as HTTP 5xx server crashes and 4xx client errors), response latency thresholds, and empty payload returns.
- **Gemini AI Root-Cause Analysis**: Integrates the official `@google/genai` SDK (`gemini-3.8-flash`) to generate concise, professional operational triage summaries for every detected anomaly, complete with built-in production resiliency and graceful fallback handling.
- **Database Persistence**: Fully persists incident logs, metric history, and AI-generated insights to **MongoDB Atlas** using robust Mongoose ODM schemas.
- **Automated Incident Notifications**: Instantly dispatches rich, automated email alerts to system administrators via **Nodemailer** upon anomaly detection.
- **Interactive Operator Dashboard**: Clean, responsive React (Vite) interface featuring real-time auto-refresh polling, dynamic risk classification filters (`HIGH`, `MEDIUM`, `LOW`), and live incident lifecycle management (marking alerts as resolved or deleting logs).

---

🛠️ **Tech Stack & Packages**

### **Backend Stack (`backend/package.json`)**
- **`express`**: Fast web framework for routing and API endpoint handling.
- **`mongoose`**: Elegant MongoDB object modeling for schema definition and persistence.
- **`@google/genai`**: Official Google Gen AI SDK utilizing `gemini-3.8-flash` for automated root-cause analysis.
- **`nodemailer`**: Node.js module used for dispatching automated incident alert emails.
- **`dotenv`**: Environment variable loader for managing secure credentials.
- **`cors`**: Express middleware enabling secure cross-origin resource sharing.
- **`nodemon`**: Development utility for automatic server restarts.

### **Frontend Stack (`frontend/package.json`)**
- **`react` / `react-dom`**: Frontend library for building dynamic component states and user interfaces.
- **`vite`**: Next-generation frontend bundling tool and lightning-fast development server.

---

📁 **Repository Structure**

```text
Care_Guide_Task/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # MongoDB database connection configuration
│   │   ├── controllers/
│   │   │   ├── alertController.js    # CRUD handlers for alert resolution and deletion
│   │   │   └── monitorController.js  # Main monitoring workflow and Google Gemini SDK integration
│   │   ├── models/
│   │   │   └── Alert.js              # Mongoose schema definitions for API metrics and logs
│   │   ├── routes/
│   │   │   ├── alertRoutes.js        # REST endpoints for fetching and updating alerts
│   │   │   └── monitorRoutes.js      # Endpoint triggering the core monitoring pipeline
│   │   ├── services/
│   │   │   ├── anomalyDetector.js    # Rule-based threshold evaluation engine
│   │   │   └── emailService.js       # Nodemailer automated notification service
│   │   ├── app.js                    # Express application configuration and middleware
│   │   └── server.js                 # Server entry point
│   ├── .env                          # Environment variables configuration
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AlertTable.jsx        # Data grid rendering risks, AI summaries, and actions
    │   │   ├── Dashboard.jsx         # Core state container, polling, and risk filter logic
    │   │   └── SummaryCards.jsx      # Top-level operational metrics overview
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json


⚙️ Setup Instructions

1. Backend Setup & Dependencies
Navigate to the backend directory and install required packages:

     cd backend
     npm install

2. Configure Environment Variables
Create a .env file inside the backend/ directory with your configuration:

    PORT=5000
    MONGO_URI=your_mongodb_atlas_connection_string
    GEMINI_API_KEY=your_google_gemini_api_key
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_email_app_password

3. Frontend Setup & Dependencies
Navigate to the frontend directory and install packages:

    cd frontend
    npm install


▶️ Run Instructions

1. Start the Backend Server
In your first terminal window, start the Node.js/Express backend server:

    cd backend
    npm run dev 

2. Start the Frontend Dashboard
In a separate terminal window, start the React development server:

    cd frontend
    npm run dev

📜 License & Copyright
© All rights reserved to Asaduzzaman Shihab.