import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const { _id, title, category, date, venue, maxCapacity, banner, status, registeredCount } = event;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const isFull = (registeredCount || 0) >= maxCapacity;

  return (
    <div className="event-card">
      <div className="card-image-container">
        {banner ? (
          <img 
            src={banner} 
            alt={title} 
            className="card-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="card-image-placeholder">
            <span>🎉 {category}</span>
          </div>
        )}
        <div className="card-badges">
          <span className="badge badge-category">{category}</span>
          <span className={`badge badge-status status-${status}`}>{status}</span>
          {isFull && <span className="badge badge-full">Full</span>}
        </div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-detail"><span>📅</span> {formattedDate}</p>
        <p className="card-detail"><span>📍</span> {venue}</p>
        
        <div className="capacity-container">
          <div className="capacity-text">
            <span>Registrations</span>
            <span>{registeredCount || 0} / {maxCapacity}</span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className={`progress-bar-fill ${isFull ? 'full' : ''}`} 
              style={{ width: `${Math.min(((registeredCount || 0) / maxCapacity) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <Link to={`/events/${_id}`} className="card-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
