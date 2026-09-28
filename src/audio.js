/* =========================================================================
   AUDIO ENGINE (ElevenLabs "Alice" pipeline architecture)
   Voice: Alice (Clear, Engaging Educator) — Voice ID: Xb7hH8MSUJpSbSDYk0k2
   Model: eleven_multilingual_v2

   Playback order for every segment:
     1. Pre-generated static mp3  (audioMap -> /assets/audio/*.mp3)
     2. Dynamic ElevenLabs request (uses VITE_ELEVENLABS_API_KEY from .env.local)
     3. Browser speechSynthesis   (last-resort fallback)
   While segment i plays, segment i+1 is preloaded (no gaps between sentences).
   ========================================================================= */
import { AUDIO_MAP } from './audioMap.js';

export const VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2";
export const MODEL_ID = "eleven_multilingual_v2";

export const STYLE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true, rate: 1.06, pitch: 1.2 },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true, rate: 1.0,  pitch: 1.1 },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true, rate: 0.98, pitch: 1.08 },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true, rate: 0.95, pitch: 1.05 },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true, rate: 0.90, pitch: 0.95 },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true, rate: 1.0,  pitch: 1.0 },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true, rate: 1.0,  pitch: 1.0 }
};

const API_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ELEVENLABS_API_KEY) || '';

export let audioMuted = false;
let ttsVoice = null;
let currentAudioElement = null;
let currentQueue = 0;
let dynamicDisabled = false; // switches off after an auth / quota failure so we don't spam the API

const urlCache = new Map(); // cache key -> Promise<string|null>

/* ---------- speechSynthesis (last resort) ---------- */
function pickVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find(v => /female|alice|zira|samantha|victoria|google us english/i.test(v.name)) ||
    voices.find(v => v.lang && v.lang.startsWith('en')) ||
    voices[0]
  );
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => { ttsVoice = pickVoice(); };
  ttsVoice = pickVoice();
}

function fallbackSpeech(seg) {
  return new Promise((resolve) => {
    if (audioMuted || typeof window === 'undefined' || !('speechSynthesis' in window) || !seg.text) return resolve();
    const cfg = STYLE_SETTINGS[seg.style] || STYLE_SETTINGS.statement;
    const utter = new SpeechSynthesisUtterance(seg.text);
    if (ttsVoice) utter.voice = ttsVoice;
    utter.rate = cfg.rate;
    utter.pitch = cfg.pitch;
    utter.volume = 1;
    utter.onend = resolve;
    utter.onerror = resolve;
    window.speechSynthesis.speak(utter);
  });
}

/* ---------- URL resolution: static file -> dynamic ElevenLabs ---------- */
async function staticFileExists(file) {
  try {
    const res = await fetch(file, { method: 'HEAD' });
    const type = res.headers.get('content-type') || '';
    return res.ok && /audio|octet-stream/i.test(type);
  } catch (e) {
    return false;
  }
}

async function fetchDynamic(seg) {
  if (!API_KEY || dynamicDisabled) return null;
  try {
    const cfg = STYLE_SETTINGS[seg.style] || STYLE_SETTINGS.statement;
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'xi-api-key': API_KEY, Accept: 'audio/mpeg' },
        body: JSON.stringify({
          text: seg.text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: cfg.stability,
            similarity_boost: cfg.similarity_boost,
            style: cfg.style,
            use_speaker_boost: cfg.use_speaker_boost
          }
        })
      }
    );
    if (!res.ok) {
      if (res.status === 401 || res.status === 402 || res.status === 403 || res.status === 429) dynamicDisabled = true;
      return null;
    }
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (e) {
    return null;
  }
}

/** Resolve the best playable URL for a segment (cached). Returns null when only speechSynthesis is possible. */
export function getAudioUrl(seg) {
  if (!seg || !seg.text) return Promise.resolve(null);
  const cacheKey = `${seg.style || 'statement'}::${seg.text}`;
  if (!urlCache.has(cacheKey)) {
    const p = (async () => {
      if (seg.file && (await staticFileExists(seg.file))) return seg.file;
      return fetchDynamic(seg);
    })();
    urlCache.set(cacheKey, p);
    p.then(u => { if (!u) urlCache.delete(cacheKey); });
  }
  return urlCache.get(cacheKey);
}

function playUrl(url) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    currentAudioElement = audio;
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('audio error'));
    audio.play().catch(reject);
  });
}

/* ---------- public API ---------- */
export function setMuted(m) {
  audioMuted = m;
  if (m) stopNarration();
}

export async function speakSegment(seg) {
  if (audioMuted || !seg || !seg.text) return;
  const myQueue = currentQueue;
  try {
    const url = await getAudioUrl(seg);
    if (myQueue !== currentQueue || audioMuted) return;
    if (url) {
      await playUrl(url);
      return;
    }
  } catch (e) {
    /* fall through to speechSynthesis */
  }
  if (myQueue !== currentQueue || audioMuted) return;
  await fallbackSpeech(seg);
}

export async function narrate(segments, autoplay = true) {
  if (!autoplay || audioMuted) return;
  stopNarration();
  const myQueue = ++currentQueue;
  const segList = (Array.isArray(segments) ? segments : [segments]).filter(Boolean);
  for (let i = 0; i < segList.length; i++) {
    if (myQueue !== currentQueue || audioMuted) return;
    if (segList[i + 1]) getAudioUrl(segList[i + 1]); // eager preload of the next segment
    await speakSegment(segList[i]);
  }
}

export function stopNarration() {
  currentQueue++;
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/** Speak a short feedback line by AUDIO_MAP key (does not clash with an active narration queue). */
export function speakKey(key, muted = false) {
  if (muted || audioMuted || !AUDIO_MAP[key]) return;
  narrate(AUDIO_MAP[key], true);
}

/* Segment helpers */
export const say = text => ({ text, style: 'statement' });
export const ask = text => ({ text, style: 'question' });
export const cheer = text => ({ text, style: 'celebration' });
export const emphasize = text => ({ text, style: 'emphasis' });
export const think = text => ({ text, style: 'thinking' });
export const celebrate = text => ({ text, style: 'celebration' });
export const instruct = text => ({ text, style: 'encouragement' });
