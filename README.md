# RepresentQuest — Grade 7 (MOE) · Understand and Represent Problems

An interactive, 5-phase module teaching problem understanding and representation heuristics for Grade 7 / Secondary 1 students.

Framed as a junior event-planning studio: client requests for parties and events are word problems that must be understood, filtered, and represented (part-whole bar, comparison bar, table, diagram, or algebra bridge) *before* booking anything.

## Architecture
- **01 Wonder**: Single hook screen highlighting given vs unknown vs noise.
- **02 Story**: 4 canonical panels delivering the core heuristics (without English character names in story text).
- **03 Simulate**: 4 interactive stations:
  1. *The Planning Board* (Concept Discovery Lab)
  2. *Match the Plan* (Build-to-Target Challenge)
  3. *From Request to Ready-to-Book* (Multi-Step / Composite Construction)
  4. *The Flawed Plan* (Error-Detective)
- **04 Practice**: 10 event-planning worlds × 10 questions = 100 questions generated procedurally with PlanVisual integration and Boss Battles.
- **05 Reflect**: 3 headline recap questions, studio reflection journal, and badge showcase.

## Run
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
```

## Story Art Brief (4 Panels)
1. **The Big Request**: The studio desk, receiving a confusing client party request with extra irrelevant noise.
2. **Understand Before You Plan**: Buzz the Bee stopping the planners from sketching before identifying given facts and the unknown.
3. **Picking the Right Tool**: Buzz reviewing the four-tool toolkit (part-whole bar, comparison bar, table, diagram) and the case where bars won't balance (algebra bridge).
4. **From Plan to Party**: The finished, approved plan being translated into a next-step number sentence and handed off for booking.
