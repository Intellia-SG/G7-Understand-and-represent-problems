// src/components/phases/ReflectPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import './ReflectPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { reflectNarration } from '../../utils/narration.js';
import { BADGES } from '../../utils/badgeEngine.js';

const REFLECT_QUESTIONS = [
  {
    q: "1. When reading a word problem, what are the three detective questions?",
    options: [
      "What is Given? What is Asked? How are quantities Related?",
      "How long is the problem? How many words does it have?",
      "Can I guess the answer right away?"
    ],
    correct: 0
  },
  {
    q: "2. In an algebraic equation like 2n + 3 = 17, what does the letter 'n' represent?",
    options: [
      "A variable that stands for the mystery unknown quantity",
      "Just the name of a character in the story",
      "A fixed number that is always 1"
    ],
    correct: 0
  },
  {
    q: "3. What is the golden final step after calculating an answer?",
    options: [
      "Check if the answer fits all the clues and makes sense in the story",
      "Immediately close the book without reading it back",
      "Add 10 to the answer just in case"
    ],
    correct: 0
  }
];

export default function ReflectPhase({ state, dispatch }) {
  const [answers, setAnswers] = useState({});
  const [journal, setJournal] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled ?? true);
  const narrated = useRef(false);

  const totalStars = state?.worldResults?.reduce((a, b) => a + (b || 0), 0) || 0;
  const xp = state?.xp || 0;
  const bestStreak = state?.maxStreak || 0;

  useEffect(() => {
    if (!narrated.current) {
      narrated.current = true;
      narrate(reflectNarration());
    }
    dispatch({ type: 'COMPLETE_PHASE', payload: 'reflect' });
    return () => stopAll();
  }, [dispatch, narrate, stopAll]);

  function handleSelectOption(qIdx, optIdx) {
    sounds.click();
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  }

  function handleSubmit() {
    setSubmitted(true);
    stopAll();
    sounds.badge();
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch { /* ignore */ }
  }

  function playAgain() {
    dispatch({ type: 'RESET_SESSION' });
    dispatch({ type: 'SET_PHASE', payload: 'intro' });
  }

  const earnedBadges = BADGES.filter(b => state?.badges?.includes(b.id));

  if (submitted) {
    return (
      <div className="reflect-wrap">
        <div className="trophy-card glass-card anim-bounce-in">
          <div className="trophy-icon">🏆</div>
          <h1 className="trophy-title headline">Grand Problem Solving Master!</h1>
          <p className="trophy-sub subheadline">
            Understand &amp; Represent Problems Mastery Complete ✅
          </p>

          <div className="trophy-stats-grid">
            <div className="trophy-stat-item">
              <span className="trophy-stat-val">{xp}</span>
              <span className="trophy-stat-lbl">Total XP Earned</span>
            </div>
            <div className="trophy-stat-item">
              <span className="trophy-stat-val">{totalStars} / 30</span>
              <span className="trophy-stat-lbl">Stars Collected</span>
            </div>
            <div className="trophy-stat-item">
              <span className="trophy-stat-val">{bestStreak}x</span>
              <span className="trophy-stat-lbl">Best Streak</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 my-2">
            <span className="text-sm font-bold text-amber-300">Badges Unlocked:</span>
            <div className="flex gap-3 flex-wrap justify-center">
              {earnedBadges.length > 0 ? (
                earnedBadges.map(b => (
                  <span key={b.id} className="bg-white/10 px-3 py-1 rounded-full text-sm font-bold border border-amber-400/40" title={b.description}>
                    {b.icon} {b.label}
                  </span>
                ))
              ) : (
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-bold border border-amber-400/40">
                  🏆 Master Detective
                </span>
              )}
            </div>
          </div>

          <button className="btn btn-primary btn-lg mt-4" onClick={playAgain}>
            Play Journey Again 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reflect-wrap">
      <div className="reflect-card glass-card anim-slide-up">
        {/* Header */}
        <div className="reflect-header">
          <span className="reflect-badge">PHASE 05 · REFLECT &amp; SCOREBOARD</span>
          <h1 className="reflect-title">Detective Case Reflection</h1>
          <p className="body-text text-secondary max-w-md">
            Consolidate what you've learned about uncovering clues, building bar models, tables, and equations!
          </p>
        </div>

        {/* 3 Stats Overview Cards */}
        <div className="reflect-stats-row">
          <div className="reflect-stat-box">
            <span className="text-2xl mb-1">✨</span>
            <span className="reflect-stat-val">{xp}</span>
            <span className="reflect-stat-lbl">Total XP</span>
          </div>

          <div className="reflect-stat-box">
            <span className="text-2xl mb-1">⭐</span>
            <span className="reflect-stat-val">{totalStars} / 30</span>
            <span className="reflect-stat-lbl">Total Stars</span>
          </div>

          <div className="reflect-stat-box">
            <span className="text-2xl mb-1">🔥</span>
            <span className="reflect-stat-val">{bestStreak}x</span>
            <span className="reflect-stat-lbl">Best Streak</span>
          </div>
        </div>

        {/* 10 Worlds Scoreboard */}
        <div className="flex flex-col gap-1 w-full">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider text-center">
            Practice World Results
          </span>
          <div className="reflect-worlds-row">
            {(state?.worldResults || Array(10).fill(null)).map((res, i) => (
              <div key={i} className="reflect-world-tile">
                <span className="text-slate-300">W{i + 1}</span>
                <span className="text-amber-400 mt-1">{res != null && res > 0 ? `${res}★` : '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reflection Questions */}
        <div className="reflect-quiz-container">
          <h3 className="font-display font-900 text-lg text-white">Review Challenge:</h3>

          {REFLECT_QUESTIONS.map((rq, qIdx) => (
            <div key={qIdx} className="reflect-q-item">
              <p className="reflect-q-text">{rq.q}</p>
              <div className="reflect-opt-row">
                {rq.options.map((opt, optIdx) => {
                  const isSelected = answers[qIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      className={`reflect-opt-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Journal Thought */}
        <div className="reflect-journal-section">
          <Mascot mood="thinking" message="What was your favorite strategy: bar models, tables, or equations?" size="sm" />
          <textarea
            className="reflect-textarea"
            placeholder="Type your detective notes here (optional)..."
            value={journal}
            onChange={e => setJournal(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-lg self-center" onClick={handleSubmit}>
          Complete Journey 🏆
        </button>
      </div>
    </div>
  );
}
