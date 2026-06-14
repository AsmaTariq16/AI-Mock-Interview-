import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';

export default function Admin() {
  const { navigate } = useRouter();

  // Simulated Users
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'MERN Stack Developer', count: 8, avg: 82 },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Python Backend Engineer', count: 5, avg: 74 },
    { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', role: 'Product Manager', count: 12, avg: 88 },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'DevOps Coordinator', count: 3, avg: 62 },
    { id: 5, name: 'Evan Wright', email: 'evan@example.com', role: 'Android Dev', count: 9, avg: 79 },
  ]);

  const [search, setSearch] = useState('');

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this candidate profile?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-content">
      {/* Welcome header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            SUPERADMIN VIEW
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0 0.5rem 0' }}>
            Admin Control Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review system usage statistics and manage candidate records.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      {/* Admin stats */}
      <div className="dashboard-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel stat-card" style={{ padding: '1.25rem' }}>
          <span className="stat-label">Platform Users</span>
          <span className="stat-value">1,482</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>+24 registered this week</span>
        </div>
        <div className="glass-panel stat-card" style={{ padding: '1.25rem' }}>
          <span className="stat-label">Total Mock Sessions</span>
          <span className="stat-value">8,914</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average duration: 24 mins</span>
        </div>
        <div className="glass-panel stat-card" style={{ padding: '1.25rem' }}>
          <span className="stat-label">AI System Accuracy</span>
          <span className="stat-value">98.4%</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gemini-2.5-flash response model</span>
        </div>
        <div className="glass-panel stat-card" style={{ padding: '1.25rem' }}>
          <span className="stat-label">Active Connections</span>
          <span className="stat-value">16</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>API Status: Optimal (9ms latency)</span>
        </div>
      </div>

      <div className="dashboard-sections" style={{ gridTemplateColumns: '1fr' }}>
        {/* User Management Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <h3 className="section-title" style={{ marginBottom: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Platform User Directory
            </h3>
            
            <input 
              type="text"
              placeholder="Search user, email or role..."
              className="form-input"
              style={{ maxWidth: '300px', padding: '0.6rem 1rem', fontSize: '0.85rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredUsers.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No matches found for search query.
            </div>
          ) : (
            <div className="table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Email Address</th>
                    <th>Configured Target Role</th>
                    <th style={{ textAlign: 'center' }}>Sessions Conducted</th>
                    <th style={{ textAlign: 'center' }}>Average Score</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{user.name}</strong>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                      <td>
                        <span style={{ 
                          fontSize: '0.8rem', 
                          background: 'var(--color-secondary)', 
                          color: '#426B4F', 
                          padding: '0.25rem 0.6rem', 
                          borderRadius: '4px',
                          fontWeight: 600
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{user.count}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ 
                          fontWeight: 800, 
                          color: user.avg >= 80 ? 'var(--color-primary)' : 'var(--text-secondary)'
                        }}>
                          {user.avg}%
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', marginRight: '0.5rem' }}
                          onClick={() => alert(`Reviewing transcripts for candidate ${user.name}`)}
                        >
                          Review Logs
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Analytics Section */}
        <div style={{ marginTop: '3rem' }}>
          <h3 className="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
            </svg>
            System-Wide Platform Analytics
          </h3>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Completed Mock Interviews (Daily Trend)
            </h4>
            <div style={{ width: '100%', overflowX: 'auto', marginTop: '1.5rem' }}>
              <svg width="100%" height="200" viewBox="0 0 600 200" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="admin-chart-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal reference lines */}
                <line x1="40" y1="20" x2="560" y2="20" stroke="var(--border-color)" strokeDasharray="3,3" />
                <line x1="40" y1="80" x2="560" y2="80" stroke="var(--border-color)" strokeDasharray="3,3" />
                <line x1="40" y1="140" x2="560" y2="140" stroke="var(--border-color)" strokeDasharray="3,3" />
                <line x1="40" y1="180" x2="560" y2="180" stroke="var(--color-primary)" strokeWidth="1.5" />
                
                {/* Y labels */}
                <text x="30" y="25" fill="var(--text-muted)" fontSize="9" textAnchor="end">150</text>
                <text x="30" y="85" fill="var(--text-muted)" fontSize="9" textAnchor="end">100</text>
                <text x="30" y="145" fill="var(--text-muted)" fontSize="9" textAnchor="end">50</text>
                <text x="30" y="185" fill="var(--text-muted)" fontSize="9" textAnchor="end">0</text>

                {/* Path Area */}
                <polygon
                  points="40,180 80,140 160,110 240,150 320,80 400,60 480,45 560,35 560,180"
                  fill="url(#admin-chart-glow)"
                />

                {/* Path Line */}
                <polyline
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="40,180 80,140 160,110 240,150 320,80 400,60 480,45 560,35"
                />

                {/* Data points */}
                {[
                  {x: 40, y: 180, count: 0, day: 'Mon'},
                  {x: 80, y: 140, count: 32, day: 'Tue'},
                  {x: 160, y: 110, count: 58, day: 'Wed'},
                  {x: 240, y: 150, count: 25, day: 'Thu'},
                  {x: 320, y: 80, count: 83, day: 'Fri'},
                  {x: 400, y: 60, count: 100, day: 'Sat'},
                  {x: 480, y: 45, count: 112, day: 'Sun'},
                  {x: 560, y: 35, count: 120, day: 'Today'}
                ].map((p, idx) => (
                  <g key={idx}>
                    <circle cx={p.x} cy={p.y} r="5" fill="#FAF8F4" stroke="var(--color-primary)" strokeWidth="3" />
                    <text x={p.x} y={p.y - 12} fill="var(--text-primary)" fontSize="9" fontWeight="700" textAnchor="middle">{p.count}</text>
                    <text x={p.x} y="195" fill="var(--text-muted)" fontSize="9" textAnchor="middle">{p.day}</text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
