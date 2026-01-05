import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import MyTickets from './pages/MyTickets';
import Profile from './pages/Profile';
import QRValidation from './pages/QRValidation';
import CreateEvent from './pages/CreateEvent';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import EventManagement from './pages/EventManagement';
import Navbar from './components/Navbar';
import { AuthResponse } from './types';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState<AuthResponse | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');
    const fullName = localStorage.getItem('userFullName');

    if (token && email && role) {
      setAuthData({ token, email, role, fullName: fullName || undefined });
      setIsAuthenticated(true);
      if (role === 'ADMIN') {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('events'); // Redirect logged in users to events by default
      }
    } else {
      setIsAuthenticated(false);
      setCurrentPage('home'); // Default to home for guests
    }
  }, []);

  const handleLogin = async (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userRole', data.role);

    // Fetch user profile to get full name
    try {
      const { userAPI } = await import('./services/api');
      const profileResponse = await userAPI.getProfile();
      const fullName = profileResponse.data.fullName;
      if (fullName) {
        localStorage.setItem('userFullName', fullName);
        setAuthData({ ...data, fullName });
      } else {
        setAuthData(data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setAuthData(data);
    }

    setIsAuthenticated(true);
    if (data.role === 'ADMIN') {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('events');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userFullName');

    setAuthData(null);
    setIsAuthenticated(false);
    setCurrentPage('home'); // Go back to landing page on logout
  };

  const renderCurrentPage = () => {
    // Public pages handling
    if (!isAuthenticated) {
      if (currentPage === 'login' || currentPage === 'events') {
        return <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage('register')} />;
      }
      if (currentPage === 'register') {
        return <Register onSwitchToLogin={() => setCurrentPage('login')} />;
      }
      return <Home onNavigate={setCurrentPage} />;
    }

    // Authenticated pages handling
    if (!authData) return null;

    switch (currentPage) {
      case 'home':
        // If authenticated user goes to home, maybe show Home or redirect. 
        // Let's show Home but with different contextual buttons if needed, or just Dashboard/Events
        // based on the design request, "Home" seems to be the landing page.
        // For now, let admins see dashboard and users see events if they navigate away,
        // but if they explicitly click Home in navbar (if we keep it), they see Home.
        // However, standard app flow usually hides landing page after login.
        // Let's stick to the specific page logic using `authData`
        return <Home onNavigate={setCurrentPage} />;
      case 'dashboard':
        return authData.role === 'ADMIN' ?
          <AdminDashboard /> :
          <UserDashboard userEmail={authData.email} />;
      case 'events':
        return <Events userRole={authData.role} onNavigate={setCurrentPage} />;
      case 'tickets':
        return authData.role === 'USER' ? <MyTickets /> : <Events userRole={authData.role} onNavigate={setCurrentPage} />;
      case 'validate':
        return authData.role === 'ADMIN' ? <QRValidation /> : <Events userRole={authData.role} onNavigate={setCurrentPage} />;
      case 'create':
        return authData.role === 'ADMIN' ? <CreateEvent /> : <Events userRole={authData.role} />;
      case 'manage':
        return authData.role === 'ADMIN' ? <EventManagement /> : <Events userRole={authData.role} />;
      case 'profile':
        return <Profile />;
      default:
        return authData.role === 'ADMIN' ?
          <AdminDashboard /> :
          <UserDashboard userEmail={authData.email} />;
    }
  };

  return (
    <div className="app">
      <Navbar
        userEmail={authData?.email || ''}
        userRole={authData?.role || ''}
        userFullName={authData?.fullName}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />
      <main className="main-content">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;