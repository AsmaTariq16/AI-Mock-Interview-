import React from 'react';
import { useRouter } from '../context/RouterContext';

export default function Landing() {
  const { navigate } = useRouter();

  return (
    <div className="main-content" style={{ maxWidth: '1100px', padding: '3.5rem 1.5rem' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '5rem', position: 'relative' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '50px',
          background: 'rgba(95, 143, 107, 0.08)',
          border: '1px solid rgba(95, 143, 107, 0.16)',
          color: 'var(--color-primary)',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          ✨ Spring 2026 Release - High Fidelity Audio & Video Simulation
        </div>
        
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '3.25rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          maxWidth: '850px',
          margin: '0 auto 1.5rem auto'
        }}>
          Conquer your next tech interview with{' '}
          <span style={{ 
            background: 'linear-gradient(135deg, #5F8F6B 0%, #426B4F 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            position: 'relative'
          }}>
            adaptive AI
          </span>
        </h1>
        
        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          maxWidth: '650px',
          margin: '0 auto 2.5rem auto',
          fontWeight: 500
        }}>
          MockingAI simulates high-fidelity technical and behavioral interviews. Get real-time feedback, speech-to-text transcriptions, and interactive score metrics.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ padding: '0.95rem 2.25rem', fontSize: '1rem' }} onClick={() => navigate('/register')}>
            Get Started Free
          </button>
          <button className="btn btn-secondary" style={{ padding: '0.95rem 2.25rem', fontSize: '1rem' }} onClick={() => navigate('/login')}>
            Sign In to Account
          </button>
        </div>
      </div>

      {/* Showcase Visual Block */}
      <div className="glass-panel" style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '6rem',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid rgba(95,143,107,0.18)',
        background: 'rgba(255,255,255,0.85)'
      }}>
        {/* Mock Interview Platform UI Simulation */}
        <div className="glass-panel" style={{
          background: '#FAF8F4',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid rgba(95,143,107,0.12)'
        }}>
          {/* Simulated Browser Bar */}
          <div style={{
            background: '#F6F4EF',
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid rgba(95,143,107,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#E0A96D' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#5F8F6B' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#DDEBDD' }}></span>
            <div style={{
              background: '#FAF8F4',
              borderRadius: '6px',
              padding: '0.2rem 4rem',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginLeft: '2rem',
              border: '1px solid rgba(95,143,107,0.06)'
            }}>
              mockingai.com/interview/session
            </div>
          </div>
          
          {/* Simulated Screen Body */}
          <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-panel" style={{ padding: '1rem', background: '#2D3A32', aspectRatio: '4/3', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', position: 'relative' }}>
                <span style={{ fontSize: '0.8rem', position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ width: '6px', height: '6px', background: 'var(--color-danger)', borderRadius: '50%' }}></span>
                  LIVE CAMERA
                </span>
                <span style={{ fontSize: '0.85rem', color: '#8E9E95', fontWeight: 600 }}>Webcam Active</span>
              </div>
              <div className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '4px', height: '40px', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '3px', height: '35%', background: 'var(--color-primary)', borderRadius: '50px' }}></div>
                <div style={{ width: '3px', height: '65%', background: 'var(--color-primary)', borderRadius: '50px' }}></div>
                <div style={{ width: '3px', height: '80%', background: 'var(--color-primary)', borderRadius: '50px' }}></div>
                <div style={{ width: '3px', height: '40%', background: 'var(--color-primary)', borderRadius: '50px' }}></div>
                <div style={{ width: '3px', height: '15%', background: 'var(--color-primary)', borderRadius: '50px' }}></div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-primary)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase' }}>Interviewer Question 1</span>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                  How does React's Virtual DOM reconciliation process handle dynamic list re-rendering using unique keys?
                </p>
              </div>
              <div className="glass-panel" style={{ padding: '1.25rem', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Type or dictate answer...</span>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} disabled>Submit Response</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'var(--color-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            marginBottom: '1.25rem'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>High-Fidelity Audio</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Answer questions naturally using our built-in speech-to-text. Practice vocal clarity, structure, and professional tone.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'var(--color-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            marginBottom: '1.25rem'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Adaptive AI Engine</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Our adaptive algorithm modifies the difficulty and focus of the next question in real-time based on your previous answer.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'var(--color-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            marginBottom: '1.25rem'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M3 20v-8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8"/><path d="M11 20v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8"/></svg>
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>In-depth Reports</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Receive comprehensive overall evaluation scores, recommendation grades, strength callouts, and actionable study suggestions.
          </p>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '2.5rem' }}>
          Trusted by candidates preparing for global SaaS products
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>15K+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.25rem' }}>Interviews Conducted</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>94.6%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.25rem' }}>Success Rate</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>4.9/5</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.25rem' }}>Candidate Rating</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>200+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '0.25rem' }}>Curated Roles</div>
          </div>
        </div>
      </div>
    </div>
  );
}
