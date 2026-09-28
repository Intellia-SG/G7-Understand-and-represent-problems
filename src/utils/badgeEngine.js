// src/utils/badgeEngine.js
// Badge definitions and unlock triggers for Understand & Represent Problems

export const BADGES = [
  { id: 'first_clue',     icon: '🔍', label: 'First Clue',      description: 'Solved your very first word problem!' },
  { id: 'hot_streak',     icon: '🔥', label: 'Hot Streak',      description: 'Achieved a streak of 5 correct answers!' },
  { id: 'super_streak',   icon: '⚡', label: 'Math Prodigy',    description: 'Achieved a 10-question winning streak!' },
  { id: 'lab_champ',      icon: '🧪', label: 'Lab Champion',    description: 'Completed all 3 interactive simulation stations!' },
  { id: 'world_star',     icon: '⭐', label: 'World Star',      description: 'Earned 3 stars in a Practice World!' },
  { id: 'problem_solver', icon: '🎯', label: 'Equation Pro',    description: 'Mastered translating stories into equations!' },
  { id: 'math_master',    icon: '🏆', label: 'Grand Detective', description: 'Completed the full 5-phase learning journey!' },
];

export function checkBadges(state) {
  const unlocked = [];

  const totalCorrect = state.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  if (totalCorrect >= 1) unlocked.push('first_clue');

  if (state.maxStreak >= 5) unlocked.push('hot_streak');
  if (state.maxStreak >= 10) unlocked.push('super_streak');

  if (state.simStationsComplete && state.simStationsComplete.every(Boolean)) {
    unlocked.push('lab_champ');
  }

  if (state.worldResults && state.worldResults.some(score => score !== null && score >= 3)) {
    unlocked.push('world_star');
  }

  if (totalCorrect >= 15) {
    unlocked.push('problem_solver');
  }

  if (state.phaseComplete && Object.values(state.phaseComplete).every(Boolean)) {
    unlocked.push('math_master');
  }

  return unlocked;
}
