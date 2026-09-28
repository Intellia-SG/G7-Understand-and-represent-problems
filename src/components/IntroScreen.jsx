// src/components/IntroScreen.jsx
import React from 'react';
import './IntroScreen.css';

const JOURNEY = [
  { num: '01', icon: '🔍', label: 'Wonder',   desc: 'Spark curiosity with a quick sketch' },
  { num: '02', icon: '📖', label: 'Story',    desc: 'Understand before you calculate' },
  { num: '03', icon: '🧪', label: 'Simulate', desc: '3 interactive math labs' },
  { num: '04', icon: '🎮', label: 'Practice', desc: '10 game worlds & challenges' },
  { num: '05', icon: '📓', label: 'Reflect',  desc: 'Review, scorecard & badges' },
];

export default function IntroScreen({ state, dispatch }) {
  const hasSaved = state?.phaseComplete && Object.values(state.phaseComplete).some(Boolean);

  function startFresh() {
    dispatch({ type: 'START_JOURNEY' });
  }

  function resumeSession() {
    dispatch({ type: 'SET_PHASE', payload: state.savedPhase || 'wonder' });
  }

  return (
    <div className="intro-wrap">
      {/* Audio Toggle in the TOP-LEFT corner on every screen */}
      <button
        type="button"
        className={`intro-audio-btn audio-toggle-btn ${!state?.audioEnabled ? 'muted' : ''}`}
        onClick={() => dispatch({ type: 'TOGGLE_AUDIO' })}
        aria-label={state?.audioEnabled ? 'Mute audio' : 'Unmute audio'}
        title={state?.audioEnabled ? 'Audio is ON (Click to Mute)' : 'Audio is OFF (Click to Unmute)'}
      >
        <span className="audio-icon">{state?.audioEnabled ? '🔊' : '🔇'}</span>
        <span className="audio-text">{state?.audioEnabled ? 'Audio ON' : 'Audio OFF'}</span>
      </button>

      {/* Top Curriculum Badge */}
      <div className="intro-top-badge">
        ✨ MOE Curriculum · Understand &amp; Represent Problems Grade 7
      </div>

      {/* Main Title */}
      <h1 className="intro-title">
        <span className="text-orange">Understand</span> <span className="text-white">&amp; Represent Problems</span>
      </h1>
      <h2 className="intro-subtitle">
        Grade 7 Math · Master Unknowns, Bar Models, Tables &amp; Equations
      </h2>

      {/* Mascot Row */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-circle">🕵️</div>
        <div className="intro-speech-bubble">
          Hi! I'm Detective Zara. Ready to crack the case,<br />build bar models, and solve equations with confidence? 🔍📊
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Learn how to decode word problems, name mystery quantities with variables, draw clear bar models, spot table patterns, and translate everyday stories into math!
      </p>

      {/* Journey Card */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR LEARNING JOURNEY · CLICK ANY PHASE TO START</div>

        <div className="journey-steps-container">
          <div className="journey-row top-row">
            {JOURNEY.slice(0, 3).map((j, i) => (
              <React.Fragment key={j.num}>
                <div
                  className="journey-step-item clickable-step"
                  onClick={() => dispatch({ type: 'SET_PHASE', payload: j.label.toLowerCase() === 'practice' ? 'play' : j.label.toLowerCase() })}
                  role="button"
                  tabIndex={0}
                  title={`Click to open ${j.label} phase`}
                >
                  <span className="journey-icon-circle">{j.icon}</span>
                  <div className="journey-text-col">
                    <span className="journey-item-title">{j.label}</span>
                    <span className="journey-item-desc">{j.desc}</span>
                  </div>
                </div>
                <span className={`journey-arrow ${i === 2 ? 'fade-arrow' : ''}`}>→</span>
              </React.Fragment>
            ))}
          </div>

          <div className="journey-row bottom-row">
            {JOURNEY.slice(3, 5).map((j, i) => (
              <React.Fragment key={j.num}>
                <div
                  className="journey-step-item clickable-step"
                  onClick={() => dispatch({ type: 'SET_PHASE', payload: j.label.toLowerCase() === 'practice' ? 'play' : j.label.toLowerCase() })}
                  role="button"
                  tabIndex={0}
                  title={`Click to open ${j.label} phase`}
                >
                  <span className="journey-icon-circle">{j.icon}</span>
                  <div className="journey-text-col">
                    <span className="journey-item-title">{j.label}</span>
                    <span className="journey-item-desc">{j.desc}</span>
                  </div>
                </div>
                {i === 0 && <span className="journey-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="intro-actions">
        <button className="btn btn-primary btn-lg" onClick={startFresh}>
          Begin Journey 🚀
        </button>

        {hasSaved && (
          <button className="btn btn-resume btn-lg" onClick={resumeSession}>
            Resume Session 🔄
          </button>
        )}
      </div>
    </div>
  );
}
