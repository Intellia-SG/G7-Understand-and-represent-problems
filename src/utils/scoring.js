// src/utils/scoring.js
// XP and Star calculation algorithms for Understand & Represent Problems

export function calcXP(attempts = 1, hints = 0, streak = 0) {
  let base = 10;
  if (attempts === 1) base = 15;
  else if (attempts === 2) base = 10;
  else base = 5;

  const hintPenalty = hints * 2;
  const streakBonus = streak >= 5 ? 10 : streak >= 3 ? 5 : 0;

  return Math.max(3, base - hintPenalty + streakBonus);
}

export function calcStars(correctCount) {
  if (correctCount >= 8) return 3;
  if (correctCount >= 6) return 2;
  if (correctCount >= 4) return 1;
  return 0;
}
