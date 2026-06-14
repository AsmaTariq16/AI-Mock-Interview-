import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { API_BASE } from '../context/AuthContext';

export default function InterviewSession() {
  const { getAuthHeaders } = useAuth();
  const { navigate, matchRoute } = useRouter();
  
  // Extract interview session ID
  const routeParams = matchRoute('/interview/:id');
  const sessionId = routeParams ? routeParams.id : null;

  // Session state
  const [interview, setInterview] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Real-time AI feedback for the previous answer
  const [prevFeedback, setPrevFeedback] = useState(null);

  // Timer state
  const [secondsLeft, setSecondsLeft] = useState(180); // 3 minutes per question
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);

  // Webcam stream state
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);

  // Speech Recognition state
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // Question typing animation state
  const [typedQuestionText, setTypedQuestionText] = useState('');
  const typingTimerRef = useRef(null);

  // 1. Fetch Interview Session on mount
  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/interview/${sessionId}`, {
          headers: getAuthHeaders()
        });
        const data = await res.json();
        
        if (data.success) {
          const session = data.interview;
          if (session.status === 'completed') {
            navigate(`/results/${session._id}`);
            return;
          }
          setInterview(session);
          
          // Find the current active question index (first empty answer)
          const activeIdx = session.questions.findIndex(q => q.answerText === '');
          const currentIdx = activeIdx === -1 ? 0 : activeIdx;
          setCurrentQuestionIdx(currentIdx);
          
          // If we had a previously graded question, display its feedback
          if (currentIdx > 0) {
            const prevQ = session.questions[currentIdx - 1];
            setPrevFeedback({
              score: prevQ.score,
              feedback: prevQ.feedback
            });
          }
        } else {
          setError(data.message || 'Failed to load interview session');
        }
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Failed to connect to backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  // 2. Typing Effect when question changes
  useEffect(() => {
    if (!interview || interview.questions.length === 0) return;
    const currentQText = interview.questions[currentQuestionIdx]?.questionText || '';
    
    // Clear existing timer
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    
    setTypedQuestionText('');
    let idx = 0;
    
    // If the question is very long, speed up character typing
    const typingInterval = currentQText.length > 150 ? 10 : 20;

    typingTimerRef.current = setInterval(() => {
      setTypedQuestionText((prev) => prev + currentQText.charAt(idx));
      idx++;
      if (idx >= currentQText.length) {
        clearInterval(typingTimerRef.current);
      }
    }, typingInterval);

    // Reset question timer parameters
    setSecondsLeft(180);
    setElapsedSeconds(0);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [interview, currentQuestionIdx]);

  // 3. Question Timer countdown
  useEffect(() => {
    if (loading || submitting || !interview) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Time expired
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, submitting, interview, currentQuestionIdx]);

  // 4. Handle Webcam media access
  useEffect(() => {
    if (!cameraActive) {
      stopWebcam();
      return;
    }

    const startWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 },
          audio: false 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.warn('Webcam access denied or unavailable:', err);
        setCameraActive(false);
      }
    };

    startWebcam();

    return () => {
      stopWebcam();
    };
  }, [cameraActive]);

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // 5. Speech Recognition Setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        let finalTrans = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTrans) {
          setAnswerText((prev) => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + finalTrans);
        }
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error:', e.error);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  // 6. Answer Submission handler
  const handleSubmitAnswer = async () => {
    if (submitting) return;
    
    // Stop recording if active
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/v1/interview/${sessionId}/answer`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          answerText: answerText.trim() || '[No response provided]',
          durationSeconds: elapsedSeconds
        })
      });

      const data = await res.json();

      if (data.success) {
        // Save current evaluation to feedback banner
        setPrevFeedback({
          score: data.score,
          feedback: data.feedback
        });

        // Reset inputs
        setAnswerText('');

        if (data.isCompleted) {
          // Go to results page
          navigate(`/results/${sessionId}`);
        } else {
          // Update interview data and index
          setInterview(data.interview);
          const nextIdx = data.interview.questions.findIndex(q => q.answerText === '');
          setCurrentQuestionIdx(nextIdx !== -1 ? nextIdx : currentQuestionIdx + 1);
        }
      } else {
        setError(data.message || 'Failed to submit answer');
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Connection lost. Please try submitting again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (secondsLeft <= 30) return 'timer-box danger';
    if (secondsLeft <= 60) return 'timer-box warning';
    return 'timer-box';
  };

  if (loading) {
    return (
      <div className="page-loader">
        <span className="spinner spinner-lg"></span>
        <span className="loader-text">Loading interview environment...</span>
      </div>
    );
  }

  if (error && !interview) {
    return (
      <div className="main-content" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <div className="btn-danger" style={{ display: 'inline-block', padding: '1rem 2rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', fontWeight: 600 }}>
          {error}
        </div>
        <div>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = interview.questions[currentQuestionIdx];
  const progressPercent = Math.round((currentQuestionIdx / interview.questionCount) * 100);

  return (
    <div className="main-content">
      <div className="interview-layout">
        
        {/* LEFT COLUMN: Webcam & Waveform */}
        <div className="webcam-container">
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div className="webcam-feed">
              {cameraActive ? (
                <>
                  <div className="webcam-indicator">
                    <span className="recording-dot"></span>
                    <span>LIVE FEED</span>
                  </div>
                  <video ref={videoRef} autoPlay playsInline muted></video>
                </>
              ) : (
                <div className="webcam-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <span>Camera Feed Off</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Role: <strong style={{ color: 'var(--text-primary)' }}>{interview.role}</strong> ({interview.difficulty})
              </span>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => setCameraActive(!cameraActive)}
              >
                {cameraActive ? 'Turn Video Off' : 'Enable Camera'}
              </button>
            </div>
          </div>

          {/* Voice Input Waveform */}
          <div className="glass-panel audio-meter" style={{ padding: '1.25rem' }}>
            <span className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Voice Level Indicator</span>
              {isRecording && <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Transcribing Speech...</span>}
            </span>
            <div className="waveform">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className={`wave-bar ${isRecording ? 'active' : ''}`}
                  style={{ 
                    animationDelay: `${i * 0.05}s`,
                    height: isRecording ? `${Math.floor(Math.random() * 70) + 15}%` : '10%' 
                  }}
                ></div>
              ))}
            </div>
            
            <button 
              type="button" 
              className={`btn ${isRecording ? 'btn-danger' : 'btn-secondary'}`}
              onClick={toggleRecording}
              style={{ marginTop: '0.5rem', width: '100%', fontSize: '0.9rem' }}
            >
              {isRecording ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
                  Stop Recording
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                  Use Voice Answer (Speech-to-Text)
                </span>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Question & Answer */}
        <div className="question-panel">
          
          {/* Progress & Timer */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div className="session-metrics">
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                QUESTION {currentQuestionIdx + 1} OF {interview.questionCount}
              </span>
              <div className={getTimerClass()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{formatTime(secondsLeft)}</span>
              </div>
            </div>
            
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          {/* AI Question display */}
          <div className="glass-panel question-card">
            <h3 style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
              Interviewer
            </h3>
            <p className="question-text">
              {typedQuestionText}
            </p>
          </div>

          {/* User Response Form */}
          <div className="glass-panel response-card" style={{ padding: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="response-text">Your Answer</label>
              
              {isRecording && (
                <div className="voice-indicator" style={{ marginBottom: '0.5rem' }}>
                  <span className="recording-dot"></span>
                  <span>Listening... Speak into your microphone. Words are transcribed in real-time below.</span>
                </div>
              )}

              <textarea
                id="response-text"
                className="form-textarea"
                rows="6"
                placeholder="Type or dictate your answer here. Explain your thinking clearly..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                disabled={submitting}
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>

            {error && (
              <div className="btn-danger" style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {answerText.trim().split(/\s+/).filter(Boolean).length} words
              </span>
              <button
                className="btn btn-primary"
                onClick={handleSubmitAnswer}
                disabled={submitting || (answerText.trim() === '' && secondsLeft > 0)}
                style={{ minWidth: '160px' }}
              >
                {submitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="spinner"></span> AI Grading...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    Submit Response
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* AI Real-time Feedback Banner */}
          {prevFeedback && (
            <div className="realtime-feedback">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="feedback-header">Previous Answer Evaluation</span>
                <span style={{ 
                  fontWeight: 800, 
                  fontSize: '0.9rem', 
                  color: 'var(--color-primary)'
                }}>
                  Score: {prevFeedback.score}/10
                </span>
              </div>
              <p className="feedback-body">
                {prevFeedback.feedback}
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Transitional Modal during final grading */}
      {submitting && currentQuestionIdx + 1 === interview.questionCount && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <span className="spinner spinner-lg" style={{ margin: '0 auto 1.5rem auto' }}></span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Interview Completed!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              We are compiling the final evaluation report. Our AI engine is assessing your tech vocabulary, communication score, and general seniority performance. Please wait...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
