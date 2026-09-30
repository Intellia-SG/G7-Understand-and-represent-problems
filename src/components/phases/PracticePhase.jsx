// src/components/phases/PracticePhase.jsx
// Phase 4: Practice (Named "Practice" in UI per user instructions)
// 10 event-planning worlds from WORLDS config, using questionBank.js and PlanVisual.jsx

import React, { useState, useEffect, useRef } from 'react';
import './PracticePhase.css';
import { WORLDS } from '../../config/worlds.config.js';
import { getQuestionsForWorld } from '../../data/questionBank.js';
import PlanVisual from '../shared/PlanVisual.jsx';
import FeedbackOverlay from '../shared/FeedbackOverlay.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { MASCOT } from '../../config/characters.config.js';

export function PracticeWorldSelect({ worldResults = [], onPlayWorld, onGoReflect }) {
  const totalStars = worldResults.reduce((a, b) => a + (b || 0), 0);
  const allCompleted = worldResults.length === 10 && worldResults.every(r => r != null && r > 0);

  return (
    <div className="practice-wrap">
      <div className="practice-worlds-card glass-card anim-slide-up">
        {/* Top Header Row */}
        <div className="practice-header-row">
          <div className="practice-title-group">
            <span className="practice-title-icon">🎮</span>
            <div>
              <h2 className="practice-main-title">Event Studio Practice Worlds</h2>
              <span className="practice-sub-title">10 Themed Client Worlds · Need 4/10 Correct to Unlock Next</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="practice-stats-pill">
              <span className="text-amber-400">⭐</span>
              <span>{totalStars} / 30</span>
            </div>

            {allCompleted && (
              <button className="btn btn-primary btn-md" onClick={onGoReflect}>
                Go to Reflect 📓
              </button>
            )}
          </div>
        </div>

        {/* 10 Worlds Grid */}
        <div className="practice-worlds-grid">
          {WORLDS.map((w, idx) => {
            const isUnlocked = idx === 0 || (worldResults[idx - 1] != null && worldResults[idx - 1] > 0);
            const stars = worldResults[idx];

            return (
              <div
                key={w.id}
                onClick={() => isUnlocked && onPlayWorld(idx)}
                className={`world-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                style={{
                  borderTop: isUnlocked ? `4px solid ${w.accent}` : undefined
                }}
              >
                <div className="world-top-tag">
                  <span className="world-badge">W{idx + 1}</span>
                  <span className="world-range">{w.range}</span>
                </div>

                <span className="world-icon">{isUnlocked ? w.emoji : '🔒'}</span>

                <span className="world-name">{w.name}</span>

                <div className="world-boss-preview" style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px' }}>
                  Boss: {w.boss?.emoji} {w.boss?.name}
                </div>

                <div className="world-stars">
                  {isUnlocked ? (
                    stars != null && stars > 0 ? (
                      '★'.repeat(stars) + '☆'.repeat(3 - stars)
                    ) : (
                      <span className="text-xs text-emerald-400 font-bold">Start Plan →</span>
                    )
                  ) : (
                    <span className="text-xs text-slate-400 font-bold">Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function PracticeQuiz({ worldIndex, state, dispatch, onBackToWorlds }) {
  const world = WORLDS[worldIndex] || WORLDS[0];
  const { sounds } = useAudio(state?.audioEnabled ?? true);

  const questions = useRef(getQuestionsForWorld(worldIndex)).current;
  const [qIndex, setQIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const timerRef = useRef(null);
  const currentQ = questions[qIndex] || questions[0];

  useEffect(() => {
    setSelectedIdx(null);
    setFeedback(null);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [qIndex, worldIndex]);

  function restartQuiz() {
    setQIndex(0);
    setLives(3);
    setStreak(0);
    setCorrectCount(0);
    setSelectedIdx(null);
    setFeedback(null);
  }

  function handleOptionClick(optStr, idx) {
    if (selectedIdx != null || lives <= 0 || feedback != null) return;
    setSelectedIdx(idx);

    const isCorrect = optStr === currentQ.correctAnswer;
    let nextLives = lives;
    let nextCorrect = correctCount;

    if (isCorrect) {
      nextCorrect += 1;
      setCorrectCount(nextCorrect);
      setStreak(s => s + 1);
      sounds.correct();
      dispatch({ type: 'ADD_XP', payload: 10 + streak * 2 });

      setFeedback({
        isCorrect: true,
        title: 'Plan Approved! 🎉',
        explanation: currentQ.explanation
      });
    } else {
      nextLives -= 1;
      setLives(nextLives);
      setStreak(0);
      sounds.wrong();

      setFeedback({
        isCorrect: false,
        title: 'Planning Revision Needed!',
        explanation: currentQ.explanation
      });
    }

    // Auto proceed after 1.8s
    timerRef.current = setTimeout(() => {
      setFeedback(null);
      if (nextLives > 0) {
        if (qIndex < questions.length - 1) {
          setQIndex(i => i + 1);
        } else {
          // Finished world (10 questions completed)
          let earnedStars = 0;
          if (nextCorrect >= 8) earnedStars = 3;
          else if (nextCorrect >= 6) earnedStars = 2;
          else if (nextCorrect >= 4) earnedStars = 1;

          sounds.levelUp();
          dispatch({
            type: 'RECORD_WORLD_SCORE',
            payload: { worldIndex, stars: earnedStars }
          });
          onBackToWorlds();
        }
      }
    }, 1800);
  }

  const isGameOver = lives <= 0;
  const progressPercent = Math.round(((qIndex + 1) / Math.max(questions.length, 1)) * 100);

  return (
    <div className="practice-wrap">
      {/* Instant Feedback Overlay */}
      {feedback && !isGameOver && (
        <FeedbackOverlay
          isCorrect={feedback.isCorrect}
          title={feedback.title}
          explanation={feedback.explanation}
          onContinue={() => {
            if (timerRef.current) clearTimeout(timerRef.current);
            setFeedback(null);
            if (lives > 0) {
              if (qIndex < questions.length - 1) setQIndex(i => i + 1);
              else onBackToWorlds();
            }
          }}
        />
      )}

      <div className="quiz-card glass-card anim-slide-up">
        {/* Top bar with back button & HUD */}
        <div className="quiz-top-bar">
          <button className="btn btn-outline btn-sm" onClick={onBackToWorlds}>
            ← Worlds
          </button>

          <span className="quiz-world-tag">
            {world.emoji} {world.name} (Q{qIndex + 1}/10)
          </span>

          <div className="quiz-hud">
            <div className="quiz-hud-pill">
              <span>⭐</span>
              <span>{correctCount * 10} XP</span>
            </div>

            <div className="quiz-hud-pill">
              {[1, 2, 3].map(h => (
                <span key={h}>{h <= lives ? '❤️' : '🖤'}</span>
              ))}
            </div>

            <div className="quiz-hud-pill">
              <span>🔥</span>
              <span>{streak}x</span>
            </div>
          </div>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {isGameOver ? (
          <div className="out-of-hearts-box anim-bounce-in">
            <span className="out-of-hearts-emoji">🐝</span>
            <h3 className="out-of-hearts-title">Planning Revision Needed!</h3>
            <p className="body-text text-secondary max-w-md">
              {MASCOT.name} says: "Don't fret! Great event directors inspect their plans and try again. Reread the request and let's go!"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button className="btn btn-primary btn-md" onClick={restartQuiz}>
                🔁 Retry World
              </button>
              <button className="btn btn-outline btn-md" onClick={onBackToWorlds}>
                🚪 Return to Worlds
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Question Card */}
            <div className="quiz-question-box">
              <div className="quiz-rule-pill">
                ✦ Focus: {world.description}
              </div>

              {/* Render PlanVisual if question has visual data */}
              {currentQ.visualData && (
                <div className="my-3">
                  <PlanVisual
                    type={currentQ.visual}
                    data={currentQ.visualData}
                    compact={true}
                  />
                </div>
              )}

              <p className="quiz-prompt-text" style={{ whiteSpace: 'pre-line' }}>
                {currentQ.questionText}
              </p>
            </div>

            {/* 4 Answer Options */}
            <div className="quiz-options-grid">
              {currentQ.options.map((opt, idx) => {
                let statusClass = '';
                if (selectedIdx != null) {
                  if (opt === currentQ.correctAnswer) statusClass = 'correct';
                  else if (idx === selectedIdx) statusClass = 'wrong';
                  else statusClass = 'dimmed';
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedIdx != null}
                    onClick={() => handleOptionClick(opt, idx)}
                    className={`quiz-option-btn ${statusClass}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PracticePhase({ state, dispatch }) {
  const [activeWorld, setActiveWorld] = useState(null);

  if (activeWorld !== null) {
    return (
      <PracticeQuiz
        worldIndex={activeWorld}
        state={state}
        dispatch={dispatch}
        onBackToWorlds={() => setActiveWorld(null)}
      />
    );
  }

  return (
    <PracticeWorldSelect
      worldResults={state?.worldResults || Array(10).fill(null)}
      onPlayWorld={(idx) => setActiveWorld(idx)}
      onGoReflect={() => {
        dispatch({ type: 'COMPLETE_PHASE', payload: 'play' });
        dispatch({ type: 'SET_PHASE', payload: 'reflect' });
      }}
    />
  );
}
