import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🎓 <span className="brand-text">CampusEvents</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/admin/events" className="nav-link">Manage Events</Link>
              <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
            </>
          ) : (
            <Link to="/admin/login" className="nav-link login-link">Admin Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
