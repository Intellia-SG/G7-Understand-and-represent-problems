# RepresentQuest — Module TRD
**Grade 7 · Understand and Represent Problems**
*(Technical companion to `RepresentQuest_Grade7_PRD.md`, produced from `Intellia_Module_Blueprint_TRD.md`. Repo: `represent-quest-main`. Default clone source: `G2-Money-Money-main`, unless a more recent sibling — `equation-quest-main`, `pattern-quest-main`, `mosaic-quest-main`, `progression-quest-main`, `rule-quest-main`, `scroll-quest-main`, or `nth-quest-main` — is designated as the actual clone source at build time. Do **not** clone from a `blueprint-quest-main` build if one was started — that theme has been dropped; see PRD §15.5.)*

---

## 1. Reference Analysis Notes — Gotcha Check

Check each fresh against whichever repo is actually cloned from, per platform blueprint §1:

1. **Dead/duplicate `src/features/*` folder.** Confirm `App.jsx`'s actual imports before copying anything.
2. **Hardcoded story-panel count.** This module uses the default **4 panels** — likely a no-op, but confirm against the actual clone source.
3. **Static vs. procedural question bank.** Build `data/questionBank.js` procedurally across the 10 concept generators in §4.1. As with the dropped architecture-themed pass at this topic, most of this module's correctness lives in **representation structure** (which bar is the whole, which quantities are compared, what a table's columns mean) rather than a single numeric answer — see the module-specific risk below.
4. **Viewport-clipping bug.** Proactively apply the `100dvh` + `ResizeObserver` header-height fix.
5. **Leftover branding strings.** Check `index.html`'s `<title>` and `README.md` for stale references from whichever module was actually cloned, including leftover mascot/character references from any of the eight prior Grade 7 modules — **and specifically any leftover "Blueprint"/architecture-studio copy** if a `blueprint-quest-main` scaffold exists anywhere in reach; none of that copy belongs in this build.

**Module-specific risk to add:** this is the platform's first *shipped* module where a plurality of questions are graded on **which representation is correct**, not a computed number. A "correct" bar model, table, or diagram must be generated from the problem's actual stated relationships programmatically (§4.4), never asserted by a question-template author — the same class of risk MosaicQuest flagged for geometry, applied here to word-problem structure instead of shapes.

## 2. Tech Stack

Unchanged from platform blueprint §2.1 — reuse verbatim (same dependency versions as the eight prior Grade 7 TRDs). `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `vercel.json` — reuse as-is.

## 3. Folder Structure

```
represent-quest-main/
├── public/assets/{audio/, story/}
├── scripts/
│   ├── generate_audio.js         # MODIFY: new `phrases` array (§8)
│   └── clean_audio.js            # reuse as-is
├── src/
│   ├── assets/story/             # story_1.png ... story_4.png
│   ├── components/
│   │   ├── IntroScreen.jsx/.css  # MODIFY: title/copy only
│   │   ├── ProgressMap.jsx/.css  # reuse as-is
│   │   ├── shared/
│   │   │   ├── Mascot.jsx/.css              # reuse as-is (props swap to Buzz the Bee)
│   │   │   ├── FeedbackOverlay.jsx/.css     # reuse as-is
│   │   │   ├── FloatingNumbers.jsx/.css     # reuse as-is
│   │   │   └── PlanVisual.jsx               # NEW — §5.1
│   │   ├── gamification/
│   │   │   ├── KingdomMap.jsx/.css  # reuse as-is
│   │   │   └── StarRating.jsx       # reuse as-is
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx/.css  # MODIFY: import PlanVisual
│   │   │   └── BossBattleModal.jsx/.css   # reuse as-is
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx/.css    # MODIFY: content only
│   │   │   ├── StoryPhase.jsx/.css     # MODIFY: content only
│   │   │   ├── SimulatePhase.jsx/.css  # MODIFY: 4 new station imports/labels (standard 4-tab architecture)
│   │   │   ├── PlayPhase.jsx/.css      # reuse as-is
│   │   │   └── ReflectPhase.jsx/.css   # MODIFY: 3 new recap questions (§6.3)
│   │   └── simulations/
│   │       ├── ThePlanningBoard.jsx         # NEW — Concept Discovery Lab — §6
│   │       ├── MatchThePlan.jsx             # NEW — Build-to-Target Challenge — §6
│   │       ├── FromRequestToReadyToBook.jsx # NEW — Multi-Step/Composite Construction — §6
│   │       ├── TheFlawedPlan.jsx            # NEW — Error-Detective — §6
│   │       └── Stations.css                 # MODIFY: extend with bar-model, table, and diagram visual classes
│   ├── config/
│   │   ├── worlds.config.js       # MODIFY: 10 topic-themed worlds — §4.1
│   │   ├── characters.config.js   # MODIFY: Rania / Vikram / Buzz — §4.2
│   │   └── audio.config.js        # reuse as-is
│   ├── core/hooks/useViewport.js  # reuse as-is
│   ├── hooks/useAudio.js          # reuse as-is
│   ├── data/
│   │   ├── storyContent.js        # MODIFY: 4 story panels — §4.3
│   │   └── questionBank.js        # MODIFY: procedurally generated 100 Qs — §4.4
│   ├── utils/
│   │   ├── audio.js               # reuse as-is
│   │   ├── audioMap.js            # auto-generated — do not hand-edit
│   │   ├── narration.js           # MODIFY: topic-specific phase scripts — §8
│   │   ├── badgeEngine.js         # MODIFY: relabelled BADGES array only — §7
│   │   ├── scoring.js             # reuse as-is
│   │   ├── shuffle.js             # reuse as-is
│   │   └── representationMath.js  # NEW — §4.4
│   ├── styles/
│   │   ├── design-tokens.css      # MODIFY: 10 new --world-N accent colors — §9
│   │   └── globals.css            # reuse as-is (apply viewport fix from §1.4 proactively)
│   ├── App.jsx                    # MODIFY only if the clone source's panel-count logic differs from 4 (§1.2)
│   ├── App.css / main.jsx / index.css   # reuse as-is
├── index.html / package.json / vite.config.js / tailwind.config.js / postcss.config.js / vercel.json / .oxlintrc.json / .gitignore
└── README.md                      # MODIFY: module-specific + art-brief (PRD §13)
```

## 4. Data Layer

### 4.1 `config/worlds.config.js`
Ten entries in the fixed shape, populated from PRD §9:

```js
export const WORLDS = [
  { id: 0, name: "The Client's Request", emoji: "🗣️", accent: "var(--world-0)",
    description: "Identify given info and the unknown; restate in own words",
    conceptFocus: "identify-given-and-unknown",
    boss: { name: "The Mumbling Client", emoji: "🗣️", reward: "Listener's Badge" } },
  { id: 1, name: "Filtering the Wish List", emoji: "📝", accent: "var(--world-1)",
    description: "Spot information not needed to solve the problem",
    conceptFocus: "identify-irrelevant-information",
    boss: { name: "The Overloaded Wish List", emoji: "📝", reward: "Filter Badge" } },
  { id: 2, name: "Picking the Planning Tool", emoji: "🤔", accent: "var(--world-2)",
    description: "Choose the right representation for a problem's structure",
    conceptFocus: "select-representation-strategy",
    boss: { name: "The Undecided Planner", emoji: "🤔", reward: "Toolkit Badge" } },
  { id: 3, name: "Splitting the Budget", emoji: "💸", accent: "var(--world-3)",
    description: "Construct a part-whole bar model",
    conceptFocus: "construct-part-whole-bar-model",
    boss: { name: "The Broken Budget", emoji: "💸", reward: "Part-Whole Badge" } },
  { id: 4, name: "Who Gets More?", emoji: "⚖️", accent: "var(--world-4)",
    description: "Construct a comparison bar model",
    conceptFocus: "construct-comparison-bar-model",
    boss: { name: "The Lopsided Guest List", emoji: "⚖️", reward: "Comparison Badge" } },
  { id: 5, name: "The Guest List Table", emoji: "📋", accent: "var(--world-5)",
    description: "Construct a table/systematic list",
    conceptFocus: "construct-table-or-list",
    boss: { name: "The Chaotic RSVP Pile", emoji: "📋", reward: "Organizer's Badge" } },
  { id: 6, name: "Mapping the Venue", emoji: "🗺️", accent: "var(--world-6)",
    description: "Construct a diagram for a spatial/relational problem",
    conceptFocus: "construct-diagram",
    boss: { name: "The Misplaced Venue Map", emoji: "🗺️", reward: "Diagram Badge" } },
  { id: 7, name: "From Plan to Booking", emoji: "📅", accent: "var(--world-7)",
    description: "Translate a representation into a next-step number sentence",
    conceptFocus: "translate-representation-to-plan",
    boss: { name: "The Delayed Booking", emoji: "📅", reward: "Planner's Badge" } },
  { id: 8, name: "When Bars Won't Balance", emoji: "💥", accent: "var(--world-8)",
    description: "Recognise when a bar model should become an algebraic one",
    conceptFocus: "recognize-when-algebra-needed",
    boss: { name: "The Overflowing Budget Bar", emoji: "💥", reward: "Algebra Bridge Badge" } },
  { id: 9, name: "The Grand Event Review", emoji: "🎉", accent: "var(--world-9)",
    description: "Mixed review of every concept above",
    conceptFocus: "mixed-review",
    boss: { name: "The Master Event Director", emoji: "🎉", reward: "Master Planner Trophy" } },
];
```

### 4.2 `config/characters.config.js`
```js
export const CHARACTERS = {
  rania: { name: "Rania", role: "Plans before checking the request", emoji: "👧🏻", colour: "var(--char-1)", mascotEmoji: "🐝" },
  vikram: { name: "Vikram", role: "Rereads and filters first", emoji: "🧑🏽", colour: "var(--char-2)", mascotEmoji: "🐝" },
  buzz: { name: "Buzz the Bee", role: "Mascot & mentor", emoji: "🐝", colour: "var(--mascot)", mascotEmoji: "🐝" },
};
export const MASCOT = { name: "Buzz the Bee", emoji: "🐝" };
```

### 4.3 `data/storyContent.js`
`STORY_PANELS` array, length 4, per PRD §8.2, fixed shape `{ panel, title, text, highlight, character, characterEmoji, imageBg, imageEmoji }`. Titles: "The Big Request," "Understand Before You Plan," "Picking the Right Tool," "From Plan to Party."

### 4.4 Question Bank — Procedural Generation

**`utils/representationMath.js`** — pure helper functions shared by the question generator and the Simulate stations. Most of these return **structured representation descriptors** (for `PlanVisual.jsx` to render) rather than bare numbers.

| Function | Purpose |
|---|---|
| `generateProblemContext(contentArea)` | Builds a word problem in one of several curated `contentArea`s (budgets, guest counts, schedules, quantities, seating) — enforcing the context-variety requirement from PRD §3/§15.2 across the bank as a whole. |
| `extractGivenAndUnknown(problem)` | Returns `{ given: [...], unknown }` for a generated problem — the **single source of truth** behind every World 0 "correct" answer, generated alongside the problem itself rather than asserted afterward. |
| `injectIrrelevantDetail(problem)` | Adds one genuinely-unused detail to a problem (e.g. an event start time, an unrelated item count) and records it as `irrelevantDetail`, so World 1's "correct" answer is always the same detail the generator itself added — never a detail a template author merely *believes* is irrelevant. |
| `buildPartWholeBarModel(problem)` | Returns a structured bar-model descriptor `{ whole, parts: [...] }` derived directly from the problem's stated quantities. |
| `buildComparisonBarModel(problem)` | Returns `{ quantityA, quantityB, ratio, unitsA, unitsB }` derived directly from the problem's stated comparison — the direction of the comparison (who has more of what) is read from the problem text's actual structure, not assumed. |
| `buildTableRepresentation(problem)` | Returns a table descriptor (`columns`, `rows`) for problems with multiple related quantities/cases. |
| `buildDiagramRepresentation(problem)` | Returns a simple labelled-diagram descriptor for spatial/relational problems (e.g. a venue-with-a-walkway layout). |
| `recommendRepresentationType(problem)` | Returns `"bar-model-part-whole"`, `"bar-model-comparison"`, `"table"`, `"diagram"`, or `"algebra"` for a given problem — the single source of truth behind World 2's and World 8's "correct" answers; classification is derived from concrete structural features of `problem` (e.g. "unknown is not a clean fraction/ratio of a stated whole" → `"algebra"`), never hand-picked per question. |
| `translateToNextStep(representation)` | Returns the number-sentence/equation string that follows from a completed representation (e.g. `"60 ÷ 5 × 2"` from a bar model) — deliberately stops short of evaluating it, per PRD §3's scope boundary with EquationQuest. |
| `verifyRepresentationMatchesProblem(problem, representation)` | Checks a candidate representation's structure against `problem`'s actual given/unknown/relationships — used to generate the Error-Detective's "flawed plan" mistakes (wrong whole, swapped comparison, irrelevant-detail-treated-as-relevant) by deliberately failing this check, never hand-authored. |

**Constraints (hard requirements, not inline magic numbers):**
- Every representation-correctness question's "correct" answer is produced by calling the matching `build*`/`recommendRepresentationType` function against the same `problem` object the question text was generated from — never authored independently and then paired up, which is how a mismatch could silently slip in.
- `injectIrrelevantDetail`'s detail is genuinely never referenced by `translateToNextStep`'s output — assert this in generation, not just by inspection.
- `recommendRepresentationType`'s `"algebra"` classification (World 8) is only used when the structural feature is unambiguous (per PRD §14) — never generated for a borderline case.
- `generateProblemContext` cycles through its curated content areas so no single context dominates the 100-question bank (PRD §3, §14).

**`data/questionBank.js` generation:**
One or more template functions per `conceptFocus` (10 concept slugs from §4.1), each producing exactly 4 options — 1 correct + 3 distractors generated via `verifyRepresentationMatchesProblem`'s deliberately-failing variants (wrong whole, swapped comparison direction, irrelevant detail included, bar model forced where algebra was needed) rather than arbitrary wrong answers. Fixed output schema (unchanged): `{ id, districtId, category, visual, questionText, options, correctAnswer, explanation, hint1, hint2, visualData }`. Also export `DISTRICTS` (derived from `WORLDS`) so `PlayPhase.jsx`'s existing import is unmodified.

## 5. Component Specs

### 5.1 `PlanVisual.jsx`
Replaces the reference's domain visual component. Takes `{ type, data, compact }`. Supported `type` values: `"bar-model-part-whole"`, `"bar-model-comparison"`, `"table"`, `"diagram"`, `"request-annotated"` (the problem text itself with given/unknown/irrelevant detail highlighted and text-labelled, used for Worlds 0–1). Every type renders full text labels for every part — never colour-only to distinguish whole/part or compared quantities (PRD §12).

`compact` prop shrinks rendering for inline use inside `QuestionRenderer.jsx`. Also reused inside the Simulate stations (The Planning Board cycles through all four representation types for one shared problem).

## 6. Simulate Station Specs

All 4 follow the fixed per-station contract: `<StationComponent onComplete={fn} audioEnabled={bool} />`, self-contained internal state, live SVG visuals themed with `design-tokens.css` variables, a `station-success` panel with a "Complete Station ✓" CTA, and keyboard-operable +/− controls alongside any slider/drag interaction. Standard single-pass architecture.

| Component | Archetype | Student manipulates | Live feedback | Completion gate |
|---|---|---|---|---|
| `ThePlanningBoard.jsx` | Concept Discovery Lab | Picks a sample client request; toggles between bar-model, table, and diagram views of the same request | `PlanVisual` re-renders the same underlying data in each selected type, so the student sees what each tool does and doesn't capture | Free exploration across at least 3 sample requests and all representation types, **plus one confirmation question** ("which of these tools would you use for a three-way guest split?") per the platform's default archetype, as in RuleQuest/ScrollQuest/NthQuest |
| `MatchThePlan.jsx` | Build-to-Target Challenge | Selects a representation type, then completes it (drags bar segments to proportion, fills table cells) to match the request | A live check compares the built representation against `verifyRepresentationMatchesProblem`, with a text-labelled match/no-match indicator | All rounds' representations correctly built and type-matched; a round can be retried without penalty |
| `FromRequestToReadyToBook.jsx` | Multi-Step/Composite Construction | Four chained steps on one request: (1) mark given/unknown, (2) cross out the irrelevant detail, (3) choose and build a representation, (4) state the next-step number sentence via `translateToNextStep` | Each step's result renders live and feeds the next; the final number sentence is shown but never evaluated | All four steps completed correctly in sequence — targets PRD LOs 1, 2, 3, and 8 |
| `TheFlawedPlan.jsx` | Error-Detective | Taps the part of a rival junior planner's representation that's wrong, then supplies the correction | The tapped part highlights; mistake pool generated via `verifyRepresentationMatchesProblem`'s failing variants, never hand-authored | Correctly identifying the erroneous part and supplying the fix |

Wire all 4 into `SimulatePhase.jsx`'s `STATIONS` array and station-index render switch; tab bar, footer navigation, progress dots, and `COMPLETE_SIM_STATION`/`ADVANCE_SIM_STATION` gating logic are reused verbatim from the reference.

### 6.3 `ReflectPhase.jsx` Recap Questions
Replace the 3 hard-coded recap questions with 3 targeting sketching-before-understanding and single-detail misrepresentation (PRD §8.5), matching the Error-Detective station's focus.

## 7. Gamification

`utils/scoring.js` (`calcXP`, `calcStars`) — reuse formulas as-is. `utils/badgeEngine.js` — reuse `checkBadges(state)` trigger logic as-is; only the `BADGES` array's display strings change, per PRD §10's rename table (First Detail Noted, Smooth Planning, Event Planning Streak, Full Planning Kit, Event Approved, Client Delighted, Dedicated Planner, Master Event Director Badge).

## 8. Audio Pipeline

`config/audio.config.js`, `utils/audio.js`, `hooks/useAudio.js`, `utils/audioMap.js` — reuse mechanics as-is.

Rewrite `utils/narration.js` function *bodies* (signatures unchanged, same list as prior modules' TRDs) and `scripts/generate_audio.js`'s `phrases` array using PRD §11's rules: "given information"/"the unknown" always named explicitly; "irrelevant information" paired with a plain-language explanation on first use; bar-model narration always names which bar is which; the World 7 handoff step always called "the next step," never "the answer"; `let n = …`/`let x = …` phrased identically to EquationQuest's narration when it appears in World 8. After content lock: `npm run generate-audio` then `npm run clean-audio`.

## 9. Design Tokens

`styles/design-tokens.css` — reuse core palette/type/radii/shadows/transitions as-is. Regenerate only the `--world-0` through `--world-9` accent block, using an event-planning palette distinct from the eight prior modules' palettes:

| World | Accent (indicative) |
|---|---|
| 0 — The Client's Request | `#6A0572` (invitation purple) |
| 1 — Filtering the Wish List | `#AB83A1` (soft mauve) |
| 2 — Picking the Planning Tool | `#F72585` (party pink) |
| 3 — Splitting the Budget | `#3A0CA3` (budget indigo) |
| 4 — Who Gets More? | `#4361EE` (guest-list blue) |
| 5 — The Guest List Table | `#4CC9F0` (RSVP cyan) |
| 6 — Mapping the Venue | `#7209B7` (venue violet) |
| 7 — From Plan to Booking | `#F77F00` (confirmation orange) |
| 8 — When Bars Won't Balance | `#D00000` (overflow red) |
| 9 — The Grand Event Review | `#240046` (deep celebration purple — most dramatic, for the finale) |

## 10. Build, QA, and Delivery

1. **Question bank stress test** — ≥300 randomized generations (30,000 questions) across all 10 concept categories and all curated content areas; assert no duplicate options, no malformed/`NaN`/`undefined` fields.
2. **Representation-correctness audit (module-specific, this module's highest-stakes check)** — for every representation question, programmatically confirm the labelled "correct" representation was produced by the matching `build*`/`recommendRepresentationType` function against the same problem object, and that every distractor genuinely fails `verifyRepresentationMatchesProblem` — the direct analogue of MosaicQuest's geometry-correctness audit, applied to word-problem structure.
3. **Irrelevant-detail audit** — confirm every World 1 item's flagged detail is genuinely absent from `translateToNextStep`'s output for that problem.
4. **Content-variety audit** — confirm no single `contentArea` accounts for a disproportionate share of the 100-question bank (PRD §3, §15.2).
5. **Algebra-bridge boundary audit** — confirm every World 8 item's classification is unambiguous, not generated near the boundary between "bar model still works" and "algebra needed."
6. **Audio parity check** — every string passed to a narration helper has an exact match in `audioMap.js`, or is intentionally dynamic.
7. **Full user-journey walkthrough** — Wonder → Story (all 4 panels) → Simulate (all 4 stations completable, tab-gating correct) → Practice (World Map, all 4 modes, all 10 Boss Battles, badges) → Reflect — zero console/page errors.
8. **Production build check** — `npm install && npm run build` succeeds from a clean extract.
9. **Accessibility spot-check** — fonts/touch targets at Secondary-appropriate sizing; every representation type fully text-labelled, not colour-only; drag interactions have keyboard equivalents.
10. **Delivery checklist** — zip excludes `node_modules/`/`dist/`; 4 story image placeholders with art-brief README; `README.md` updated and checked for leftover branding (including any leftover architecture/"Blueprint" copy, §1.5); `.env.local.example` documents `VITE_ELEVENLABS_API_KEY` with no real key committed.

## 11. Risks

- **Representation-correctness is a fundamentally different QA problem than any purely-numeric sibling module's "clean number" check** — it requires the generator and the verifier to share one source of truth (`problem`) end-to-end, not just validate a final numeric output. A generation pipeline that builds the question text and the "correct" representation from *separate* code paths is the single most likely source of a silent mismatch; §4.4's constraint that every correct answer is produced by calling the build function against the same problem object is the load-bearing guardrail here.
- **This module ends deliberately short of solving.** World 7's `translateToNextStep` output is graded as a string (the next step), never evaluated to a number — a build shortcut that quietly evaluates it and grades the final answer instead would silently expand this module's scope into EquationQuest's territory; keep the two outputs (the next-step string vs. its evaluated value) clearly separate in the data model.
- **Context-variety enforcement (§4.4, §10.4) is easy to let slip** if question templates are added ad hoc after the initial generation pass — worth re-running the content-variety audit after any bank expansion, not just at initial ship.
- **Theme-rework risk.** This module replaces an earlier, differently-themed pass at the same topic (§1.5). If any assets, copy, or config from that earlier pass exist in a shared location, confirm none of it — mascot references, world names, "Blueprint" copy — leaks into this build during setup.
- **Concept Discovery Lab tension, still unresolved for this module** (PRD §15.3), consistent with RuleQuest, ScrollQuest, and NthQuest rather than ProgressionQuest.
