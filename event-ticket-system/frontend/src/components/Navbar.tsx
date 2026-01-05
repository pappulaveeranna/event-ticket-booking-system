import React from 'react';

interface NavbarProps {
  userEmail?: string;
  userRole?: string;
  userFullName?: string;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  isAuthenticated: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  userEmail = '',
  userRole = '',
  userFullName,
  currentPage,
  onNavigate,
  onLogout,
  isAuthenticated
}) => {
  const getUserName = (email: string) => {
    return email.split('@')[0];
  };

  const displayName = userFullName || getUserName(userEmail);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h3 style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => onNavigate('home')}>🎫 Event Ticket Booking with QR Code Validation</h3>
      </div>

      <div className="navbar-nav">
        {/* Public Links */}
        {!isAuthenticated && (
          <>
            <button
              className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => onNavigate('home')}
            >
              🏠 Home
            </button>
            <button
              className={`nav-btn ${currentPage === 'login' ? 'active' : ''}`}
              onClick={() => onNavigate('login')}
            >
              Login
            </button>
            <button
              className={`nav-btn ${currentPage === 'register' ? 'active' : ''}`}
              onClick={() => onNavigate('register')}
              style={{ background: 'var(--primary-color)', color: 'white' }}
            >
              Register
            </button>
          </>
        )}

        {/* User Links */}
        {isAuthenticated && (
          <>
            <button
              className={`nav-btn ${currentPage === 'events' ? 'active' : ''}`}
              onClick={() => onNavigate('events')}
            >
              🎆 Events
            </button>

            {userRole === 'USER' && (
              <button
                className={`nav-btn ${currentPage === 'tickets' ? 'active' : ''}`}
                onClick={() => onNavigate('tickets')}
              >
                🎫 My Tickets
              </button>
            )}

            {userRole === 'ADMIN' && (
              <>
                <button
                  className={`nav-btn ${currentPage === 'validate' ? 'active' : ''}`}
                  onClick={() => onNavigate('validate')}
                >
                  🔍 Validate QR
                </button>
                <button
                  className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
                  onClick={() => onNavigate('dashboard')}
                >
                  📊 Dashboard
                </button>
                <button
                  className={`nav-btn ${currentPage === 'create' ? 'active' : ''}`}
                  onClick={() => onNavigate('create')}
                >
                  ➕ Create Event
                </button>
                <button
                  className={`nav-btn ${currentPage === 'manage' ? 'active' : ''}`}
                  onClick={() => onNavigate('manage')}
                >
                  ⚙️ Manage Events
                </button>
              </>
            )}

            <button
              className={`nav-btn ${currentPage === 'profile' ? 'active' : ''}`}
              onClick={() => onNavigate('profile')}
            >
              👤 Profile
            </button>
          </>
        )}
      </div>

      {isAuthenticated && (
        <div className="navbar-user">
          <div className="user-info">
            <span className="user-email">{displayName}</span>
            <span className={`user-role ${userRole.toLowerCase()}`}>{userRole}</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;