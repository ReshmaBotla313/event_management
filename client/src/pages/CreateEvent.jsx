import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    venue: '',
    maxCapacity: '',
    banner: '',
    status: 'upcoming'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { title, description, category, date, time, venue, maxCapacity } = formData;
    if (!title || !description || !category || !date || !time || !venue || !maxCapacity) {
      setError('All fields except Banner Image URL are required.');
      return;
    }

    if (parseInt(maxCapacity) <= 0) {
      setError('Max Capacity must be greater than 0.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/events', formData);
      navigate('/admin/events');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create event. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-form-container">
      <div className="form-card-wrapper">
        <div className="form-header">
          <Link to="/admin/events" className="back-link">← Cancel and Go Back</Link>
          <h1>Create Campus Event</h1>
          <p>Publish a new event to the student portal</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Annual Hackathon 2026"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="maxCapacity">Maximum Capacity</label>
              <input
                type="number"
                id="maxCapacity"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleChange}
                min="1"
                placeholder="e.g. 100"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                type="text"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="e.g. 10:00 AM - 4:00 PM"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="venue">Venue</label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="e.g. Main Auditorium, Block A"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="banner">Banner Image URL</label>
            <input
              type="url"
              id="banner"
              name="banner"
              value={formData.banner}
              onChange={handleChange}
              placeholder="e.g. https://example.com/banner.jpg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Event Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Provide event details, scheduling, requirements..."
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <Link to="/admin/events" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
