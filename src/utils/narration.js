// src/utils/narration.js
import { AUDIO_MAP } from '../audioMap.js';

export function wonderNarration() {
  return [
    AUDIO_MAP.wonder_1 || { text: "Zara and Leo's class is running a book sale. A book and a bookmark cost $11 together, and the book costs exactly $10 more than the bookmark. Most people blurt out that the bookmark costs $1, but a quick sketch reveals something surprising!", style: "statement" },
    AUDIO_MAP.wonder_2 || { text: "How can we turn a wordy problem into a picture or an equation that gives the right answer every time?", style: "question" }
  ];
}

export function storyNarration(panelIndex = 0) {
  const keys = [
    'story_1',
    'story_2',
    'story_3',
    'story_4',
    'story_5',
    'story_6',
    'story_7',
    'story_8'
  ];
  const key = keys[panelIndex] || 'story_1';
  return AUDIO_MAP[key] ? [AUDIO_MAP[key]] : [];
}

export function simStationIntro(stationIndex = 0) {
  const map = {
    0: AUDIO_MAP.sim_1_1,
    1: AUDIO_MAP.sim_2_1,
    2: AUDIO_MAP.sim_3_1
  };
  return map[stationIndex] ? [map[stationIndex]] : [];
}

export function reflectNarration() {
  return AUDIO_MAP.reflect_1 ? [AUDIO_MAP.reflect_1] : [
    { text: "Great work! Take a moment to reflect on what you have learned about understanding and representing problems.", style: "statement" }
  ];
}
