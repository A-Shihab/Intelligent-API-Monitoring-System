const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  api_name: { type: String, required: true },
  response_time_ms: { type: Number, required: true },
  status_code: { type: Number, required: true },
  records_returned: { type: Number, required: true },
  reasons: [String],
  ai_alert: String,
  resolved: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);