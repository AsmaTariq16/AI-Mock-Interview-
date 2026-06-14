import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

export default function Results() {
  const { getAuthHeaders } = useAuth();
  const { navigate, matchRoute } = useRouter();

  // Extract interview session ID
  const routeParams = matchRoute('/results/:id');
  const sessionId = routeParams ? routeParams.id : null;

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeAccordionIdx, setActiveAccordionIdx] = useState(0);

  useEffect(() => {
    if (!sessionId) return;

    const fetchReport = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/interview/${sessionId}`, {
          headers: getAuthHeaders()
        });
        const data = await res.json();

        if (data.success) {
          setInterview(data.interview);
        } else {
          setError(data.message || 'Failed to load final report');
        }
      } catch (err) {
        console.error('Error fetching final report:', err);
        setError('Connection error. Failed to load results data.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [sessionId]);

  const getRecommendationClass = (rec) => {
    if (!rec) return 'recommendation-badge hire';
    const norm = rec.toLowerCase();
    if (norm.includes('strong')) return 'recommendation-badge strong-hire';
    if (norm.includes('needs') || norm.includes('improve')) return 'recommendation-badge needs-improvement';
    return 'recommendation-badge hire';
  };

  const getCircleStrokeColor = () => {
    return 'var(--color-primary)';
  };

  if (loading) {
    return (
      <div className="page-loader">
        <span className="spinner spinner-lg"></span>
        <span className="loader-text">Compiling AI analysis report...</span>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <div className="btn-danger" style={{ display: 'inline-block', padding: '1rem 2rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', fontWeight: 600 }}>
          {error || 'Interview report not found'}
        </div>
        <div>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const {
    role,
    level,
    experience,
    focus,
    difficulty,
    questionCount,
    overallScore,
    recommendation,
    finalFeedback,
    skillBreakdown,
    strengths,
    weaknesses,
    suggestions,
    questions,
    createdAt
  } = interview;

  // SVG Circular progress configurations
  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="main-content">
      {/* Results Header */}
      <div className="results-header">
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            MOCK INTERVIEW ANALYSIS
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0 0.5rem 0', fontFamily: 'var(--font-display)' }}>
            {role}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Conducted on {new Date(createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
          </p>
        </div>

        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      {/* Overview Block: Circular Score & Recommendation */}
      <div className="glass-panel" style={{ padding: '2.25rem', marginBottom: '2.5rem' }}>
        <div className="results-summary">
          {/* Animated SVG Circle */}
          <div className="result-circle-wrapper">
            <svg height="120" width="120" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                stroke="rgba(95,143,107,0.06)"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx="60"
                cy="60"
              />
              <circle
                stroke={getCircleStrokeColor()}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-out' }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx="60"
                cy="60"
              />
            </svg>
            <div className="result-circle-score" style={{ color: 'var(--color-primary)' }}>
              {overallScore}%
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>Evaluation Recommendation</h2>
              <span className={getRecommendationClass(recommendation)}>
                {recommendation || 'Hire'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '800px' }}>
              {finalFeedback}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Skill Radar & Strengths */}
      <div className="skill-radar-grid">
        {/* Left: Skill Breakdown Progress Bars */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 className="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M3 20v-8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8"/><path d="M11 20v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8"/><path d="M15 20v-8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8"/>
            </svg>
            Skill Competency Ratings
          </h3>
          <div className="skills-list">
            {skillBreakdown && Object.entries(skillBreakdown).map(([skill, val]) => (
              <div key={skill} className="skill-bar-container">
                <div className="skill-bar-label">
                  <span>{skill}</span>
                  <span style={{ color: 'var(--color-primary)' }}>{val}/10</span>
                </div>
                <div className="skill-bar-track">
                  <div className="skill-bar-fill" style={{ width: `${val * 10}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Improvement suggestions */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 className="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
            </svg>
            Actionable Recommendations
          </h3>
          <ul className="bullet-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {suggestions && suggestions.map((item, idx) => (
              <li key={idx} style={{ paddingLeft: '1.75rem', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Grid: Strengths & Weaknesses */}
      <div className="analysis-grid">
        <div className="glass-panel analysis-card strengths-card">
          <h3 className="section-title" style={{ color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>
            Key Strengths
          </h3>
          <ul className="bullet-list">
            {strengths && strengths.map((item, idx) => (
              <li key={idx} style={{ color: 'var(--text-secondary)' }}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="glass-panel analysis-card weaknesses-card">
          <h3 className="section-title" style={{ color: 'var(--color-danger)', marginBottom: '1.25rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm12-7h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/>
            </svg>
            Areas for Development
          </h3>
          <ul className="bullet-list">
            {weaknesses && weaknesses.map((item, idx) => (
              <li key={idx} style={{ color: 'var(--text-secondary)' }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Accordion List: Question by Question Transcript */}
      <div className="timeline-section">
        <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Question-by-Question Transcript
        </h3>

        <div className="timeline-list">
          {questions && questions.map((item, idx) => {
            const isActive = activeAccordionIdx === idx;
            return (
              <div key={idx} className="glass-panel timeline-item" style={{ borderLeft: `4px solid ${isActive ? 'var(--color-primary)' : 'var(--border-color)'}` }}>
                <div 
                  className="timeline-q-header" 
                  onClick={() => setActiveAccordionIdx(isActive ? -1 : idx)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 800 }}>Q{idx + 1}</span>
                    <span className="timeline-q-title" style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {item.questionText.length > 80 && !isActive ? item.questionText.substring(0, 80) + '...' : item.questionText}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <span className="timeline-q-score">Score: {item.score}/10</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{ transform: isActive ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition-fast)' }}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>

                {isActive && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                        Your Response ({item.durationSeconds || 0}s)
                      </h4>
                      <p className="timeline-textblock answer">
                        "{item.answerText}"
                      </p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                        AI Evaluation & Feedback
                      </h4>
                      <p className="timeline-textblock feedback">
                        {item.feedback}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ minWidth: '200px' }}>
          Back to Dashboard
        </button>
      </div>

    </div>
  );
}
