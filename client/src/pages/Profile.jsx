import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { API_BASE } from '../context/AuthContext';

export default function Profile() {
  const { user, logout, getAuthHeaders } = useAuth();
  const { navigate } = useRouter();

  // Active tab state
  const [activeTab, setActiveTab] = useState('profile');

  // Statistics state
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Profile forms state
  const [name, setName] = useState(user?.name || '');
  const [targetRole, setTargetRole] = useState('Senior Full Stack Developer');
  const [bio, setBio] = useState('Passionate software craftsperson focused on building clean web applications.');
  const [profileMessage, setProfileMessage] = useState('');

  // Notification switches state
  const [emailTranscripts, setEmailTranscripts] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [difficultyNudges, setDifficultyNudges] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/interview/history`, {
          headers: getAuthHeaders()
        });
        const data = await res.json();
        if (data.success) {
          setHistory(data.history);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  const completed = history.filter(i => i.status === 'completed');
  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((sum, i) => sum + i.overallScore, 0) / completed.length)
    : 0;

  // Breakdown of recommendations
  const recStats = completed.reduce((acc, curr) => {
    const rec = curr.recommendation || 'Hire';
    acc[rec] = (acc[rec] || 0) + 1;
    return acc;
  }, { 'Strong Hire': 0, 'Hire': 0, 'Needs Improvement': 0 });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setProfileMessage('Profile settings saved successfully.');
    setTimeout(() => setProfileMessage(''), 3000);
  };

  return (
    <div className="main-content" style={{ maxWidth: '900px' }}>
      
      {/* Welcome header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem', fontFamily: 'var(--font-display)' }}>
          Settings & Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your personal details, subscription plan, and system notifications.</p>
      </div>

      {/* Tabs list */}
      <div className="tab-container">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Settings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          Subscription & Billing
        </button>
        <button 
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Cumulative Stats
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'profile' && (
        <form onSubmit={handleUpdateProfile} className="glass-panel" style={{ padding: '2.5rem' }}>
          <h3 className="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Personal Details
          </h3>

          {profileMessage && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(95, 143, 107, 0.12)', border: '1px solid var(--color-primary)', color: '#426B4F', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
              {profileMessage}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <input 
                type="text" 
                id="profile-name" 
                className="form-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">Email Address</label>
              <input 
                type="email" 
                id="profile-email" 
                className="form-input" 
                value={user?.email || ''} 
                disabled 
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label" htmlFor="profile-role">Target Job Title</label>
              <input 
                type="text" 
                id="profile-role" 
                className="form-input" 
                value={targetRole} 
                onChange={(e) => setTargetRole(e.target.value)} 
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label" htmlFor="profile-bio">Short Bio</label>
              <textarea 
                id="profile-bio" 
                className="form-textarea" 
                rows="3" 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={logout}>
              Log Out of Account
            </button>
            <button type="submit" className="btn btn-primary" style={{ minWidth: '150px' }}>
              Save Changes
            </button>
          </div>
        </form>
      )}

      {activeTab === 'billing' && (
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h3 className="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
            </svg>
            Choose Subscription Plan
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Get unlimited adaptive interview sessions, full transcript downloads, and high-fidelity video checks.
          </p>

          <div className="pricing-grid">
            <div className="glass-panel pricing-card">
              <div>
                <span className="pricing-title">Starter Tier</span>
                <div className="pricing-price">$0<span>/month</span></div>
                <ul className="pricing-features">
                  <li>3 interviews monthly</li>
                  <li>Simulated local questions</li>
                  <li>Basic score overview</li>
                </ul>
              </div>
              <button className="btn btn-secondary" style={{ width: '100%' }} disabled>Current Plan</button>
            </div>

            <div className="glass-panel pricing-card premium">
              <div>
                <span className="pricing-title" style={{ color: 'var(--color-primary)' }}>Pro Growth</span>
                <div className="pricing-price">$19<span>/month</span></div>
                <ul className="pricing-features">
                  <li>Unlimited AI interviews</li>
                  <li>Gemini-powered questions</li>
                  <li>Microphone voice-to-text</li>
                  <li>Detailed feedback reports</li>
                </ul>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => alert('Redirecting to stripe sandbox checkout...')}>Upgrade to Pro</button>
            </div>

            <div className="glass-panel pricing-card">
              <div>
                <span className="pricing-title">Enterprise</span>
                <div className="pricing-price">Custom</div>
                <ul className="pricing-features">
                  <li>Custom team management</li>
                  <li>Platform analytics sharing</li>
                  <li>Tailored role criteria</li>
                  <li>Dedicated account manager</li>
                </ul>
              </div>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => alert('Support ticket raised. Our sales team will email you shortly.')}>Contact Sales</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h3 className="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
            Notification Preferences
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Choose how and when MockingAI triggers system messages and sounds.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Email Assessment transcripts</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Automatically send a detailed PDF report when an interview completes.</span>
              </div>
              <input 
                type="checkbox" 
                checked={emailTranscripts} 
                onChange={(e) => setEmailTranscripts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Webcam & Audio sound alerts</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Play notification chime sound when a question is ready or timer runs out.</span>
              </div>
              <input 
                type="checkbox" 
                checked={soundEffects} 
                onChange={(e) => setSoundEffects(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Adaptive Difficulty Nudges</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Show small helper overlays in live session when the AI increases target difficulty.</span>
              </div>
              <input 
                type="checkbox" 
                checked={difficultyNudges} 
                onChange={(e) => setDifficultyNudges(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h3 className="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M3 20v-8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8"/><path d="M11 20v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8"/><path d="M15 20v-8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8"/>
            </svg>
            Platform Performance Summary
          </h3>

          {loadingHistory ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <span className="spinner"></span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Total Sessions:</span>
                <span style={{ fontWeight: 'bold' }}>{history.length}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Completed Assessments:</span>
                <span style={{ fontWeight: 'bold' }}>{completed.length}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Average Cumulative Score:</span>
                <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{avgScore}%</span>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                  Hiring Decisions Breakdown
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Strong Hire:</span>
                    <span style={{ fontWeight: 600 }}>{recStats['Strong Hire']}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Hire:</span>
                    <span style={{ fontWeight: 600 }}>{recStats['Hire']}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--color-warning)', fontWeight: 700 }}>Needs Improvement:</span>
                    <span style={{ fontWeight: 600 }}>{recStats['Needs Improvement']}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
