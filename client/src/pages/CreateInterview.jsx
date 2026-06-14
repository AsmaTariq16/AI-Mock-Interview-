import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

export default function CreateInterview() {
  const { getAuthHeaders } = useAuth();
  const { navigate } = useRouter();

  // Wizard state
  const [step, setStep] = useState(1);

  // Configuration settings
  const [role, setRole] = useState('MERN Stack Developer');
  const [level, setLevel] = useState('Intermediate');
  const [experience, setExperience] = useState('2-3 Years');
  const [focus, setFocus] = useState('Fullstack');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [interviewType, setInterviewType] = useState('Technical');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Device check states
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [micVolume, setMicVolume] = useState(10);
  const volumeIntervalRef = useRef(null);

  // Microphone level simulator for Step 2
  useEffect(() => {
    if (step === 2) {
      volumeIntervalRef.current = setInterval(() => {
        setMicVolume(Math.floor(Math.random() * 60) + 10);
      }, 200);
      
      // Start camera for system check preview
      if (cameraActive) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          .then(mediaStream => {
            setStream(mediaStream);
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
            }
          })
          .catch(err => {
            console.warn('System check camera access denied:', err);
            setCameraActive(false);
          });
      }
    } else {
      stopCamera();
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
    }

    return () => {
      stopCamera();
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
    };
  }, [step, cameraActive]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!role || !level || !experience || !focus || !difficulty || !questionCount || !interviewType) {
      setError('Please configure all settings.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/v1/interview/start', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          role,
          level,
          experience,
          focus,
          difficulty,
          questionCount: Number(questionCount),
          interviewType
        })
      });

      const data = await res.json();

      if (data.success) {
        navigate(`/interview/${data.interview._id}`);
      } else {
        setError(data.message || 'Failed to start interview session');
        setStep(1); // go back to adjust config
      }
    } catch (err) {
      console.error('Error starting session:', err);
      setError('Connection error. Failed to initiate interview session.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: '750px' }}>
      
      {/* Wizard Progress Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem', fontFamily: 'var(--font-display)' }}>
            {step === 1 ? 'Configure Your Assessment' : 'Hardware & System Check'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {step === 1 
              ? 'Our adaptive AI engines will curate questions customized to these target settings.' 
              : 'Ensure your video and audio inputs are configured properly for active grading.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.35rem', borderRadius: '30px' }}>
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: 800, 
            padding: '0.4rem 1rem', 
            borderRadius: '20px', 
            background: step === 1 ? 'var(--color-primary)' : 'transparent',
            color: step === 1 ? '#FAF8F4' : 'var(--text-secondary)',
            transition: 'all var(--transition-fast)'
          }}>
            1. Parameters
          </span>
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: 800, 
            padding: '0.4rem 1rem', 
            borderRadius: '20px', 
            background: step === 2 ? 'var(--color-primary)' : 'transparent',
            color: step === 2 ? '#FAF8F4' : 'var(--text-secondary)',
            transition: 'all var(--transition-fast)'
          }}>
            2. System Check
          </span>
        </div>
      </div>

      {error && (
        <div className="btn-danger" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', textAlign: 'center', fontWeight: 600 }}>
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleNextStep} className="glass-panel animate-fade-in" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label" htmlFor="role">Target Job Role</label>
              <input
                type="text"
                id="role"
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. MERN Stack Developer, Python Engineer, Product Manager"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="level">Seniority Level</label>
              <select id="level" className="form-select" value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="Beginner">Junior / Entry Level</option>
                <option value="Intermediate">Mid Level / Associate</option>
                <option value="Advanced">Senior / Lead Level</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="experience">Years of Experience</label>
              <select id="experience" className="form-select" value={experience} onChange={(e) => setExperience(e.target.value)}>
                <option value="Fresher">Fresher / Graduate</option>
                <option value="1 Year">1 Year</option>
                <option value="2-3 Years">2-3 Years</option>
                <option value="5+ Years">5+ Years</option>
                <option value="10+ Years">10+ Years</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="focus">Core Tech Focus Area</label>
              <input
                type="text"
                id="focus"
                className="form-input"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="e.g. Frontend, Backend, Fullstack, DevOps"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="interviewType">Interview Format</label>
              <select id="interviewType" className="form-select" value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
                <option value="Technical">Technical (Coding & Architecture)</option>
                <option value="HR / Behavioral">HR / Behavioral / Soft Skills</option>
                <option value="Mixed">Mixed (Technical + HR)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="difficulty">Initial Difficulty</label>
              <select id="difficulty" className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="Easy">Easy (Foundational)</option>
                <option value="Medium">Medium (Applied Skills)</option>
                <option value="Hard">Hard (Deep Expert)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="questionCount">Total Questions</label>
              <select id="questionCount" className="form-select" value={questionCount} onChange={(e) => setQuestionCount(e.target.value)}>
                <option value="5">5 Questions (Fast practice)</option>
                <option value="10">10 Questions (Standard)</option>
                <option value="15">15 Questions (Thorough)</option>
                <option value="20">20 Questions (Extended)</option>
              </select>
            </div>

          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ minWidth: '180px' }}>
              Next: System Check
            </button>
          </div>
        </form>
      ) : (
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            
            {/* Webcam Preview Panel */}
            <div className="webcam-container">
              <span className="form-label">Video Feed Verification</span>
              <div className="webcam-feed" style={{ aspectRatio: '4/3', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                {cameraActive ? (
                  <>
                    <div className="webcam-indicator">
                      <span className="recording-dot"></span>
                      <span>SYSTEM CHECK VIEW</span>
                    </div>
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
                  </>
                ) : (
                  <div className="webcam-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <span>Camera Offline / Blocked</span>
                  </div>
                )}
              </div>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setCameraActive(!cameraActive)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                {cameraActive ? 'Test Offline Mode' : 'Connect Video Stream'}
              </button>
            </div>

            {/* Mic and Environment Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span className="form-label">Audio Input Level</span>
                <div className="waveform" style={{ marginTop: '0.5rem', height: '60px' }}>
                  {[...Array(15)].map((_, i) => (
                    <div 
                      key={i} 
                      className="wave-bar active"
                      style={{ 
                        height: `${Math.min(100, Math.max(10, micVolume + (Math.sin(i) * 15)))}%`,
                        width: '4px',
                        background: 'var(--color-primary)',
                        transition: 'height 0.1s ease'
                      }}
                    ></div>
                  ))}
                </div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: 600 }}>
                  Speak out loud. The audio meter should react in Sage Green waves.
                </span>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-secondary)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>💡 Guidelines for best AI analysis:</strong>
                <p>1. Find a quiet space with minimal echo.</p>
                <p>2. Keep your camera focused on your face (optional but recommended).</p>
                <p>3. Articulate your replies slowly and specify key industry vocabularies.</p>
              </div>
            </div>

          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} disabled={loading}>
              Configure Options
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ minWidth: '180px' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="spinner"></span> Building AI...
                </span>
              ) : 'Begin Assessment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
