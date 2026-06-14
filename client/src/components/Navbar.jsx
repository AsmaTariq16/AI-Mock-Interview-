import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useSidebar } from '../context/SidebarContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { currentPath, navigate } = useRouter();
  const { toggle } = useSidebar();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const navClass = user && currentPath === '/dashboard' ? 'navbar navbar-dashboard' : 'navbar';

  useEffect(() => {
    if (!showNotifications) return;
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  if (!user) {
    return (
      <nav className={navClass}>
        <div className="nav-brand" onClick={() => navigate('/')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') navigate('/'); }}>
          <Logo size={24} style={{ marginRight: '0.25rem' }} />
          <span>MockingAI</span>
        </div>
        <div className="nav-links">
          <span className="nav-link" onClick={() => navigate('/login')}>Sign In</span>
          <button className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }} onClick={() => navigate('/register')}>
            Sign Up
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className={navClass}>
      <div className="navbar-left">
        <button
          className="hamburger"
          onClick={toggle}
          aria-label="Toggle navigation menu"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="nav-brand" onClick={() => navigate('/dashboard')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') navigate('/dashboard'); }}>
          <Logo size={24} style={{ marginRight: '0.25rem' }} />
          <span>MockingAI</span>
        </div>
      </div>

      <div className="nav-links" ref={notifRef}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowNotifications(prev => !prev)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Notifications">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <span className="notification-badge">2</span>

          {showNotifications && (
            <div className="glass-panel notification-dropdown" onClick={(e) => e.stopPropagation()}>
              <strong className="notification-header">Notifications</strong>
              <div className="notification-list">
                <div className="notification-item">
                  <strong>Pro Account Trial:</strong> Explore your free sandbox evaluations.
                </div>
                <div className="notification-item">
                  <strong>AI Grading Optimal:</strong> Model responses synced with Gemini.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="navbar-profile">
          <div className="navbar-avatar" aria-hidden="true">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>

        <button className="btn btn-secondary" onClick={logout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}
