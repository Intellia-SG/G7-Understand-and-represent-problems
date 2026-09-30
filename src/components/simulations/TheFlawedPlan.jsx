// src/components/simulations/TheFlawedPlan.jsx
// Station 4: Error-Detective (TRD §6 / PRD §8.3)
// A rival junior planner submitted a flawed plan with one seeded mistake. Find and fix it!

import React, { useState } from 'react';
import PlanVisual from '../shared/PlanVisual.jsx';
import './Stations.css';

const FLAWED_CASES = [
  {
    id: 'flaw_1',
    title: 'Case 1: Swapped Units',
    errorCategory: 'swapped-comparison',
    problemText: 'At a corporate awards gala, the Ballroom seats 3 times as many people as the Terrace. Together they hold 80 guests. How many seats are in the Terrace?',
    rivalNote: "Rival says: 'Ballroom gets 1 unit and Terrace gets 3 units.'",
    flawedVisualType: 'bar-model-comparison',
    flawedVisualData: {
      quantityA: { label: 'Ballroom', units: 1, value: 20 },
      quantityB: { label: 'Terrace', units: 3, value: 60, isUnknown: true },
      totalBracket: { label: 'Total = 80 guests' }
    },
    errorSpots: [
      { id: 'spot_a', label: 'The total of 80 guests is wrong' },
      { id: 'spot_b', label: 'The units are swapped: Ballroom should have 3 units, Terrace 1 unit' },
      { id: 'spot_c', label: 'A table should have been used instead' }
    ],
    correctSpotId: 'spot_b',
    fixExplanation: 'Ballroom accommodates 3 times as many, so Ballroom must have 3 units and Terrace 1 unit!'
  },
  {
    id: 'flaw_2',
    title: 'Case 2: Trapped Noise',
    errorCategory: 'noise-included',
    problemText: 'A banquet host orders 40 cupcakes at $3 each. The party begins at 7:00 PM. How much do the cupcakes cost in total?',
    rivalNote: "Rival says: 'I wrote the plan equation as: 40 × 3 + 7 = 127.'",
    flawedVisualType: 'bar-model-part-whole',
    flawedVisualData: {
      whole: { label: 'Total Calculated Cost', value: '$127' },
      parts: [
        { label: 'Cupcakes (40 × $3)', value: '$120', percent: 60 },
        { label: 'Start Time (7:00 PM)', value: '$7', percent: 40, isUnknown: false }
      ]
    },
    errorSpots: [
      { id: 'spot_a', label: 'Start time (7:00 PM) was mistakenly added into the dollar budget!' },
      { id: 'spot_b', label: 'The number of cupcakes should be 7' },
      { id: 'spot_c', label: 'Cupcakes cannot be multiplied by $3' }
    ],
    correctSpotId: 'spot_a',
    fixExplanation: 'Start time (7:00 PM) is an irrelevant detail. It has nothing to do with cupcake costs!'
  },
  {
    id: 'flaw_3',
    title: 'Case 3: Forced Bar Model',
    errorCategory: 'forced-bar-algebra-needed',
    problemText: 'A guest count is increased by 15, and the result is 3 more than twice the original count. How many guests were there initially?',
    rivalNote: "Rival says: 'I tried to draw a simple part-whole bar, but parts overlap with unknown multiples!'",
    flawedVisualType: 'bar-model-part-whole',
    flawedVisualData: {
      whole: { label: 'Unknown Total (?)', value: 'Overlapping Parts' },
      parts: [
        { label: 'Original Count', value: '?', percent: 30, isUnknown: true },
        { label: 'Plus 15', value: '15', percent: 30 },
        { label: 'Twice Original + 3', value: '2 × ? + 3', percent: 40, isUnknown: true }
      ]
    },
    errorSpots: [
      { id: 'spot_a', label: 'Bars cannot balance overlapping unknowns. Switch to algebra: let n = original count.' },
      { id: 'spot_b', label: 'Use a larger drawing paper' },
      { id: 'spot_c', label: 'Just guess the number 15' }
    ],
    correctSpotId: 'spot_a',
    fixExplanation: 'When the unknown appears on both sides, bars break down. This is the algebra bridge: let n = original count!'
  }
];

export default function TheFlawedPlan({ onComplete, audioEnabled = true }) {
  const [caseIdx, setCaseIdx] = useState(0);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [solvedCases, setSolvedCases] = useState([false, false, false]);
  const [feedback, setFeedback] = useState(null);

  const activeCase = FLAWED_CASES[caseIdx];

  function handleSelectSpot(spotId) {
    setSelectedSpotId(spotId);
    setFeedback(null);
  }

  function handleAudit() {
    if (!selectedSpotId) {
      setFeedback({ ok: false, msg: '⚠️ Select an option below to flag the rival flaw!' });
      return;
    }

    if (selectedSpotId === activeCase.correctSpotId) {
      const updated = [...solvedCases];
      updated[caseIdx] = true;
      setSolvedCases(updated);
      setFeedback({
        ok: true,
        msg: `🕵️ Spot On! ${activeCase.fixExplanation}`
      });
    } else {
      setFeedback({
        ok: false,
        msg: 'Not quite the flaw. Reread the request and look for swapped units, noise, or broken bar logic!'
      });
    }
  }

  function handleReset() {
    setSelectedSpotId(null);
    setFeedback(null);
  }

  function nextCase() {
    if (caseIdx < FLAWED_CASES.length - 1) {
      setCaseIdx(prev => prev + 1);
      setSelectedSpotId(null);
      setFeedback(null);
    }
  }

  const allSolved = solvedCases.every(Boolean);

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🔍 Station D: The Flawed Plan</h3>
        <div className="station-target-box">
          <span className="station-target-label">Cases Solved:</span>
          <span className="station-target-num">{solvedCases.filter(Boolean).length}/3</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Case Tabs, Problem Story, Flaw Spot Options & Actions */}
        <div className="station-col-left">
          {/* Case Navigation Tabs */}
          <div className="rounds-nav-bar">
            {FLAWED_CASES.map((c, idx) => (
              <button
                key={c.id}
                className={`round-step-btn ${caseIdx === idx ? 'current' : ''} ${solvedCases[idx] ? 'completed' : ''}`}
                onClick={() => {
                  setCaseIdx(idx);
                  setSelectedSpotId(null);
                  setFeedback(null);
                }}
              >
                <span>{solvedCases[idx] ? '✓' : idx + 1}</span> {c.title}
              </button>
            ))}
          </div>

          {/* Problem Prompt & Rival Quote */}
          <div className="station-story-box glass-card">
            <div className="story-tag">📋 Case File: {activeCase.title}</div>
            <p className="story-text">{activeCase.problemText}</p>
            <div className="rival-quote-callout">
              <strong>Rival Note:</strong> "{activeCase.rivalNote}"
            </div>
          </div>

          {/* Flaw Options */}
          <div className="station-tabs-row">
            <span className="station-tabs-label">What is the flaw in the rival's plan?</span>
            <div className="spot-steps-list">
              {activeCase.errorSpots.map(spot => {
                const isSelected = selectedSpotId === spot.id;
                const isCorrect = isSelected && feedback?.ok;
                const isWrong = isSelected && feedback && !feedback.ok;

                return (
                  <button
                    key={spot.id}
                    className={`spot-step-card ${isCorrect ? 'selected-error' : isWrong ? 'selected-wrong-guess' : ''}`}
                    onClick={() => handleSelectSpot(spot.id)}
                  >
                    <span>{isSelected ? (isCorrect ? '✅' : '❌') : '🔍'}</span>
                    <span>{spot.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="station-actions">
            <button className="btn-outline" onClick={handleReset}>
              Reset
            </button>
            <button className="btn-primary" onClick={handleAudit}>
              Audit Plan 🔍
            </button>
            {solvedCases[caseIdx] && caseIdx < FLAWED_CASES.length - 1 && (
              <button className="btn-primary" onClick={nextCase}>
                Next Case →
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Flawed Model Visual, Feedback & Completion */}
        <div className="station-col-right">
          {/* Flawed Visual Stage */}
          <div className="flawed-visual-stage glass-card">
            <div className="flaw-warning-banner">
              ⚠️ RIVAL'S FLAWED DRAFT · AUDIT CAREFULLY
            </div>
            <div className="visual-display-area">
              <PlanVisual
                type={activeCase.flawedVisualType}
                data={activeCase.flawedVisualData}
                compact={true}
              />
            </div>
          </div>

          {/* Feedback Box */}
          {feedback && (
            <div className={`quiz-feedback-box ${feedback.ok ? 'success' : 'retry'}`}>
              {feedback.msg}
            </div>
          )}

          {/* Completion Banner */}
          {allSolved ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🏆</span>
                <p className="station-success-msg">
                  All 3 Rival Flaws Neutralized! Master Planner Status Achieved!
                </p>
              </div>
              <div className="station-success-actions">
                <button className="btn-green" onClick={onComplete}>
                  Complete Station ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="station-guide-card">
              <span className="station-guide-text">
                Catch the flaw in all 3 rival cases to restore quality to the event studio!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
