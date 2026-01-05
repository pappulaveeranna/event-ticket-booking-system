import React from 'react';
import './Home.css';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>🏠 Home Page Content</h1>
        <h2>🎫 Welcome to EventEase</h2>
        <p>Your one-stop platform to book tickets for concerts 🎸, festivals 🎡, conferences 🎤, and live shows 🎭 — fast, secure, and hassle-free.</p>
        <button onClick={() => onNavigate('events')} className="cta-button">
          👉 Browse Events
        </button>
      </div>

      <div className="features-section">
        <h2>🌟 Why Choose EventEase?</h2>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">🎟️</div>
            <h3>Instant QR Ticket</h3>
            <p>Get your ticket with a unique QR code immediately after booking.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🛡️</div>
            <h3>Secure Entry</h3>
            <p>Your QR code is scanned at the gate to prevent duplicate or fake tickets.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h3>Easy Booking</h3>
            <p>Choose your event, select seats, and confirm in just a few clicks.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📡</div>
            <h3>Real-Time Validation</h3>
            <p>Tickets are verified live using our smart QR scanning system.</p>
          </div>
        </div>
      </div>

      <div className="events-section">
        <h2>🎉 Explore Exciting Events</h2>
        <p>Browse upcoming concerts 🎵, workshops 💡, movie screenings 🎬, cultural festivals 🏮, and sports events ⚽ happening near you.</p>
        <p><strong>⏳ Book your seat before it's gone!</strong></p>
      </div>

      <div className="qr-system-section">
        <h2>🔐 Smart QR Code System</h2>
        <p>Each ticket comes with a unique QR code 🔳.</p>
        <p>Scan it at the venue gate to:</p>
        <ul>
          <li>✅ Verify authenticity</li>
          <li>🚫 Prevent duplicate usage</li>
          <li>🚀 Ensure fast entry</li>
        </ul>
      </div>

      <div className="organizers-section">
        <h2>👨💻 For Event Organizers</h2>
        <p>Manage events 📅, monitor bookings 📊, and validate tickets 🤳 easily using our Admin Dashboard.</p>
      </div>

      <div className="cta-section">
        <h2>🚀 Start Booking Now</h2>
        <p>Create your account 👤, choose an event, book your ticket, and enjoy the show! 🍿</p>
        <button onClick={() => onNavigate('events')} className="cta-button">
          👉 Click "Browse Events" to get started
        </button>
      </div>
    </div>
  );
};

export default Home;
