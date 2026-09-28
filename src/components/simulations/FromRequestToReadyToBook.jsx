// src/components/simulations/FromRequestToReadyToBook.jsx
// Station 3: Multi-Step / Composite Construction (TRD §6 / PRD §8.3)
// 4-step workflow: Given/Unknown -> Filter Noise -> Choose Tool -> State Next-Step Sentence (Do not solve)

import React, { useState } from 'react';
import PlanVisual from '../shared/PlanVisual.jsx';
import './Stations.css';

const FULL_REQUEST = {
  title: 'Annual Sports Dinner Catering',
  fullText: 'The graduation committee organizes a dinner for 60 athletes. The venue hall has a ceiling height of 4.5 meters. The catering package costs $18 per athlete, and there is a fixed $150 linen setup fee. How much is the total dinner catering bill?',
  clauses: [
    { id: 'c1', text: '60 athletes attending', role: 'given', label: 'Given Quantity' },
    { id: 'c2', text: 'Venue hall ceiling height is 4.5 meters', role: 'noise', label: 'Irrelevant Detail' },
    { id: 'c3', text: 'Catering package is $18 per athlete', role: 'given', label: 'Given Unit Cost' },
    { id: 'c4', text: 'Fixed $150 linen setup fee', role: 'given', label: 'Given Fixed Fee' },
    { id: 'c5', text: 'What is the total dinner catering bill?', role: 'unknown', label: 'Unknown Question' }
  ],
  correctTool: 'table',
  visualData: {
    columns: ['Athletes Count', 'Per-Athlete Cost ($)', 'Setup Fee ($)', 'Total Bill ($)'],
    rows: [
      ['60 athletes', '60 × $18 = $1,080', '$150', 'Next step: 60 × 18 + 150']
    ]
  },
  nextStepSentence: '60 × 18 + 150',
  distractorSentences: [
    '60 × 18 + 150 + 4.5',
    '60 + 18 + 150',
    '1,230 (This is evaluated, but we only state the plan sentence!)'
  ]
};

export default function FromRequestToReadyToBook({ onComplete, audioEnabled = true }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [markedClauses, setMarkedClauses] = useState({});
  const [filteredNoiseId, setFilteredNoiseId] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedNextStep, setSelectedNextStep] = useState(null);
  const [stepFeedback, setStepFeedback] = useState(null);

  // Step 1: Identify Given and Unknown
  function handleToggleClause(id) {
    setMarkedClauses(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    setStepFeedback(null);
  }

  function validateStep1() {
    const isUnknownMarked = markedClauses['c5'];
    const areGivensMarked = markedClauses['c1'] && markedClauses['c3'] && markedClauses['c4'];

    if (isUnknownMarked && areGivensMarked) {
      setStepFeedback({ ok: true, msg: '✨ Great! You identified what is Given and what is Unknown.' });
      setTimeout(() => {
        setCurrentStep(2);
        setStepFeedback(null);
      }, 1000);
    } else {
      setStepFeedback({
        ok: false,
        msg: 'Please mark the key facts (athletes, per-athlete rate, setup fee) and the unknown question.'
      });
    }
  }

  // Step 2: Cross out noise
  function handleSelectNoise(id) {
    setFilteredNoiseId(id);
    setStepFeedback(null);
  }

  function validateStep2() {
    if (filteredNoiseId === 'c2') {
      setStepFeedback({ ok: true, msg: '🎯 Noise filtered! Ceiling height has zero effect on catering bills.' });
      setTimeout(() => {
        setCurrentStep(3);
        setStepFeedback(null);
      }, 1000);
    } else {
      setStepFeedback({
        ok: false,
        msg: 'Look for a number that does not affect the catering cost at all.'
      });
    }
  }

  // Step 3: Choose Tool
  function handleSelectTool(toolKey) {
    setSelectedTool(toolKey);
    setStepFeedback(null);
  }

  function validateStep3() {
    if (selectedTool === 'table') {
      setStepFeedback({ ok: true, msg: '📊 Excellent choice! A table organizes composite per-unit and fixed charges cleanly.' });
      setTimeout(() => {
        setCurrentStep(4);
        setStepFeedback(null);
      }, 1000);
    } else {
      setStepFeedback({
        ok: false,
        msg: 'A multi-tier composite calculation is best organized using a structured table.'
      });
    }
  }

  // Step 4: Next-step number sentence
  function handleSelectNextStep(sentence) {
    setSelectedNextStep(sentence);
    setStepFeedback(null);
  }

  function validateStep4() {
    if (selectedNextStep === FULL_REQUEST.nextStepSentence) {
      setStepFeedback({
        ok: true,
        msg: '🎉 Perfect! The plan is formulated as "60 × 18 + 150" without solving it, ready to hand off for booking!'
      });
    } else {
      setStepFeedback({
        ok: false,
        msg: 'Remember: we state the plan sentence without noise and without evaluating early.'
      });
    }
  }

  const isComplete = currentStep === 4 && selectedNextStep === FULL_REQUEST.nextStepSentence;

  return (
    <div className="station-container anim-slide-up">
      <div className="station-header">
        <span className="station-badge">Station 3 · Composite Construction</span>
        <h2 className="station-title">From Request to Ready-to-Book 📝</h2>
        <p className="station-desc">
          Take a real client request through the 4-step planning pipeline: Understand facts, filter out noise, choose the representation, and state the next-step number sentence!
        </p>
      </div>

      {/* 4 Chained Pipeline Indicators */}
      <div className="pipeline-steps-bar">
        {[
          { num: 1, label: '1. Given & Unknown' },
          { num: 2, label: '2. Filter Noise' },
          { num: 3, label: '3. Build Model' },
          { num: 4, label: '4. Next-Step Sentence' }
        ].map(s => (
          <div key={s.num} className={`pipe-step ${currentStep === s.num ? 'active' : (currentStep > s.num ? 'done' : '')}`}>
            <span className="step-circle">{currentStep > s.num ? '✓' : s.num}</span>
            <span className="step-name">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Main Request Display */}
      <div className="station-story-box glass-card">
        <div className="story-tag">📋 Client Case File: {FULL_REQUEST.title}</div>
        <p className="story-text">"{FULL_REQUEST.fullText}"</p>
      </div>

      {/* STEP 1: Given & Unknown */}
      {currentStep === 1 && (
        <div className="pipeline-step-card glass-card anim-slide-up">
          <div className="step-card-header">
            <h4>Step 1: Mark All Relevant Facts and the Target Unknown:</h4>
            <p>Click on the statements to tag them as relevant clues to solve the problem.</p>
          </div>

          <div className="clauses-list">
            {FULL_REQUEST.clauses.map(c => (
              <button
                key={c.id}
                className={`clause-btn ${markedClauses[c.id] ? 'selected' : ''}`}
                onClick={() => handleToggleClause(c.id)}
              >
                <span className="checkbox-icon">{markedClauses[c.id] ? '☑' : '☐'}</span>
                <span>{c.text}</span>
              </button>
            ))}
          </div>

          <button className="btn btn-primary btn-md mt-4" onClick={validateStep1}>
            Confirm Facts &amp; Continue →
          </button>
        </div>
      )}

      {/* STEP 2: Filter Noise */}
      {currentStep === 2 && (
        <div className="pipeline-step-card glass-card anim-slide-up">
          <div className="step-card-header">
            <h4>Step 2: Spot and Filter Out the Irrelevant Noise Detail:</h4>
            <p>Click on the detail that has NO effect on the client's catering bill.</p>
          </div>

          <div className="clauses-list">
            {FULL_REQUEST.clauses.map(c => (
              <button
                key={c.id}
                className={`clause-btn ${filteredNoiseId === c.id ? 'noise-highlight' : ''}`}
                onClick={() => handleSelectNoise(c.id)}
              >
                <span className="noise-icon">{filteredNoiseId === c.id ? '🗑️' : '📄'}</span>
                <span>{c.text}</span>
              </button>
            ))}
          </div>

          <button className="btn btn-primary btn-md mt-4" onClick={validateStep2}>
            Cross Out Noise &amp; Continue →
          </button>
        </div>
      )}

      {/* STEP 3: Choose Tool */}
      {currentStep === 3 && (
        <div className="pipeline-step-card glass-card anim-slide-up">
          <div className="step-card-header">
            <h4>Step 3: Choose the Representation Strategy:</h4>
            <p>Which tool captures both the per-unit athlete cost and the fixed linen fee?</p>
          </div>

          <div className="tool-pill-group justify-center my-3">
            {[
              { id: 'bar-model-part-whole', label: 'Part-Whole Bar' },
              { id: 'table', label: 'Structured Table' },
              { id: 'diagram', label: 'Spatial Diagram' }
            ].map(t => (
              <button
                key={t.id}
                className={`station-tool-pill ${selectedTool === t.id ? 'active' : ''}`}
                onClick={() => handleSelectTool(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {selectedTool && (
            <div className="mt-3">
              <PlanVisual type="table" data={FULL_REQUEST.visualData} compact={false} />
            </div>
          )}

          <button className="btn btn-primary btn-md mt-4" onClick={validateStep3}>
            Confirm Representation &amp; Continue →
          </button>
        </div>
      )}

      {/* STEP 4: Next-Step Number Sentence */}
      {currentStep === 4 && (
        <div className="pipeline-step-card glass-card anim-slide-up">
          <div className="step-card-header">
            <h4>Step 4: Formulate the Next-Step Number Sentence:</h4>
            <p>Translate the representation into the mathematical plan (stop at the sentence, do not solve):</p>
          </div>

          <div className="quiz-options-grid my-3">
            {[FULL_REQUEST.nextStepSentence, ...FULL_REQUEST.distractorSentences].map((sentence, idx) => (
              <button
                key={idx}
                className={`quiz-option-btn ${selectedNextStep === sentence ? 'active' : ''}`}
                onClick={() => handleSelectNextStep(sentence)}
              >
                {sentence}
              </button>
            ))}
          </div>

          <button className="btn btn-primary btn-md mt-4" onClick={validateStep4}>
            Submit Plan Sentence 🚀
          </button>
        </div>
      )}

      {/* Feedback banner */}
      {stepFeedback && (
        <div className={`quiz-feedback-box ${stepFeedback.ok ? 'success' : 'retry'}`}>
          {stepFeedback.msg}
        </div>
      )}

      {/* Completion */}
      {isComplete && (
        <div className="station-success anim-bounce-in">
          <div className="success-content">
            <span className="success-icon">🎖️</span>
            <div>
              <h3>Booking Ready! Full Pipeline Executed!</h3>
              <p>You understood the facts, crossed out noise, built the model, and stated the exact next-step number sentence.</p>
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
