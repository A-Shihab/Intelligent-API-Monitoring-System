import React from 'react';

export default function SummaryCards({ alerts }) {
  const totalAlerts = alerts.length;
  const criticalErrors = alerts.filter(a => a.status_code >= 500).length;
  const highLatency = alerts.filter(a => a.response_time_ms > 3000).length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px' }}>Total Anomalies</h3>
        <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>{totalAlerts}</p>
      </div>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px' }}>Server Failures (5xx)</h3>
        <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#dc2626' }}>{criticalErrors}</p>
      </div>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px' }}>High Latency (&gt;3s)</h3>
        <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#d97706' }}>{highLatency}</p>
      </div>
    </div>
  );
}