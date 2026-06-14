import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

export default function Dashboard() {
  const { getAuthHeaders, user } = useAuth();
  const { navigate } = useRouter();
  
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/interview/history', {
          headers: getAuthHeaders()
        });
        const data = await res.json();
        
        if (data.success) {
          setHistory(data.history);
        } else {
          setError(data.message || 'Failed to fetch interview history');
        }
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Connection error. Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Compute Metrics
  const completedInterviews = history.filter(i => i.status === 'completed');
  const totalCompleted = completedInterviews.length;
  
  const avgScore = totalCompleted > 0 
    ? Math.round(completedInterviews.reduce((sum, i) => sum + i.overallScore, 0) / totalCompleted)
    : 0;

  const highScore = totalCompleted > 0
    ? Math.max(...completedInterviews.map(i => i.overallScore))
    : 0;

  // Determine recommendation rate
  const hireCount = completedInterviews.filter(i => i.recommendation === 'Hire' || i.recommendation === 'Strong Hire').length;
  const hireRate = totalCompleted > 0 ? Math.round((hireCount / totalCompleted) * 100) : 0;

  // Render SVG performance trend line in Sage Green
  const renderTrendChart = () => {
    if (totalCompleted < 2) {
      return (
        <div style={{
          height: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          border: '1px dashed var(--border-color)',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(95, 143, 107, 0.02)',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>🌱</span>
          Complete at least 2 interviews to view performance trends.
        </div>
      );
    }

    // Sort chronologically ascending
    const chartData = [...completedInterviews]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-6); // show last 6 interviews

    const width = 500;
    const height = 150;
    const padding = 25;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = chartData.map((item, idx) => {
      const x = padding + (idx / (chartData.length - 1)) * chartWidth;
      // Invert Y since 0 is top
      const y = padding + chartHeight - (item.overallScore / 100) * chartHeight;
      return { x, y, score: item.overallScore, label: item.role };
    });

    const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

    return (
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="var(--border-color)" strokeDasharray="3,3" />
          <line x1={padding} y1={padding + chartHeight / 2} x2={width - padding} y2={padding + chartHeight / 2} stroke="var(--border-color)" strokeDasharray="3,3" />
          <line x1={padding} y1={padding + chartHeight} x2={width - padding} y2={padding + chartHeight} stroke="var(--border-color)" />

          {/* Area fill */}
          {polylinePoints && (
            <polygon
              points={`${points[0].x},${padding + chartHeight} ${polylinePoints} ${points[points.length - 1].x},${padding + chartHeight}`}
              fill="url(#chart-glow)"
            />
          )}

          {/* Trend line */}
          <polyline
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />

          {/* Value circles & labels */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill="#FAF8F4"
                stroke="var(--color-primary)"
                strokeWidth="3"
              />
              <text
                x={p.x}
                y={p.y - 12}
                fill="var(--text-primary)"
                fontSize="9"
                fontWeight="700"
                textAnchor="middle"
              >
                {p.score}%
              </text>
              <text
                x={p.x}
                y={padding + chartHeight + 15}
                fill="var(--text-muted)"
                fontSize="8"
                fontWeight="600"
                textAnchor="middle"
              >
                {p.label.split(' ')[0]}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'score-badge success';
    if (score >= 60) return 'score-badge warning';
    return 'score-badge danger';
  };

  if (loading) {
    return (
      <div className="page-loader">
        <span className="spinner spinner-lg"></span>
        <span className="loader-text">Loading dashboard analytics...</span>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Welcome header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem', fontFamily: 'var(--font-display)' }}>
            Hello, <span style={{ color: 'var(--color-primary)' }}>{user?.name}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome to your mock interview control center.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/setup')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Start New Interview
        </button>
      </div>

      {error && (
        <div className="btn-danger" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', textAlign: 'center', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="dashboard-grid">
        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <span className="stat-label">Interviews Run</span>
          <span className="stat-value">{history.length}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {totalCompleted} Completed / {history.length - totalCompleted} In Progress
          </span>
        </div>
        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <span className="stat-label">Average Score</span>
          <span className="stat-value">{avgScore}%</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Target benchmark: 75%
          </span>
        </div>
        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <span className="stat-label">Highest Score</span>
          <span className="stat-value">{highScore}%</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Best personal performance
          </span>
        </div>
        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <span className="stat-label">Hire Recommendation</span>
          <span className="stat-value">
            {hireRate}%
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Pass rate (Hire or Strong Hire)
          </span>
        </div>
      </div>

      {/* Main sections */}
      <div className="dashboard-sections">
        {/* Left: History list */}
        <div>
          <h3 className="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            Interview History
          </h3>

          {history.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
              <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                  <path d="M6 6h10"/>
                  <path d="M6 10h10"/>
                </svg>
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>No Interviews Conducted Yet</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem', maxWidth: '420px', margin: '0 auto 2rem auto', lineHeight: '1.5' }}>
                Conduct your first automated, AI-driven interactive mock interview to get a detailed evaluation report.
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/setup')}>
                Start First Session
              </button>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div key={item._id} className="glass-panel history-item">
                  <div className="history-info">
                    <span className="history-role">{item.role}</span>
                    <div className="history-meta">
                      <span>{item.level}</span>
                      <span>•</span>
                      <span>{item.focus}</span>
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {item.status === 'completed' ? (
                      <>
                        <div className="history-score">
                          <span className={getScoreBadgeClass(item.overallScore)}>{item.overallScore}%</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                            {item.recommendation}
                          </span>
                        </div>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem' }} onClick={() => navigate(`/results/${item._id}`)}>
                          Report
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="history-score">
                          <span className="score-badge" style={{ background: 'rgba(95, 143, 107, 0.08)', color: 'var(--color-primary)', borderColor: 'var(--border-color)' }}>
                            Active
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                            Q: {item.questions.length}/{item.questionCount}
                          </span>
                        </div>
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }} onClick={() => navigate(`/interview/${item._id}`)}>
                          Resume
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Trend Chart & Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div>
            <h3 className="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"/>
                <path d="m19 9-5 5-4-4-3 3"/>
              </svg>
              Performance Trend
            </h3>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              {renderTrendChart()}
            </div>
          </div>

          <div>
            <h3 className="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Interview Tips
            </h3>
            <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>01.</span>
                <p><strong>Use speech-to-text:</strong> Turn on the microphone to speak naturally. High communication scores relate to smooth explanations.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>02.</span>
                <p><strong>Structure response:</strong> When answering technical questions, first state the definition, explain the design, then describe edge cases.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>03.</span>
                <p><strong>Observe feedback:</strong> Adaptive AI changes difficulty based on details. Address structural flaws highlighted in the feedback box.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
