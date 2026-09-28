# RepresentQuest — Module PRD
**Grade 7 · Understand and Represent Problems**
*(Produced from `Intellia_Module_Blueprint_PRD.md` — {{GRADE}} = Grade 7, {{TOPIC}} = Understand and Represent Problems, {{SPECIAL_INSTRUCTIONS}} = "not a blueprint" — the architecture-studio theme from an earlier pass on this same topic is dropped; this is a fresh theme and full PRD, not a rename)*

---

## 1. Overview

RepresentQuest teaches the stage of problem-solving that comes **before** calculating: reading a word problem, identifying what's given and what's unknown, filtering out information that isn't needed, and choosing and correctly building a representation — a bar model, a table, a list, or a diagram — that captures the problem's structure. It also covers the Secondary 1 turning point where bar models stop being the right tool and an algebraic representation (`let x = …`) takes over. It's framed as a junior event-planning studio: every world is a client's party or event request that must be understood and mapped out *before* anyone starts booking anything.

## 2. Background

This is the ninth Grade 7 (Secondary 1) module built against the platform blueprint's reference architecture, following EquationQuest, PatternQuest, MosaicQuest, ProgressionQuest, RuleQuest, ScrollQuest, NthQuest, and an earlier pass at this exact topic (architecture-studio themed) that has been dropped in favour of this fresh build. It reuses `G2-Money-Money-main`'s five-phase architecture per platform convention.

**This module sits outside the "pattern family" the earlier six sequence/pattern modules built up** — it isn't about sequences at all. It's a **process/heuristics-strand module**: the Understand and Devise-a-Plan stages of Singapore's Polya-based problem-solving approach (Understand → Plan → Do → Check), plus the model-drawing, table, list, and diagram heuristics taught alongside it.

**Relationship to EquationQuest (the one real neighbour):** EquationQuest teaches *solving* — forming and executing a linear equation. RepresentQuest stops one step earlier: understanding a problem and choosing/building its representation, of which an equation is only one option among several (bar model, table, list, diagram). World 7 here ends at "translate the representation into a number sentence or equation" and deliberately does **not** carry through to solving it — that handoff is EquationQuest's job. The two modules are complementary, not overlapping.

## 3. Standards Alignment

**Source:** this maps to the centre of Singapore's MOE Mathematics Curriculum Framework, not to one content chapter. The framework places *Mathematical Problem Solving* at its core, built on Concepts, Skills, **Processes**, **Metacognition**, and Attitudes. Within Processes, this module covers the *Thinking Skills and Heuristics* strand and the first two steps of the Polya-based **Understand → Plan → Do → Check** approach that MOE schools teach continuously from Primary through Secondary — including model drawing (bar models), making a table, making a systematic list, using a diagram, and (new at this stage) recognising when to switch to algebra. Because this strand is taught continuously across all levels rather than introduced fresh at Secondary 1, **no grade-level scope-jump flag applies here** — this is at-level reinforcement and deepening of an already-familiar process, applied to Secondary 1-appropriate problem complexity.

**In-scope skills:**
- Reading a word problem to identify the given information and the unknown, and restating the problem in one's own words.
- Identifying information in a problem that is irrelevant to answering the question.
- Choosing an appropriate representation for a problem's structure: bar model, table, list, or diagram.
- Constructing a part-whole bar model.
- Constructing a comparison bar model (two quantities compared).
- Constructing a table or systematic list to organise a problem with multiple related quantities or cases.
- Constructing a simple diagram for a spatial or relational problem that doesn't suit a bar model.
- Translating a completed representation into a next-step number sentence or equation — stopping at the plan, not the full solve.
- Recognising when a bar model becomes impractical (the unknown isn't a clean part of the whole) and an algebraic representation is the better tool — the explicit Primary-to-Secondary bridge.
- Checking whether a chosen representation actually matches the problem's stated relationships, and revising it if not.

**Adjacent skills treated as bridge only, not tested here:**
- **Carrying out the plan** (solving the equation or calculation once represented) — EquationQuest's job, and the "Do" step of Polya's framework.
- **Checking the final numeric answer for reasonableness** — the "Check" step; referenced narratively in Story but not built into the question bank, to keep this module's scope to Understand + Plan only.
- **Guess-and-check, work-backwards, and act-it-out heuristics** — real MOE-taught heuristics, but a deliberately excluded set so this module doesn't sprawl into a general "all heuristics" catalogue; flagged in §15 as candidates for a possible companion module.

**Domain conventions to encode as house style:**
- Problems are deliberately drawn from **varied real-world contexts** (budgets, guest counts, schedules, quantities, seating) rather than one fixed content area, because the skill being taught — understanding and representing — is meant to transfer across topics, not live inside one of them.
- Every worked example follows the same order: **identify given/unknown → filter noise → choose a representation → build it → state the next step** — never skipping straight to a representation without the identification step shown.
- A bar model is always checked against the problem's actual wording before being accepted as "correct" — matching the domain research finding that a wrong answer is often caused by a single misrepresented piece of information, not a calculation error.

## 4. Learning Objectives

By the end of this module, a student should be able to:
1. Identify the given information and the unknown in a word problem, and restate it in their own words.
2. Identify information in a problem that is irrelevant to answering the question.
3. Choose an appropriate representation (bar model, table, list, or diagram) for a given problem's structure.
4. Construct a part-whole bar model.
5. Construct a comparison bar model.
6. Construct a table or systematic list for a problem with multiple related quantities.
7. Construct a simple diagram for a spatial or relational problem.
8. Translate a representation into a next-step number sentence or equation, and recognise when a bar model should be replaced by an algebraic representation.

Ordering runs foundational → applied (understand → filter → choose → part-whole bars → comparison bars → tables/lists → diagrams → translate to a plan → recognise the algebra bridge), and drives the world sequence in §9.

## 5. Inherited Standards *(Section A of the platform blueprint — copied verbatim, unchanged)*

- **Five-phase architecture:** Wonder → Story → Simulate → Play ("Practice" in-UI) → Reflect.
- **Gamification:** XP per question, 0–3 stars per world, streak tracking, 8 fixed badge triggers (relabelled §10), 10 Boss Battles (5Q/3 lives).
- **Practice modes:** Guided (5Q, hints, untimed), Independent (10Q, no hints), Timed Challenge (8Q, 60s), Boss Battle (5Q, 3 lives).
- **Audio pipeline:** ElevenLabs Alice voice only, 6 emotional presets, pre-generated + dynamic narration, no browser TTS fallback, strict 1:1 narration/on-screen-text parity.
- **Question bank shape:** 10 worlds × 10 questions = 100, procedurally generated, ≥300-run stress test, fixed schema, World 9 (last, 0-indexed) is the mixed-review grand finale.
- **Product standards:** React/Vite/Tailwind/Framer Motion, pixel-faithful `design-tokens.css` reuse, enlarged Simulate/Practice fonts and touch targets, zip delivery with placeholder story art + art-brief README.
- **Simulate phase:** the standard 4 required, archetype-mapped stations.

## 6. Enhancement Requests / Special Instructions

The person explicitly rejected the earlier architecture/"blueprint" theming for this topic. This PRD responds with a full re-theme — a junior event-planning studio — rather than a rename of the prior pass; every named element in §7–§10 is new. All other defaults are unchanged: 4-panel Story (justified §8.2), Singaporean-multicultural naming (§7), theme-specific mascot override with rationale (§7), and the standard 4-station Simulate design (§8.3). The Concept Discovery Lab confirmation-question tension is not re-resolved here (see §15.3).

## 7. Module Identity

- **Module name:** **RepresentQuest**
- **Story theme:** a junior event-planning studio. Every world is a client's request for a party or event — a word problem — that must be understood and mapped out into a plan (a representation) before anything gets booked. Budgets and guest counts make part-whole and comparison bar models feel unusually natural here, and a venue layout gives the diagram world a concrete anchor.
- **Named characters** (Singaporean-multicultural convention, first names only, distinct from all eight sibling modules' pairs):
  - **Rania** — starts sketching a plan before checking what the client actually asked for.
  - **Vikram** — always rereads the request and crosses out anything irrelevant first.
- **Mascot: Buzz the Bee 🐝** *(override, with stated rationale)* — bees are famously organised planners and builders, working from a clear structure before anything is built; a fitting, distinct choice for a module about planning before booking, and distinct from every mascot used in the other eight sibling modules.

## 8. Five-Phase Journey Detail

### 8.1 Wonder
Single hook screen: *"A client's request lands on your desk: three numbers, a question, and one detail that doesn't matter at all. Before you plan anything — can you tell what's actually being asked?"*

### 8.2 Story — 4 panels (default, not exceeded)

| # | Title | Concept delivered | Narrative beat |
|---|---|---|---|
| 1 | The Big Request | Hook: a client request with a distracting extra detail | Rania and Vikram receive their first joint request and read it very differently. |
| 2 | Understand Before You Plan | Identify given/unknown; filter irrelevant information | Buzz the Bee stops Rania from planning until she can state what's given and what's asked. |
| 3 | Picking the Right Tool | The toolkit: bar model, table, list, diagram — and when a bar model isn't enough | Buzz reviews all four tools, then shows a case where the unknown isn't a clean part of the whole — "time to use a letter instead." |
| 4 | From Plan to Party | Worked application: understand, filter, represent, translate to a next step | The pair correctly represents the request, hands off a clear number sentence, and the studio approves the plan. |

### 8.3 Simulate — 4 stations (archetype-mapped)
Summary (full technical spec in the companion TRD):

| Station | Archetype | Premise |
|---|---|---|
| The Planning Board | Concept Discovery Lab | Student picks a sample client request and toggles between representation types (bar model, table, diagram) to see the *same* information built four different ways — builds intuition for what each tool shows well and poorly. |
| Match the Plan | Build-to-Target Challenge | Given a request, the student selects the right representation type and completes it correctly (drags bar segments to proportion, fills a table) across multiple rounds spanning different problem types. |
| From Request to Ready-to-Book | Multi-Step/Composite Construction | Given a full client request with a mix of relevant and irrelevant information, the student identifies given/unknown, crosses out the noise, chooses a representation, builds it, and states the final next-step number sentence — without solving it — combining LOs 1, 2, 3, and 8. |
| The Flawed Plan | Error-Detective | A rival junior planner's representation contains one seeded mistake (the wrong quantity treated as "the whole," two compared quantities swapped, an irrelevant number treated as relevant, or a bar model forced onto a request that needed algebra); the student finds and fixes it. |

### 8.4 Play / Practice
Standard, unchanged mechanics (10 worlds × 10 questions, 4 modes). See world table in §9.

### 8.5 Reflect
3 new recap questions targeting the module's two headline habits: **sketching a representation before identifying what's actually given and asked**, and **misrepresenting a single piece of information** (wrong "whole," swapped comparison, treating noise as signal). Followed by the standard scorecard and a reflection prompt ("Which request made you change your plan partway through, and why?").

## 9. World & Question Bank Table

*Shape: `{ id, name, emoji, accent, description, conceptFocus, boss: { name, emoji, reward } }`. World 9 (last) is the mixed-review grand finale per platform standard. Problems span varied real-world contexts by design (§3).*

| id | World | conceptFocus | Description | Boss | Reward |
|---|---|---|---|---|---|
| 0 | The Client's Request | `identify-given-and-unknown` | Identify given info and the unknown; restate in own words | The Mumbling Client 🗣️ | Listener's Badge |
| 1 | Filtering the Wish List | `identify-irrelevant-information` | Spot information not needed to solve the problem | The Overloaded Wish List 📝 | Filter Badge |
| 2 | Picking the Planning Tool | `select-representation-strategy` | Choose the right representation for a problem's structure | The Undecided Planner 🤔 | Toolkit Badge |
| 3 | Splitting the Budget | `construct-part-whole-bar-model` | Construct a part-whole bar model | The Broken Budget 💸 | Part-Whole Badge |
| 4 | Who Gets More? | `construct-comparison-bar-model` | Construct a comparison bar model | The Lopsided Guest List ⚖️ | Comparison Badge |
| 5 | The Guest List Table | `construct-table-or-list` | Construct a table/systematic list | The Chaotic RSVP Pile 📋 | Organizer's Badge |
| 6 | Mapping the Venue | `construct-diagram` | Construct a diagram for a spatial/relational problem | The Misplaced Venue Map 🗺️ | Diagram Badge |
| 7 | From Plan to Booking | `translate-representation-to-plan` | Translate a representation into a next-step number sentence | The Delayed Booking 📅 | Planner's Badge |
| 8 | When Bars Won't Balance | `recognize-when-algebra-needed` | Recognise when a bar model should become an algebraic one | The Overflowing Budget Bar 💥 | Algebra Bridge Badge |
| 9 | The Grand Event Review | `mixed-review` | Mixed review of every concept above; hardest boss | The Master Event Director 🎉 | Master Planner Trophy |

**Sample questions (illustrative, not the full 100):**

- **World 0:** *"A party planner books tables for a wedding. 45 guests are confirmed, and more RSVPs come in, bringing the total to 112. What is unknown?"* → "How many additional RSVPs came in" ✓
- **World 1:** *"An event starts at 6pm. It needs 20 chairs at $15 each and 10 tablecloths. How much do the chairs alone cost?"* → the tablecloth count and start time are irrelevant ✓
- **World 2:** *"Two co-hosts split a $84 catering bill so that one pays 3 times as much as the other. Which tool fits best?"* → "A comparison bar model" ✓ (distractor: "A table," less natural for a two-quantity ratio split)
- **World 3:** *"A $50 budget is split between decorations and snacks. Decorations cost $18. Draw a bar model and find the snack budget."* → correct part-whole model, `$32` ✓
- **World 4:** *"Aiden invited 3 times as many guests as Priya. Together they invited 48. Represent this as a comparison bar model."* → correct 1-unit/3-unit comparison model ✓
- **World 5:** *"Three friends each bring a different number of drink packs, at $4 a pack, totalling $60 spent across all three. List the possible pack counts."* → correctly organised systematic list ✓
- **World 6:** *"A rectangular hall is twice as long as it is wide, with a walkway around the edge. Sketch a diagram showing the given relationships."* → correctly labelled diagram ✓
- **World 7:** *"A model shows 5 units = 60 guests. What is the next step to find the value of 2 units?"* → "60 ÷ 5 × 2" ✓ (stops here — not asked to compute the final number)
- **World 8:** *"A guest count is increased by 7, then the result is 3 more than twice the original count. Would a bar model represent this cleanly?"* → "No — the unknown isn't a clean part of a whole; use `let n = the original count` instead" ✓
- **World 9:** mixed-type item combining identifying irrelevant information (World 1) with choosing between a bar model and algebra (World 8).

## 10. Gamification — Badge Renames

| Fixed trigger | Badge name |
|---|---|
| First correct answer | First Detail Noted 📝 |
| 5-answer streak | Smooth Planning 🎈 |
| 10-answer streak | Event Planning Streak 🔥 |
| All 4 Simulate stations complete | Full Planning Kit 🧰 |
| Any world scores 3 stars | Event Approved ⭐⭐⭐ |
| Any Boss Battle won | Client Delighted 🎉 |
| 20+ questions answered in Practice | Dedicated Planner 📆 |
| Full 5-phase journey complete | Master Event Director Badge 🏆 |

## 11. Audio & Narration Content Rules

- "given information" and "the unknown" are always spoken in full, and a problem's unknown is always named explicitly ("the unknown here is …"), never left implicit.
- "irrelevant information" is paired with "information you don't need" on first use per world.
- Bar-model narration always names which bar is "the whole" and which are "the parts" (or which quantity is being compared to which), never just "this bar" or "that bar."
- The handoff step (World 7) is always narrated as "the next step," never as "the answer," to reinforce that this module stops short of solving.
- "let *n* = …" (or "let *x* = …") is introduced, when it appears in World 8, exactly as EquationQuest phrases it, so a student moving between the two modules hears consistent language.

## 12. Accessibility

Standard enlarged fonts/touch targets in Simulate and Practice, calibrated toward the platform's Secondary-1 sizing precedent. Bar models, tables, and diagrams all carry full text labels for every part (never colour-only to distinguish "whole" from "part," or one compared quantity from another). Drag interactions (bar segments, table cells) require keyboard-operable equivalents.

## 13. Assets Required

4 story images at the reference's standard placeholder dimensions, delivered as blank CSS-framed placeholders, with an art-brief README describing each panel (kept inclusive — party themes generic, no alcohol or age-inappropriate content):
1. The studio desk, Rania and Vikram receiving their first confusing client request.
2. Buzz the Bee stopping Rania from planning before she identifies given/unknown.
3. Buzz reviewing the four-tool toolkit and the "when bars don't balance" case.
4. The finished, approved plan being handed off for booking.

## 14. Success Metrics / Acceptance Criteria

Standard fixed criteria (question-bank stress test, audio parity, clean build, full-journey walkthrough) plus module-specific:
- Every bar-model, table, and diagram item's "correct" representation is verified to actually match the stated problem relationships (part/whole roles, comparison direction, quantities), not merely asserted by a template author.
- World 1's irrelevant-information items include a genuine, clearly-unused detail in every case — never a detail that's subtly needed, which would make the "correct" answer arguable.
- World 8's bar-model-vs-algebra items are drawn only from genuinely clear cases in each direction — never a problem that could reasonably be modelled either way.
- Problems span the varied real-world contexts required by §3's house style — no single context (e.g. budgets) dominates the bank.
- All 4 Simulate stations are genuinely interactive, not static reveal-and-answer screens.

## 15. Assumptions & Open Questions

1. **Excluded heuristics (§3):** guess-and-check, work-backwards, and act-it-out are real, MOE-taught heuristics this module deliberately excludes to keep scope to Understand + Represent. Worth deciding whether these deserve their own future companion module (a natural "Solve and Check Problems" counterpart) rather than being folded in here.
2. **Content-context overlap with sibling modules:** because problems here are deliberately drawn from varied contexts (§3), some will resemble scenarios already used in EquationQuest or ProgressionQuest (money, quantities). This is expected and fine — the skill under test (representation, not execution) is different — but worth a light context-variety check during QA so it doesn't read as repetitive to a student doing several modules back to back.
3. **Concept Discovery Lab tension — not re-resolved here**, consistent with RuleQuest, ScrollQuest, NthQuest, and the earlier pass at this topic, rather than ProgressionQuest, absent a fresh special instruction.
4. **Character names and mascot** (Rania, Vikram, Buzz the Bee) are proposed defaults, not yet stakeholder-approved.
5. **Superseded prior work:** an earlier PRD/TRD pass at this same topic used an architecture-studio theme ("BlueprintQuest") and has been dropped per explicit feedback. If that repo name or any of its assets were already started, they should be discarded in favour of `represent-quest-main` rather than merged.
