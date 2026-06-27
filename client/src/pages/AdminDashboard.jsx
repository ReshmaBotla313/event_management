import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading-container"><div className="loader"></div></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Control Panel</h1>
        <p>Overview of campus event activities and registrations</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Total Events</h3>
            <p className="stat-number">{stats.totalEvents}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>Total Registrations</h3>
            <p className="stat-number">{stats.totalRegistrations}</p>
          </div>
        </div>
      </div>

      <div className="quick-actions-card">
        <h2>Quick Actions</h2>
        <div className="actions-buttons-grid">
          <Link to="/admin/events/create" className="action-btn create-btn">
            ➕ Create New Event
          </Link>
          <Link to="/admin/events" className="action-btn manage-btn">
            ⚙️ Manage Existing Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
