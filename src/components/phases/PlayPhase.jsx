// src/components/phases/PlayPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import './PlayPhase.css';
import QuestionRenderer from '../quiz/QuestionRenderer.jsx';
import BossBattleModal from '../quiz/BossBattleModal.jsx';
import FeedbackOverlay from '../shared/FeedbackOverlay.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { DISTRICTS } from '../../data/questionBank.js';
import { calcStars } from '../../utils/scoring.js';
import {
  playQuestionNarration,
  playCorrectNarration,
  playWrongNarration,
  playHint1Narration,
  playHint2Narration,
  districtCompleteNarration,
} from '../../utils/narration.js';

export default function PlayPhase({ state, dispatch }) {
  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled ?? true);
  const [showMap, setShowMap]       = useState(state?.currentQuestion === 0);
  const [hintsShown, setHintsShown] = useState(0);
  const [showHint, setShowHint]     = useState(false);
  const [showBoss, setShowBoss]     = useState(false);
  const [worldSummary, setWorldSummary] = useState(null);
  const feedbackTimer               = useRef(null);

  const qs = state?.questionSet || [];
  const qIdx = state?.currentQuestion || 0;
  const question = qs[qIdx];
  const distIdx = state?.currentDistrict || 0;
  const district = DISTRICTS[distIdx] || DISTRICTS[0];
  const qInDistrict = qIdx % 10;
  const isPlayDone = state?.phaseComplete?.play;

  const districtScores = state?.districtScores || Array(10).fill(null);
  const districtCorrect = state?.districtCorrect || Array(10).fill(0);

  const totalStars = districtScores.reduce((s, sc) => {
    if (sc === null || sc === undefined) return s;
    return s + calcStars(sc);
  }, 0);

  // Narrate question when question changes
  useEffect(() => {
    if (!showMap && !showBoss && !worldSummary && question && !state?.showFeedback) {
      const timer = setTimeout(() => {
        narrate(playQuestionNarration(question.questionText));
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [qIdx, showMap, showBoss, worldSummary, narrate, question, state?.showFeedback]);

  // Auto-dismiss popup after 2.2s
  useEffect(() => {
    if (state?.showFeedback) {
      feedbackTimer.current = setTimeout(() => {
        if (state?.showFeedback === 'correct') {
          dispatch({ type: 'CLEAR_FEEDBACK' });
          advanceQuestion();
        } else {
          handleAfterWrong();
        }
      }, 2200);
    }
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, [state?.showFeedback]);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      stopAll();
    };
  }, [stopAll]);

  function handleAnswer(answer) {
    stopAll();
    const isCorrect = String(answer).trim() === String(question.correctAnswer).trim();

    if (isCorrect) {
      sounds.correct();
      dispatch({ type: 'ANSWER_CORRECT' });
      narrate(playCorrectNarration((state?.streak || 0) + 1));
    } else {
      sounds.wrong();
      dispatch({ type: 'ANSWER_INCORRECT', payload: question.explanation });
      narrate(playWrongNarration());
      setHintsShown(0);
    }
  }

  function advanceQuestion() {
    setHintsShown(0);
    setShowHint(false);
    const nextIdx = qIdx + 1;

    if (nextIdx % 10 === 0 && nextIdx <= 100) {
      sounds.levelUp();
      narrate(districtCompleteNarration());
      dispatch({ type: 'NEXT_QUESTION' });
      const completedDist = Math.floor((nextIdx - 1) / 10);
      const score = (state?.districtCorrect?.[completedDist] || 0) + (state?.showFeedback === 'correct' ? 1 : 0);
      setWorldSummary({
        district: DISTRICTS[completedDist],
        score,
        stars: calcStars(score),
        isLast: nextIdx >= 100,
      });
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  }

  function handleShowHint() {
    stopAll();
    dispatch({ type: 'USE_HINT' });
    if (hintsShown === 0) {
      setShowHint(1);
      setHintsShown(1);
      narrate(playHint1Narration());
    } else {
      setShowHint(2);
      setHintsShown(2);
      narrate(playHint2Narration());
    }
  }

  function handleAfterWrong() {
    dispatch({ type: 'CLEAR_FEEDBACK' });
    advanceQuestion();
  }

  function handlePrevQuestion() {
    stopAll();
    dispatch({ type: 'CLEAR_FEEDBACK' });
    dispatch({ type: 'PREV_QUESTION' });
  }

  function handleNextQuestion() {
    stopAll();
    dispatch({ type: 'CLEAR_FEEDBACK' });
    advanceQuestion();
  }

  function startDistrict(idx) {
    stopAll();
    setWorldSummary(null);
    setShowMap(false);
    // If selecting a district different from current, update state
    if (idx !== distIdx) {
      dispatch({
        type: 'LOAD_QUESTIONS',
        payload: qs, // keep session questions
      });
      // Set question pointer to start of this district
      for (let i = 0; i < idx * 10; i++) {
        dispatch({ type: 'NEXT_QUESTION' });
      }
    }
    setTimeout(() => {
      narrate(playQuestionNarration(qs[idx * 10]?.questionText || ''));
    }, 400);
  }

  // World Complete Summary Modal
  if (worldSummary) {
    return (
      <div className="play-done-wrap">
        <div className="play-done-card glass-card anim-bounce-in">
          <div className="play-done-icon">🎉</div>
          <h2 className="play-done-title headline">{worldSummary.district.name} Completed!</h2>
          <div className="world-stars-display" style={{ fontSize: '2rem', color: '#f59e0b', margin: '8px 0' }}>
            {'★'.repeat(worldSummary.stars)}{'☆'.repeat(3 - worldSummary.stars)}
          </div>
          <div className="play-done-stats">
            <div className="stat-pill">
              <span>✅</span>
              <span>{worldSummary.score}/10 Correct</span>
            </div>
            <div className="stat-pill">
              <span>⭐</span>
              <span>{worldSummary.stars} Stars Earned</span>
            </div>
          </div>
          {worldSummary.score >= 4 ? (
            <p style={{ color: '#86efac', fontWeight: 800 }}>✨ Next World Unlocked!</p>
          ) : (
            <p style={{ color: '#fca5a5', fontWeight: 700 }}>Need 4/10 to unlock the next world. Try again!</p>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className="btn btn-primary play-done-cta"
              onClick={() => {
                setWorldSummary(null);
                setShowMap(true);
              }}
            >
              🗺️ Return to Game Worlds
            </button>
            {worldSummary.isLast && (
              <button
                className="btn btn-primary play-done-cta"
                onClick={() => dispatch({ type: 'SET_PHASE', payload: 'reflect' })}
              >
                🌟 Go to Reflect Phase
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Practice Hub (Worlds Grid Screen) — Matches Image 2 Exactly
  if (showMap) {
    const activeBoss = DISTRICTS[distIdx]?.boss || DISTRICTS[9]?.boss || { name: 'The Definition Keeper' };

    return (
      <div className="practice-hub-wrap">
        <div className="practice-hub-card glass-card anim-slide-up">
          {/* Top Neon Mint Accent Bar */}
          <div className="practice-hub-accent" />

          {/* Header Row */}
          <div className="practice-hub-header">
            <div className="practice-hub-title-group">
              <h2 className="practice-hub-title">Area Game Worlds</h2>
              <span className="practice-hub-subtitle">
                10 Themed Worlds · Need 4/10 Correct to Unlock Next World
              </span>
            </div>

            <div className="practice-hub-stars-badge">
              <span className="star-icon">⭐</span>
              <span className="star-count">{totalStars} / 30</span>
            </div>
          </div>

          {/* 10 Worlds Grid (2 rows x 5 columns) */}
          <div className="practice-hub-grid">
            {DISTRICTS.map((dist, idx) => {
              const isFirst = idx === 0;
              const prevScore = districtScores[idx - 1];
              const isUnlocked = isFirst || (prevScore !== null && prevScore !== undefined && prevScore >= 4);
              const isCompleted = districtScores[idx] !== null && districtScores[idx] !== undefined;
              const stars = isCompleted ? calcStars(districtScores[idx]) : 0;
              const isCurrent = idx === distIdx;

              return (
                <div
                  key={dist.id}
                  className={`practice-world-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent && !isCompleted ? 'active-world' : ''} ${isCompleted ? 'completed-world' : ''}`}
                  onClick={() => isUnlocked && startDistrict(idx)}
                  role="button"
                  tabIndex={isUnlocked ? 0 : -1}
                  title={isUnlocked ? `Play ${dist.name}` : `World locked: complete World ${idx} with at least 4/10`}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && isUnlocked) {
                      e.preventDefault();
                      startDistrict(idx);
                    }
                  }}
                >
                  {/* Top Row: W# on left, Q range on right */}
                  <div className="world-card-top">
                    <span className="world-tag-w">W{idx + 1}</span>
                    <span className="world-tag-q">{dist.range}</span>
                  </div>

                  {/* Center Icon */}
                  <div className="world-card-icon-area">
                    {isUnlocked ? (
                      isCurrent && !isCompleted ? (
                        <div className="world-radar-icon" aria-label="Active Radar">
                          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#00f5c4" strokeWidth="2">
                            <circle cx="12" cy="12" r="9" opacity="0.35" />
                            <circle cx="12" cy="12" r="5.5" opacity="0.75" />
                            <circle cx="12" cy="12" r="2.5" fill="#00f5c4" />
                          </svg>
                        </div>
                      ) : (
                        <span className="world-emoji-icon">{dist.emoji || dist.icon || '🎯'}</span>
                      )
                    ) : (
                      <span className="world-lock-icon">🔒</span>
                    )}
                  </div>

                  {/* World Name */}
                  <span className="world-card-name" title={dist.name}>
                    {dist.name}
                  </span>

                  {/* Bottom Action Status */}
                  <div className="world-card-bottom">
                    {isCompleted ? (
                      <span className="world-stars-stars">
                        {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
                      </span>
                    ) : isUnlocked ? (
                      <span className="world-action-play">Play →</span>
                    ) : (
                      <span className="world-action-locked">Locked</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Buttons */}
          <div className="practice-hub-actions">
            <button
              className="boss-battle-hub-btn"
              onClick={() => setShowBoss(true)}
              title="Challenge the Boss"
            >
              <span className="crown-icon">👑</span>
              <span>Boss Battle: {activeBoss.name || 'The Definition Keeper'}</span>
            </button>

            <button
              className="jump-reflect-btn"
              onClick={() => dispatch({ type: 'SET_PHASE', payload: 'reflect' })}
              title="Jump to Reflect phase"
            >
              <span className="jump-icon">📓</span>
              <span>Jump to Reflect Phase →</span>
            </button>
          </div>
        </div>

        {/* Boss Battle Modal */}
        {showBoss && (
          <BossBattleModal
            boss={district.boss || DISTRICTS[9].boss}
            questions={qs.slice(distIdx * 10, distIdx * 10 + 5)}
            onWin={() => {
              setShowBoss(false);
              dispatch({ type: 'UNLOCK_BADGE', payload: 'client_delighted' });
            }}
            onClose={() => setShowBoss(false)}
            audioEnabled={state?.audioEnabled}
          />
        )}
      </div>
    );
  }

  // Question Quiz Screen
  return (
    <div className="play-wrap">
      {/* Sleek Compact Top Bar: Topic Badge + HUD + Progress in one row */}
      <div className="play-top-bar">
        <div className="play-topic-compact">
          <span className="topic-name">
            <span className="topic-icon">{district.icon || district.emoji}</span> W{distIdx + 1}: {district.name}
          </span>
          <button
            className="topic-mini-btn map-btn"
            onClick={() => setShowMap(true)}
            title="Return to Worlds Hub"
          >
            🗺️ Worlds
          </button>
          <button
            className="topic-mini-btn boss-btn"
            onClick={() => setShowBoss(true)}
            title="Challenge World Boss"
          >
            👑 Boss
          </button>
        </div>

        <div className="play-hud-compact">
          <span className="hud-pill-mini">⭐ {state?.xp || 0}</span>
          <span className="hud-pill-mini">🔥 {state?.streak || 0}x</span>
          <span className="hud-pill-mini q-num">Q {qInDistrict + 1}/10</span>
        </div>
      </div>

      {/* Question Progress Mini Line */}
      <div className="play-progress-line">
        <div className="play-progress-fill" style={{ width: `${((qInDistrict + 1) / 10) * 100}%` }} />
      </div>

      {/* Question Renderer */}
      {question && (
        <div className="play-question-area">
          <QuestionRenderer
            question={question}
            onAnswer={handleAnswer}
            hintsShown={hintsShown}
            showHint={showHint}
            onHint={handleShowHint}
            isLocked={state?.showFeedback === 'correct'}
            onPrev={handlePrevQuestion}
            onNext={handleNextQuestion}
            canPrev={qInDistrict > 0}
          />
        </div>
      )}

      {/* Boss Battle Modal */}
      {showBoss && (
        <BossBattleModal
          boss={district.boss}
          questions={qs.slice(distIdx * 10, distIdx * 10 + 5)}
          onWin={() => {
            setShowBoss(false);
            dispatch({ type: 'UNLOCK_BADGE', payload: 'client_delighted' });
          }}
          onClose={() => setShowBoss(false)}
          audioEnabled={state?.audioEnabled}
        />
      )}

      {/* Feedback Overlay */}
      {state?.showFeedback && (
        <FeedbackOverlay
          isCorrect={state?.showFeedback === 'correct'}
          explanation={question?.explanation}
          onContinue={
            state?.showFeedback === 'correct'
              ? () => {
                  dispatch({ type: 'CLEAR_FEEDBACK' });
                  advanceQuestion();
                }
              : handleAfterWrong
          }
        />
      )}
    </div>
  );
}
