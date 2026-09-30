// src/utils/narration.js
// Voice narration scripts for RepresentQuest Grade 7 following PRD §11 & TRD §8 rules

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const instruct  = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });

export function wonderNarration() {
  return [
    say("Welcome to RepresentQuest! Let's investigate the big planning request mystery!"),
    say("A client's request lands on your desk: three numbers, a question, and one detail that doesn't matter at all."),
    ask("Can you identify what is given information and what is the unknown being asked before anyone starts booking?"),
    cheer("Let's investigate how understanding facts and drawing representations beats guessing every time!"),
  ];
}

export function storyNarration(panel) {
  const scripts = [
    [
      say("At our junior event-planning studio, every word problem is a client request waiting to be understood."),
      say("A grand banquet request lands on the desk with numbers, guest tallies, and one confusing extra detail."),
      think("How can we represent this request clearly? the junior planners wondered."),
      cheer("Buzz the Bee stops the planners before they sketch anything: always understand the request first!"),
    ],
    [
      say("Buzz the Bee reviews the first two golden rules of problem solving."),
      say("Identify the given information, and name the unknown you are asked to find."),
      say("Then cross out irrelevant information — details you do not need for the math, like ambient temperature or room colors."),
      cheer("Filter the noise so only the math facts remain!"),
    ],
    [
      say("Choose the right tool from your toolkit: a part-whole bar model for split totals, a comparison bar model for ratios, a table for multi-step schedules, or a diagram for spatial layouts."),
      say("And when bars won't balance because the unknown is on both sides of a relationship, it is time to bridge to algebra: let n equal the unknown."),
      cheer("Pick the representation that matches the problem structure!"),
    ],
    [
      say("With the request filtered and the representation complete, the team formulates the next-step number sentence."),
      say("Notice we stop at the plan, ready for booking, without calculating the final answer."),
      cheer("The studio director stamps the plan: Approved!"),
    ],
  ];

  return scripts[panel] || scripts[0];
}

export function simStationIntro(stationIdx) {
  const intros = [
    [
      instruct("Welcome to Station A — The Planning Board!"),
      instruct("Explore how the exact same client request can be represented using a part-whole bar model, a comparison bar model, a table, or a spatial diagram."),
    ],
    [
      instruct("Welcome to Station B — Match the Plan!"),
      instruct("Read the client request, pick the matching representation tool, and adjust the units to match the relationship."),
    ],
    [
      instruct("Welcome to Station C — Ready-to-Book Pipeline!"),
      instruct("Follow all four planning steps: mark given information and the unknown, filter out irrelevant noise, choose your tool, and state the next-step number sentence."),
    ],
    [
      instruct("Welcome to Station D — The Flawed Plan!"),
      instruct("Inspect a rival planner's model, spot the seeded mistake — like swapped comparison bars, noise included, or forcing a bar where algebra is needed — and fix it!"),
    ],
  ];

  return intros[stationIdx] || intros[0];
}

export function playQuestionNarration(questionText) {
  return [
    ask(questionText)
  ];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) {
    return [cheer("Incredible planning streak! You are an unstoppable planner! 🔥")];
  }
  if (streak >= 3) {
    return [cheer("Awesome! Three correct plans in a row! ⭐")];
  }
  return [cheer("Spot on! Plan approved! 🎉")];
}

export function playWrongNarration() {
  return [
    think("Not quite — check your given facts, filter out the noise, and try again! 💡")
  ];
}

export function playHint1Narration() {
  return [
    encourage("Here's your first hint! Look at what is given and what the question asks for.")
  ];
}

export function playHint2Narration() {
  return [
    encourage("Here's your final clue! Match the problem structure to the right representation.")
  ];
}

export function districtCompleteNarration() {
  return [
    cheer("World Complete! Spectacular job on this event planning district! 🌟")
  ];
}

export function bossStartNarration() {
  return [
    emphasize("The Boss Battle begins! Answer correctly to approve the client's event and claim your badge!")
  ];
}

export function bossWinNarration() {
  return [
    cheer("Victory! You defeated the boss and claimed the Event World Badge! 👑")
  ];
}

export function reflectNarration() {
  return [
    say("Welcome to the Reflect Phase! Let's review the key problem representation concepts and check your scorecard! 📓")
  ];
}

export function reflectCompleteNarration() {
  return [
    cheer("Outstanding! You have mastered understanding problems, filtering noise, drawing bar models, and bridging to algebra! You are a true Master Event Director! 🏆")
  ];
}
