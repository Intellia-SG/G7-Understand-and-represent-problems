// src/utils/badgeEngine.js
// 8 Badge definitions and unlock triggers for RepresentQuest (PRD §10 / TRD §7)

export const BADGES = [
  {
    id: 'first_detail_noted',
    icon: '📝',
    label: 'First Detail Noted 📝',
    description: 'Logged your very first correct detail in the planning studio!'
  },
  {
    id: 'smooth_planning',
    icon: '🎈',
    label: 'Smooth Planning 🎈',
    description: 'Achieved a streak of 5 correct answers in a row!'
  },
  {
    id: 'planning_streak',
    icon: '🔥',
    label: 'Event Planning Streak 🔥',
    description: 'Reached an impressive 10-answer winning streak!'
  },
  {
    id: 'full_planning_kit',
    icon: '🧰',
    label: 'Full Planning Kit 🧰',
    description: 'Completed all 4 interactive simulation stations!'
  },
  {
    id: 'event_approved',
    icon: '⭐⭐⭐',
    label: 'Event Approved ⭐⭐⭐',
    description: 'Earned a flawless 3-star rating in any Practice World!'
  },
  {
    id: 'client_delighted',
    icon: '🎉',
    label: 'Client Delighted 🎉',
    description: 'Defeated an Event Boss in a Boss Battle challenge!'
  },
  {
    id: 'dedicated_planner',
    icon: '📆',
    label: 'Dedicated Planner 📆',
    description: 'Answered 20 or more questions in Practice phase!'
  },
  {
    id: 'master_event_director',
    icon: '🏆',
    label: 'Master Event Director Badge 🏆',
    description: 'Successfully completed the entire 5-phase learning journey!'
  },
];

export function checkBadges(state) {
  const unlocked = [];

  // 1. First correct answer
  if (state.totalStars > 0 || state.xp > 0 || (state.worldResults && state.worldResults.some(r => r > 0))) {
    unlocked.push('first_detail_noted');
  }

  // 2. 5-answer streak
  if (state.maxStreak >= 5) {
    unlocked.push('smooth_planning');
  }

  // 3. 10-answer streak
  if (state.maxStreak >= 10) {
    unlocked.push('planning_streak');
  }

  // 4. All 4 Simulate stations complete
  if (state.simStationsComplete && state.simStationsComplete.length >= 4 && state.simStationsComplete.every(Boolean)) {
    unlocked.push('full_planning_kit');
  }

  // 5. Any world scores 3 stars
  if (state.worldResults && state.worldResults.some(score => score !== null && score >= 3)) {
    unlocked.push('event_approved');
  }

  // 6. Any Boss Battle won
  if (state.bossesDefeated && state.bossesDefeated.length > 0) {
    unlocked.push('client_delighted');
  }

  // 7. 20+ questions answered in Practice
  const practiceCount = state.totalQuestionsAnswered || (state.xp ? Math.floor(state.xp / 10) : 0);
  if (practiceCount >= 20) {
    unlocked.push('dedicated_planner');
  }

  // 8. Full 5-phase journey complete
  if (state.phaseComplete && Object.values(state.phaseComplete).every(Boolean)) {
    unlocked.push('master_event_director');
  }

  return unlocked;
}
