/* =========================================================================
   MATH DATA & PROCEDURAL QUESTION GENERATOR
   Procedurally generates unbounded, non-repeating Grade 7 questions on
   "Understand and Represent Problems" (unknowns, bar models, tables,
   equations, balance scales, ratio, percent, speed, reasonableness).
   ========================================================================= */

export const WESTERN_NAMES = [
  "Leo", "Emma", "Alex", "Oliver", "Sophia", "Jack", "Maya", "Lucas",
  "Ethan", "Chloe", "Noah", "Liam", "Harper", "Ava", "Mason", "Ella",
  "James", "Mia", "Logan", "Charlotte"
];

export const PRACTICE_WORLDS = [
  { id: 0, name: "Detective HQ",   icon: "🕵️", range: "Q1–10",   difficulty: 1, types: ['askUnknown', 'notNeeded'] },
  { id: 1, name: "Letter Lagoon", icon: "🔤", range: "Q11–20",  difficulty: 1, types: ['defineVar', 'w2expr'] },
  { id: 2, name: "Bar Model Bay",         icon: "📊", range: "Q21–30",  difficulty: 2, types: ['barUnits', 'barDifference'] },
  { id: 3, name: "Table Tower",           icon: "📋", range: "Q31–40",  difficulty: 2, types: ['tableRule', 'tablePredict'] },
  { id: 4, name: "Equation Express",      icon: "🚂", range: "Q41–50",  difficulty: 3, types: ['eqFromStory', 'solveEq'] },
  { id: 5, name: "Balance Arena",   icon: "⚖️", range: "Q51–60",  difficulty: 3, types: ['balance', 'solveEq'] },
  { id: 6, name: "Ratio River",           icon: "🌊", range: "Q61–70",  difficulty: 3, types: ['ratioBar', 'ratioDiff'] },
  { id: 7, name: "Percent Peak",          icon: "🏔️", range: "Q71–80",  difficulty: 4, types: ['percentSale', 'percentEq'] },
  { id: 8, name: "Speedway",      icon: "🏎️", range: "Q81–90",  difficulty: 4, types: ['speedEq', 'speedSolve'] },
  { id: 9, name: "Master Citadel", icon: "👑", range: "Q91–100", difficulty: 4,
    types: ['multiStep', 'reasonable', 'eqFromStory', 'barUnits', 'balance', 'speedSolve', 'percentSale', 'tableRule', 'ratioBar', 'barDifference'] }
];

/* ------------------------------ helpers ------------------------------ */
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function fmt(v) {
  if (Number.isInteger(v)) return v.toString();
  return Number(v.toFixed(2)).toString();
}
function otherName(name) {
  let n = pick(WESTERN_NAMES);
  while (n === name) n = pick(WESTERN_NAMES);
  return n;
}

/**
 * Build 4 unique options (correct + 3 distractors) from strings.
 * `fallbacks` (function) supplies extra plausible strings if distractors collide.
 */
function buildOptions(correct, distractors, fallbacks = () => []) {
  const seen = new Set([correct]);
  const picked = [];
  const tryAdd = (d) => {
    if (d == null) return;
    const s = String(d);
    if (s === 'NaN' || s.includes('Infinity') || s.includes('undefined')) return;
    if (seen.has(s)) return;
    seen.add(s);
    picked.push(s);
  };
  shuffle(distractors).forEach(d => { if (picked.length < 3) tryAdd(d); });
  fallbacks().forEach(d => { if (picked.length < 3) tryAdd(d); });
  const options = shuffle([correct, ...picked]);
  return { options, correctIndex: options.indexOf(correct) };
}

/** numeric options with optional prefix/suffix (positive numbers only) */
function numOptions(correctVal, distVals, { pre = '', suf = '' } = {}) {
  const f = v => `${pre}${fmt(v)}${suf}`;
  const okDist = distVals.filter(v => Number.isFinite(v) && v > 0 && fmt(v) !== fmt(correctVal));
  const fb = () => [correctVal + 1, correctVal + 2, correctVal * 2, correctVal - 1, correctVal + 5, correctVal + 10]
    .filter(v => v > 0).map(f);
  return buildOptions(f(correctVal), okDist.map(f), fb);
}

/* ------------------------------ archetypes ------------------------------ */

/* World 1 — read the story: what is the unknown? */
function askUnknown(name) {
  const other = otherName(name);
  const templates = [
    () => {
      const n = randInt(3, 9), p = randInt(2, 8), T = n * p;
      return {
        story: `${name} buys ${n} identical notebooks and pays $${T} in total. How much does ONE notebook cost?`,
        correct: 'The cost of one notebook',
        wrong: [`The number of notebooks bought`, `The total amount paid`, `The change ${name} received`],
        given: [`${n} notebooks`, `$${T} total`], ask: 'Cost of 1 notebook'
      };
    },
    () => {
      const t = randInt(2, 5), d = t * randInt(10, 18);
      return {
        story: `${name} cycles ${d} km in ${t} hours at a steady pace. What is ${name}'s average speed?`,
        correct: `${name}'s average speed`,
        wrong: [`The distance cycled`, `The time taken`, `The number of rest stops`],
        given: [`${d} km`, `${t} hours`], ask: 'Average speed'
      };
    },
    () => {
      const g = randInt(3, 6), groups = randInt(3, 7), n = g * groups;
      return {
        story: `A class of ${n} students is split into teams of ${g}. How many teams are there?`,
        correct: 'The number of teams',
        wrong: [`The number of students in each team`, `The total number of students`, `The number of students left out`],
        given: [`${n} students`, `${g} per team`], ask: 'Number of teams'
      };
    },
    () => {
      const s = randInt(4, 12), w = randInt(5, 9), T = s * w;
      return {
        story: `${name} saves $${s} every week. How many weeks will it take to save $${T}?`,
        correct: 'The number of weeks needed',
        wrong: [`The amount saved each week`, `The savings target`, `The amount ${name} spends each week`],
        given: [`$${s} per week`, `$${T} goal`], ask: 'Number of weeks'
      };
    }
  ];
  const t = pick(templates)();
  const { options, correctIndex } = buildOptions(t.correct, t.wrong);
  return {
    tip: 'FIND THE UNKNOWN',
    prompt: `${t.story} Which quantity is the UNKNOWN that the question asks you to find?`,
    options, correctIndex,
    diagramData: { mode: 'detective', given: t.given, ask: t.ask },
    explanation: `The question mark hides "${t.correct.toLowerCase()}" — that is the unknown. The other values are given clues.`
  };
}

/* World 1 — which detail is NOT needed */
function notNeeded(name) {
  const templates = [
    () => {
      const n = randInt(3, 8), p = randInt(2, 6), r = randInt(2, 5);
      return {
        story: `${name} buys ${n} pens at $${p} each and a ruler for $${r}. How much do the pens cost altogether?`,
        correct: `The ruler costs $${r}`,
        wrong: [`${name} bought ${n} pens`, `Each pen costs $${p}`, `Total cost = number of pens × price of one pen`],
        given: [`${n} pens`, `$${p} each`, `ruler $${r} ✗`], ask: 'Cost of the pens'
      };
    },
    () => {
      const t = randInt(2, 5), d = t * randInt(12, 20), c = randInt(6, 12);
      return {
        story: `A train travels ${d} km in ${t} hours. It has ${c} carriages. What is the train's average speed?`,
        correct: `The train has ${c} carriages`,
        wrong: [`The train travels ${d} km`, `The journey takes ${t} hours`, `Speed = distance ÷ time`],
        given: [`${d} km`, `${t} hours`, `${c} carriages ✗`], ask: 'Average speed'
      };
    },
    () => {
      const l = randInt(6, 15), w = randInt(3, 9), colour = pick(['blue', 'red', 'green']);
      return {
        story: `A rectangle is ${l} cm long and ${w} cm wide. It is drawn in ${colour} ink. Find its perimeter.`,
        correct: `The rectangle is drawn in ${colour} ink`,
        wrong: [`The length is ${l} cm`, `The width is ${w} cm`, `Perimeter = 2 × (length + width)`],
        given: [`${l} cm long`, `${w} cm wide`, `${colour} ink ✗`], ask: 'Perimeter'
      };
    }
  ];
  const t = pick(templates)();
  const { options, correctIndex } = buildOptions(t.correct, t.wrong);
  return {
    tip: 'SPOT THE EXTRA DETAIL',
    prompt: `${t.story} Which piece of information is NOT needed to solve the problem?`,
    options, correctIndex,
    diagramData: { mode: 'detective', given: t.given, ask: t.ask },
    explanation: `"${t.correct}" does not help answer the question, so we can ignore it.`
  };
}

/* World 2 — define the variable */
function defineVar(name) {
  const other = otherName(name);
  const k = randInt(3, 9);
  let prompt, correct, wrong, given, ask, explanation;
  if (Math.random() < 0.5) {
    prompt = `${name} has ${k} more marbles than ${other}. We want to find how many marbles ${other} has. Which choice defines the letter correctly?`;
    correct = `Let m = ${other}'s marbles. Then ${name} has m + ${k}.`;
    wrong = [
      `Let m = ${other}'s marbles. Then ${name} has m − ${k}.`,
      `Let m = ${name}'s marbles. Then ${other} has m + ${k}.`,
      `Let m = ${k}. Then ${name} has ${k}m marbles.`,
      `Let m = ${name}'s marbles. Then ${other} has ${k}m.`
    ];
    given = [`${name} = ${other} + ${k}`]; ask = `${other}'s marbles`;
    explanation = `The unknown is ${other}'s marbles, so let m be that. ${name} has ${k} MORE, so ${name} has m + ${k}.`;
  } else {
    prompt = `${name} reads ${k} times as many pages as ${other}. We want to find how many pages ${other} reads. Which choice defines the letter correctly?`;
    correct = `Let p = ${other}'s pages. Then ${name} reads ${k}p pages.`;
    wrong = [
      `Let p = ${other}'s pages. Then ${name} reads p + ${k} pages.`,
      `Let p = ${name}'s pages. Then ${other} reads ${k}p pages.`,
      `Let p = ${k}. Then ${name} reads p pages.`,
      `Let p = ${other}'s pages. Then ${name} reads p ÷ ${k} pages.`
    ];
    given = [`${name} = ${k} × ${other}`]; ask = `${other}'s pages`;
    explanation = `The unknown is ${other}'s pages, so let p be that. "${k} times as many" means multiply: ${k}p.`;
  }
  const { options, correctIndex } = buildOptions(correct, wrong);
  return {
    tip: 'NAME THE UNKNOWN', prompt, options, correctIndex,
    diagramData: { mode: 'detective', given, ask }, explanation
  };
}

/* World 2 — words to algebraic expression */
function w2expr() {
  const a = randInt(2, 9), b = randInt(2, 6);
  const forms = [
    () => ({
      p: `${a} more than ${b} times a number n`,
      c: `${b}n + ${a}`, w: [`${b}(n + ${a})`, `${a}n + ${b}`, `${b}n − ${a}`, `${a} − ${b}n`],
      e: `"${b} times a number" is ${b}n, and "${a} more than" that means add ${a}.`
    }),
    () => ({
      p: `${a} less than ${b} times a number n`,
      c: `${b}n − ${a}`, w: [`${a} − ${b}n`, `${b}(n − ${a})`, `${b}n + ${a}`, `${a}n − ${b}`],
      e: `"${a} less than X" means X − ${a}, so it is ${b}n − ${a} (not ${a} − ${b}n).`
    }),
    () => ({
      p: `the sum of a number n and ${a}, all multiplied by ${b}`,
      c: `${b}(n + ${a})`, w: [`${b}n + ${a}`, `n + ${a * b}`, `${b} + n + ${a}`, `${b}(n) × ${a}`],
      e: `"The sum of n and ${a}" is n + ${a}; multiplying ALL of it by ${b} needs brackets.`
    }),
    () => ({
      p: `a number n divided by ${b}, then increased by ${a}`,
      c: `n ÷ ${b} + ${a}`, w: [`${b} ÷ n + ${a}`, `n ÷ (${b} + ${a})`, `(n + ${a}) ÷ ${b}`, `n ÷ ${b} − ${a}`],
      e: `Divide n by ${b} first, then add ${a}: n ÷ ${b} + ${a}.`
    }),
    () => ({
      p: `twice a number n, decreased by ${a}`,
      c: `2n − ${a}`, w: [`2(n − ${a})`, `${a} − 2n`, `2n + ${a}`, `n − 2${a}`],
      e: `"Twice n" is 2n; "decreased by ${a}" means subtract ${a}.`
    })
  ];
  const f = pick(forms)();
  const { options, correctIndex } = buildOptions(f.c, f.w);
  return {
    tip: 'WORDS → SYMBOLS',
    prompt: `Which expression represents "${f.p}"?`,
    options, correctIndex,
    diagramData: { mode: 'card', lines: [`"${f.p}"`, '⬇', '?'] },
    explanation: f.e
  };
}

/* World 3 — bar model, multiples */
function barUnits(name, diff) {
  const other = otherName(name);
  const k = randInt(2, diff >= 3 ? 5 : 4);
  const u = randInt(3, 6 + 3 * diff);
  const T = (k + 1) * u;
  const thing = pick(['stickers', 'coins', 'cards', 'stamps']);
  const askBig = Math.random() < 0.4;
  const ans = askBig ? k * u : u;
  const askName = askBig ? name : other;
  const wrong = askBig
    ? [u, T - k, T / k, (k + 1) * k, T - u * 2]
    : [k * u, T / k, T - k, T / 2, u + k];
  const { options, correctIndex } = numOptions(ans, wrong, { suf: ` ${thing}` });
  return {
    tip: 'DRAW THE BARS',
    prompt: `${name} has ${k} times as many ${thing} as ${other}. Together they have ${T} ${thing}. How many ${thing} does ${askName} have?`,
    options, correctIndex,
    diagramData: {
      mode: 'bars',
      rows: [
        { label: other, units: 1, unitLabel: '?' },
        { label: name, units: k, unitLabel: '?' }
      ],
      total: `${T}`
    },
    explanation: `${k} + 1 = ${k + 1} units = ${T}, so 1 unit = ${u}. ${askBig ? `${name} has ${k} × ${u} = ${ans}` : `${other} has 1 unit = ${u}`}.`
  };
}

/* World 3 — bar model, "more than" */
function barDifference(name) {
  const other = otherName(name);
  const B = randInt(6, 35), D = randInt(4, 18);
  const T = 2 * B + D;
  const unit = pick(['cm', 'kg', 'points', 'minutes']);
  const noun = { cm: 'ribbon length', kg: 'mass', points: 'score', minutes: 'time' }[unit];
  const askBig = Math.random() < 0.35;
  const ans = askBig ? B + D : B;
  const wrong = askBig ? [B, T - D, T / 2, B + 2 * D] : [T - D, T / 2, B + D, T - B];
  const { options, correctIndex } = numOptions(ans, wrong, { suf: ` ${unit}` });
  return {
    tip: 'SUBTRACT THE EXTRA PIECE',
    prompt: `${name}'s ${noun} is ${D} ${unit} more than ${other}'s. Together their ${noun}s total ${T} ${unit}. What is ${askBig ? name : other}'s ${noun}?`,
    options, correctIndex,
    diagramData: {
      mode: 'bars',
      rows: [
        { label: other, units: 1, unitLabel: '?' },
        { label: name, units: 1, unitLabel: '?', extra: `+${D}` }
      ],
      total: `${T}`
    },
    explanation: `Remove the extra ${D}: ${T} − ${D} = ${T - D}, split into 2 equal bars → ${B} each.${askBig ? ` ${name} = ${B} + ${D} = ${ans}.` : ''}`
  };
}

/* World 4 — table → rule */
function tableRule(name, diff) {
  const m = randInt(2, 3 + diff), c = randInt(2, 9);
  const unit = pick(['hour', 'day', 'kilometre', 'song']);
  const shop = { hour: 'bike-hire shop', day: 'gym', kilometre: 'taxi company', song: 'music app' }[unit];
  const rows = [1, 2, 3, 4, 5].map(x => [x, m * x + c]);
  const correct = `y = ${m}x + ${c}`;
  const wrong = [`y = ${c}x + ${m}`, `y = ${m}x − ${c}`, `y = ${m + c}x`, `y = x + ${m + c - 1}`];
  const { options, correctIndex } = buildOptions(correct, wrong);
  return {
    tip: 'FIND THE PATTERN',
    prompt: `A ${shop} charges a fixed fee plus a price for each ${unit}. The table shows the total cost, y dollars, for x ${unit}s. Which rule fits?`,
    options, correctIndex,
    diagramData: { mode: 'table', xLabel: `${unit}s (x)`, yLabel: 'Cost $ (y)', rows, step: m },
    explanation: `y goes up by ${m} each time, so the rule starts with ${m}x. When x = 1, y = ${m + c}, so add ${c}: y = ${m}x + ${c}.`
  };
}

/* World 4 — table → predict */
function tablePredict(name, diff) {
  const m = randInt(2, 3 + diff), c = randInt(2, 9);
  const N = pick([8, 10, 12, 15, 20]);
  const ans = m * N + c;
  const rows = [1, 2, 3, 4].map(x => [x, m * x + c]);
  const wrong = [m * N, (m + c) * N, m * N - c, N + m + c, ans + m];
  const { options, correctIndex } = numOptions(ans, wrong, { pre: '$' });
  return {
    tip: 'USE THE RULE',
    prompt: `${name} studies the table (x = number of items, y = cost in dollars). What is the cost for ${N} items?`,
    options, correctIndex,
    diagramData: { mode: 'table', xLabel: 'Items (x)', yLabel: 'Cost $ (y)', rows, step: m },
    explanation: `Rule: y = ${m}x + ${c}. For x = ${N}: ${m} × ${N} + ${c} = ${ans}.`
  };
}

/* World 5 — equation from story */
function eqFromStory(name, diff) {
  if (Math.random() < 0.5) {
    const m = randInt(2, 5), c = randInt(2, 12), n = randInt(3, 12);
    const plus = Math.random() < 0.6;
    const t = plus ? m * n + c : m * n - c;
    const verb = plus ? 'adding' : 'subtracting';
    const op = plus ? '+' : '−';
    const opp = plus ? '−' : '+';
    const correct = `${m}n ${op} ${c} = ${t}`;
    const wrong = [`${m}(n ${op} ${c}) = ${t}`, `n ${op} ${m * c} = ${t}`, `${m}n ${opp} ${c} = ${t}`, `${m} + n ${op} ${c} = ${t}`];
    const { options, correctIndex } = buildOptions(correct, wrong);
    return {
      tip: 'TRANSLATE TO AN EQUATION',
      prompt: `${name} thinks of a number, n. Multiplying it by ${m} and then ${verb} ${c} gives ${t}. Which equation represents this?`,
      options, correctIndex,
      diagramData: { mode: 'card', lines: [`n → ×${m} → ${plus ? '+' : '−'}${c} → ${t}`] },
      explanation: `Follow the steps in order: n × ${m} = ${m}n, then ${op} ${c}, and the result is ${t}.`
    };
  }
  const other = otherName(name);
  const k = randInt(2, 4), a = randInt(6, 14), T = a + k * a;
  const correct = `a + ${k}a = ${T}`;
  const wrong = [`${k}a = ${T}`, `a + ${k} = ${T}`, `${k}a + ${k} = ${T}`, `a × ${k}a = ${T}`];
  const { options, correctIndex } = buildOptions(correct, wrong);
  return {
    tip: 'TRANSLATE TO AN EQUATION',
    prompt: `${name} is a years old. ${other} is ${k} times as old as ${name}. Together their ages add up to ${T}. Which equation represents this?`,
    options, correctIndex,
    diagramData: { mode: 'bars', rows: [{ label: name, units: 1, unitLabel: 'a' }, { label: other, units: k, unitLabel: 'a' }], total: `${T}` },
    explanation: `${name} = a and ${other} = ${k}a. The total is a + ${k}a = ${T}.`
  };
}

/* World 5 — solve an equation */
function solveEq(name, diff) {
  const x = randInt(2, 9 + diff), m = randInt(2, 6), c = randInt(2, 15);
  const forms = [
    () => { const t = m * x + c; return { eq: `${m}x + ${c} = ${t}`, ans: x, wrong: [(t + c) / m, t - c, (t - c) * m, t / m - c], ex: `Subtract ${c}: ${m}x = ${t - c}. Divide by ${m}: x = ${x}.` }; },
    () => { const t = m * x - c; return { eq: `${m}x − ${c} = ${t}`, ans: x, wrong: [(t - c) / m, t + c, (t + c) * m, t / m + c], ex: `Add ${c}: ${m}x = ${t + c}. Divide by ${m}: x = ${x}.` }; },
    () => { const q = randInt(2, 5), xx = q * randInt(2, 8), t = xx / q + c; return { eq: `x ÷ ${q} + ${c} = ${t}`, ans: xx, wrong: [(t - c) / q, (t + c) * q, t - c, xx + q], ex: `Subtract ${c}: x ÷ ${q} = ${t - c}. Multiply by ${q}: x = ${xx}.` }; },
    () => { const t = m * (x + c); return { eq: `${m}(x + ${c}) = ${t}`, ans: x, wrong: [t / m + c, (t - c) / m, t / m, t - c], ex: `Divide by ${m}: x + ${c} = ${t / m}. Subtract ${c}: x = ${x}.` }; }
  ];
  const f = pick(forms)();
  const { options, correctIndex } = numOptions(f.ans, f.wrong, { pre: 'x = ' });
  return {
    tip: 'UNDO STEP BY STEP',
    prompt: `${name} represents a problem with the equation ${f.eq}. What is the value of x?`,
    options, correctIndex,
    diagramData: { mode: 'card', lines: [f.eq, 'x = ?'] },
    explanation: f.ex
  };
}

/* World 6 — balance scale */
function balance(name, diff) {
  const x = randInt(2, 6 + diff), c = randInt(1, 3), a = c + randInt(1, 3), b = randInt(1, 9);
  const d = (a - c) * x + b;
  const left = `${a === 1 ? '' : a}x + ${b}`, right = `${c === 1 ? '' : c}x + ${d}`;
  const wrong = [(d + b) / (a - c), (d - b) / (a + c), d - b, (d - b) / a, x + 1];
  const { options, correctIndex } = numOptions(x, wrong, { pre: 'x = ' });
  return {
    tip: 'KEEP IT BALANCED',
    prompt: `The two sides of the balance scale are equal. Find x.`,
    options, correctIndex,
    diagramData: { mode: 'balance', left, right },
    explanation: `Take ${c}x off both sides: ${a - c === 1 ? '' : a - c}x + ${b} = ${d}. Take ${b} off both sides: ${a - c === 1 ? '' : a - c}x = ${d - b}. So x = ${x}.`
  };
}

/* World 7 — ratio bars */
function ratioBar(name, diff) {
  const [a, b] = pick([[1, 2], [2, 3], [3, 4], [2, 5], [3, 5], [1, 4], [4, 5]]);
  const u = randInt(2, 5 + 2 * diff);
  const T = (a + b) * u;
  const ctx = pick([
    { t: 'red beads to blue beads', p: 'red', q: 'blue', total: n => `${n} beads`, count: l => `${l} beads`, suf: '' },
    { t: 'boys to girls in a club', p: 'boys', q: 'girls', total: n => `${n} students`, count: l => l, suf: '' },
    { t: 'orange juice to water in a drink', p: 'juice', q: 'water', total: n => `${n} ml`, count: l => `ml of ${l}`, suf: ' ml' }
  ]);
  const askSecond = Math.random() < 0.6;
  const ans = askSecond ? b * u : a * u;
  const wrong = askSecond ? [a * u, T / b, u, T - b, T / a] : [b * u, T / a, u, T - a, T / b];
  const { options, correctIndex } = numOptions(ans, wrong, { suf: ctx.suf });
  return {
    tip: 'ONE BOX = ONE UNIT',
    prompt: `The ratio of ${ctx.t} is ${a} : ${b}. There are ${ctx.total(T)} altogether. How many ${ctx.count(askSecond ? ctx.q : ctx.p)} are there?`,
    options, correctIndex,
    diagramData: {
      mode: 'bars',
      rows: [{ label: ctx.p, units: a, unitLabel: '?' }, { label: ctx.q, units: b, unitLabel: '?' }],
      total: `${T}`
    },
    explanation: `${a} + ${b} = ${a + b} units = ${T}, so 1 unit = ${u}. ${askSecond ? `${ctx.q}: ${b} × ${u} = ${ans}` : `${ctx.p}: ${a} × ${u} = ${ans}`}.`
  };
}

/* World 7 — ratio difference */
function ratioDiff(name, diff) {
  const [a, b] = pick([[1, 3], [2, 5], [3, 5], [2, 7], [3, 7], [1, 4]]);
  const u = randInt(3, 8 + diff * 2);
  const T = (a + b) * u;
  const other = otherName(name);
  const ans = (b - a) * u;
  const wrong = [u, b * u, T / (b - a), a * u, T - ans];
  const { options, correctIndex } = numOptions(ans, wrong, { pre: '$' });
  return {
    tip: 'COMPARE THE UNITS',
    prompt: `${name} and ${other} share $${T} in the ratio ${a} : ${b}. How much MORE money does ${other} receive than ${name}?`,
    options, correctIndex,
    diagramData: {
      mode: 'bars',
      rows: [{ label: name, units: a, unitLabel: '?' }, { label: other, units: b, unitLabel: '?' }],
      total: `$${T}`
    },
    explanation: `${a + b} units = $${T} → 1 unit = $${u}. The difference is ${b} − ${a} = ${b - a} units = $${ans}.`
  };
}

/* World 8 — percent sale (solve) */
function percentSale(name) {
  const p = pick([10, 20, 25, 40, 50]);
  const orig = 20 * randInt(3, 15);
  const S = orig * (100 - p) / 100;
  const item = pick(['jacket', 'backpack', 'skateboard', 'pair of trainers']);
  const wrong = [S * (1 + p / 100), S + p, S - p, orig * p / 100, S * (100 - p) / 100];
  const { options, correctIndex } = numOptions(orig, wrong, { pre: '$' });
  const g = gcd(100, p);
  return {
    tip: 'SALE = (100 − %) OF ORIGINAL',
    prompt: `${name} buys a ${item} in a ${p}% off sale and pays $${S}. What was the ORIGINAL price?`,
    options, correctIndex,
    diagramData: {
      mode: 'bars',
      rows: [
        { label: 'Original', units: 100 / g, unitLabel: `${g}%` },
        { label: 'Sale', units: (100 - p) / g, unitLabel: `${g}%` }
      ],
      total: `$${S} = ${100 - p}%`
    },
    explanation: `The sale price is ${100 - p}% of the original. ${100 - p}% = $${S}, so 1% = $${fmt(S / (100 - p))} and 100% = $${orig}.`
  };
}
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

/* World 8 — percent sale (represent) */
function percentEq(name) {
  const p = pick([10, 20, 25, 40, 50]);
  const orig = 20 * randInt(3, 15);
  const S = orig * (100 - p) / 100;
  const r = (100 - p) / 100;
  const item = pick(['jacket', 'backpack', 'skateboard', 'pair of trainers']);
  const correct = `${fmt(r)}x = ${S}`;
  const wrong = [`x − ${p} = ${S}`, `${fmt(1 + p / 100)}x = ${S}`, `${fmt(p / 100)}x = ${S}`, `x − ${fmt(p / 100)} = ${S}`];
  const { options, correctIndex } = buildOptions(correct, wrong);
  return {
    tip: 'PERCENT → DECIMAL',
    prompt: `A ${item} has a ${p}% discount, and the sale price is $${S}. Let x be the original price in dollars. Which equation represents this?`,
    options, correctIndex,
    diagramData: { mode: 'card', lines: [`Original = x`, `Discount = ${p}%`, `Pay ${100 - p}% of x = $${S}`] },
    explanation: `After a ${p}% discount you pay ${100 - p}% of x, which is ${fmt(r)}x. So ${fmt(r)}x = ${S}.`
  };
}

/* World 9 — speed equation (represent) */
function speedParams() {
  const h1 = randInt(2, 4), h2 = randInt(1, 3), k = randInt(2, 6), x = randInt(8, 20);
  const D = h1 * x + h2 * (x + k);
  return { h1, h2, k, x, D };
}
function speedEq(name) {
  const { h1, h2, k, D } = speedParams();
  const correct = `${h1}x + ${h2}(x + ${k}) = ${D}`;
  const wrong = [`${h1}x + ${h2}x + ${k} = ${D}`, `${h1 + h2}(x + ${k}) = ${D}`, `${h1}x + ${h2}(x − ${k}) = ${D}`, `${h1}(x + ${k}) + ${h2}x = ${D}`];
  const { options, correctIndex } = buildOptions(correct, wrong);
  return {
    tip: 'DISTANCE = SPEED × TIME',
    prompt: `${name} cycles for ${h1} hours at x km/h, then for ${h2} hour${h2 > 1 ? 's' : ''} at (x + ${k}) km/h. The total distance is ${D} km. Which equation represents this?`,
    options, correctIndex,
    diagramData: {
      mode: 'bars',
      rows: [{ label: 'Leg 1', units: h1, unitLabel: 'x' }, { label: 'Leg 2', units: h2, unitLabel: 'x', extra: `+${k * h2}` }],
      total: `${D} km`
    },
    explanation: `Leg 1: ${h1} × x. Leg 2: ${h2} × (x + ${k}). Their sum is the total distance ${D}.`
  };
}

/* World 9 — speed equation (solve) */
function speedSolve(name) {
  const { h1, h2, k, x, D } = speedParams();
  const wrong = [(D - k) / (h1 + h2), D / (h1 + h2), (D + h2 * k) / (h1 + h2), x + k, x - 1];
  const { options, correctIndex } = numOptions(x, wrong, { suf: ' km/h' });
  return {
    tip: 'BUILD, THEN SOLVE',
    prompt: `${name} cycles for ${h1} hours at x km/h, then ${h2} hour${h2 > 1 ? 's' : ''} at (x + ${k}) km/h, covering ${D} km in total. Find x.`,
    options, correctIndex,
    diagramData: {
      mode: 'bars',
      rows: [{ label: 'Leg 1', units: h1, unitLabel: 'x' }, { label: 'Leg 2', units: h2, unitLabel: 'x', extra: `+${k * h2}` }],
      total: `${D} km`
    },
    explanation: `${h1}x + ${h2}(x + ${k}) = ${D} → ${h1 + h2}x + ${h2 * k} = ${D} → ${h1 + h2}x = ${D - h2 * k} → x = ${x}.`
  };
}

/* World 10 — savings story (multi-step) */
function multiStep(name) {
  const c = randInt(10, 60), m = randInt(4, 15), w = randInt(4, 12), T = c + m * w;
  const wrong = [T / m, (T + c) / m, w + 1, w - 1, T - c];
  const { options, correctIndex } = numOptions(w, wrong, { suf: ' weeks' });
  return {
    tip: 'START + RATE × TIME',
    prompt: `${name} already has $${c} and saves $${m} every week. After how many weeks will ${name} have exactly $${T}?`,
    options, correctIndex,
    diagramData: {
      mode: 'table', xLabel: 'Week (w)', yLabel: 'Savings $',
      rows: [[0, c], [1, c + m], [2, c + 2 * m], [3, c + 3 * m]], step: m
    },
    explanation: `Savings = ${c} + ${m}w. Set ${c} + ${m}w = ${T} → ${m}w = ${T - c} → w = ${w}.`
  };
}

/* World 10 — is the answer reasonable? */
function reasonable(name) {
  const cap = pick([30, 40, 45, 50]), q = randInt(3, 8), r = randInt(3, cap - 5);
  const s = cap * q + r;
  const wrong = [q, s / cap, q + 2, q - 1];
  const { options, correctIndex } = numOptions(q + 1, wrong, { suf: ' buses' });
  return {
    tip: 'CHECK YOUR ANSWER',
    prompt: `${s} students go on a trip. Each bus seats ${cap} students. ${name} calculates ${s} ÷ ${cap} = ${fmt(s / cap)}. How many buses are really needed?`,
    options, correctIndex,
    diagramData: { mode: 'card', lines: [`${s} ÷ ${cap} = ${fmt(s / cap)}`, 'A bus cannot be split!'] },
    explanation: `${fmt(s / cap)} is not a whole number, and every student needs a seat. Round UP to ${q + 1} buses.`
  };
}

const ARCHETYPES = {
  askUnknown, notNeeded, defineVar, w2expr, barUnits, barDifference,
  tableRule, tablePredict, eqFromStory, solveEq, balance,
  ratioBar, ratioDiff, percentSale, percentEq, speedEq, speedSolve,
  multiStep, reasonable
};

/**
 * Generate a procedural question for a given world
 */
export function makeQuestion(worldIndex = 0) {
  const world = PRACTICE_WORLDS[worldIndex] || PRACTICE_WORLDS[0];
  const name = pick(WESTERN_NAMES);
  const type = pick(world.types);
  const q = ARCHETYPES[type](name, world.difficulty);
  return { world, name, type, ...q };
}
