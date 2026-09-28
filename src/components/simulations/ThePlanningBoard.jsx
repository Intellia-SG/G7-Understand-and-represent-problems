// src/components/simulations/ThePlanningBoard.jsx
// Station 1: Concept Discovery Lab (TRD §6 / PRD §8.3)
// Explore how the same client request looks across different representation tools.

import React, { useState } from 'react';
import PlanVisual from '../shared/PlanVisual.jsx';
import './Stations.css';

const SAMPLE_REQUESTS = [
  {
    id: 'req_1',
    title: 'Wedding Reception Budget',
    event: 'Grand Wedding Reception',
    story: 'A client has an approved $800 total budget. They spend $320 on floral arrangements and the rest on gourmet catering. How much is catering?',
    data: {
      'bar-model-part-whole': {
        whole: { label: 'Approved Budget', value: '$800' },
        parts: [
          { label: 'Floral Arches', value: '$320', percent: 40 },
          { label: 'Catering', value: '?', percent: 60, isUnknown: true }
        ]
      },
      'bar-model-comparison': {
        quantityA: { label: 'Catering', units: 3, value: '$480' },
        quantityB: { label: 'Florals', units: 2, value: '$320' },
        totalBracket: { label: 'Total Budget = $800' }
      },
      'table': {
        columns: ['Expense Category', 'Amount ($)', 'Status'],
        rows: [
          ['Floral Arches', '$320', 'Given Fact'],
          ['Gourmet Catering', '?', 'To Calculate ($800 - $320)'],
          ['Total Approved', '$800', 'Client Whole Budget']
        ]
      },
      'diagram': {
        title: 'Budget Allocation Breakdown',
        dimensions: {
          outerLength: '$800 total',
          outerWidth: '2 major categories',
          walkwayMargin: '$320 florals',
          innerArea: '$480 remainder for catering'
        }
      }
    },
    bestTool: 'bar-model-part-whole',
    bestReason: 'A Part-Whole Bar directly shows the known part ($320) subtracted from the whole ($800).'
  },
  {
    id: 'req_2',
    title: 'School Gala Guest Split',
    event: 'Annual School Gala',
    story: 'The Main Auditorium seats 3 times as many guests as the Outdoor Pavilion. Together they seat 120 guests. How many guests fit in the Pavilion?',
    data: {
      'bar-model-part-whole': {
        whole: { label: 'Total Guests', value: '120 guests' },
        parts: [
          { label: 'Main Auditorium (3 units)', value: '90', percent: 75 },
          { label: 'Pavilion (1 unit)', value: '30', percent: 25, isUnknown: true }
        ]
      },
      'bar-model-comparison': {
        quantityA: { label: 'Auditorium', units: 3, value: 90 },
        quantityB: { label: 'Pavilion', units: 1, value: 30, isUnknown: true },
        totalBracket: { label: 'Total = 120 guests (4 equal units)' }
      },
      'table': {
        columns: ['Ratio Units', 'Auditorium', 'Pavilion', 'Combined'],
        rows: [
          ['1 Unit Base', '3 × 10 = 30', '10', '40'],
          ['2 Units Base', '3 × 20 = 60', '20', '80'],
          ['3 Units Base', '3 × 30 = 90', '30 (Target!)', '120 Total']
        ]
      },
      'diagram': {
        title: 'Auditorium vs Pavilion Layout',
        dimensions: {
          outerLength: '120 total capacity',
          outerWidth: '3:1 ratio split',
          walkwayMargin: '1 unit pavilion',
          innerArea: '3 units main auditorium'
        }
      }
    },
    bestTool: 'bar-model-comparison',
    bestReason: 'A Comparison Bar clearly displays the 3-to-1 unit relationship between the two spaces.'
  },
  {
    id: 'req_3',
    title: 'Banquet Hall Walkway Setup',
    event: 'Sports Awards Dinner',
    story: 'A banquet hall is 30 meters long and 16 meters wide. Fire code requires a 2-meter walkway around all four outer walls. What are the dimensions for dining tables?',
    data: {
      'bar-model-part-whole': {
        whole: { label: 'Hall Length', value: '30 m' },
        parts: [
          { label: 'Walkways (2 × 2m)', value: '4m', percent: 13 },
          { label: 'Inner Table Floor', value: '26m', percent: 87, isUnknown: true }
        ]
      },
      'bar-model-comparison': {
        quantityA: { label: 'Outer Length', units: 3, value: '30m' },
        quantityB: { label: 'Inner Dining Floor', units: 2, value: '26m' },
        totalBracket: { label: 'Walkway Border = 2m on each end' }
      },
      'table': {
        columns: ['Zone', 'Length (m)', 'Width (m)', 'Calculation'],
        rows: [
          ['Outer Walls', '30', '16', 'Given Hall Boundary'],
          ['Walkway Margin', '2m each side', '2m each side', 'Safety Clearance'],
          ['Dining Floor', '26 (30 - 4)', '12 (16 - 4)', 'Inner usable area']
        ]
      },
      'diagram': {
        title: 'Hall Safety Perimeter Layout',
        dimensions: {
          outerLength: '30 m',
          outerWidth: '16 m',
          walkwayMargin: '2 m border',
          innerArea: '26 m × 12 m inner table space'
        }
      }
    },
    bestTool: 'diagram',
    bestReason: 'A Diagram directly captures spatial dimensions and boundaries visually.'
  }
];

export default function ThePlanningBoard({ onComplete, audioEnabled = true }) {
  const [selectedReqIdx, setSelectedReqIdx] = useState(0);
  const [activeTool, setActiveTool] = useState('bar-model-part-whole');
  const [viewedCount, setViewedCount] = useState(new Set(['req_1-bar-model-part-whole']));
  const [confirmAnswer, setConfirmAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const req = SAMPLE_REQUESTS[selectedReqIdx];
  const visualData = req.data[activeTool];

  function handleSelectRequest(idx) {
    setSelectedReqIdx(idx);
    const key = `${SAMPLE_REQUESTS[idx].id}-${activeTool}`;
    setViewedCount(prev => new Set([...prev, key]));
  }

  function handleSelectTool(toolKey) {
    setActiveTool(toolKey);
    const key = `${req.id}-${toolKey}`;
    setViewedCount(prev => new Set([...prev, key]));
  }

  function handleConfirmAnswer(ans) {
    setConfirmAnswer(ans);
    setShowFeedback(true);
  }

  // Station completed when explored requests & answered confirmation question correctly
  const exploredEnough = viewedCount.size >= 4;
  const isQuestionCorrect = confirmAnswer === 'bar-model-comparison';
  const isComplete = exploredEnough && isQuestionCorrect;

  return (
    <div className="station-container anim-slide-up">
      <div className="station-header">
        <span className="station-badge">Station 1 · Concept Discovery Lab</span>
        <h2 className="station-title">The Planning Board 📐</h2>
        <p className="station-desc">
          Test drive different planning tools! See how the same client request transforms when viewed as a Part-Whole Bar, Comparison Bar, Table, or Diagram.
        </p>
      </div>

      {/* Request selector tabs */}
      <div className="station-tabs-row">
        <span className="station-tabs-label">1. Select Client Request:</span>
        <div className="tab-pill-group">
          {SAMPLE_REQUESTS.map((r, idx) => (
            <button
              key={r.id}
              className={`station-tab-pill ${selectedReqIdx === idx ? 'active' : ''}`}
              onClick={() => handleSelectRequest(idx)}
            >
              {idx + 1}. {r.title}
            </button>
          ))}
        </div>
      </div>

      {/* Story request card */}
      <div className="station-story-box glass-card">
        <div className="story-tag">📋 Client Request:</div>
        <p className="story-text">{req.story}</p>
      </div>

      {/* Tool switcher tabs */}
      <div className="station-tabs-row">
        <span className="station-tabs-label">2. Switch Planning Representation:</span>
        <div className="tool-pill-group">
          <button
            className={`station-tool-pill ${activeTool === 'bar-model-part-whole' ? 'active' : ''}`}
            onClick={() => handleSelectTool('bar-model-part-whole')}
          >
            📊 Part-Whole Bar
          </button>
          <button
            className={`station-tool-pill ${activeTool === 'bar-model-comparison' ? 'active' : ''}`}
            onClick={() => handleSelectTool('bar-model-comparison')}
          >
            ⚖️ Comparison Bar
          </button>
          <button
            className={`station-tool-pill ${activeTool === 'table' ? 'active' : ''}`}
            onClick={() => handleSelectTool('table')}
          >
            📋 Structured Table
          </button>
          <button
            className={`station-tool-pill ${activeTool === 'diagram' ? 'active' : ''}`}
            onClick={() => handleSelectTool('diagram')}
          >
            🗺️ Spatial Diagram
          </button>
        </div>
      </div>

      {/* Active Visual Render */}
      <div className="station-visual-stage glass-card">
        <div className="stage-header">
          <span className="tool-name-indicator">
            Active View: <strong>{activeTool.replace(/-/g, ' ').toUpperCase()}</strong>
          </span>
          {activeTool === req.bestTool && (
            <span className="optimal-badge">⭐ Recommended Match for This Problem</span>
          )}
        </div>

        <div className="visual-display-area">
          <PlanVisual type={activeTool} data={visualData} compact={false} />
        </div>

        <div className="tool-explanation-footer">
          💡 <strong>Tool Insight:</strong> {req.bestReason}
        </div>
      </div>

      {/* Confirmation Question Gate */}
      <div className="confirmation-quiz-card glass-card">
        <div className="quiz-question-title">
          🎯 <strong>Discovery Checkpoint:</strong> Which tool is best suited when a request compares two quantities by a ratio (e.g., "Hall A seats 3 times as many as Hall B")?
        </div>

        <div className="quiz-options-grid">
          {[
            { id: 'diagram', label: 'Spatial Diagram' },
            { id: 'bar-model-comparison', label: 'Comparison Bar Model (with equal units)' },
            { id: 'plain-guess', label: 'Mental Guesswork' },
            { id: 'bar-model-part-whole', label: 'Part-Whole Bar with no units' }
          ].map((opt) => (
            <button
              key={opt.id}
              className={`quiz-option-btn ${confirmAnswer === opt.id ? (opt.id === 'bar-model-comparison' ? 'correct' : 'wrong') : ''}`}
              onClick={() => handleConfirmAnswer(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className={`quiz-feedback-box ${isQuestionCorrect ? 'success' : 'retry'}`}>
            {isQuestionCorrect
              ? '✨ Exactly right! A comparison bar model visually shows equal units so you can split totals cleanly.'
              : '🤔 Not quite. When two quantities are in a ratio (e.g. 3 times as many), equal unit comparison bars make the relationship visible!'}
          </div>
        )}
      </div>

      {/* Completion Banner */}
      {isComplete && (
        <div className="station-success anim-bounce-in">
          <div className="success-content">
            <span className="success-icon">🎉</span>
            <div>
              <h3>Planning Board Mastered!</h3>
              <p>You have explored how each tool represents client requests and confirmed your toolkit intuition.</p>
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
