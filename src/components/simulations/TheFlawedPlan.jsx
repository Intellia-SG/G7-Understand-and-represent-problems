// src/components/simulations/TheFlawedPlan.jsx
// Station 4: Error-Detective (TRD §6 / PRD §8.3)
// A rival junior planner submitted a flawed plan with one seeded mistake. Find and fix it!

import React, { useState } from 'react';
import PlanVisual from '../shared/PlanVisual.jsx';
import './Stations.css';

const FLAWED_CASES = [
  {
    id: 'flaw_1',
    title: 'Case 1: The Swapped Comparison',
    errorCategory: 'swapped-comparison',
    problemText: 'At a corporate awards gala, the Ballroom seats 3 times as many people as the Terrace. Together they hold 80 guests. How many seats are in the Terrace?',
    rivalNote: "Rival Planner says: 'I drew a comparison bar: Ballroom gets 1 unit and Terrace gets 3 units.'",
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
    title: 'Case 2: The Trapped Irrelevant Detail',
    errorCategory: 'noise-included',
    problemText: 'A banquet host orders 40 cupcakes at $3 each. The party begins at 7:00 PM. How much do the cupcakes cost in total?',
    rivalNote: "Rival Planner says: 'I wrote the plan equation as: 40 × 3 + 7 = 127.'",
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
    title: 'Case 3: Forcing a Bar Model when Algebra is Needed',
    errorCategory: 'forced-bar-algebra-needed',
    problemText: 'A guest count is increased by 15, and the result is 3 more than twice the original count. How many guests were there initially?',
    rivalNote: "Rival Planner says: 'I tried to draw a simple part-whole bar, but the parts keep overlapping with unknown multiples!'",
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
      { id: 'spot_a', label: 'The bars won\'t balance: the unknown isn\'t a clean fraction of a whole. Switch to algebra: let n = original count.' },
      { id: 'spot_b', label: 'Use a larger drawing paper' },
      { id: 'spot_c', label: 'Just guess the number 15' }
    ],
    correctSpotId: 'spot_a',
    fixExplanation: 'When the unknown appears on both sides of a relationship, bar models break down. This is the algebra bridge: let n = original count!'
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
      setFeedback({ ok: false, msg: '⚠️ Tap or select the flawed element to flag the mistake!' });
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

  function nextCase() {
    if (caseIdx < FLAWED_CASES.length - 1) {
      setCaseIdx(prev => prev + 1);
      setSelectedSpotId(null);
      setFeedback(null);
    }
  }

  const allSolved = solvedCases.every(Boolean);

  return (
    <div className="station-container anim-slide-up">
      <div className="station-header">
        <span className="station-badge">Station 4 · Error-Detective</span>
        <h2 className="station-title">The Flawed Plan 🔍</h2>
        <p className="station-desc">
          A rival junior planner submitted an event proposal, but it has a fatal flaw! Inspect their representation, spot the error, and restore order to the event studio.
        </p>
      </div>

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
            <span>{solvedCases[idx] ? '✓' : idx + 1}</span> Case {idx + 1}
          </button>
        ))}
      </div>

      {/* Case Description Card */}
      <div className="station-story-box glass-card">
        <div className="story-tag">📋 Case File: {activeCase.title}</div>
        <p className="story-text">{activeCase.problemText}</p>
        <div className="rival-quote-callout">
          <strong>Rival Note:</strong> "{activeCase.rivalNote}"
        </div>
      </div>

      {/* Flawed Plan Visual */}
      <div className="flawed-visual-stage glass-card">
        <div className="flaw-warning-banner">
          ⚠️ <strong>Rival's Proposed Model (Contains Seeded Error):</strong>
        </div>
        <PlanVisual
          type={activeCase.flawedVisualType}
          data={activeCase.flawedVisualData}
          compact={false}
        />
      </div>

      {/* Detective Options */}
      <div className="flaw-spotter-card glass-card">
        <div className="quiz-question-title">
          🔎 <strong>Detective Inspection:</strong> What is the exact mistake in this rival plan?
        </div>

        <div className="quiz-options-grid my-3">
          {activeCase.errorSpots.map(spot => (
            <button
              key={spot.id}
              className={`quiz-option-btn ${selectedSpotId === spot.id ? 'active' : ''}`}
              onClick={() => handleSelectSpot(spot.id)}
            >
              {spot.label}
            </button>
          ))}
        </div>

        <div className="station-actions-row">
          <button className="btn btn-primary btn-md" onClick={handleAudit}>
            Flag Flaw &amp; Fix Plan 🛡️
          </button>

          {solvedCases[caseIdx] && caseIdx < FLAWED_CASES.length - 1 && (
            <button className="btn btn-secondary btn-md anim-bounce-in" onClick={nextCase}>
              Next Flawed Case →
            </button>
          )}
        </div>

        {feedback && (
          <div className={`quiz-feedback-box ${feedback.ok ? 'success' : 'retry'}`}>
            {feedback.msg}
          </div>
        )}
      </div>

      {/* Completion */}
      {allSolved && (
        <div className="station-success anim-bounce-in">
          <div className="success-content">
            <span className="success-icon">🎖️</span>
            <div>
              <h3>Master Detective Certified!</h3>
              <p>You caught all three critical planning traps: swapped units, irrelevant noise inclusion, and forced bar models where algebra is needed.</p>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={onComplete}>
            Complete Station ✓
          </button>
        </div>
      )}
    </div>
  );
}
