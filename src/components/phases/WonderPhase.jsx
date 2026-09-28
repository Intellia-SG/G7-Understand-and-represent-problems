// src/components/phases/WonderPhase.jsx
import React, { useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

const PARTICLES = ['🔍', '📊', 'b', 'x', '11', '⭐', '💡', '✨', '📝', '❓'];

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
      {/* Floating background particles */}
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
          <div className="wonder-stadium-icon" aria-hidden="true">🔍</div>
          <h1 className="wonder-title headline">Can a Quick Sketch Beat a Quick Guess?</h1>

          <div className="wonder-number-display">
            <span className="number-display wonder-num">Book + Bookmark = $11 · Book = Bookmark + $10</span>
          </div>

          <div className="wonder-question-card">
            <p className="body-text wonder-q">
              A book and a bookmark cost <strong className="wonder-em">$11 together</strong>, and the book costs exactly <strong className="wonder-em">$10 more</strong> than the bookmark.
            </p>
            <p className="body-text wonder-q">
              Most people blurt out that the bookmark costs <span className="wonder-highlight">$1</span>, but a quick bar sketch reveals something surprising! How can we represent it to get the right answer every time?
            </p>
          </div>

          {/* Mascot */}
          <div className="wonder-mascot-row">
            <Mascot mood="curious" message="Let's investigate how sketches and equations uncover the truth!" size="sm" />
          </div>

          <button className="btn btn-primary btn-lg wonder-cta" onClick={handleInvestigate}>
            Start Investigation 🔍
          </button>
        </div>
      </div>
    </div>
  );
}
