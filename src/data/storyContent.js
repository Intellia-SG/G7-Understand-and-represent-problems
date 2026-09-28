// src/data/storyContent.js
// 4 canonical Story Panels for RepresentQuest (PRD §8.2 / TRD §4.3)
// Note: Per user instructions, no English character names are used in the story phase.
// Characters are referred to conceptually (The Junior Planners / Buzz the Bee 🐝).

export const STORY_PANELS = [
  {
    panel: 1,
    title: "The Big Request",
    subtitle: "A Busy Day at the Event Studio",
    quote: "Every word problem is a client request waiting to be understood!",
    text: "At our junior event-planning studio, a brand new client request lands on the desk: a grand banquet with numbers, guest tallies, and one confusing extra detail that has nothing to do with the party setup. Before rushing to book anything, the planners pause. Reading quickly without checking can lead to costly mistakes!",
    highlight: "Read carefully before sketching or calculating!",
    character: "Buzz the Bee",
    characterEmoji: "🐝",
    imageBg: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    imageEmoji: "📋",
    keyConcept: "Client requests often include extra distracting information."
  },
  {
    panel: 2,
    title: "Understand Before You Plan",
    subtitle: "Separating Signal from Noise",
    quote: "Spot what is Given, what is Unknown, and filter out the noise!",
    text: "Buzz the Bee hovers over the desk and reminds the team: 'Never draw a plan until you can state two things clearly: What information is Given? And what is the Unknown you are asked to find?' Next, cross out details that do not change the mathematical relationships, like party colors or start times.",
    highlight: "Given + Unknown + Filter = A Clean Problem!",
    character: "Buzz the Bee",
    characterEmoji: "🐝",
    imageBg: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
    imageEmoji: "🔍",
    keyConcept: "Filter out irrelevant noise so only math facts remain."
  },
  {
    panel: 3,
    title: "Picking the Right Tool",
    subtitle: "Choosing from the Representation Toolkit",
    quote: "Bars, tables, diagrams — and letters when bars won't balance!",
    text: "Every problem has a structure. For budgets split into pieces, use a Part-Whole Bar. For two guest counts where one is three times the other, use a Comparison Bar. For multi-step schedules or quantities, build a Table or List. For room layouts, sketch a Diagram. And when the unknown isn't a clean part of a whole, it's time to bridge to algebra: let n = the unknown!",
    highlight: "Match the tool to the problem structure!",
    character: "Buzz the Bee",
    characterEmoji: "🐝",
    imageBg: "linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)",
    imageEmoji: "🧰",
    keyConcept: "Different structures need different representations."
  },
  {
    panel: 4,
    title: "From Plan to Party",
    subtitle: "The Plan is the Next Step, Not the Final Solve",
    quote: "A clear representation tells you the exact next step to take!",
    text: "With the request filtered and the right model drawn, the team translates the picture into a clean next-step number sentence — stopping at the plan, ready for booking! When the representation is accurate, finding the solution becomes straightforward. The studio director stamps the plan: APPROVED!",
    highlight: "Understand → Filter → Represent → State the Next Step!",
    character: "Buzz the Bee",
    characterEmoji: "🐝",
    imageBg: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
    imageEmoji: "🎉",
    keyConcept: "Representing clearly prepares the exact next step."
  }
];
