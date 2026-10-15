import React, { useState, useEffect } from 'react';
import SummaryCards from './SummaryCards.jsx';
import AlertTable from './AlertTable.jsx';

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [riskFilter, setRiskFilter] = useState('ALL'); // Risk filter state

  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/alerts');
      if (!response.ok) throw new Error('Failed to fetch alerts from backend');
      const data = await response.json();
      setAlerts(data);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchAlerts();
    setTimeout(() => setIsRefreshing(false), 300);
  };

  // Toggle resolved state via backend PATCH route
  const handleResolve = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/alerts/${id}/resolve`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to update resolution status');
      fetchAlerts(); // Refresh list immediately
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete alert via backend DELETE route
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/alerts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete alert');
      fetchAlerts(); // Refresh list immediately
    } catch (err) {
      alert(err.message);
    }
  };

  // Helper function to accurately categorize risk levels
  const getRiskLevel = (alert) => {
    if (alert.status_code >= 500 || alert.records_returned === 0) {
      return 'HIGH';
    } 
   
    else if (alert.status_code >= 400 && alert.status_code < 500) {
      return 'MEDIUM';
    } 
   
    else if (alert.response_time_ms > 3000) {
      return 'LOW';
    }
    return 'LOW';
  };

  // Filter alerts based on active risk selection
  const filteredAlerts = alerts.filter((alert) => {
    if (riskFilter === 'ALL') return true;
    return getRiskLevel(alert) === riskFilter;
  });

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>Loading monitoring dashboard...</div>;
  if (error) return <div style={{ padding: '50px', textAlign: 'center', color: 'red', fontFamily: 'sans-serif' }}>Connection Error: {error}. Ensure your backend server is running on port 5000.</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '24px' }}>Intelligent API Monitoring & Alert Dashboard</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Real-time automated anomaly tracking and AI-generated insights</p>
          </div>
          <button 
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            style={{ 
              background: isRefreshing ? '#93c5fd' : '#2563eb', 
              color: '#fff', 
              border: 'none', 
              padding: '10px 16px', 
              borderRadius: '6px', 
              cursor: isRefreshing ? 'not-allowed' : 'pointer', 
              fontWeight: '600',
              transition: 'background 0.2s ease'
            }}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </header>

        <SummaryCards alerts={alerts} />

        {/* Risk Filter Buttons Bar */}
        <div style={{ margin: '20px 0', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontWeight: '600', color: '#334155', fontSize: '14px', marginRight: '5px' }}>Filter Risk:</span>
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((level) => {
            const isActive = riskFilter === level;
            return (
              <button
                key={level}
                onClick={() => setRiskFilter(level)}
                style={{
                  background: isActive ? '#0f172a' : '#fff',
                  color: isActive ? '#fff' : '#475569',
                  border: '1px solid #cbd5e1',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {level === 'ALL' ? 'All Alerts' : `${level} Risk`}
              </button>
            );
          })}
        </div>

        <AlertTable alerts={filteredAlerts} onResolve={handleResolve} onDelete={handleDelete} />
      </div>
    </div>
  );
}