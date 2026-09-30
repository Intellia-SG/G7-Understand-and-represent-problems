// src/data/storyContent.js
// 4 Widescreen Story Panels for RepresentQuest (Grade 7 · Understand and Represent Problems)

export const STORY_PANELS = [
  {
    panel: 0,
    title: "The Big Client Request 📋",
    text: "At our junior event studio, a client request lands on the desk: 40 dining chairs at $6 each, 8 banquet tables at $25 each, and a note that room temperature is 24°C. \"Before we start booking,\" Buzz the Bee buzzed, \"we must understand the request! What is Given, what is Unknown, and what is just noise?\" The team carefully highlighted the key quantities.",
    highlight: "📋 Given: 40 chairs @ $6, 8 tables @ $25 · Target: Total Cost · Noise: 24°C",
    character: "Buzz the Bee",
    characterEmoji: "🐝",
    imageBg: "radial-gradient(circle, #ff9f43 0%, #d35400 100%)",
    imageEmoji: "📋",
  },
  {
    panel: 1,
    title: "Filter Signal from Noise 🔍",
    text: "Buzz pointed his pointer at the temperature note. \"The client says the hall is 24°C, but that doesn't change the rental bill! That's distracting noise.\" The planners crossed out 24°C with a red marker. \"Now the facts are crystal clear: chairs cost 40 × $6 = $240, and tables cost 8 × $25 = $200. Filtering noise prevents costly mistakes!\" Buzz cheered.",
    highlight: "🔍 Filter Noise: Ignore 24°C · Focus on: Chairs ($240) + Tables ($200) ✅",
    character: "Buzz the Bee",
    characterEmoji: "🐝",
    imageBg: "radial-gradient(circle, #f472b6 0%, #db2777 100%)",
    imageEmoji: "🔍",
  },
  {
    panel: 2,
    title: "Pick the Right Model 📊",
    text: "Next, the team opened their representation toolkit. \"Which tool matches our problem?\" asked Buzz. For combining chair and table costs into a grand total, a Part-Whole Bar model is perfect! Two parts combine to make the unknown whole. For comparing two quantities, use comparison bars. For schedules, build a table. Matching the model to the structure makes the plan crystal clear!",
    highlight: "📊 Model: Part-Whole Bar · [ Chairs: $240 ] + [ Tables: $200 ] = [ Total: ? ]",
    character: "Buzz the Bee",
    characterEmoji: "🐝",
    imageBg: "radial-gradient(circle, #ffd54f 0%, #ffb300 100%)",
    imageEmoji: "📊",
  },
  {
    panel: 3,
    title: "From Plan to Booking! 🏆",
    text: "With the bar model drawn, Buzz translated the picture into the ready-to-book equation: Total = 40($6) + 8($25) = $440. \"We don't just guess numbers,\" Buzz smiled proudly. \"We understand the request, filter the noise, build the representation, and state the exact next step!\" The studio director stamped the plan: APPROVED FOR BOOKING! 🏆",
    highlight: "🏆 Total = 40 × $6 + 8 × $25 = $240 + $200 = $440 · Plan Approved! ✅",
    character: "Buzz the Bee",
    characterEmoji: "🐝",
    imageBg: "radial-gradient(circle, #4ade80 0%, #16a34a 100%)",
    imageEmoji: "🏆",
  },
];
