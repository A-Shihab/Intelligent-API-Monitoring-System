/**
 * Evaluates API response metrics to detect potential anomalies.
 */
function detectAnomaly(metric) {
  const slowThreshold = parseInt(process.env.SLOW_RESPONSE_MS) || 3000;
  const reasons = [];

  // Rule 1: HTTP Error Status (>= 400)
  if (metric.status_code >= 400) {
    reasons.push(`HTTP Status ${metric.status_code} indicates request failure.`);
  }

  // Rule 2: High Latency
  if (metric.response_time_ms > slowThreshold) {
    reasons.push(`High latency detected: ${metric.response_time_ms}ms (Threshold: ${slowThreshold}ms).`);
  }

  // Rule 3: Zero or Missing Records returned on successful status
  if (metric.status_code === 200 && metric.records_returned === 0) {
    reasons.push(`Unexpected empty response payload: 0 records returned.`);
  }

  return {
    isAnomaly: reasons.length > 0,
    reasons
  };
}

module.exports = detectAnomaly;