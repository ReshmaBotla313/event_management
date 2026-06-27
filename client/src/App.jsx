import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminEvents from './pages/AdminEvents';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import EventRegistrations from './pages/EventRegistrations';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/events/:id" element={<EventDetail />} />
              
              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/events" 
                element={
                  <ProtectedRoute>
                    <AdminEvents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/events/create" 
                element={
                  <ProtectedRoute>
                    <CreateEvent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/events/:id/edit" 
                element={
                  <ProtectedRoute>
                    <EditEvent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/events/:id/registrations" 
                element={
                  <ProtectedRoute>
                    <EventRegistrations />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} CampusEvents Management System. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
