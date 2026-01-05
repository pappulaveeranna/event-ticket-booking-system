import React, { useState } from 'react';
import { authAPI } from '../services/api';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authAPI.register(email, password, role, fullName, phoneNumber, address);
      setSuccess('Registration successful! Please login.');
      setTimeout(() => onSwitchToLogin(), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)', // Take up remaining vertical space
      width: '100%',
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Outfit', sans-serif",
      boxSizing: 'border-box'
    }}>
      <style>{`
        @keyframes customFloat {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>

      {/* Main Gradient Container - Responsive */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        flex: 1, // Allow to expand
        minHeight: '600px', // Lower min-height for smaller screens
        background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
        borderRadius: '24px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        padding: '40px 20px' // Internal padding to prevent content touching edges
      }}>

        {/* Decorative Ticket Shapes */}
        <div style={{
          position: 'absolute', top: '10%', right: '15%',
          width: '80px', height: '40px',
          border: '2px dashed rgba(255,255,255,0.3)',
          borderRadius: '12px',
          transform: 'rotate(15deg)',
          animation: 'customFloat 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', left: '10%',
          width: '100px', height: '50px',
          border: '2px dashed rgba(255,255,255,0.2)',
          borderRadius: '15px',
          transform: 'rotate(-10deg)',
          animation: 'customFloat 8s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '5%',
          width: '60px', height: '30px',
          border: '2px dashed rgba(255,255,255,0.2)',
          borderRadius: '8px',
          transform: 'rotate(45deg)',
          opacity: 0.6
        }} />

        {/* Glassmorphism Card */}
        <div style={{
          width: '100%',
          maxWidth: '450px',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)', // Fixed safari casing
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          zIndex: 10
        }}>
          {/* Headers */}
          <h1 style={{
            color: 'white',
            fontSize: '22px',
            fontWeight: '600',
            marginBottom: '8px',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Event Ticket Booking with<br />QR Code Validation
          </h1>

          <h2 style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '30px',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Create Account
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

              {/* Full Name */}
              <input
                type="text"
                placeholder="User Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  border: 'none', outline: 'none', background: '#f8f9fa',
                  fontSize: '15px', color: '#2d3436'
                }}
              />

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  border: 'none', outline: 'none', background: '#f8f9fa',
                  fontSize: '15px', color: '#2d3436'
                }}
              />

              {/* Phone Number */}
              <input
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  border: 'none', outline: 'none', background: '#f8f9fa',
                  fontSize: '15px', color: '#2d3436'
                }}
              />

              {/* Address */}
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  border: 'none', outline: 'none', background: '#f8f9fa',
                  fontSize: '15px', color: '#2d3436'
                }}
              />

              {/* Password */}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  border: 'none', outline: 'none', background: '#f8f9fa',
                  fontSize: '15px', color: '#2d3436'
                }}
              />

              {/* Role Selection */}
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  border: 'none', outline: 'none', background: '#f8f9fa',
                  fontSize: '15px', color: '#2d3436', cursor: 'pointer'
                }}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {error && <div style={{ color: '#ff7675', marginTop: '15px', textAlign: 'center', fontSize: '14px', background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '5px' }}>{error}</div>}
            {success && <div style={{ color: '#55efc4', marginTop: '15px', textAlign: 'center', fontSize: '14px', background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '5px' }}>{success}</div>}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', marginTop: '25px', padding: '14px',
                background: '#e67e22', color: 'white', border: 'none',
                borderRadius: '10px', fontSize: '16px', fontWeight: '700',
                cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px',
                transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {loading ? 'REGISTERING...' : 'REGISTER'}
            </button>
          </form>

          {/* Login Link */}
          <div style={{ marginTop: '20px', fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '14px'
              }}
            >
              Login
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;