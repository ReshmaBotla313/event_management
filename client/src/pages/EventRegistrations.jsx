import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const EventRegistrations = () => {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, regRes] = await Promise.all([
          api.get(`/events/${id}`),
          api.get(`/registrations/event/${id}`)
        ]);
        setEvent(eventRes.data);
        setRegistrations(regRes.data);
      } catch (err) {
        setError('Failed to retrieve registration data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const filteredRegistrations = registrations.filter(reg => 
    reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-container"><div className="loader"></div></div>;
  if (error || !event) return <div className="error-banner">{error || 'Event not found.'}</div>;

  return (
    <div className="registrations-view-container">
      <div className="registrations-header">
        <Link to="/admin/events" className="back-link">← Back to Manage Events</Link>
        <h1>Registrations: {event.title}</h1>
        <p className="subtitle">
          Total Attendees: <strong>{registrations.length}</strong> / Max Capacity: <strong>{event.maxCapacity}</strong>
        </p>
      </div>

      <div className="table-search-bar">
        <input 
          type="text" 
          placeholder="🔍 Search by Name, Roll Number, or Branch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredRegistrations.length === 0 ? (
        <div className="no-registrations-card">
          <p>No registration records match the criteria or no registrations yet.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Year</th>
                <th>Branch</th>
                <th>Registered At</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((reg, index) => {
                const regDate = new Date(reg.registeredAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <tr key={reg._id}>
                    <td>{index + 1}</td>
                    <td className="font-semibold">{reg.name}</td>
                    <td><span className="roll-badge">{reg.rollNumber}</span></td>
                    <td>{reg.year} Year</td>
                    <td>{reg.branch}</td>
                    <td>{regDate}</td>
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

export default EventRegistrations;
