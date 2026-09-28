// src/hooks/useAudio.js
// Audio Engine supporting static audioMap lookup, ElevenLabs dynamic fallback, and Web Audio SFX

import { useRef, useCallback, useEffect } from 'react';
import { AUDIO_MAP } from '../audioMap.js';

const VOICE_SETTINGS = {
  celebration:  { stability: 0.15, similarity_boost: 0.50, style: 0.70, use_speaker_boost: true },
  encouragement:{ stability: 0.18, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:     { stability: 0.22, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:     { stability: 0.18, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:     { stability: 0.25, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:    { stability: 0.22, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:  { stability: 0.22, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID = 'eleven_multilingual_v2';
const blobCache = new Map();

// Text to audio file path mapping dictionary for fast O(1) text lookup
const textToPathMap = {};
if (AUDIO_MAP) {
  Object.values(AUDIO_MAP).forEach(item => {
    if (item && item.text && item.file) {
      textToPathMap[item.text.trim()] = item.file;
    }
  });
}

export function useAudio(audioEnabled = true) {
  const currentAudioRef = useRef(null);
  const playingRef      = useRef(false);
  const narrateIdRef    = useRef(0);

  useEffect(() => {
    if (!audioEnabled) {
      narrateIdRef.current++;
      stopAll();
    }
  }, [audioEnabled]);

  const stopAll = useCallback(() => {
    narrateIdRef.current++;
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    playingRef.current = false;
  }, []);

  const getAudioUrl = useCallback(async (textOrKey, style = 'statement') => {
    // 1. Check if direct key in AUDIO_MAP
    if (AUDIO_MAP && AUDIO_MAP[textOrKey] && AUDIO_MAP[textOrKey].file) {
      return AUDIO_MAP[textOrKey].file;
    }

    // 2. Check if text matches audioMap text
    const cleanText = String(textOrKey).trim();
    if (textToPathMap[cleanText]) {
      return textToPathMap[cleanText];
    }

    // 3. Check memory cache for dynamically fetched audio
    const cacheKey = `${cleanText}__${style}`;
    if (blobCache.has(cacheKey)) return blobCache.get(cacheKey);

    // 4. Dynamic fetch from ElevenLabs if API key provided
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) return null;

    try {
      const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: MODEL_ID,
          voice_settings: settings,
        }),
      });
      if (!res.ok) throw new Error(`ElevenLabs ${res.status}`);
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      blobCache.set(cacheKey, url);
      return url;
    } catch (err) {
      return null;
    }
  }, []);

  const playSegment = useCallback(async (segment, expectedId) => {
    if (!audioEnabled || narrateIdRef.current !== expectedId) return;
    const textOrKey = typeof segment === 'string' ? segment : (segment.text || segment.key || '');
    const style = typeof segment === 'object' && segment.style ? segment.style : 'statement';
    
    // Check if segment has direct file property
    const directFile = typeof segment === 'object' ? segment.file : null;
    const url = directFile || await getAudioUrl(textOrKey, style);
    if (!url || narrateIdRef.current !== expectedId) return;

    return new Promise((resolve) => {
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      audio.onended = () => { currentAudioRef.current = null; resolve(); };
      audio.onerror = () => { currentAudioRef.current = null; resolve(); };
      audio.play().catch(() => resolve());
    });
  }, [audioEnabled, getAudioUrl]);

  const narrate = useCallback(async (segments) => {
    if (!audioEnabled || !segments) return;
    stopAll();
    const currentId = ++narrateIdRef.current;
    playingRef.current = true;

    const list = Array.isArray(segments) ? segments : [segments];

    for (const seg of list) {
      if (narrateIdRef.current !== currentId) break;
      await playSegment(seg, currentId);
      if (narrateIdRef.current !== currentId) break;
      await new Promise(r => setTimeout(r, 200));
    }
    if (narrateIdRef.current === currentId) {
      playingRef.current = false;
    }
  }, [audioEnabled, stopAll, playSegment]);

  // Zero-latency tone-based Web Audio synthesizer for instant responsive feedback
  const playTone = useCallback((frequencies, durations) => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      let offset = 0;
      frequencies.forEach((freq, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + (durations[i] || 150) / 1000 + 0.15);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + (durations[i] || 150) / 1000 + 0.15);
        offset += (durations[i] || 150) / 1000;
      });
    } catch { /* ignore WebAudio errors */ }
  }, [audioEnabled]);

  const sounds = {
    correct: () => playTone([880, 1100, 1320], [100, 100, 180]),
    wrong:   () => playTone([220, 180], [160, 200]),
    badge:   () => playTone([523, 659, 784, 1047], [90, 90, 90, 240]),
    streak:  () => playTone([440, 880, 1100], [70, 70, 180]),
    levelUp: () => playTone([523, 659, 784, 1047, 1319], [60, 60, 60, 60, 250]),
    click:   () => playTone([440], [50]),
    defeat:  () => playTone([300, 240, 180], [120, 120, 250]),
  };

  return {
    narrate,
    stopAll,
    sounds,
    say:       (text) => ({ text, style: 'statement' }),
    ask:       (text) => ({ text, style: 'question' }),
    cheer:     (text) => ({ text, style: 'celebration' }),
    emphasize: (text) => ({ text, style: 'emphasis' }),
    think:     (text) => ({ text, style: 'thinking' }),
    celebrate: (text) => ({ text, style: 'celebration' }),
    instruct:  (text) => ({ text, style: 'instruction' }),
    encourage: (text) => ({ text, style: 'encouragement' }),
  };
}

export default useAudio;
