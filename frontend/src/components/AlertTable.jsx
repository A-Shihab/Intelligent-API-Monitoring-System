import React from 'react';

export default function AlertTable({ alerts, onResolve, onDelete }) {
  if (alerts.length === 0) {
    return (
      <div style={{ background: '#fff', padding: '30px', textAlign: 'center', borderRadius: '8px', color: '#64748b' }}>
        No API anomalies detected. All systems healthy!
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '14px' }}>
            <th style={{ padding: '14px 16px' }}>API Name</th>
            <th style={{ padding: '14px 16px' }}>Status Code</th>
            <th style={{ padding: '14px 16px' }}>Response Time</th>
            <th style={{ padding: '14px 16px' }}>AI Alert Description</th>
            <th style={{ padding: '14px 16px' }}>Timestamp</th>
            <th style={{ padding: '14px 16px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert._id || Math.random()} style={{ borderBottom: '1px solid #e2e8f0', fontSize: '14px', background: alert.resolved ? '#f8fafc' : '#fff' }}>
              <td style={{ padding: '14px 16px', fontWeight: '600', color: '#1e293b' }}>
                {alert.api_name}
                {alert.resolved && (
                  <span style={{ display: 'block', fontSize: '11px', color: '#16a34a', fontWeight: 'bold' }}>✓ Resolved</span>
                )}
              </td>
              <td style={{ padding: '14px 16px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  background: alert.status_code >= 500 ? '#fee2e2' : '#fef3c7',
                  color: alert.status_code >= 500 ? '#991b1b' : '#92400e'
                }}>
                  {alert.status_code}
                </span>
              </td>
              <td style={{ padding: '14px 16px', color: '#334155' }}>{alert.response_time_ms} ms</td>
              <td style={{ padding: '14px 16px', color: '#475569', maxWidth: '350px' }}>{alert.ai_alert}</td>
              <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>
                {new Date(alert.timestamp).toLocaleString()}
              </td>
              <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    onClick={() => onResolve(alert._id)}
                    style={{
                      background: alert.resolved ? '#e2e8f0' : '#dcfce7',
                      color: alert.resolved ? '#475569' : '#166534',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {alert.resolved ? 'Mark Active' : 'Mark Resolved'}
                  </button>

                  <button
                    onClick={() => onDelete(alert._id)}
                    style={{
                      background: '#fee2e2',
                      color: '#991b1b',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}