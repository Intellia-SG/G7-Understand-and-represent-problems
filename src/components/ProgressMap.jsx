// src/components/ProgressMap.jsx
import React from 'react';
import './ProgressMap.css';

const PHASES = [
  { key: 'wonder',   num: '01', icon: '🔍', label: 'Wonder'   },
  { key: 'story',    num: '02', icon: '📖', label: 'Story'    },
  { key: 'simulate', num: '03', icon: '🧪', label: 'Simulate' },
  { key: 'play',     num: '04', icon: '🎮', label: 'Practice' },
  { key: 'reflect',  num: '05', icon: '📓', label: 'Reflect'  },
];

export default function ProgressMap({ currentPhase, phaseComplete, onSelectPhase }) {
  // Normalize practice phase key (play or practice)
  const activeKey = currentPhase === 'practice' ? 'play' : currentPhase;

  return (
    <nav className="progress-bar-nav" role="navigation" aria-label="Learning journey phases">
      <div className="progress-bar-pill">
        {PHASES.map((p, i) => {
          const isActive    = p.key === activeKey;
          const isCompleted = phaseComplete?.[p.key];

          return (
            <React.Fragment key={p.key}>
              <button
                type="button"
                className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => onSelectPhase && onSelectPhase(p.key)}
                aria-label={`Go to ${p.label} phase`}
                title={`Phase ${p.num}: ${p.label}`}
              >
                <span className={`step-circle ${isCompleted ? 'circle-done' : isActive ? 'circle-active' : 'circle-idle'}`}>
                  {isCompleted ? '✓' : p.num}
                </span>
                <span className="step-label">
                  <span className="step-label-icon">{p.icon}</span> {p.label}
                </span>
              </button>
              {i < PHASES.length - 1 && <span className="step-divider">—</span>}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
