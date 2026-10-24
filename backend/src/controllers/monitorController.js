require('dotenv').config();
const Alert = require('../models/Alert');
const { sendAnomalyEmail } = require('../services/emailService');
const detectAnomaly = require('../services/anomalyDetector');
const { GoogleGenAI } = require('@google/genai');

// Initialize GoogleGenAI client once
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

exports.monitorApi = async (req, res) => {
  try {
    console.log("[Monitor API Hit] Received payload:", req.body);
    
    const incomingData = req.body;
    if (!incomingData) {
      return res.status(400).json({ error: "Request body or payload is required" });
    }

    // Normalizing input into an array to support batch processing
    const metrics = Array.isArray(incomingData) ? incomingData : [incomingData];
    const results = [];

    for (const metric of metrics) {
      const { api_name, response_time_ms, status_code, records_returned } = metric;

      if (!api_name) {
        results.push({ success: false, error: "api_name is required for metric item", item: metric });
        continue;
      }

      // Evaluating anomaly using modular service
      const evaluation = detectAnomaly(metric);
      const isAnomaly = evaluation.isAnomaly;
      const reasons = evaluation.reasons;

      console.log(`[Evaluation for ${api_name}] Is Anomaly? ${isAnomaly}`, reasons);

      if (isAnomaly) {
        let aiAlertDescription;

        try {
          console.log(`[Gemini API] Requesting AI root-cause analysis for ${api_name}...`);

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
          console.error("[Gemini API Error - Falling back]:", aiErr.message);
          aiAlertDescription = `${api_name} encountered an anomaly (HTTP ${status_code}). Immediate review required.`;
        }
        
        // Saving anomaly document into MongoDB
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
          await sendAnomalyEmail(newAnomaly);
        } catch (emailErr) {
          console.error("[Email Service Exception]:", emailErr);
        }

        results.push({
          isAnomaly: true,
          ...newAnomaly.toObject()
        });

      } else {
        // --- AUTO-RESOLUTION LOGIC ---
        const updateResult = await Alert.updateMany(
          { 
            api_name: api_name, 
            resolved: { $ne: true } 
          },
          { $set: { resolved: true } }
        );

        console.log(`[Auto-Resolution Check] Modified ${updateResult.modifiedCount} alert(s) for api_name: "${api_name}"`);

        results.push({
          status: "HEALTHY",
          api_name,
          message: `API metrics are within normal thresholds. Auto-resolved ${updateResult.modifiedCount} alert(s).`
        });
      }
    }

    return res.status(200).json({
      success: true,
      batchProcessedCount: metrics.length,
      results: Array.isArray(incomingData) ? results : results[0]
    });

  } catch (error) {
    console.error("[Monitor Controller Error]:", error);
    return res.status(500).json({ error: error.message });
  }
};