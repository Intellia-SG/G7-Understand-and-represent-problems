// src/data/questionBank.js
// Procedural question generator producing 100 questions across 10 worlds (TRD §4.4 / PRD §9)
// Follows strict single-source-of-truth from representationMath.js

import { WORLDS } from '../config/worlds.config.js';
import {
  generateProblemContext,
  extractGivenAndUnknown,
  injectIrrelevantDetail,
  buildPartWholeBarModel,
  buildComparisonBarModel,
  buildTableRepresentation,
  buildDiagramRepresentation,
  recommendRepresentationType,
  translateToNextStep,
  CONTENT_AREAS,
  pick,
  randInt,
  shuffle
} from '../utils/representationMath.js';

export const DISTRICTS = WORLDS.map(w => ({
  id: w.id,
  name: w.name,
  emoji: w.emoji,
  accent: w.accent,
  description: w.description,
  conceptFocus: w.conceptFocus,
  range: w.range,
  boss: w.boss
}));

/**
 * Builds 4 unique options ensuring no duplicates.
 */
function createOptions(correct, distractors, fallbacks = []) {
  const seen = new Set([correct]);
  const opts = [correct];

  for (const d of distractors) {
    if (d && !seen.has(d) && opts.length < 4) {
      seen.add(d);
      opts.push(d);
    }
  }

  for (const fb of fallbacks) {
    if (fb && !seen.has(fb) && opts.length < 4) {
      seen.add(fb);
      opts.push(fb);
    }
  }

  // Fallback safety
  let padIdx = 1;
  while (opts.length < 4) {
    const dummy = `Option ${padIdx++}`;
    if (!seen.has(dummy)) {
      seen.add(dummy);
      opts.push(dummy);
    }
  }

  return shuffle(opts);
}

/**
 * Generates 10 questions for a given world index.
 */
function generateWorldQuestions(worldId) {
  const world = WORLDS[worldId];
  const questions = [];

  for (let qIdx = 0; qIdx < 10; qIdx++) {
    const area = CONTENT_AREAS[qIdx % CONTENT_AREAS.length];
    const baseProblem = generateProblemContext(area);
    const qGlobalId = worldId * 10 + qIdx + 1;

    switch (worldId) {
      case 0: {
        // World 0: Identify given and unknown
        const targetKind = qIdx % 2 === 0 ? 'unknown' : 'given';
        let questionText, correctAnswer, distractors, visualData;

        if (targetKind === 'unknown') {
          questionText = `Client Request: "${baseProblem.story}"\n\nWhat is the target UNKNOWN you are asked to find?`;
          correctAnswer = baseProblem.unknown;
          distractors = [
            baseProblem.given[0] || 'The starting total',
            baseProblem.given[1] || 'The first allocated cost',
            'The name of the event manager'
          ];
        } else {
          questionText = `Client Request: "${baseProblem.story}"\n\nWhich of the following is a GIVEN fact directly stated in the request?`;
          correctAnswer = baseProblem.given[0];
          distractors = [
            `The unknown: ${baseProblem.unknown}`,
            'The exact time the guests will leave the party',
            'The brand of the sound equipment used'
          ];
        }

        visualData = {
          story: baseProblem.story,
          given: baseProblem.given,
          unknown: baseProblem.unknown
        };

        questions.push({
          id: qGlobalId,
          districtId: worldId,
          category: world.conceptFocus,
          visual: 'request-annotated',
          visualData,
          questionText,
          options: createOptions(correctAnswer, distractors, ['Budget overflow', 'Total venue area', 'Party duration']),
          correctAnswer,
          explanation: `In this request, the given facts are: ${baseProblem.given.join('; ')}. The unknown being asked is: ${baseProblem.unknown}.`,
          hint1: "Look closely at what the final sentence in the request asks for.",
          hint2: "Given facts are numbers you already know; the unknown has a question mark."
        });
        break;
      }

      case 1: {
        // World 1: Filtering the Wish List (irrelevant details)
        const noisyProblem = injectIrrelevantDetail(baseProblem);
        const questionText = `Client Request: "${noisyProblem.storyWithNoise}"\n\nWhich piece of information is IRRELEVANT (not needed) to solve the client's question?`;
        const correctAnswer = noisyProblem.irrelevantDetail;
        const distractors = [
          noisyProblem.given[0] || 'The total budget',
          noisyProblem.given[1] || 'The primary booking count',
          'None — every single word is strictly required for calculation'
        ];

        questions.push({
          id: qGlobalId,
          districtId: worldId,
          category: world.conceptFocus,
          visual: 'request-annotated',
          visualData: {
            story: noisyProblem.storyWithNoise,
            given: noisyProblem.given,
            unknown: noisyProblem.unknown,
            irrelevantDetail: noisyProblem.irrelevantDetail
          },
          questionText,
          options: createOptions(correctAnswer, distractors, ['Event hall ceiling height', 'Sound technician shoe size']),
          correctAnswer,
          explanation: `"${noisyProblem.irrelevantDetail}" is extra noise. Filtering it out leaves only the relevant mathematical quantities.`,
          hint1: "Ask yourself: does knowing this detail change the calculation result?",
          hint2: "Details like cardstock weight, weather, or manager background don't affect costs."
        });
        break;
      }

      case 2: {
        // World 2: Picking the Planning Tool
        const recType = recommendRepresentationType(baseProblem);
        const toolNames = {
          'bar-model-part-whole': 'Part-Whole Bar Model',
          'bar-model-comparison': 'Comparison Bar Model',
          'table': 'Structured Table / Systematic List',
          'diagram': 'Spatial / Relational Diagram',
          'algebra': 'Algebraic Equation (let x = ...)'
        };

        const correctAnswer = toolNames[recType] || 'Part-Whole Bar Model';
        const allTools = Object.values(toolNames);
        const distractors = allTools.filter(t => t !== correctAnswer);

        questions.push({
          id: qGlobalId,
          districtId: worldId,
          category: world.conceptFocus,
          visual: 'request-annotated',
          visualData: {
            story: baseProblem.story,
            given: baseProblem.given,
            unknown: baseProblem.unknown
          },
          questionText: `Client Request: "${baseProblem.story}"\n\nWhich planning representation tool is most suitable for this problem's structure?`,
          options: createOptions(correctAnswer, distractors),
          correctAnswer,
          explanation: `For ${baseProblem.contentArea.replace(/_/g, ' ')}, ${correctAnswer} captures the structural relationship without unnecessary complexity.`,
          hint1: "Look at whether this problem splits a whole, compares two quantities in a ratio, organizes rows, or maps a space.",
          hint2: "Spatial problems need diagrams; ratios need comparison bars; total budgets need part-whole bars."
        });
        break;
      }

      case 3: {
        // World 3: Splitting the Budget (Part-Whole Bar Model)
        const budgetProb = generateProblemContext('budgets');
        const visualData = buildPartWholeBarModel(budgetProb);
        const wholeVal = budgetProb.quantities.total;
        const part1Val = budgetProb.quantities.part1.value;
        const part2Val = budgetProb.quantities.part2.value;

        const questionText = `A client has a total budget of $${wholeVal}. $${part1Val} is allocated for ${budgetProb.quantities.part1.name.toLowerCase()}. Which relationship correctly defines the unknown part?`;
        const correctAnswer = `Unknown Part = $${wholeVal} - $${part1Val}`;
        const distractors = [
          `Unknown Part = $${wholeVal} + $${part1Val}`,
          `Unknown Part = $${wholeVal} × $${part1Val}`,
          `Unknown Part = $${part1Val} ÷ 2`
        ];

        questions.push({
          id: qGlobalId,
          districtId: worldId,
          category: world.conceptFocus,
          visual: 'bar-model-part-whole',
          visualData,
          questionText,
          options: createOptions(correctAnswer, distractors),
          correctAnswer,
          explanation: `In a Part-Whole Bar Model: Whole ($${wholeVal}) = Part 1 ($${part1Val}) + Part 2. Therefore, Unknown Part = $${wholeVal} - $${part1Val}.`,
          hint1: "When you know the whole and one part, subtract the known part from the whole.",
          hint2: "The whole bar is split into two pieces that sum to the total."
        });
        break;
      }

      case 4: {
        // World 4: Who Gets More? (Comparison Bar Model)
        const compProb = generateProblemContext('guest_counts');
        const visualData = buildComparisonBarModel(compProb);
        const ratio = compProb.quantities.ratio;
        const total = compProb.quantities.total;
        const totalUnits = ratio + 1;

        const questionText = `${compProb.story}\n\nIn a comparison bar model representing this, how many total equal units represent the combined total of ${total} guests?`;
        const correctAnswer = `${totalUnits} equal units (${ratio} for ${compProb.quantities.hostA.name} + 1 for ${compProb.quantities.hostB.name})`;
        const distractors = [
          `${ratio} equal units`,
          `2 equal units`,
          `${ratio * 2} equal units`
        ];

        questions.push({
          id: qGlobalId,
          districtId: worldId,
          category: world.conceptFocus,
          visual: 'bar-model-comparison',
          visualData,
          questionText,
          options: createOptions(correctAnswer, distractors),
          correctAnswer,
          explanation: `Since ${compProb.quantities.hostA.name} has ${ratio} units and ${compProb.quantities.hostB.name} has 1 unit, the combined total is ${ratio} + 1 = ${totalUnits} units.`,
          hint1: "Count the unit boxes: one group has several boxes, the other has 1 box.",
          hint2: "Add the ratio multiplier to 1 to find the total units for the whole sum."
        });
        break;
      }

      case 5: {
        // World 5: The Guest List Table (Structured Table / Systematic List)
        const tableProb = generateProblemContext('quantities');
        const visualData = buildTableRepresentation(tableProb);
        const packPrice = tableProb.quantities.packPrice || 4;
        const packsPerBox = tableProb.quantities.packsPerBox || 8;
        const boxCost = packPrice * packsPerBox;

        const questionText = `Boxes of event favors contain ${packsPerBox} packs each at $${packPrice} per pack. In a systematic table, what is the cost progression for 1, 2, and 3 boxes?`;
        const correctAnswer = `1 box: $${boxCost}, 2 boxes: $${boxCost * 2}, 3 boxes: $${boxCost * 3}`;
        const distractors = [
          `1 box: $${boxCost}, 2 boxes: $${boxCost + packPrice}, 3 boxes: $${boxCost + packPrice * 2}`,
          `1 box: $${packPrice}, 2 boxes: $${packPrice * 2}, 3 boxes: $${packPrice * 3}`,
          `1 box: $${boxCost}, 2 boxes: $${boxCost * 4}, 3 boxes: $${boxCost * 8}`
        ];

        questions.push({
          id: qGlobalId,
          districtId: worldId,
          category: world.conceptFocus,
          visual: 'table',
          visualData,
          questionText,
          options: createOptions(correctAnswer, distractors),
          correctAnswer,
          explanation: `Each box costs ${packsPerBox} × $${packPrice} = $${boxCost}. A table lists constant multiples: $${boxCost}, $${boxCost * 2}, $${boxCost * 3}.`,
          hint1: "Calculate the cost of 1 entire carton first, then multiply by carton count.",
          hint2: "The table row increments by the constant price of one full carton."
        });
        break;
      }

      case 6: {
        // World 6: Mapping the Venue (Diagram for spatial/relational problems)
        const seatProb = generateProblemContext('seating');
        const visualData = buildDiagramRepresentation(seatProb);
        const L = seatProb.quantities.length;
        const W = seatProb.quantities.width;
        const border = seatProb.quantities.walkwayWidth;

        const questionText = `A banquet hall is ${L}m long and ${W}m wide with a ${border}m perimeter walkway along all 4 outer walls. On a diagram, what expression represents the usable inner dining length?`;
        const correctAnswer = `${L} - 2 × (${border}) = ${L - 2 * border} meters`;
        const distractors = [
          `${L} - ${border} = ${L - border} meters`,
          `${L} + 2 × (${border}) = ${L + 2 * border} meters`,
          `(${L} × ${W}) ÷ ${border} meters`
        ];

        questions.push({
          id: qGlobalId,
          districtId: worldId,
          category: world.conceptFocus,
          visual: 'diagram',
          visualData,
          questionText,
          options: createOptions(correctAnswer, distractors),
          correctAnswer,
          explanation: `A walkway surrounds all edges, so the inner usable length loses ${border}m from both the left and right sides: ${L} - 2(${border}) = ${L - 2 * border}m.`,
          hint1: "A perimeter walkway takes space from BOTH ends of the hall.",
          hint2: "Subtract 2 times the walkway border width from the outer dimension."
        });
        break;
      }

      case 7: {
        // World 7: From Plan to Booking (translate representation to next step without solving)
        const units = pick([3, 4, 5, 6]);
        const targetUnits = pick([1, 2]);
        const total = units * pick([15, 20, 25, 30]);

        const questionText = `A comparison model shows that ${units} equal units represent ${total} event badges. What is the NEXT STEP number sentence to find the value of ${targetUnits} unit(s)? (Do NOT calculate the final answer)`;
        const correctAnswer = targetUnits === 1 ? `${total} ÷ ${units}` : `(${total} ÷ ${units}) × ${targetUnits}`;
        const distractors = [
          `${total} - ${units}`,
          `${total} × ${units}`,
          `${(total / units) * targetUnits} badges (This is the calculated answer, not the next step sentence!)`
        ];

        questions.push({
          id: qGlobalId,
          districtId: worldId,
          category: world.conceptFocus,
          visual: 'bar-model-comparison',
          visualData: {
            quantityA: { label: 'Total Units', units, value: total },
            quantityB: { label: 'Target Units', units: targetUnits, value: '?' },
            totalBracket: { label: `${units} units = ${total}` }
          },
          questionText,
          options: createOptions(correctAnswer, distractors),
          correctAnswer,
          explanation: `To find the value of ${targetUnits} unit(s), divide the total (${total}) by the unit count (${units}) then multiply by ${targetUnits}. RepresentQuest stops at stating this next step!`,
          hint1: "Find the operation that calculates one single unit first.",
          hint2: "We only want the number sentence plan, not the final evaluated number."
        });
        break;
      }

      case 8: {
        // World 8: When Bars Won't Balance (Algebra Bridge: let n = ...)
        const algebraCases = [
          {
            text: 'A guest count is increased by 12, then the result is 4 more than three times the original count.',
            correct: 'No — the unknown is compared against a multiple plus extra on both sides; use algebra (let n = original count)',
            distractors: [
              'Yes — draw a 12-unit bar model',
              'Yes — draw a circle diagram',
              'No — word problems with numbers cannot be modeled'
            ]
          },
          {
            text: 'A client doubles their ticket order and receives a $10 discount, paying the exact same as 3 tickets plus $5.',
            correct: 'Algebra is best (let t = ticket price) because the unknown appears with different operations on both sides',
            distractors: [
              'Draw a simple 2-piece part-whole bar',
              'Guess random numbers until it matches',
              'Use a venue floor diagram'
            ]
          },
          {
            text: 'The total catering bill of $600 is split evenly among 4 distinct corporate departments.',
            correct: 'A Part-Whole Bar model is still clean and sufficient ($600 divided into 4 equal parts)',
            distractors: [
              'Must switch to complex algebra immediately',
              'Cannot be solved with either bars or equations',
              'Draw an architect blueprint'
            ]
          }
        ];

        const cCase = algebraCases[qIdx % algebraCases.length];

        questions.push({
          id: qGlobalId,
          districtId: worldId,
          category: world.conceptFocus,
          visual: 'request-annotated',
          visualData: {
            story: cCase.text,
            given: ['Stated relationships across operations'],
            unknown: 'Mystery starting quantity'
          },
          questionText: `Consider this client scenario: "${cCase.text}"\n\nIs a simple bar model the right tool, or is it time to bridge to algebra?`,
          options: createOptions(cCase.correct, cCase.distractors),
          correctAnswer: cCase.correct,
          explanation: `When unknowns appear on both sides of an equality with mixed additions and multiplications, bar models become impractical. This is the Secondary 1 algebra bridge: define a variable like let n = unknown.`,
          hint1: "Can you cleanly split a single bar into equal pieces, or does the unknown appear in a complex equation?",
          hint2: "When bars won't balance, we use a letter (let x = ... or let n = ...)."
        });
        break;
      }

      case 9:
      default: {
        // World 9: Grand Event Review (Mixed grand finale)
        const mixedTopics = [
          {
            q: 'A client states: "We need 50 chairs at $8 each, the hall opens at 5:00 PM, and 4 stage lights at $30 each." Which detail is IRRELEVANT to finding the equipment rental bill?',
            a: 'The hall opens at 5:00 PM',
            d: ['50 chairs at $8 each', '4 stage lights at $30 each', 'All details are necessary']
          },
          {
            q: 'A model shows 4 units = 80 guests. What is the next-step number sentence to determine the value of 3 units?',
            a: '(80 ÷ 4) × 3',
            d: ['80 - 4 × 3', '80 × 4 ÷ 3', '60 guests (This is the final answer, not the next-step sentence!)']
          },
          {
            q: 'Why does an event planner create a representation before calculating numbers?',
            a: 'To make the mathematical structure and relationships clear before committing resources',
            d: ['Because calculators are forbidden in event planning', 'To make the report look colorful', 'To guess the answer faster']
          }
        ];

        const item = mixedTopics[qIdx % mixedTopics.length];

        questions.push({
          id: qGlobalId,
          districtId: worldId,
          category: world.conceptFocus,
          visual: 'request-annotated',
          visualData: {
            story: item.q,
            given: ['Multiple event parameters'],
            unknown: 'Best representation strategy'
          },
          questionText: item.q,
          options: createOptions(item.a, item.d),
          correctAnswer: item.a,
          explanation: `Master planners always understand facts, filter noise, and choose the matching representation before calculating.`,
          hint1: "Review the core habits: understand, filter, choose tool, and state the plan.",
          hint2: "Signal vs noise and representation vs execution are the central ideas."
        });
        break;
      }
    }
  }

  return questions;
}

// Generate all 100 questions (10 worlds × 10 questions)
export const QUESTIONS = [];
for (let w = 0; w < 10; w++) {
  QUESTIONS.push(...generateWorldQuestions(w));
}

/**
 * Helper to fetch a question for a specific world or index
 */
export function getQuestionsForWorld(worldId) {
  return QUESTIONS.filter(q => q.districtId === worldId);
}

/**
 * Random question selector
 */
export function getRandomQuestion(worldId = null) {
  const pool = worldId != null ? getQuestionsForWorld(worldId) : QUESTIONS;
  return pick(pool);
}

export default QUESTIONS;

