// src/App.jsx
import React, { useReducer, useEffect, useCallback } from 'react';
import './App.css';
import IntroScreen from './components/IntroScreen.jsx';
import ProgressMap from './components/ProgressMap.jsx';
import FloatingNumbers from './components/shared/FloatingNumbers.jsx';
import WonderPhase from './components/phases/WonderPhase.jsx';
import StoryPhase from './components/phases/StoryPhase.jsx';
import SimulatePhase from './components/phases/SimulatePhase.jsx';
import PracticePhase from './components/phases/PracticePhase.jsx';
import ReflectPhase from './components/phases/ReflectPhase.jsx';
import { checkBadges } from './utils/badgeEngine.js';

const initialState = {
  phase: 'intro',
  savedPhase: null,
  storyPanel: 0,
  currentSimStation: 0,
  simStationsComplete: [false, false, false],
  worldResults: Array(10).fill(null),
  xp: 0,
  totalStars: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],
  phaseComplete: { wonder: false, story: false, simulate: false, play: false, reflect: false },
  audioEnabled: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'START_JOURNEY':
      return {
        ...state,
        phase: 'wonder',
        savedPhase: 'wonder',
      };

    case 'SET_PHASE': {
      const nextPhase = action.payload === 'practice' ? 'play' : action.payload;
      return {
        ...state,
        phase: nextPhase,
        savedPhase: nextPhase !== 'intro' ? nextPhase : state.savedPhase,
      };
    }

    case 'NEXT_STORY_PANEL':
      if (state.storyPanel >= 7) {
        return {
          ...state,
          phase: 'simulate',
          phaseComplete: { ...state.phaseComplete, story: true },
        };
      }
      return { ...state, storyPanel: state.storyPanel + 1 };

    case 'PREV_STORY_PANEL':
      if (state.storyPanel === 0) return state;
      return { ...state, storyPanel: state.storyPanel - 1 };

    case 'ADVANCE_SIM_STATION':
      return { ...state, currentSimStation: Math.min(state.currentSimStation + 1, 2) };

    case 'PREV_SIM_STATION':
      return { ...state, currentSimStation: Math.max(state.currentSimStation - 1, 0) };

    case 'COMPLETE_SIM_STATION': {
      const sc = [...state.simStationsComplete];
      sc[action.payload] = true;
      const allDone = sc.every(Boolean);
      return {
        ...state,
        simStationsComplete: sc,
        ...(allDone ? { phaseComplete: { ...state.phaseComplete, simulate: true } } : {}),
      };
    }

    case 'RECORD_WORLD_SCORE': {
      const { worldIndex, stars } = action.payload;
      const nextResults = [...state.worldResults];
      nextResults[worldIndex] = Math.max(nextResults[worldIndex] || 0, stars);

      const totalStars = nextResults.reduce((a, b) => a + (b || 0), 0);
      const isPracticeDone = nextResults.every(r => r != null && r > 0);

      return {
        ...state,
        worldResults: nextResults,
        totalStars,
        ...(isPracticeDone ? { phaseComplete: { ...state.phaseComplete, play: true } } : {}),
      };
    }

    case 'ADD_XP':
      return {
        ...state,
        xp: state.xp + action.payload,
        maxStreak: Math.max(state.maxStreak, state.streak),
      };

    case 'UNLOCK_BADGE': {
      if (state.badges.includes(action.payload)) return state;
      return { ...state, badges: [...state.badges, action.payload] };
    }

    case 'COMPLETE_PHASE':
      return {
        ...state,
        phaseComplete: { ...state.phaseComplete, [action.payload]: true },
      };

    case 'TOGGLE_AUDIO':
      return { ...state, audioEnabled: !state.audioEnabled };

    case 'RESET_SESSION':
      return {
        ...initialState,
        audioEnabled: state.audioEnabled,
      };

    default:
      return state;
  }
}

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Check and unlock badges reactively
  useEffect(() => {
    const newBadges = checkBadges(state);
    newBadges.forEach((id) => dispatch({ type: 'UNLOCK_BADGE', payload: id }));
  }, [state.phaseComplete, state.simStationsComplete, state.worldResults, state.maxStreak, state.xp]);

  const goHome = useCallback(() => {
    dispatch({ type: 'SET_PHASE', payload: 'intro' });
  }, []);

  return (
    <div className="app-shell">
      <FloatingNumbers />

      {/* Header with Top-Left Audio Toggle & Home Button + Center Progress Map */}
      {state.phase !== 'intro' && (
        <header className="app-header">
          {/* Top-Left Controls: Audio Toggle and Home Button */}
          <div className="top-left-controls">
            <button
              type="button"
              className={`audio-toggle-btn ${!state.audioEnabled ? 'muted' : ''}`}
              onClick={() => dispatch({ type: 'TOGGLE_AUDIO' })}
              aria-label={state.audioEnabled ? 'Mute audio' : 'Unmute audio'}
              title={state.audioEnabled ? 'Audio is ON (Click to Mute)' : 'Audio is OFF (Click to Unmute)'}
            >
              <span className="audio-icon">{state.audioEnabled ? '🔊' : '🔇'}</span>
              <span className="audio-text">{state.audioEnabled ? 'Audio ON' : 'Audio OFF'}</span>
            </button>

            <button className="home-btn" onClick={goHome} aria-label="Home" title="Return to Intro">
              <span className="home-icon">🏠</span>
              <span className="home-text">Home</span>
            </button>
          </div>

          {/* Center Progress Map */}
          <div className="header-progress">
            <ProgressMap
              currentPhase={state.phase}
              phaseComplete={state.phaseComplete}
              onSelectPhase={(pKey) => dispatch({ type: 'SET_PHASE', payload: pKey })}
            />
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="phase-content">
        {state.phase === 'intro' && (
          <IntroScreen state={state} dispatch={dispatch} />
        )}
        {state.phase === 'wonder' && (
          <WonderPhase state={state} dispatch={dispatch} />
        )}
        {state.phase === 'story' && (
          <StoryPhase state={state} dispatch={dispatch} />
        )}
        {state.phase === 'simulate' && (
          <SimulatePhase state={state} dispatch={dispatch} />
        )}
        {state.phase === 'play' && (
          <PracticePhase state={state} dispatch={dispatch} />
        )}
        {state.phase === 'reflect' && (
          <ReflectPhase state={state} dispatch={dispatch} />
        )}
      </main>
    </div>
  );
}

export default App;
