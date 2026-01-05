import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { AuthResponse } from '../types';

interface LoginProps {
  onLogin: (authData: AuthResponse) => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(email, password);
      onLogin(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
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
        flex: 1,
        minHeight: '600px',
        background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
        borderRadius: '24px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        padding: '40px 20px'
      }}>

        {/* Decorative Ticket Shapes */}
        <div style={{
          position: 'absolute', top: '15%', left: '10%',
          width: '70px', height: '35px',
          border: '2px dashed rgba(255,255,255,0.3)',
          borderRadius: '10px',
          transform: 'rotate(-15deg)',
          animation: 'customFloat 7s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', bottom: '25%', right: '12%',
          width: '90px', height: '45px',
          border: '2px dashed rgba(255,255,255,0.2)',
          borderRadius: '14px',
          transform: 'rotate(10deg)',
          animation: 'customFloat 9s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute', top: '30%', right: '20%',
          width: '50px', height: '25px',
          border: '2px dashed rgba(255,255,255,0.2)',
          borderRadius: '6px',
          transform: 'rotate(25deg)',
          opacity: 0.6
        }} />

        {/* Glassmorphism Card */}
        <div style={{
          width: '100%',
          maxWidth: '450px',
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
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
            Welcome Back
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '14px 18px', borderRadius: '12px',
                  border: 'none', outline: 'none', background: '#f8f9fa',
                  fontSize: '16px', color: '#2d3436'
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
                  width: '100%', padding: '14px 18px', borderRadius: '12px',
                  border: 'none', outline: 'none', background: '#f8f9fa',
                  fontSize: '16px', color: '#2d3436'
                }}
              />
            </div>

            {error && <div style={{ color: '#ff7675', marginTop: '20px', textAlign: 'center', fontSize: '15px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px' }}>{error}</div>}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', marginTop: '30px', padding: '16px',
                background: '#e67e22', color: 'white', border: 'none',
                borderRadius: '12px', fontSize: '16px', fontWeight: '700',
                cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px',
                transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>

          {/* Register Link */}
          <div style={{ marginTop: '25px', fontSize: '15px', color: 'rgba(255,255,255,0.9)' }}>
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '15px'
              }}
            >
              Register
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;