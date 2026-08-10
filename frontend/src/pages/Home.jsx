import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Home = () => {
  const [status, setStatus] = useState({
    backend: 'PENDING',
    database: 'PENDING',
    databaseName: null,
    error: null,
  });
  const [loading, setLoading] = useState(false);
  const [checksCount, setChecksCount] = useState(0);

  const checkConnectivity = async () => {
    setLoading(true);
    setStatus(prev => ({ ...prev, error: null }));
    try {
      const response = await api.get('/connectivity');
      setStatus({
        backend: response.data.backend || 'UP',
        database: response.data.database || 'DISCONNECTED',
        databaseName: response.data.databaseName || null,
        error: null,
      });
    } catch (err) {
      console.error('Connectivity check failed:', err);
      setStatus({
        backend: 'DOWN',
        database: 'UNKNOWN',
        databaseName: null,
        error: err.message || 'Failed to connect to backend server',
      });
    } finally {
      setLoading(false);
      setChecksCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    checkConnectivity();
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="candle-animation-container">
          <div className="candle">
            <div className="flame"></div>
            <div className="wick"></div>
            <div className="wax"></div>
          </div>
        </div>
        <h1 className="hero-title">The Candle Tales</h1>
        <p className="hero-subtitle">Phase 1: Architecture & Scaffolding Connectivity Portal</p>
      </div>

      <div className="status-grid">
        {/* Backend Status Card */}
        <div className={`status-card ${status.backend === 'UP' ? 'status-up' : status.backend === 'PENDING' ? 'status-pending' : 'status-down'}`}>
          <div className="card-header">
            <h3>Backend Server</h3>
            <span className={`status-badge ${status.backend === 'UP' ? 'badge-up' : status.backend === 'PENDING' ? 'badge-pending' : 'badge-down'}`}>
              {status.backend}
            </span>
          </div>
          <div className="card-body">
            <p className="status-desc">
              {status.backend === 'UP' 
                ? 'The Spring Boot API server is scaffolded, running, and accepting REST requests.' 
                : status.backend === 'PENDING'
                ? 'Establishing link to the Spring Boot REST endpoint...'
                : 'Could not reach the Spring Boot backend. Check if the API server is running.'}
            </p>
            <div className="endpoint-details">
              <code>GET /api/connectivity</code>
            </div>
          </div>
        </div>

        {/* Database Status Card */}
        <div className={`status-card ${status.database === 'CONNECTED' ? 'status-up' : status.database === 'PENDING' ? 'status-pending' : 'status-down'}`}>
          <div className="card-header">
            <h3>MySQL Database</h3>
            <span className={`status-badge ${status.database === 'CONNECTED' ? 'badge-up' : status.database === 'PENDING' ? 'badge-pending' : 'badge-down'}`}>
              {status.database}
            </span>
          </div>
          <div className="card-body">
            <p className="status-desc">
              {status.database === 'CONNECTED'
                ? `Successfully connected to the database: '${status.databaseName || 'the_candle_tales'}'.`
                : status.database === 'PENDING'
                ? 'Waiting for database connectivity check...'
                : 'The backend cannot connect to the database. Verify MySQL credentials and status.'}
            </p>
            <div className="endpoint-details">
              <code>DBMS: MySQL 8.x</code>
            </div>
          </div>
        </div>
      </div>

      {status.error && (
        <div className="error-banner">
          <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="error-content">
            <strong>Connection Error:</strong> {status.error}
          </div>
        </div>
      )}

      <div className="actions-section">
        <button 
          onClick={checkConnectivity} 
          disabled={loading}
          className={`btn-check-status ${loading ? 'btn-loading' : ''}`}
        >
          {loading ? 'Verifying Link...' : 'Re-verify Connectivity'}
        </button>
        <span className="checks-counter">Checks run: {checksCount}</span>
      </div>
    </div>
  );
};

export default Home;
