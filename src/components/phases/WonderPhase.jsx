// src/components/phases/WonderPhase.jsx
import React, { useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

const PARTICLES = ['📋', '📊', '🐝', '🏷️', '⭐', '🏆', '🎯', '💡', '⚖️', '✨'];

export default function WonderPhase({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    const segs = wonderNarration();
    narrate(segs);
    return () => stopAll();
  }, [narrate, stopAll]);

  function handleInvestigate() {
    stopAll();
    dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder' });
    dispatch({ type: 'SET_PHASE', payload: 'story' });
  }

  return (
    <div className="wonder-wrap">
      {/* Floating particles */}
      <div className="wonder-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="wonder-particle"
            style={{
              left: `${5 + (i * 9.5) % 90}%`,
              top: `${5 + (i * 7.5) % 80}%`,
              animationDelay: `${i * 0.6}s`,
              fontSize: `${1.1 + (i % 3) * 0.4}rem`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="wonder-content anim-slide-up">
        {/* Main hook card */}
        <div className="wonder-card glass-card">
          <div className="wonder-stadium-icon" aria-hidden="true">📋</div>
          <h1 className="wonder-title">The Big Request Mystery!</h1>

          <div className="wonder-number-display">
            <span className="wonder-num">40 × $6 + 8 × $25 ➔ Total Bill? ➔ Ignore 24°C!</span>
          </div>

          <div className="wonder-question-card">
            <p className="wonder-q">
              A client request lands on your desk: <strong className="wonder-em">40 dining chairs at $6 each</strong>, <strong className="wonder-em">8 banquet tables at $25 each</strong>, and an ambient room temperature of 24°C.
            </p>
            <p className="wonder-q">
              Can you tell what is <span className="wonder-highlight">given information</span> and what is the <span className="wonder-highlight">target unknown</span>, before anyone starts booking?
            </p>
          </div>

          {/* Mascot */}
          <div className="wonder-mascot-row">
            <Mascot mood="curious" message="Bzz! Great planners never calculate until they understand the facts and filter the noise!" size="sm" />
          </div>

          <button className="btn btn-primary btn-lg wonder-cta" onClick={handleInvestigate}>
            Start Investigation 🔍
          </button>
        </div>
      </div>
    </div>
  );
}
