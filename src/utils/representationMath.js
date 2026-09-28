// src/utils/representationMath.js
// Pure helper functions shared by the question generator and Simulate stations.
// Single source of truth for problem structures, representations, and distractors (TRD §4.4).

export const CONTENT_AREAS = ['budgets', 'guest_counts', 'schedules', 'quantities', 'seating'];

const EVENT_TYPES = [
  'wedding banquet', 'school anniversary gala', 'birthday festival', 'charity luncheon',
  'sports day reception', 'graduation dinner', 'corporate awards night', 'music festival green room'
];

/**
 * Random integer between min and max inclusive
 */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick random element from an array
 */
export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Shuffle array
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generates a structured client problem context in a specific content area.
 */
export function generateProblemContext(contentArea = null) {
  const area = contentArea || pick(CONTENT_AREAS);
  const event = pick(EVENT_TYPES);

  switch (area) {
    case 'budgets': {
      // Part-whole budget problem
      const totalBudget = pick([240, 360, 480, 500, 600, 750, 900, 1200]);
      const frac = pick([0.25, 0.3, 0.4, 0.5, 0.6]);
      const part1Val = Math.round(totalBudget * frac);
      const part2Val = totalBudget - part1Val;
      const part1Name = pick(['Decorations', 'Live Music', 'Catering Deposit', 'Floral Arches', 'Lighting Rig']);
      const part2Name = pick(['Snacks & Refreshments', 'Sound Equipment', 'Party Favors', 'Photography']);

      return {
        id: `budget_${Date.now()}_${randInt(100, 999)}`,
        contentArea: 'budgets',
        event,
        story: `For a ${event}, the client has an approved total budget of $${totalBudget}. They allocate $${part1Val} for ${part1Name.toLowerCase()}, and the rest goes to ${part2Name.toLowerCase()}. How much money is allocated for ${part2Name.toLowerCase()}?`,
        given: [
          `Total approved budget: $${totalBudget}`,
          `${part1Name} cost: $${part1Val}`
        ],
        unknown: `Budget allocated for ${part2Name.toLowerCase()}`,
        quantities: {
          total: totalBudget,
          part1: { name: part1Name, value: part1Val },
          part2: { name: part2Name, value: part2Val }
        },
        type: 'part-whole',
        correctStrategy: 'bar-model-part-whole',
        nextStepSentence: `$${totalBudget} - $${part1Val}`
      };
    }

    case 'guest_counts': {
      // Comparison ratio problem
      const ratio = pick([2, 3, 4]);
      const baseUnits = pick([12, 15, 18, 20, 25, 30]);
      const aVal = baseUnits * ratio;
      const bVal = baseUnits;
      const totalGuests = aVal + bVal;
      const hostA = pick(['Main Dining Hall', 'VIP Balcony', 'Outdoor Patio', 'Auditorium']);
      const hostB = pick(['Lounge Area', 'Side Gallery', 'Garden Tent', 'Mezzanine']);

      return {
        id: `guests_${Date.now()}_${randInt(100, 999)}`,
        contentArea: 'guest_counts',
        event,
        story: `At a ${event}, the ${hostA} accommodates ${ratio} times as many guests as the ${hostB}. Together, both areas seat ${totalGuests} guests. How many guests can the ${hostB} seat?`,
        given: [
          `Total guest capacity: ${totalGuests}`,
          `${hostA} seats ${ratio} times as many guests as ${hostB}`
        ],
        unknown: `Number of guests in the ${hostB}`,
        quantities: {
          total: totalGuests,
          ratio,
          hostA: { name: hostA, units: ratio, value: aVal },
          hostB: { name: hostB, units: 1, value: bVal }
        },
        type: 'comparison',
        correctStrategy: 'bar-model-comparison',
        nextStepSentence: `${totalGuests} ÷ ${ratio + 1}`
      };
    }

    case 'schedules': {
      // Table / timeline problem
      const startHour = randInt(14, 18); // 2pm to 6pm
      const intervalMins = pick([15, 20, 30]);
      const stages = ['Welcome Speech', 'Acoustic Set', 'Dinner Service', 'Cake Ceremony', 'Dance Floor'];
      const rows = stages.map((stage, i) => {
        const totalMins = i * intervalMins;
        const hr = startHour + Math.floor(totalMins / 60);
        const mn = totalMins % 60;
        const timeStr = `${hr % 12 || 12}:${mn === 0 ? '00' : mn} ${hr >= 12 ? 'PM' : 'AM'}`;
        return { stage, time: timeStr, duration: `${intervalMins} mins` };
      });

      return {
        id: `schedule_${Date.now()}_${randInt(100, 999)}`,
        contentArea: 'schedules',
        event,
        story: `The schedule for a ${event} starts at ${rows[0].time}. Each event segment runs for exactly ${intervalMins} minutes across ${stages.length} consecutive program items. How can the planner organize each activity and its start time clearly?`,
        given: [
          `Starting time: ${rows[0].time}`,
          `Duration per stage: ${intervalMins} minutes`,
          `Number of consecutive items: ${stages.length}`
        ],
        unknown: `Timeline and scheduled times for each segment`,
        quantities: {
          startHour,
          intervalMins,
          rows
        },
        type: 'table-schedule',
        correctStrategy: 'table',
        nextStepSentence: `List time increments: +${intervalMins} mins per row`
      };
    }

    case 'seating': {
      // Diagram spatial layout problem
      const length = pick([24, 30, 36, 40]);
      const width = Math.round(length / 2);
      const walkwayWidth = pick([2, 3]);

      return {
        id: `seating_${Date.now()}_${randInt(100, 999)}`,
        contentArea: 'seating',
        event,
        story: `A rectangular banquet hall for a ${event} is ${length} meters long and ${width} meters wide. A safety perimeter walkway of ${walkwayWidth} meters is reserved along all four outer walls. Which planning representation best shows the spatial layout of the tables and walkways?`,
        given: [
          `Hall dimensions: ${length} m long by ${width} m wide`,
          `Walkway perimeter: ${walkwayWidth} m around all outer edges`
        ],
        unknown: `Spatial arrangement and dimensions of the inner table floor`,
        quantities: {
          length,
          width,
          walkwayWidth,
          innerWidth: width - 2 * walkwayWidth,
          innerLength: length - 2 * walkwayWidth
        },
        type: 'diagram-spatial',
        correctStrategy: 'diagram',
        nextStepSentence: `(${length} - 2×${walkwayWidth}) × (${width} - 2×${walkwayWidth})`
      };
    }

    case 'quantities':
    default: {
      // Multi-quantity drink packs or favor bundles
      const packPrice = pick([3, 4, 5, 6]);
      const packsPerBox = pick([6, 8, 10, 12]);
      const totalBudget = packPrice * packsPerBox * pick([3, 4, 5]);

      return {
        id: `qty_${Date.now()}_${randInt(100, 999)}`,
        contentArea: 'quantities',
        event,
        story: `For a ${event}, favor boxes are bought at $${packPrice} per pack. Each large carton contains ${packsPerBox} packs. A planner spends a total of $${totalBudget} on cartons. How many cartons were ordered?`,
        given: [
          `Cost per pack: $${packPrice}`,
          `Packs per carton: ${packsPerBox}`,
          `Total spent: $${totalBudget}`
        ],
        unknown: `Total number of cartons ordered`,
        quantities: {
          packPrice,
          packsPerBox,
          totalBudget,
          cartons: totalBudget / (packPrice * packsPerBox)
        },
        type: 'composite',
        correctStrategy: 'table',
        nextStepSentence: `$${totalBudget} ÷ ($${packPrice} × ${packsPerBox})`
      };
    }
  }
}

/**
 * Extracts given information array and unknown statement from a problem.
 */
export function extractGivenAndUnknown(problem) {
  return {
    given: problem.given || [],
    unknown: problem.unknown || 'The missing quantity'
  };
}

/**
 * Injects a genuinely unused, irrelevant detail into the problem.
 * Guarantees that the detail is never used in calculations or representations.
 */
export function injectIrrelevantDetail(problem) {
  const noiseOptions = [
    { text: `The event coordinator's favorite theme colour is royal gold.`, label: 'Theme colour preference' },
    { text: `The event invitation was printed on 200gsm cardstock at 9:00 AM.`, label: 'Cardstock weight & print time' },
    { text: `The venue manager has 14 years of hotel experience.`, label: 'Manager years of experience' },
    { text: `There are 8 unused spare coat hangers in the lobby closet.`, label: 'Spare coat hangers count' },
    { text: `The ambient hall temperature will be kept at 21 degrees Celsius.`, label: 'Room temperature' },
    { text: `The DJ brought 3 backup flash drives in their backpack.`, label: 'DJ backup flash drives' }
  ];

  const noise = pick(noiseOptions);
  const updatedProblem = {
    ...problem,
    irrelevantDetail: noise.text,
    irrelevantLabel: noise.label,
    storyWithNoise: `${problem.story} (Note: ${noise.text})`
  };

  return updatedProblem;
}

/**
 * Builds a structured part-whole bar model descriptor derived directly from problem data.
 */
export function buildPartWholeBarModel(problem) {
  const q = problem.quantities || {};
  const total = q.total || 100;
  const part1 = q.part1 || { name: 'Part A', value: 40 };
  const part2 = q.part2 || { name: 'Part B', value: 60 };

  return {
    type: 'bar-model-part-whole',
    whole: {
      label: `Total Budget / Count`,
      value: total,
      unit: '$'
    },
    parts: [
      {
        label: part1.name,
        value: part1.value,
        percent: Math.round((part1.value / total) * 100),
        isUnknown: false
      },
      {
        label: part2.name,
        value: '?',
        actualValue: part2.value,
        percent: Math.round((part2.value / total) * 100),
        isUnknown: true
      }
    ]
  };
}

/**
 * Builds a structured comparison bar model descriptor.
 */
export function buildComparisonBarModel(problem) {
  const q = problem.quantities || {};
  const ratio = q.ratio || 3;
  const hostA = q.hostA || { name: 'Main Hall', units: ratio, value: ratio * 20 };
  const hostB = q.hostB || { name: 'Lounge', units: 1, value: 20 };
  const total = q.total || (hostA.value + hostB.value);

  return {
    type: 'bar-model-comparison',
    quantityA: {
      label: hostA.name,
      units: ratio,
      unitLabels: Array(ratio).fill('1 unit'),
      value: hostA.value
    },
    quantityB: {
      label: hostB.name,
      units: 1,
      unitLabels: ['1 unit'],
      value: hostB.value,
      isUnknown: true
    },
    totalBracket: {
      label: `Total = ${total} guests`,
      totalUnits: ratio + 1,
      value: total
    },
    ratioDescription: `${hostA.name} has ${ratio} units, ${hostB.name} has 1 unit`
  };
}

/**
 * Builds a structured table representation descriptor.
 */
export function buildTableRepresentation(problem) {
  const q = problem.quantities || {};

  if (q.rows) {
    return {
      type: 'table',
      columns: ['Program Segment', 'Scheduled Start', 'Duration'],
      rows: q.rows.map(r => [r.stage, r.time, r.duration])
    };
  }

  // Default multi-quantity table
  return {
    type: 'table',
    columns: ['Number of Cartons', 'Total Packs', 'Total Cost ($)'],
    rows: [
      [1, q.packsPerBox || 8, (q.packsPerBox || 8) * (q.packPrice || 4)],
      [2, (q.packsPerBox || 8) * 2, (q.packsPerBox || 8) * 2 * (q.packPrice || 4)],
      [3, (q.packsPerBox || 8) * 3, (q.packsPerBox || 8) * 3 * (q.packPrice || 4)],
      ['...', '...', `Target: $${q.totalBudget || 96}`]
    ]
  };
}

/**
 * Builds a structured diagram representation descriptor for spatial/relational problems.
 */
export function buildDiagramRepresentation(problem) {
  const q = problem.quantities || {};
  const length = q.length || 36;
  const width = q.width || 18;
  const walkway = q.walkwayWidth || 2;

  return {
    type: 'diagram',
    layout: 'venue-plan',
    title: 'Venue Perimeter & Banquet Floor',
    dimensions: {
      outerLength: `${length} m`,
      outerWidth: `${width} m`,
      walkwayMargin: `${walkway} m walkway on all sides`,
      innerArea: `${length - 2 * walkway} m × ${width - 2 * walkway} m table zone`
    },
    labels: [
      { text: `Length: ${length}m`, position: 'top' },
      { text: `Width: ${width}m`, position: 'left' },
      { text: `Walkway: ${walkway}m border`, position: 'center' }
    ]
  };
}

/**
 * Recommends the optimal representation strategy for a given problem structure.
 * Single source of truth for World 2 & World 8.
 */
export function recommendRepresentationType(problem) {
  if (problem.type === 'algebra-bridge' || problem.needsAlgebra) {
    return 'algebra';
  }
  if (problem.contentArea === 'seating' || problem.type === 'diagram-spatial') {
    return 'diagram';
  }
  if (problem.contentArea === 'schedules' || problem.type === 'table-schedule') {
    return 'table';
  }
  if (problem.type === 'comparison' || problem.contentArea === 'guest_counts') {
    return 'bar-model-comparison';
  }
  return 'bar-model-part-whole';
}

/**
 * Translates a completed representation into a next-step number sentence.
 * Stated as an un-evaluated plan sentence, NOT solved (per PRD §3 / TRD §4.4).
 */
export function translateToNextStep(representation, problem = null) {
  if (representation.nextStepSentence) {
    return representation.nextStepSentence;
  }
  if (problem && problem.nextStepSentence) {
    return problem.nextStepSentence;
  }
  if (representation.type === 'bar-model-part-whole') {
    const wholeVal = representation.whole?.value || 100;
    const partVal = representation.parts?.[0]?.value || 40;
    return `${wholeVal} - ${partVal}`;
  }
  if (representation.type === 'bar-model-comparison') {
    const total = representation.totalBracket?.value || 60;
    const units = representation.totalBracket?.totalUnits || 4;
    return `${total} ÷ ${units}`;
  }
  if (representation.type === 'table') {
    return `Look for row where Total = Target`;
  }
  if (representation.type === 'diagram') {
    return `Subtract border margins from total dimensions`;
  }
  return `Formulate equation`;
}

/**
 * Verifies whether a candidate representation matches the problem's stated relationships.
 * Also used to produce the Error-Detective's flawed plans deliberately.
 */
export function verifyRepresentationMatchesProblem(problem, candidateRepresentation) {
  if (!problem || !candidateRepresentation) {
    return { matches: false, reason: 'Missing representation or problem context.' };
  }

  // Check 1: Did it pick the right high-level type?
  const expectedType = recommendRepresentationType(problem);
  if (candidateRepresentation.type !== expectedType && candidateRepresentation.strategy !== expectedType) {
    return {
      matches: false,
      errorType: 'wrong-strategy',
      reason: `Expected strategy "${expectedType}", but got "${candidateRepresentation.type || candidateRepresentation.strategy}".`
    };
  }

  // Check 2: Part-whole check (wrong whole)
  if (expectedType === 'bar-model-part-whole' && candidateRepresentation.whole) {
    const expectedWhole = problem.quantities?.total;
    if (candidateRepresentation.whole.value !== expectedWhole) {
      return {
        matches: false,
        errorType: 'wrong-whole',
        reason: `The whole bar is set to ${candidateRepresentation.whole.value}, but the client's total is ${expectedWhole}.`
      };
    }
  }

  // Check 3: Comparison check (swapped quantities)
  if (expectedType === 'bar-model-comparison' && candidateRepresentation.quantityA) {
    const expectedRatio = problem.quantities?.ratio || 3;
    if (candidateRepresentation.quantityA.units < candidateRepresentation.quantityB?.units) {
      return {
        matches: false,
        errorType: 'swapped-comparison',
        reason: `Comparison reversed! ${problem.quantities?.hostA?.name} has more units than ${problem.quantities?.hostB?.name}.`
      };
    }
  }

  // Check 4: Noise treated as signal
  if (candidateRepresentation.includesNoise || candidateRepresentation.usedIrrelevant) {
    return {
      matches: false,
      errorType: 'noise-included',
      reason: `An irrelevant detail (${problem.irrelevantDetail || 'noise'}) was incorrectly included in the mathematical model.`
    };
  }

  return { matches: true, reason: 'Representation accurately captures the problem relationships.' };
}
