require('dotenv').config();
const Alert = require('../models/Alert');
const { sendAnomalyEmail } = require('../services/emailService');
const { GoogleGenAI } = require('@google/genai');

exports.monitorApi = async (req, res) => {
  try {
    console.log("[Monitor API Hit] Received payload:", req.body);
    
    const { api_name, response_time_ms, status_code, records_returned } = req.body;

    if (!api_name) {
      return res.status(400).json({ error: "api_name is required" });
    }

    // Rule-based anomaly checks
    const reasons = [];
    if (status_code >= 400) {
      reasons.push(`HTTP Status ${status_code} indicates request failure.`);
    }
    if (response_time_ms > 3000) {
      reasons.push(`High latency detected: ${response_time_ms}ms (Threshold: 3000ms).`);
    }
    if (records_returned === 0 && status_code < 400) {
      reasons.push(`Zero records returned despite successful HTTP status.`);
    }

    const isAnomaly = reasons.length > 0;
    console.log(`[Evaluation] Is Anomaly? ${isAnomaly}`, reasons);

    if (isAnomaly) {
      let aiAlertDescription;

      try {
        console.log("[Gemini API] Requesting AI root-cause analysis...");

        // Instantiate Google Gen AI with the loaded GEMINI_API_KEY from environment variables
        const apiKey = process.env.GEMINI_API_KEY;
        const ai = new GoogleGenAI({ apiKey });

        // Request content generation from Gemini 1.5 Flash
        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Analyze this API anomaly and provide a concise, professional operational root-cause description in 1 sentence: 
          - API Name: ${api_name}
          - Status Code: ${status_code}
          - Response Time: ${response_time_ms}ms
          - Records Returned: ${records_returned}
          - Detected Issues: ${reasons.join(', ')}`,
        });

        aiAlertDescription = geminiResponse.text;
        console.log("[Gemini API Success]:", aiAlertDescription);

      } catch (aiErr) {
        console.error("[Gemini API Error - Falling back to default]:", aiErr.message);
        aiAlertDescription = `${api_name} encountered an anomaly (HTTP ${status_code}). Immediate review required.`;
      }
      
      // Save anomaly document into MongoDB
      const newAnomaly = await Alert.create({
        api_name,
        response_time_ms,
        status_code,
        records_returned,
        reasons,
        ai_alert: aiAlertDescription,
        resolved: false,
        timestamp: new Date()
      });

      console.log("[Database] Anomaly saved successfully:", newAnomaly._id);

      // Trigger Nodemailer service asynchronously
      try {
        console.log("[Email Service] Triggering sendAnomalyEmail...");
        const emailResult = await sendAnomalyEmail(newAnomaly);
        console.log("[Email Service Result]:", emailResult);
      } catch (emailErr) {
        console.error("[Email Service Exception]:", emailErr);
      }

      return res.status(200).json({
        isAnomaly: true,
        ...newAnomaly.toObject()
      });
    }

    // --- AUTO-RESOLUTION LOGIC ---
    const updateResult = await Alert.updateMany(
      { 
        api_name: api_name, 
        resolved: { $ne: true } 
      },
      { $set: { resolved: true } }
    );

    console.log(`[Auto-Resolution Check] Modified ${updateResult.modifiedCount} alert(s) for api_name: "${api_name}"`);

    return res.status(200).json({
      status: "HEALTHY",
      message: `API metrics are within normal thresholds. Auto-resolved ${updateResult.modifiedCount} alert(s).`
    });

  } catch (error) {
    console.error("[Monitor Controller Error]:", error);
    return res.status(500).json({ error: error.message });
  }
};