// src/components/IntroScreen.jsx
import React from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';

const JOURNEY = [
  { num: '01', icon: '🔍', label: 'Wonder',   desc1: 'Client request', desc2: 'signal alert', phaseKey: 'wonder' },
  { num: '02', icon: '📖', label: 'Story',    desc1: 'Rania, Vikram',  desc2: '& Buzz',       phaseKey: 'story' },
  { num: '03', icon: '🧪', label: 'Simulate', desc1: '4 interactive',  desc2: 'labs',         phaseKey: 'simulate' },
  { num: '04', icon: '🎮', label: 'Practice', desc1: '10 worlds',      desc2: '& bosses',     phaseKey: 'play' },
  { num: '05', icon: '📓', label: 'Reflect',  desc1: 'Review &',       desc2: 'scorecard',    phaseKey: 'reflect' },
];

export default function IntroScreen({ state, dispatch }) {
  const hasSaved = state?.phaseComplete && Object.values(state.phaseComplete).some(Boolean);

  function startFresh() {
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }

  function resumeSession() {
    dispatch({ type: 'SET_PHASE', payload: state.savedPhase || 'wonder' });
  }

  return (
    <div className="intro-wrap">
      {/* Top Pill Badge */}
      <div className="intro-top-badge">
        ✨ Curriculum · Understand and Represent Problems Grade 7
      </div>

      {/* Main Title */}
      <h1 className="intro-title">
        <span className="text-orange">Represent</span> <span className="text-white">Quest</span>
      </h1>
      <h2 className="intro-subtitle">
        Master Unknowns, Bar Models, Tables, Diagrams &amp; Trajectory Heuristics
      </h2>

      {/* Mascot Speech Bubble Row */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-circle">
          <span className="intro-mascot-emoji">🐝</span>
        </div>
        <div className="intro-speech-bubble">
          Hi! I'm Buzz. Client requests are complex! Understand every fact, filter the noise, formulate representations with <span className="intro-bubble-highlight">Part-Whole &amp; Comparison Models</span>, and calibrate plans to save the event! 📐✨
        </div>
      </div>

      {/* Learning Journey Card */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR LEARNING JOURNEY · CLICK ANY PHASE TO START</div>

        <div className="journey-steps-row">
          {JOURNEY.map((j, i) => (
            <React.Fragment key={j.num}>
              <div
                className="journey-step-item"
                onClick={() => dispatch({ type: 'SET_PHASE', payload: j.phaseKey })}
                role="button"
                tabIndex={0}
                title={`Click to open ${j.label} phase`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dispatch({ type: 'SET_PHASE', payload: j.phaseKey });
                  }
                }}
              >
                <span className={`journey-icon-circle phase-${j.label.toLowerCase()}`}>
                  {j.icon}
                </span>
                <div className="journey-text-col">
                  <span className="journey-item-title">{j.label}</span>
                  <span className="journey-item-desc">
                    {j.desc1}<br />{j.desc2}
                  </span>
                </div>
              </div>
              {i < JOURNEY.length - 1 && <span className="journey-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Begin Your Journey CTA Button */}
      <div className="intro-ctas">
        <button className="intro-cta-btn" onClick={startFresh}>
          🚀 Begin Your Journey!
        </button>
        {hasSaved && (
          <button className="intro-resume-btn" onClick={resumeSession}>
            ↩ Resume Session
          </button>
        )}
      </div>

      {/* Bottom Horizontal Badges */}
      <div className="intro-bottom-badges">
        <div className="intro-badge-pill">
          <span className="badge-icon">🎯</span>
          <span>100 Questions</span>
        </div>
        <div className="intro-badge-pill">
          <span className="badge-icon">📊</span>
          <span>Bar Models &amp; Tables</span>
        </div>
        <div className="intro-badge-pill">
          <span className="badge-icon">✨</span>
          <span>Badges &amp; XP</span>
        </div>
      </div>
    </div>
  );
}
