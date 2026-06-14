import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';

export default function ForgotPassword() {
  const { navigate } = useRouter();
  
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address.');
      return;
    }

    setError('');
    setLoading(true);

    // Simulate API reset request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="auth-page">
      <div className="glass-panel auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">We will send a temporary security code to recover your account</p>
        </div>

        {error && (
          <div className="btn-danger" style={{ 
            padding: '0.75rem 1rem', 
            borderRadius: 'var(--radius-sm)', 
            marginBottom: '1.5rem', 
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(95, 143, 107, 0.12)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Recovery Email Sent</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5' }}>
              Check your inbox at <strong>{email}</strong> for instructions on how to reset your password.
            </p>
            <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/login')}>
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" htmlFor="reset-email">Email Address</label>
              <input
                type="email"
                id="reset-email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.85rem' }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="spinner"></span> Sending Instructions...
                </span>
              ) : 'Send Reset Instructions'}
            </button>
          </form>
        )}

        {!success && (
          <div className="auth-footer">
            Remembered your password?{' '}
            <span className="auth-link" style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>
              Sign In
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
