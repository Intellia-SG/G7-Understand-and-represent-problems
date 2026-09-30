// src/components/simulations/MatchThePlan.jsx
// Station 2: Build-to-Target Challenge (TRD §6 / PRD §8.3)
// Select the right representation type and build it to match the client request.

import React, { useState } from 'react';
import PlanVisual from '../shared/PlanVisual.jsx';
import './Stations.css';

const ROUNDS = [
  {
    id: 'round_1',
    title: 'Round 1: Split Gala Budget',
    targetSummary: '$200 Lighting + $300 Catering = $500 Total',
    problem: {
      type: 'part-whole',
      story: 'A charity gala has a total budget of $500. $200 is set aside for lighting and audio. The rest is for catering. Build the part-whole model to match!',
      quantities: {
        total: 500,
        part1: { name: 'Lighting & Audio', value: 200 },
        part2: { name: 'Catering', value: 300 }
      },
      correctStrategy: 'bar-model-part-whole'
    },
    tools: [
      { id: 'bar-model-part-whole', label: '📊 Part-Whole Bar' },
      { id: 'diagram', label: '🗺️ Spatial Diagram' },
      { id: 'table', label: '📋 Table' }
    ],
    initialConfig: {
      part1Value: 150,
      wholeValue: 500
    }
  },
  {
    id: 'round_2',
    title: 'Round 2: VIP vs General Seats',
    targetSummary: '4 General : 1 VIP Ratio (100 Total Seats)',
    problem: {
      type: 'comparison',
      story: 'For an awards banquet, there are 4 times as many general seats as VIP seats. Total guest capacity is 100. Build the comparison model!',
      quantities: {
        total: 100,
        ratio: 4,
        hostA: { name: 'General Seats', units: 4, value: 80 },
        hostB: { name: 'VIP Seats', units: 1, value: 20 }
      },
      correctStrategy: 'bar-model-comparison'
    },
    tools: [
      { id: 'bar-model-comparison', label: '⚖️ Comparison Bar' },
      { id: 'bar-model-part-whole', label: '📊 Part-Whole Bar' },
      { id: 'table', label: '📋 Table' }
    ],
    initialConfig: {
      unitsA: 2,
      unitsB: 1
    }
  },
  {
    id: 'round_3',
    title: 'Round 3: Drink Cartons',
    targetSummary: '3 Cartons = 18 Bottles ($90 Total)',
    problem: {
      type: 'composite',
      story: 'Fruit punch bottles are packed 6 per carton at $5 per bottle ($30/carton). Total expenditure is $90. How many cartons were bought? Match the right organizing tool!',
      quantities: {
        packPrice: 5,
        packsPerBox: 6,
        totalBudget: 90
      },
      correctStrategy: 'table'
    },
    tools: [
      { id: 'table', label: '📋 Structured Table' },
      { id: 'diagram', label: '🗺️ Spatial Diagram' },
      { id: 'bar-model-part-whole', label: '📊 Part-Whole Bar' }
    ],
    initialConfig: {
      tableRowsCount: 1
    }
  }
];

export default function MatchThePlan({ onComplete, audioEnabled = true }) {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState('bar-model-part-whole');
  const [userConfig, setUserConfig] = useState({
    part1Value: 150,
    wholeValue: 500,
    unitsA: 2,
    unitsB: 1,
    tableRowsCount: 1
  });
  const [roundCompleted, setRoundCompleted] = useState([false, false, false]);
  const [feedback, setFeedback] = useState(null);

  const round = ROUNDS[currentRoundIdx];
  const problem = round.problem;

  function handleStrategyChange(strat) {
    setSelectedStrategy(strat);
    setFeedback(null);
  }

  function updateConfig(field, delta, min, max) {
    setUserConfig(prev => {
      const current = prev[field] ?? min;
      const next = Math.max(min, Math.min(max, current + delta));
      return { ...prev, [field]: next };
    });
    setFeedback(null);
  }

  function handleReset() {
    setUserConfig({
      part1Value: 150,
      wholeValue: 500,
      unitsA: 2,
      unitsB: 1,
      tableRowsCount: 1
    });
    setFeedback(null);
  }

  function handleValidate() {
    if (!selectedStrategy) {
      setFeedback({ ok: false, msg: '⚠️ Please select a representation tool first!' });
      return;
    }

    if (selectedStrategy !== problem.correctStrategy) {
      setFeedback({
        ok: false,
        msg: `❌ Not the optimal tool. For this structure, ${problem.correctStrategy.replace(/-/g, ' ')} is the best fit.`
      });
      return;
    }

    if (currentRoundIdx === 0) {
      if (userConfig.part1Value === 200) {
        markRoundSuccess();
      } else {
        setFeedback({
          ok: false,
          msg: `Almost! The lighting & audio part is $200. Adjust the slider to $200.`
        });
      }
    } else if (currentRoundIdx === 1) {
      if (userConfig.unitsA === 4 && userConfig.unitsB === 1) {
        markRoundSuccess();
      } else {
        setFeedback({
          ok: false,
          msg: `Check the ratio! General seats must have 4 units for every 1 unit of VIP seats.`
        });
      }
    } else if (currentRoundIdx === 2) {
      if (userConfig.tableRowsCount >= 3) {
        markRoundSuccess();
      } else {
        setFeedback({
          ok: false,
          msg: `Add more table rows until total reaches $90 (3 cartons × $30/carton).`
        });
      }
    }
  }

  function markRoundSuccess() {
    const updated = [...roundCompleted];
    updated[currentRoundIdx] = true;
    setRoundCompleted(updated);
    setFeedback({
      ok: true,
      msg: '🎉 Perfect Match! The representation precisely captures the client request.'
    });
  }

  function nextRound() {
    if (currentRoundIdx < ROUNDS.length - 1) {
      const nextIdx = currentRoundIdx + 1;
      setCurrentRoundIdx(nextIdx);
      setSelectedStrategy(ROUNDS[nextIdx].tools[0].id);
      setFeedback(null);
    }
  }

  const allDone = roundCompleted.every(Boolean);

  // Dynamic visual preview based on user's current build
  let builtData = null;
  if (selectedStrategy === 'bar-model-part-whole') {
    const p1 = userConfig.part1Value;
    const whole = userConfig.wholeValue;
    const p2 = Math.max(0, whole - p1);
    builtData = {
      whole: { label: 'Total Budget', value: `$${whole}` },
      parts: [
        { label: 'Lighting & Audio', value: `$${p1}`, percent: Math.round((p1 / whole) * 100) },
        { label: 'Catering', value: `$${p2}`, percent: Math.round((p2 / whole) * 100), isUnknown: true }
      ]
    };
  } else if (selectedStrategy === 'bar-model-comparison') {
    builtData = {
      quantityA: { label: 'General Seats', units: userConfig.unitsA, value: userConfig.unitsA * 20 },
      quantityB: { label: 'VIP Seats', units: userConfig.unitsB, value: userConfig.unitsB * 20, isUnknown: true },
      totalBracket: { label: `Total = 100 seats (${userConfig.unitsA + userConfig.unitsB} units total)` }
    };
  } else if (selectedStrategy === 'table') {
    const count = userConfig.tableRowsCount;
    const rows = [];
    for (let i = 1; i <= count; i++) {
      rows.push([`${i} Carton(s)`, `${i * 6} Bottles`, `$${i * 30}`]);
    }
    builtData = {
      columns: ['Cartons', 'Total Bottles', 'Total Cost ($)'],
      rows
    };
  } else {
    builtData = {
      title: 'Spatial Layout Map',
      dimensions: {
        outerLength: 'Budget Allocation',
        outerWidth: 'Setup Area',
        walkwayMargin: 'Reserved Costs',
        innerArea: 'Remaining Space'
      }
    };
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🎯 Station B: Match the Plan</h3>
        <div className="station-target-box">
          <span className="station-target-label">Round:</span>
          <span className="station-target-num">{currentRoundIdx + 1}/3</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Round Nav, Request, Strategy Picker, Stepper Controls & Actions */}
        <div className="station-col-left">
          {/* Round Navigation Bar */}
          <div className="rounds-nav-bar">
            {ROUNDS.map((r, idx) => (
              <button
                key={r.id}
                className={`round-step-btn ${currentRoundIdx === idx ? 'current' : ''} ${roundCompleted[idx] ? 'completed' : ''}`}
                onClick={() => {
                  setCurrentRoundIdx(idx);
                  setSelectedStrategy(r.tools[0].id);
                  setFeedback(null);
                }}
              >
                <span>{roundCompleted[idx] ? '✓' : idx + 1}</span> {r.title}
              </button>
            ))}
          </div>

          {/* Problem Prompt */}
          <div className="station-story-box glass-card">
            <div className="story-tag">📋 Request Details:</div>
            <p className="story-text">{problem.story}</p>
          </div>

          {/* Strategy Picker */}
          <div className="station-tabs-row">
            <span className="station-tabs-label">Step 1: Choose Tool:</span>
            <div className="tool-pill-group">
              {round.tools.map(tool => (
                <button
                  key={tool.id}
                  className={`station-tool-pill ${selectedStrategy === tool.id ? 'active' : ''}`}
                  onClick={() => handleStrategyChange(tool.id)}
                >
                  {tool.label}
                </button>
              ))}
            </div>
          </div>

          {/* Builder Controls */}
          <div className="builder-controls-card glass-card">
            <div className="builder-title">Step 2: Adjust Parameters to Match:</div>

            {selectedStrategy === 'bar-model-part-whole' && (
              <div className="control-row">
                <label>Known Part Value (Lighting & Audio): <strong>${userConfig.part1Value}</strong></label>
                <div className="stepper-controls">
                  <button className="stepper-btn" onClick={() => updateConfig('part1Value', -50, 50, 450)} aria-label="Decrease value">−</button>
                  <input
                    type="range"
                    min="50"
                    max="450"
                    step="50"
                    value={userConfig.part1Value}
                    onChange={(e) => updateConfig('part1Value', Number(e.target.value) - userConfig.part1Value, 50, 450)}
                    className="slider"
                  />
                  <button className="stepper-btn" onClick={() => updateConfig('part1Value', 50, 50, 450)} aria-label="Increase value">+</button>
                </div>
              </div>
            )}

            {selectedStrategy === 'bar-model-comparison' && (
              <div className="control-row">
                <label>General Seats Unit Count: <strong>{userConfig.unitsA} units</strong> (Ratio to VIP: {userConfig.unitsA}:1)</label>
                <div className="stepper-controls">
                  <button className="stepper-btn" onClick={() => updateConfig('unitsA', -1, 1, 6)} aria-label="Decrease units">−</button>
                  <span className="unit-display">{userConfig.unitsA}</span>
                  <button className="stepper-btn" onClick={() => updateConfig('unitsA', 1, 1, 6)} aria-label="Increase units">+</button>
                </div>
              </div>
            )}

            {selectedStrategy === 'table' && (
              <div className="control-row">
                <label>Cartons in Table: <strong>{userConfig.tableRowsCount}</strong> (Each carton = 6 bottles @ $5 = $30)</label>
                <div className="stepper-controls">
                  <button className="stepper-btn" onClick={() => updateConfig('tableRowsCount', -1, 1, 5)} aria-label="Decrease rows">−</button>
                  <span className="unit-display">{userConfig.tableRowsCount}</span>
                  <button className="stepper-btn" onClick={() => updateConfig('tableRowsCount', 1, 1, 5)} aria-label="Increase rows">+</button>
                </div>
              </div>
            )}

            {selectedStrategy === 'diagram' && (
              <div className="control-row">
                <label>Spatial Layout Map: Exploring geometric breakdown.</label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="station-actions">
            <button className="btn-outline" onClick={handleReset}>
              Reset
            </button>
            <button className="btn-primary" onClick={handleValidate}>
              Verify Plan 🔍
            </button>
            {roundCompleted[currentRoundIdx] && currentRoundIdx < ROUNDS.length - 1 && (
              <button className="btn-primary" onClick={nextRound}>
                Next Round →
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Live Model Visual, Status Bar & Completion */}
        <div className="station-col-right">
          {/* Target comparison summary bar */}
          <div className="running-ratio-bar">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', color: '#fff' }}>
              Target: <strong>{round.targetSummary}</strong>
            </div>
            <div className={`running-ratio-text ${roundCompleted[currentRoundIdx] ? 'exact' : ''}`}>
              {roundCompleted[currentRoundIdx] ? '✨ Matched Target Parameters!' : '🔧 Adjust parameters on the left to match target'}
            </div>
          </div>

          {/* Visual Display Stage */}
          <div className="station-visual-stage glass-card">
            <div className="stage-header">
              <span className="tool-name-indicator">
                Model: <strong>{selectedStrategy.replace(/-/g, ' ').toUpperCase()}</strong>
              </span>
              {selectedStrategy === problem.correctStrategy && (
                <span className="optimal-badge">✓ Optimal Representation</span>
              )}
            </div>
            <div className="visual-display-area">
              <PlanVisual type={selectedStrategy} data={builtData} compact={true} />
            </div>
          </div>

          {/* Feedback Display */}
          {feedback && (
            <div className={`quiz-feedback-box ${feedback.ok ? 'success' : 'retry'}`}>
              {feedback.msg}
            </div>
          )}

          {/* Completion Banner */}
          {allDone ? (
            <div className="station-success anim-bounce-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="success-icon">🎉</span>
                <p className="station-success-msg">
                  All 3 Plans Matched Perfectly! You mastered matching models to requests.
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
                Complete all 3 rounds to master Station B!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
