import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import authService from './services/authService';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DistributorDashboard from './screens/DistributorDashboard'; // New component
import TeamAppScreen from './screens/TeamAppScreen'; // New component
import './App.css';

// Main Application Entry Point with Routing
function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.token) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    // Redirect based on role after login
    if (loggedInUser.role === 'Team Member') {
      navigate('/team-app');
    } else {
      navigate('/'); // Default to Distributor Dashboard for Admin/Distributor
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <div>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterScreen />} />

        {/* Conditional rendering for the main dashboard/app based on user role */}
        <Route
          path="/"
          element={user && (user.role === 'Admin' || user.role === 'Distributor') ? (
            <DistributorDashboard user={user} />
          ) : user && user.role === 'Team Member' ? (
            <TeamAppScreen user={user} />
          ) : (
            <LoginScreen onLogin={handleLogin} />
          )}
        />
        {/* Specific route for Team Members (can also be handled by the '/' route above) */}
        <Route
          path="/team-app"
          element={user && user.role === 'Team Member' ? (
            <TeamAppScreen user={user} />
          ) : (
            <LoginScreen onLogin={handleLogin} />
          )}
        />
        {/* Add more protected routes here */}
      </Routes>
    </div>
  );
}


// Basic Header Component for Navigation
const Header = ({ user, onLogout }) => {
  return (
    <header style={{
      backgroundColor: '#333',
      color: 'white',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <div className="logo">
        <Link to={user && user.role === 'Team Member' ? "/team-app" : "/"} style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
          DeliveryApp
        </Link>
      </div>
      <nav>
        {user ? (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex' }}>
            <li style={{ marginRight: '20px' }}>
              <span style={{ color: 'white' }}>Hello, {user.name} ({user.role})</span>
            </li>
            <li>
              <button onClick={onLogout} style={{
                background: 'none',
                border: '1px solid white',
                color: 'white',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Logout
              </button>
            </li>
          </ul>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex' }}>
            <li style={{ marginRight: '20px' }}>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            </li>
            <li>
              <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

// Export App wrapped in Router for index.js
const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;