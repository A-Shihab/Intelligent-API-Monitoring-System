const nodemailer = require('nodemailer');

const sendAnomalyEmail = async (anomalyData) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('[Email Service] Skipping: EMAIL_USER or EMAIL_PASS not set in .env');
      return { success: false, error: 'Missing credentials' };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const recipient = process.env.ALERT_RECIPIENT || process.env.EMAIL_USER;

    const mailOptions = {
      from: `"API Monitoring System" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: `🚨 [CRITICAL ALERT] API Anomaly Detected: ${anomalyData.api_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 25px; border: 1px solid #cbd5e1; border-radius: 8px; background-color: #f8fafc; max-width: 600px; margin: auto;">
          <h2 style="color: #dc2626; margin-top: 0; border-bottom: 2px solid #fee2e2; padding-bottom: 10px;">API Monitoring System Alert</h2>
          <p style="color: #334155; font-size: 15px;">An infrastructure anomaly has been automatically detected, stored, and evaluated by AI.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; background: #ffffff; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0;">
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 12px; font-weight: bold; color: #475569;">API Name:</td><td style="padding: 12px; color: #0f172a; font-weight: 600;">${anomalyData.api_name}</td></tr>
            <tr style="background: #f8fafc; border-bottom: 1px solid #f1f5f9;"><td style="padding: 12px; font-weight: bold; color: #475569;">Status Code:</td><td style="padding: 12px; color: #dc2626; font-weight: bold;">${anomalyData.status_code}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 12px; font-weight: bold; color: #475569;">Response Time:</td><td style="padding: 12px; color: #0f172a;">${anomalyData.response_time_ms} ms</td></tr>
            <tr style="background: #f8fafc; border-bottom: 1px solid #f1f5f9;"><td style="padding: 12px; font-weight: bold; color: #475569;">Records Returned:</td><td style="padding: 12px; color: #0f172a;">${anomalyData.records_returned}</td></tr>
            <tr><td style="padding: 12px; font-weight: bold; color: #475569; vertical-align: top;">AI Insight:</td><td style="padding: 12px; color: #0f172a; line-height: 1.4;">${anomalyData.ai_alert}</td></tr>
          </table>

          <p style="margin-top: 25px; font-size: 12px; color: #64748b; text-align: center;">Automated notification generated at ${new Date(anomalyData.timestamp).toLocaleString()}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service Success] Real email sent to ${recipient}! Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email Service Error]:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendAnomalyEmail };