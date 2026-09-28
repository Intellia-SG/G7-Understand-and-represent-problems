import React, { useEffect } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { narrate, stopNarration } from '../audio.js';

export function WonderPhase({ muted, onNext }) {
  useEffect(() => {
    narrate([AUDIO_MAP.wonder_1, AUDIO_MAP.wonder_2], !muted);
    return () => stopNarration();
  }, [muted]);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none z-10">
      <BgSymbols />

      <div className="w-full max-w-2xl glass-card flex flex-col items-center text-center fade-in-up z-20 my-auto">
        {/* Glowing Phase Band */}
        <div className="phase-band phase-band--wonder" />

        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">🔍</span>
          <span className="text-purple-300 font-display font-800 text-xs sm:text-sm tracking-wider uppercase">
            Phase 1: Wonder & Curiosity
          </span>
        </div>

        <h2 className="text-main-heading text-purple-200 mb-3 max-w-xl">
          Can a Quick Sketch Beat a Quick Guess?
        </h2>

        {/* Feature Stat Box */}
        <div className="w-full bg-[#1e143c]/90 border border-purple-400/30 rounded-2xl p-4 sm:p-6 mb-4 flex flex-col items-center shadow-xl">
          <div className="text-number text-amber-300 text-4xl sm:text-6xl mb-1">
            $1? Not So Fast!
          </div>
          <p className="text-body text-slate-200 max-w-lg">
            {AUDIO_MAP.wonder_1.text}
          </p>
        </div>

        {/* Mascot Thinking Bubble */}
        <div className="flex items-center gap-3 bg-[#14082c]/80 border border-purple-500/30 rounded-full px-5 py-2 mb-5">
          <div className="w-8 h-8 rounded-full bg-purple-500/30 text-purple-200 flex items-center justify-center font-bold text-sm shrink-0">
            🤖
          </div>
          <p className="text-slate-300 text-xs sm:text-sm font-semibold">
            {AUDIO_MAP.wonder_2.text}
          </p>
        </div>

        <button onClick={onNext} className="btn-gold flex items-center gap-2">
          <span>Explore the Story</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
