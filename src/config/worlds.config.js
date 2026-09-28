// src/config/worlds.config.js
// 10 topic-themed worlds for RepresentQuest (TRD §4.1 / PRD §9)

export const WORLDS = [
  {
    id: 0,
    name: "The Client's Request",
    emoji: "🗣️",
    accent: "var(--world-0)",
    description: "Identify given info and the unknown; restate in own words",
    conceptFocus: "identify-given-and-unknown",
    range: "Q1–10",
    boss: { name: "The Mumbling Client", emoji: "🗣️", reward: "Listener's Badge" }
  },
  {
    id: 1,
    name: "Filtering the Wish List",
    emoji: "📝",
    accent: "var(--world-1)",
    description: "Spot information not needed to solve the problem",
    conceptFocus: "identify-irrelevant-information",
    range: "Q11–20",
    boss: { name: "The Overloaded Wish List", emoji: "📝", reward: "Filter Badge" }
  },
  {
    id: 2,
    name: "Picking the Planning Tool",
    emoji: "🤔",
    accent: "var(--world-2)",
    description: "Choose the right representation for a problem's structure",
    conceptFocus: "select-representation-strategy",
    range: "Q21–30",
    boss: { name: "The Undecided Planner", emoji: "🤔", reward: "Toolkit Badge" }
  },
  {
    id: 3,
    name: "Splitting the Budget",
    emoji: "💸",
    accent: "var(--world-3)",
    description: "Construct a part-whole bar model",
    conceptFocus: "construct-part-whole-bar-model",
    range: "Q31–40",
    boss: { name: "The Broken Budget", emoji: "💸", reward: "Part-Whole Badge" }
  },
  {
    id: 4,
    name: "Who Gets More?",
    emoji: "⚖️",
    accent: "var(--world-4)",
    description: "Construct a comparison bar model",
    conceptFocus: "construct-comparison-bar-model",
    range: "Q41–50",
    boss: { name: "The Lopsided Guest List", emoji: "⚖️", reward: "Comparison Badge" }
  },
  {
    id: 5,
    name: "The Guest List Table",
    emoji: "📋",
    accent: "var(--world-5)",
    description: "Construct a table/systematic list",
    conceptFocus: "construct-table-or-list",
    range: "Q51–60",
    boss: { name: "The Chaotic RSVP Pile", emoji: "📋", reward: "Organizer's Badge" }
  },
  {
    id: 6,
    name: "Mapping the Venue",
    emoji: "🗺️",
    accent: "var(--world-6)",
    description: "Construct a diagram for a spatial/relational problem",
    conceptFocus: "construct-diagram",
    range: "Q61–70",
    boss: { name: "The Misplaced Venue Map", emoji: "🗺️", reward: "Diagram Badge" }
  },
  {
    id: 7,
    name: "From Plan to Booking",
    emoji: "📅",
    accent: "var(--world-7)",
    description: "Translate a representation into a next-step number sentence",
    conceptFocus: "translate-representation-to-plan",
    range: "Q71–80",
    boss: { name: "The Delayed Booking", emoji: "📅", reward: "Planner's Badge" }
  },
  {
    id: 8,
    name: "When Bars Won't Balance",
    emoji: "💥",
    accent: "var(--world-8)",
    description: "Recognise when a bar model should become an algebraic one",
    conceptFocus: "recognize-when-algebra-needed",
    range: "Q81–90",
    boss: { name: "The Overflowing Budget Bar", emoji: "💥", reward: "Algebra Bridge Badge" }
  },
  {
    id: 9,
    name: "The Grand Event Review",
    emoji: "🎉",
    accent: "var(--world-9)",
    description: "Mixed review of every concept above",
    conceptFocus: "mixed-review",
    range: "Q91–100",
    boss: { name: "The Master Event Director", emoji: "🎉", reward: "Master Planner Trophy" }
  },
];
