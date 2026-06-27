import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import EventCard from '../components/EventCard';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Extract unique categories
  const categories = ['All', ...new Set(events.map(event => event.category))];

  // Filter events
  const filteredEvents = events.filter(event => {
    const categoryMatch = selectedCategory === 'All' || event.category === selectedCategory;
    const statusMatch = selectedStatus === 'All' || event.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  if (loading) return <div className="loading-container"><div className="loader"></div></div>;

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Explore & Experience Campus Events</h1>
        <p>Discover workshops, sports, seminars, and cultural festivals happening around campus. Register today to reserve your spot!</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="filter-controls">
        <div className="filter-group">
          <label>Filter by Category:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="All">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="no-events-container">
          <h3>No events found</h3>
          <p>Please check back later or adjust your filters.</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
