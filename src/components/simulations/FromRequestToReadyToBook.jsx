// src/components/simulations/FromRequestToReadyToBook.jsx
// Station 3: Multi-Step / Composite Construction (TRD §6 / PRD §8.3)
// 4-step workflow: Given/Unknown -> Filter Noise -> Choose Tool -> State Next-Step Sentence

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
    '60 × 18 + 150',
    '60 × 18 + 150 + 4.5',
    '60 + 18 + 150',
    '1,230 (This is evaluated early!)'
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
      }, 700);
    } else {
      setStepFeedback({
        ok: false,
        msg: 'Please mark the 3 key facts (athletes, $18/rate, $150 fee) and the question.'
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
      setStepFeedback({ ok: true, msg: '🎯 Noise filtered! Ceiling height has zero effect on the catering bill.' });
      setTimeout(() => {
        setCurrentStep(3);
        setStepFeedback(null);
      }, 700);
    } else {
      setStepFeedback({
        ok: false,
        msg: 'Look for the number detail that has nothing to do with food or linen costs.'
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
      setStepFeedback({ ok: true, msg: '📊 Excellent! A table organizes composite per-unit and fixed charges cleanly.' });
      setTimeout(() => {
        setCurrentStep(4);
        setStepFeedback(null);
      }, 700);
    } else {
      setStepFeedback({
        ok: false,
        msg: 'Multi-part rates ($18/person + $150 fixed) are best organized in a structured table.'
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
        msg: '🎉 Perfect! The plan sentence is "60 × 18 + 150" ready to hand off for booking!'
      });
    } else {
      setStepFeedback({
        ok: false,
        msg: 'Remember: state the plan sentence without noise and without solving early.'
      });
    }
  }

  const isComplete = currentStep === 4 && selectedNextStep === FULL_REQUEST.nextStepSentence;

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">📝 Station C: Ready-to-Book Pipeline</h3>
        <div className="station-target-box">
          <span className="station-target-label">Step:</span>
          <span className="station-target-num">{currentStep}/4</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Pipeline Bar, Story, Active Step Interactive & Actions */}
        <div className="station-col-left">
          {/* 4 Pipeline Steps Bar */}
          <div className="pipeline-steps-bar">
            {[
              { num: 1, label: '1. Facts' },
              { num: 2, label: '2. Filter' },
              { num: 3, label: '3. Tool' },
              { num: 4, label: '4. Plan' }
            ].map(s => (
              <div key={s.num} className={`pipe-step ${currentStep === s.num ? 'active' : (currentStep > s.num ? 'done' : '')}`}>
                <span className="step-circle">{currentStep > s.num ? '✓' : s.num}</span>
                <span className="step-name">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Client Case Prompt */}
          <div className="station-story-box glass-card">
            <div className="story-tag">📋 Case File: {FULL_REQUEST.title}</div>
            <p className="story-text">"{FULL_REQUEST.fullText}"</p>
          </div>

          {/* Active Step Content */}
          {currentStep === 1 && (
            <div className="pipeline-step-card glass-card">
              <div className="step-card-header">
                <h4>Step 1: Mark Relevant Facts &amp; Unknown Question:</h4>
                <p>Click items to check off facts needed to calculate the catering bill.</p>
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
            </div>
          )}

          {currentStep === 2 && (
            <div className="pipeline-step-card glass-card">
              <div className="step-card-header">
                <h4>Step 2: Spot and Filter Out the Noise Detail:</h4>
                <p>Click on the detail that has zero effect on the catering cost.</p>
              </div>
              <div className="clauses-list">
                {FULL_REQUEST.clauses.map(c => (
                  <button
                    key={c.id}
                    className={`clause-btn ${filteredNoiseId === c.id ? 'noise-highlight' : ''}`}
                    onClick={() => handleSelectNoise(c.id)}
                  >
                    <span>{filteredNoiseId === c.id ? '❌' : '🔎'}</span>
                    <span>{c.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="pipeline-step-card glass-card">
              <div className="step-card-header">
                <h4>Step 3: Select Best Representation Tool:</h4>
                <p>Choose the tool that best structures unit costs + fixed fees.</p>
              </div>
              <div className="clauses-list">
                {[
                  { id: 'table', label: '📋 Structured Multi-Tier Table (Recommended)' },
                  { id: 'bar-model-part-whole', label: '📊 Single Part-Whole Bar' },
                  { id: 'diagram', label: '🗺️ Spatial Room Diagram' }
                ].map(tool => (
                  <button
                    key={tool.id}
                    className={`clause-btn ${selectedTool === tool.id ? 'selected' : ''}`}
                    onClick={() => handleSelectTool(tool.id)}
                  >
                    <span>{selectedTool === tool.id ? '✓' : '○'}</span>
                    <span>{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="pipeline-step-card glass-card">
              <div className="step-card-header">
                <h4>Step 4: Select Next-Step Plan Sentence:</h4>
                <p>Pick the numerical sentence that states the plan without solving early.</p>
              </div>
              <div className="clauses-list">
                {FULL_REQUEST.distractorSentences.map(sent => (
                  <button
                    key={sent}
                    className={`clause-btn ${selectedNextStep === sent ? 'selected' : ''}`}
                    onClick={() => handleSelectNextStep(sent)}
                  >
                    <span>{selectedNextStep === sent ? '✓' : '○'}</span>
                    <span>{sent}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="station-actions">
            {currentStep > 1 && (
              <button className="btn-outline" onClick={() => setCurrentStep(prev => prev - 1)}>
                ← Back
              </button>
            )}
            {currentStep === 1 && (
              <button className="btn-primary" onClick={validateStep1}>
                Confirm Facts →
              </button>
            )}
            {currentStep === 2 && (
              <button className="btn-primary" onClick={validateStep2}>
                Filter Noise →
              </button>
            )}
            {currentStep === 3 && (
              <button className="btn-primary" onClick={validateStep3}>
                Confirm Tool →
              </button>
            )}
            {currentStep === 4 && (
              <button className="btn-primary" onClick={validateStep4}>
                Verify Sentence 🔍
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Accumulated Plan Board & Visual Stage */}
        <div className="station-col-right">
          {/* Accumulated Plan Summary Board */}
          <div className="plan-summary-board glass-card">
            <div className="summary-board-title">📋 Case Plan in Progress</div>
            <div className="summary-item">
              <span>📌</span>
              <div>
                <strong>Givens:</strong>{' '}
                {currentStep > 1 ? '60 athletes, $18/athlete, $150 fixed fee' : 'Pending selection...'}
              </div>
            </div>
            <div className="summary-item">
              <span>🗑️</span>
              <div>
                <strong>Noise Filtered:</strong>{' '}
                {currentStep > 2 ? '4.5m hall ceiling height removed' : 'Pending filter...'}
              </div>
            </div>
            <div className="summary-item">
              <span>📊</span>
              <div>
                <strong>Chosen Model:</strong>{' '}
                {currentStep > 3 ? 'Structured Table' : 'Pending tool...'}
              </div>
            </div>
            <div className="summary-item">
              <span>✏️</span>
              <div>
                <strong>Plan Sentence:</strong>{' '}
                {selectedNextStep || 'Pending final formulation...'}
              </div>
            </div>
          </div>

          {/* Visual Model Stage */}
          <div className="station-visual-stage glass-card">
            <div className="stage-header">
              <span className="tool-name-indicator">
                Model: <strong>TABLE REPRESENTATION</strong>
              </span>
              <span className="optimal-badge">Ready-to-Book</span>
            </div>
            <div className="visual-display-area">
              <PlanVisual type="table" data={FULL_REQUEST.visualData} compact={true} />
            </div>
          </div>

          {/* Feedback */}
          {stepFeedback && (
            <div className={`quiz-feedback-box ${stepFeedback.ok ? 'success' : 'retry'}`}>
              {stepFeedback.msg}
            </div>
          )}

          {/* Completion Banner */}
          {isComplete ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  Pipeline Complete! The client request is ready to book without errors.
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
                Follow all 4 steps to turn the client request into a ready-to-book plan!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
