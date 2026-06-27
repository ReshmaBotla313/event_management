import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (err) {
      setError('Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will also remove all its student registration details.`)) {
      return;
    }

    try {
      await api.delete(`/events/${id}`);
      setEvents(prev => prev.filter(event => event._id !== id));
    } catch (err) {
      alert('Failed to delete event. Please try again.');
    }
  };

  if (loading) return <div className="loading-container"><div className="loader"></div></div>;

  return (
    <div className="admin-events-container">
      <div className="admin-events-header">
        <div>
          <h1>Manage Events</h1>
          <p>Create, update, delete events or view registration details</p>
        </div>
        <Link to="/admin/events/create" className="btn btn-primary">
          ➕ Create New Event
        </Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {events.length === 0 ? (
        <div className="no-events-card">
          <h3>No events found</h3>
          <p>Get started by creating your first campus event!</p>
          <Link to="/admin/events/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Create Event
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event Banner</th>
                <th>Title</th>
                <th>Category</th>
                <th>Date & Time</th>
                <th>Venue</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => {
                const eventDate = new Date(event.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <tr key={event._id}>
                    <td>
                      {event.banner ? (
                        <img 
                          src={event.banner} 
                          alt="" 
                          className="table-thumbnail" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="table-thumbnail-placeholder">
                          No Banner
                        </div>
                      )}
                    </td>
                    <td className="font-semibold">{event.title}</td>
                    <td>{event.category}</td>
                    <td>
                      <div>{eventDate}</div>
                      <div className="sub-text">{event.time}</div>
                    </td>
                    <td>{event.venue}</td>
                    <td>{event.registeredCount || 0} / {event.maxCapacity}</td>
                    <td>
                      <span className={`badge badge-status status-${event.status}`}>{event.status}</span>
                    </td>
                    <td>
                      <div className="action-buttons-cell">
                        <Link to={`/admin/events/${event._id}/registrations`} className="btn btn-info btn-sm">
                          Registrations
                        </Link>
                        <Link to={`/admin/events/${event._id}/edit`} className="btn btn-warning btn-sm">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(event._id, event.title)} className="btn btn-danger btn-sm">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
