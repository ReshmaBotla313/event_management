import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    year: '',
    branch: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
    } catch (err) {
      setError('Failed to fetch event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear inline error when typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full Name is required';
    if (!formData.rollNumber.trim()) errors.rollNumber = 'Roll Number is required';
    if (!formData.year) errors.year = 'Year is required';
    if (!formData.branch) errors.branch = 'Branch is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await api.post(`/registrations/${id}`, formData);
      setSuccessMessage(response.data.message || 'Registered successfully!');
      setFormData({ name: '', rollNumber: '', year: '', branch: '' });
      // Refresh capacity count
      fetchEventDetails();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        if (err.response.data.message.toLowerCase().includes('already registered')) {
          setSubmitError('Already registered');
        } else {
          setSubmitError(err.response.data.message);
        }
      } else {
        setSubmitError('Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="loader"></div></div>;
  if (error || !event) return <div className="error-banner">{error || 'Event not found.'}</div>;

  const isFull = event.registeredCount >= event.maxCapacity;
  const isCompleted = event.status === 'completed';

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="event-detail-container">
      <Link to="/" className="back-link">← Back to Events</Link>
      
      <div className="detail-hero">
        {event.banner ? (
          <img 
            src={event.banner} 
            alt={event.title} 
            className="detail-banner"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="detail-banner-placeholder">
            <span>🎉 {event.category} Event</span>
          </div>
        )}
        <div className="detail-header-overlay">
          <div className="detail-badges">
            <span className="badge badge-category">{event.category}</span>
            <span className={`badge badge-status status-${event.status}`}>{event.status}</span>
            {isFull && <span className="badge badge-full">Event is Full</span>}
          </div>
          <h1>{event.title}</h1>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-info-pane">
          <div className="detail-card info-card">
            <h2>Event Details</h2>
            <p><strong>📅 Date:</strong> {formattedDate}</p>
            <p><strong>⏰ Time:</strong> {event.time}</p>
            <p><strong>📍 Venue:</strong> {event.venue}</p>
            <p><strong>👥 Capacity:</strong> {event.registeredCount} / {event.maxCapacity} registered</p>
          </div>

          <div className="detail-card desc-card">
            <h2>About the Event</h2>
            <div className="description-text">{event.description}</div>
          </div>
        </div>

        <div className="detail-registration-pane">
          <div className="detail-card form-card">
            <h2>Register for this Event</h2>
            
            {isCompleted ? (
              <div className="info-banner info-completed">
                This event has been completed. Registrations are closed.
              </div>
            ) : isFull ? (
              <div className="info-banner info-full">
                This event is currently full. Registrations are closed.
              </div>
            ) : (
              <form onSubmit={handleRegister} className="registration-form">
                {successMessage && <div className="success-alert">{successMessage}</div>}
                {submitError && <div className="error-alert">{submitError}</div>}

                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={formErrors.name ? 'input-error' : ''}
                  />
                  {formErrors.name && <span className="inline-error">{formErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="rollNumber">Roll Number</label>
                  <input
                    type="text"
                    id="rollNumber"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="Enter your roll number"
                    className={formErrors.rollNumber ? 'input-error' : ''}
                  />
                  {formErrors.rollNumber && <span className="inline-error">{formErrors.rollNumber}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="year">Year</label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className={formErrors.year ? 'input-error' : ''}
                    >
                      <option value="">Select Year</option>
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                    </select>
                    {formErrors.year && <span className="inline-error">{formErrors.year}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="branch">Branch</label>
                    <select
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      className={formErrors.branch ? 'input-error' : ''}
                    >
                      <option value="">Select Branch</option>
                      <option value="BBA">BBA</option>
                      <option value="BZC">BZC</option>
                      <option value="MPC">MPC</option>
                      <option value="B.Sc">B.Sc</option>
                      <option value="BCA">BCA</option>
                      <option value="B.Com">B.Com</option>
                      <option value="MCA">MCA</option>
                      <option value="MBA">MBA</option>
                    </select>
                    {formErrors.branch && <span className="inline-error">{formErrors.branch}</span>}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Register'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
