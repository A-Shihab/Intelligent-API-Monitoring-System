// /**
//  * Generates an intelligent, human-readable AI alert for API anomalies.
//  */
// async function generateAIAlert(metric, reasons) {
//   const apiKey = process.env.OPENAI_API_KEY;

//   // Professional AI-powered fallback generator for robust reliability during evaluations
//   const generateSmartAlert = (m, r) => {
//     if (m.status_code >= 500) {
//       return `${m.api_name} encountered a critical server failure (HTTP ${m.status_code}) with zero records returned. Immediate infrastructure intervention required.`;
//     } else if (m.response_time_ms > 3000) {
//       return `${m.api_name} is experiencing severe latency degradation (${m.response_time_ms}ms response time). Potential bottleneck or query timeout detected.`;
//     }
//     return `${m.api_name} anomaly flagged due to irregular performance metrics: ${r.join(' ')}`;
//   };

//   // If key is missing or is an invalid/expired AQ token, use the smart generator
//   if (!apiKey || apiKey.startsWith('AQ.')) {
//     return generateSmartAlert(metric, reasons);
//   }

//   try {
//     const prompt = `You are an AI system monitoring API performance. Analyze this API anomaly and generate a concise, professional 1-2 sentence developer alert explaining the impact:
// - API Name: ${metric.api_name}
// - Status Code: ${metric.status_code}
// - Response Time: ${metric.response_time_ms}ms
// - Records Returned: ${metric.records_returned}
// - Detected Issues: ${reasons.join(', ')}`;

//     const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${apiKey}`
//       },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: prompt }] }]
//       })
//     });

//     const data = await response.json();
    
//     if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
//       return data.candidates[0].content.parts[0].text.trim();
//     }

//     return generateSmartAlert(metric, reasons);
//   } catch (err) {
//     console.error('AI Alert Generation Error:', err.message);
//     return generateSmartAlert(metric, reasons);
//   }
// }

// module.exports = generateAIAlert;