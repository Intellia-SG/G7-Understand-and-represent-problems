import React, { useState, useEffect } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { BarModel } from '../components/ProblemDiagram.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { narrate, speakKey } from '../audio.js';

/* =========================================================================
   3 STATIONS × 3 ACTIVITIES
   Station 1 — Story Decoder  (UNDERSTAND: highlight given / asked / related clues)
   Station 2 — Model Maker    (REPRESENT: build a bar model, a table + rule, an equation)
   Station 3 — Solve & Check  (SOLVE INDEPENDENTLY: type the answer, then verify)
   Descriptions are read from AUDIO_MAP so the spoken text == the on-screen text.
   ========================================================================= */

const STATIONS = [
  { n: 1, icon: '🔍', title: 'Station 1: Story Decoder', sub: 'Highlight the clues' },
  { n: 2, icon: '🧱', title: 'Station 2: Model Maker', sub: 'Build bars, tables & equations' },
  { n: 3, icon: '🧩', title: 'Station 3: Solve & Check', sub: 'Solve it, then verify' }
];

const STATION_ACTIVITIES = {
  1: [
    {
      id: 1, title: 'Activity 1: Fun Fair Tickets', icon: '🎟️', kind: 'decoder',
      segments: [
        { t: "Zara's class runs a fun fair.", role: 'none' },
        { t: 'They sold 35 tickets on Friday.', role: 'given' },
        { t: 'Each ticket costs $4.', role: 'none' },
        { t: 'On Saturday they sold 12 more tickets than on Friday.', role: 'rel' },
        { t: 'How many tickets did they sell on Saturday?', role: 'ask' }
      ],
      unknown: 'Tickets sold on Saturday',
      letter: 'Let t = number of tickets sold on Saturday, so t = 35 + 12.',
      hint: 'The price of a ticket is a distractor — the question is about how MANY tickets, not money.'
    },
    {
      id: 2, title: 'Activity 2: Recycling Drive', icon: '♻️', kind: 'decoder',
      segments: [
        { t: 'Leo and Mia collect cans for recycling.', role: 'none' },
        { t: 'Together they collected 96 cans.', role: 'given' },
        { t: 'Leo collected 3 times as many cans as Mia.', role: 'rel' },
        { t: 'The cans were sorted into blue bins.', role: 'none' },
        { t: 'How many cans did Mia collect?', role: 'ask' }
      ],
      unknown: "Mia's cans",
      letter: 'Let m = number of cans Mia collected, so Leo collected 3m and m + 3m = 96.',
      hint: '"3 times as many" tells you how Leo and Mia are related. The colour of the bins is just decoration.'
    },
    {
      id: 3, title: 'Activity 3: Phone Plan', icon: '📱', kind: 'decoder',
      segments: [
        { t: 'A phone plan costs $15 per month plus $0.10 for every text message.', role: 'rel' },
        { t: "Jaya's bill last month was $22.", role: 'given' },
        { t: 'She also bought a new phone case.', role: 'none' },
        { t: 'How many text messages did she send?', role: 'ask' }
      ],
      unknown: 'Number of text messages',
      letter: 'Let n = number of messages, so 15 + 0.10n = 22.',
      hint: 'The fixed fee and the price per message describe HOW the bill is made (a relationship). The phone case is not part of the bill.'
    }
  ],
  2: [
    {
      id: 1, title: 'Activity 1: Sticker Bar Model', icon: '📊', kind: 'bar',
      problem: 'Sam has 3 times as many stickers as Mia. Together they have 48 stickers. How many stickers does Mia have?',
      rows: [{ label: 'Mia', target: 1 }, { label: 'Sam', target: 3 }],
      total: 48, unitName: 'stickers',
      hint: '"3 times as many" means Sam needs 3 boxes for every 1 box of Mia.',
      solution: ['Total boxes = 1 + 3 = 4 units', '4 units = 48', '1 unit = 48 ÷ 4 = 12', 'Mia = 1 unit = 12 stickers  ✅']
    },
    {
      id: 2, title: 'Activity 2: Sunflower Growth Table', icon: '🌻', kind: 'table',
      problem: 'A sunflower is 8 cm tall on Day 0 and grows 3 cm every day.',
      xLabel: 'Day (d)', yLabel: 'Height (h cm)',
      rows: [[1, 11], [2, 14], [3, 17], [4, 20]], prefilled: 2, step: 3,
      rules: ['h = 3d + 8', 'h = 8d + 3', 'h = 11d', 'h = d + 11'], correctRule: 0,
      hint: 'Each day adds 3 cm, and the plant already had 8 cm on Day 0.',
      check: 'Check Day 3: 3 × 3 + 8 = 17 ✅'
    },
    {
      id: 3, title: 'Activity 3: Equation Tile Builder', icon: '🧮', kind: 'tiles',
      problem: 'Mia thinks of a number, n. Doubling it and then subtracting 5 gives 19.',
      bank: ['2n', 'n', '−', '+', '5', '=', '19', '3'],
      answers: [['2n', '−', '5', '=', '19'], ['19', '=', '2n', '−', '5']],
      hint: 'Doubling n is written 2n. Then subtract 5, and the result equals 19.',
      solution: ['2n − 5 = 19', '2n = 24  (add 5 to both sides)', 'n = 12  (divide by 2)', 'Check: 2 × 12 − 5 = 19 ✅']
    }
  ],
  3: [
    {
      id: 1, title: 'Activity 1: Ages in a Bar Model', icon: '🎂', kind: 'solve-bars',
      problem: 'Dad is 4 times as old as Kai. Together they are 45 years old.',
      rows: [{ label: 'Kai', units: 1, unitLabel: '?' }, { label: 'Dad', units: 4, unitLabel: '?' }],
      total: '45', ask: "Kai's age", unit: 'years', answer: 9,
      hint: '5 equal boxes make 45, so one box is 45 ÷ 5.',
      check: 'Check: Kai 9 + Dad 36 = 45 ✅ and 36 is 4 × 9 ✅'
    },
    {
      id: 2, title: 'Activity 2: Taxi Fare Rule', icon: '🚕', kind: 'solve-table',
      problem: 'Fare = 3 + 2k dollars, where k is the number of kilometres. Ali paid $25.',
      xLabel: 'Distance (k km)', yLabel: 'Fare ($)', rows: [[1, 5], [2, 7], [3, 9], [4, 11]],
      ask: 'distance (k)', unit: 'km', answer: 11,
      hint: 'Write 3 + 2k = 25. Subtract 3 from both sides, then divide by 2.',
      check: 'Check: 3 + 2 × 11 = 25 ✅'
    },
    {
      id: 3, title: 'Activity 3: Spot the Error', icon: '🔧', kind: 'solve-error',
      problem: 'Ravi solves 3x − 5 = 16 like this:',
      steps: [
        { t: 'Step 1:  3x − 5 = 16', bad: false },
        { t: 'Step 2:  3x = 16 − 5 = 11', bad: true },
        { t: 'Step 3:  x = 11 ÷ 3', bad: false }
      ],
      ask: 'x', unit: '', answer: 7,
      hint: 'To undo "− 5" you must ADD 5 to both sides. Then divide by 3.',
      check: 'Check: 3 × 7 − 5 = 16 ✅'
    }
  ]
};

const ROLE_STYLES = {
  given: { label: 'Given', emoji: '🟦', chip: 'bg-sky-500/35 border-sky-300 text-sky-50', tool: 'border-sky-400 text-sky-200', active: 'bg-sky-500 text-slate-950 border-sky-200' },
  ask:   { label: 'Asked', emoji: '🟥', chip: 'bg-rose-500/35 border-rose-300 text-rose-50', tool: 'border-rose-400 text-rose-200', active: 'bg-rose-500 text-white border-rose-200' },
  rel:   { label: 'Related', emoji: '🟨', chip: 'bg-amber-400/35 border-amber-300 text-amber-50', tool: 'border-amber-400 text-amber-200', active: 'bg-amber-400 text-slate-950 border-amber-100' }
};

const scrollRef = el => { if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); };

const BOX = 'flex flex-col items-center gap-2 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-3 shadow-xl flex-1 min-h-0 overflow-y-auto [&>*]:shrink-0 [&>*:first-child]:mt-auto [&>*:last-child]:mb-auto';

/* ------------------------------------------------------------------ */
/* Station 1 — Story Decoder                                          */
/* ------------------------------------------------------------------ */
function DecoderStation({ act, muted }) {
  const [tool, setTool] = useState('given');
  const [marks, setMarks] = useState({});
  const [wrong, setWrong] = useState([]);
  const [status, setStatus] = useState(null); // null | 'ok' | {right,total}
  const [showHint, setShowHint] = useState(false);

  const apply = (i) => {
    setWrong(w => w.filter(x => x !== i));
    setStatus(null);
    setMarks(m => {
      const next = { ...m };
      if (tool === 'erase' || next[i] === tool) delete next[i];
      else next[i] = tool;
      return next;
    });
  };

  const check = () => {
    const bad = [];
    act.segments.forEach((seg, i) => {
      const expected = seg.role === 'none' ? undefined : seg.role;
      if (marks[i] !== expected) bad.push(i);
    });
    setWrong(bad);
    if (bad.length === 0) {
      setStatus('ok');
      speakKey('sim_success', muted);
    } else {
      setStatus({ right: act.segments.length - bad.length, total: act.segments.length });
      speakKey('sim_retry', muted);
    }
  };

  return (
    <div className={BOX}>
      {/* Highlighter toolbar */}
      <div className="flex items-center gap-2 bg-[#14082c] px-3 py-2 rounded-xl border border-cyan-400/30 w-full justify-center flex-wrap shrink-0">
        <span className="text-xs sm:text-sm font-extrabold text-slate-200">Highlighter:</span>
        {Object.entries(ROLE_STYLES).map(([key, r]) => (
          <button
            key={key}
            onClick={() => setTool(key)}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-900 border-2 transition cursor-pointer ${tool === key ? `${r.active} scale-105 shadow-md` : `bg-white/5 ${r.tool} hover:bg-white/10`}`}
          >
            {r.emoji} {r.label}
          </button>
        ))}
        <button
          onClick={() => setTool('erase')}
          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-900 border-2 transition cursor-pointer ${tool === 'erase' ? 'bg-white text-slate-900 border-white scale-105' : 'bg-white/5 border-white/30 text-slate-200 hover:bg-white/10'}`}
        >
          🧽 Erase
        </button>
      </div>

      {/* Problem, split into tappable clue chips */}
      <div className="w-full bg-[#100a2c] border-2 border-purple-400/30 rounded-2xl p-2.5 flex flex-wrap gap-2 justify-center items-center content-center">
        {act.segments.map((seg, i) => {
          const m = marks[i];
          const isWrong = wrong.includes(i);
          return (
            <button
              key={i}
              onClick={() => apply(i)}
              className={`px-2.5 py-1.5 rounded-xl border-2 text-left text-sm font-extrabold leading-snug transition cursor-pointer ${
                m ? ROLE_STYLES[m].chip : 'bg-white/5 border-white/20 text-slate-100 hover:bg-white/10'
              } ${isWrong ? '!border-rose-500 ring-2 ring-rose-500 animate-shake' : ''}`}
            >
              {seg.t}
            </button>
          );
        })}
      </div>

      {status === 'ok' ? (
        <div ref={scrollRef} className="w-full bg-emerald-950/90 border-2 border-emerald-400/60 rounded-2xl p-3 text-center fade-in-up shrink-0">
          <p className="font-display font-900 text-emerald-300 text-sm sm:text-base mb-1">🕵️ Case cracked! Detective Card</p>
          <p className="text-slate-100 text-xs sm:text-sm font-extrabold">❓ Unknown: <span className="text-rose-300">{act.unknown}</span></p>
          <p className="text-slate-100 text-xs sm:text-sm font-extrabold">🔤 {act.letter}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 justify-center shrink-0">
            <button onClick={check} className="btn-gold text-sm sm:text-base font-900 px-7 py-2.5 shadow-lg hover:scale-105 transition cursor-pointer">
              Check My Clues ✨
            </button>
            <button
              onClick={() => setShowHint(h => !h)}
              className="bg-purple-900/80 hover:bg-purple-800 border border-purple-400/50 text-purple-200 font-display font-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              💡 Hint
            </button>
          </div>
          {status && (
            <div className="p-2.5 rounded-xl text-xs sm:text-sm font-900 w-full text-center bg-rose-950/90 text-rose-300 border-2 border-rose-400/60 shrink-0">
              {status.right} of {status.total} clues are right. Wrong ones are outlined in red — rethink them!
            </div>
          )}
          {showHint && (
            <div className="p-2.5 bg-amber-950/90 border border-amber-400/50 text-amber-200 rounded-xl text-xs sm:text-sm font-bold w-full text-center fade-in-up shrink-0">
              💡 {act.hint}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Station 2 — Model Maker                                            */
/* ------------------------------------------------------------------ */
const ROW_BG = ['bg-violet-600 border-violet-300', 'bg-sky-500 border-sky-200'];

function BarBuilder({ act, muted }) {
  const [counts, setCounts] = useState(act.rows.map(() => 1));
  const [state, setState] = useState(null); // null | 'wrong' | 'ok'
  const [showHint, setShowHint] = useState(false);

  const unit = act.total / act.rows.reduce((a, r) => a + r.target, 0);
  const totalUnits = counts.reduce((a, b) => a + b, 0);

  const change = (i, d) => {
    setState(null);
    setCounts(c => c.map((v, idx) => (idx === i ? Math.min(6, Math.max(1, v + d)) : v)));
  };

  const check = () => {
    const ok = counts.every((c, i) => c === act.rows[i].target);
    setState(ok ? 'ok' : 'wrong');
    speakKey(ok ? 'sim_success' : 'sim_retry', muted);
  };

  return (
    <div className={BOX}>
      <div className="w-full bg-[#14082c] border border-cyan-400/30 rounded-xl px-4 py-2 text-center text-slate-100 text-sm sm:text-base font-extrabold shrink-0">
        {act.problem}
      </div>

      <div className="flex flex-col gap-2 w-full items-center justify-center">
        {act.rows.map((r, i) => (
          <div key={r.label} className="flex items-center gap-3 w-full max-w-xl">
            <span className="w-14 text-right font-display font-900 text-slate-100 text-sm sm:text-base">{r.label}</span>
            <button onClick={() => change(i, -1)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-900 text-lg cursor-pointer">−</button>
            <div className="flex gap-1.5 flex-1 min-h-[2.5rem] items-center">
              {Array.from({ length: counts[i] }).map((_, k) => (
                <div key={k} className={`h-10 w-12 sm:w-14 rounded-lg border-2 flex items-center justify-center font-display font-900 text-white text-sm ${ROW_BG[i % 2]}`}>
                  {state === 'ok' ? unit : ''}
                </div>
              ))}
            </div>
            <button onClick={() => change(i, 1)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-900 text-lg cursor-pointer">+</button>
          </div>
        ))}
        <p className="text-xs sm:text-sm font-900 text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded-lg px-3 py-1">
          Total boxes: {totalUnits} {state === 'ok' ? `→ ${act.total} ${act.unitName} in all` : ''}
        </p>
      </div>

      {state === 'ok' ? (
        <div ref={scrollRef} className="w-full bg-emerald-950/90 border-2 border-emerald-400/60 rounded-2xl p-3 fade-in-up shrink-0">
          {act.solution.map((l, i) => (
            <p key={i} className="text-emerald-200 font-mono text-xs sm:text-sm font-bold text-center">{l}</p>
          ))}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 justify-center shrink-0">
            <button onClick={check} className="btn-gold text-sm sm:text-base font-900 px-7 py-2.5 shadow-lg hover:scale-105 transition cursor-pointer">
              Check My Model ✨
            </button>
            <button onClick={() => setShowHint(h => !h)} className="bg-purple-900/80 hover:bg-purple-800 border border-purple-400/50 text-purple-200 font-display font-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl transition cursor-pointer">
              💡 Hint
            </button>
          </div>
          {state === 'wrong' && (
            <div className="p-2.5 rounded-xl text-xs sm:text-sm font-900 w-full text-center bg-rose-950/90 text-rose-300 border-2 border-rose-400/60 shrink-0">
              The picture doesn't match the story yet. Re-read the problem and adjust the boxes!
            </div>
          )}
          {showHint && (
            <div className="p-2.5 bg-amber-950/90 border border-amber-400/50 text-amber-200 rounded-xl text-xs sm:text-sm font-bold w-full text-center fade-in-up shrink-0">
              💡 {act.hint}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TableBuilder({ act, muted }) {
  const hidden = act.rows.slice(act.prefilled);
  const [vals, setVals] = useState(hidden.map(() => ''));
  const [stage, setStage] = useState('fill'); // fill -> rule -> done
  const [fillState, setFillState] = useState(null); // null | boolean[]
  const [ruleWrong, setRuleWrong] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const checkFill = () => {
    const res = hidden.map((r, i) => Number(vals[i]) === r[1] && vals[i] !== '');
    setFillState(res);
    if (res.every(Boolean)) {
      setStage('rule');
      speakKey('sim_success', muted);
    } else {
      speakKey('sim_retry', muted);
    }
  };

  const pickRule = (i) => {
    if (i === act.correctRule) {
      setStage('done');
      setRuleWrong(null);
      speakKey('sim_success', muted);
    } else {
      setRuleWrong(i);
      speakKey('sim_retry', muted);
    }
  };

  return (
    <div className={BOX}>
      <div className="w-full bg-[#14082c] border border-cyan-400/30 rounded-xl px-4 py-2 text-center text-slate-100 text-sm sm:text-base font-extrabold shrink-0">
        {act.problem}
      </div>

      <div className="overflow-x-auto max-w-full">
        <table className="mx-auto border-separate border-spacing-0 rounded-xl overflow-hidden border-2 border-cyan-400/50 text-center">
          <thead>
            <tr className="bg-cyan-500/25 text-cyan-100 font-display text-sm sm:text-base">
              <th className="px-4 py-2 border-r border-cyan-400/30">{act.xLabel}</th>
              {act.rows.map(([x], i) => <th key={i} className="px-5 py-2 border-r border-cyan-400/20 last:border-r-0">{x}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white/5 text-amber-300 font-display text-sm sm:text-base">
              <td className="px-4 py-2 border-r border-cyan-400/30 text-cyan-100">{act.yLabel}</td>
              {act.rows.map(([, y], i) => {
                const hi = i - act.prefilled;
                if (hi < 0) return <td key={i} className="px-5 py-2 border-r border-cyan-400/20 font-900">{y}</td>;
                const ok = fillState && fillState[hi];
                const bad = fillState && !fillState[hi];
                return (
                  <td key={i} className="px-2 py-1.5 border-r border-cyan-400/20 last:border-r-0">
                    {stage === 'fill' ? (
                      <input
                        type="number"
                        value={vals[hi]}
                        onChange={e => { setVals(v => v.map((x, k) => (k === hi ? e.target.value : x))); setFillState(null); }}
                        className={`w-16 bg-[#14082c] border-2 rounded-lg text-center text-white font-900 py-1 outline-none ${bad ? 'border-rose-400 animate-shake' : ok ? 'border-emerald-400' : 'border-cyan-400/60 focus:border-amber-400'}`}
                        placeholder="?"
                      />
                    ) : <span className="font-900">{y}</span>}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
        {stage !== 'fill' && (
          <div className="flex justify-center gap-6 mt-1 text-xs sm:text-sm font-900 text-emerald-300 fade-in-up">
            <span>↗ each step: +{act.step}</span>
          </div>
        )}
      </div>

      {stage === 'fill' && (
        <>
          <p className="text-slate-200 text-xs sm:text-sm font-extrabold shrink-0">Step 1: Type the missing heights.</p>
          <div className="flex items-center gap-3 justify-center shrink-0">
            <button onClick={checkFill} className="btn-gold text-sm sm:text-base font-900 px-7 py-2.5 shadow-lg hover:scale-105 transition cursor-pointer">
              Check the Table ✨
            </button>
            <button onClick={() => setShowHint(h => !h)} className="bg-purple-900/80 hover:bg-purple-800 border border-purple-400/50 text-purple-200 font-display font-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl transition cursor-pointer">
              💡 Hint
            </button>
          </div>
          {fillState && !fillState.every(Boolean) && (
            <div className="p-2.5 rounded-xl text-xs sm:text-sm font-900 w-full text-center bg-rose-950/90 text-rose-300 border-2 border-rose-400/60 shrink-0">
              Some heights are off. Look at how much the plant grows each day!
            </div>
          )}
          {showHint && (
            <div className="p-2.5 bg-amber-950/90 border border-amber-400/50 text-amber-200 rounded-xl text-xs sm:text-sm font-bold w-full text-center fade-in-up shrink-0">
              💡 {act.hint}
            </div>
          )}
        </>
      )}

      {stage === 'rule' && (
        <div ref={scrollRef} className="w-full flex flex-col items-center gap-2 fade-in-up shrink-0">
          <p className="text-slate-100 text-xs sm:text-sm font-extrabold">Step 2: Which rule matches the pattern?</p>
          <div className="grid grid-cols-2 gap-2.5 w-full max-w-md">
            {act.rules.map((r, i) => (
              <button
                key={r}
                onClick={() => pickRule(i)}
                className={`py-2 rounded-xl border-2 font-display font-900 text-sm sm:text-base cursor-pointer transition ${
                  ruleWrong === i ? 'bg-rose-600 border-rose-300 text-white animate-shake' : 'bg-[#14082e] border-purple-400/40 text-white hover:border-cyan-400'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          {ruleWrong != null && <p className="text-rose-300 text-xs sm:text-sm font-900">Test it on the table — does it give the right height for Day 1?</p>}
        </div>
      )}

      {stage === 'done' && (
        <div ref={scrollRef} className="w-full bg-emerald-950/90 border-2 border-emerald-400/60 rounded-2xl p-3 text-center fade-in-up shrink-0">
          <p className="font-display font-900 text-emerald-300 text-sm sm:text-lg">Rule found: {act.rules[act.correctRule]}</p>
          <p className="text-emerald-200 font-mono text-xs sm:text-sm font-bold">{act.check}</p>
        </div>
      )}
    </div>
  );
}

function TileBuilder({ act, muted }) {
  const [seq, setSeq] = useState([]); // indices into bank
  const [state, setState] = useState(null); // null | 'wrong' | 'ok'
  const [showHint, setShowHint] = useState(false);

  const built = seq.map(i => act.bank[i]);
  const add = (i) => { if (state === 'ok' || seq.includes(i) || seq.length >= 7) return; setState(null); setSeq(s => [...s, i]); };
  const undo = () => { setState(null); setSeq(s => s.slice(0, -1)); };
  const clear = () => { setState(null); setSeq([]); };

  const check = () => {
    const ok = act.answers.some(a => a.length === built.length && a.every((t, i) => t === built[i]));
    setState(ok ? 'ok' : 'wrong');
    speakKey(ok ? 'sim_success' : 'sim_retry', muted);
  };

  return (
    <div className={BOX}>
      <div className="w-full bg-[#14082c] border border-cyan-400/30 rounded-xl px-4 py-2 text-center text-slate-100 text-sm sm:text-base font-extrabold shrink-0">
        {act.problem}
      </div>

      {/* Equation slots */}
      <div className={`w-full min-h-[3.5rem] rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 px-3 py-2 flex-wrap shrink-0 ${state === 'ok' ? 'border-emerald-400 bg-emerald-950/50' : state === 'wrong' ? 'border-rose-400 bg-rose-950/40 animate-shake' : 'border-cyan-400/50 bg-[#14082c]'}`}>
        {built.length === 0 && <span className="text-slate-400 font-extrabold text-sm">Tap the tiles below to build the equation…</span>}
        {built.map((t, i) => (
          <span key={i} className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-display font-900 text-lg sm:text-xl shadow-md">{t}</span>
        ))}
      </div>

      {/* Tile bank */}
      <div className="flex flex-wrap gap-2.5 justify-center shrink-0">
        {act.bank.map((t, i) => (
          <button
            key={i}
            disabled={seq.includes(i)}
            onClick={() => add(i)}
            className={`min-w-[3rem] px-4 py-2 rounded-xl border-2 font-display font-900 text-lg sm:text-xl transition cursor-pointer ${
              seq.includes(i) ? 'opacity-25 border-white/10 text-slate-500' : 'bg-[#14082e] border-cyan-400/60 text-white hover:bg-cyan-500/20 hover:scale-105'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {state === 'ok' ? (
        <div ref={scrollRef} className="w-full bg-emerald-950/90 border-2 border-emerald-400/60 rounded-2xl p-3 fade-in-up shrink-0">
          {act.solution.map((l, i) => <p key={i} className="text-emerald-200 font-mono text-xs sm:text-sm font-bold text-center">{l}</p>)}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2.5 justify-center shrink-0">
            <button onClick={undo} className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-display font-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl cursor-pointer">↩ Undo</button>
            <button onClick={clear} className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-display font-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl cursor-pointer">🗑 Clear</button>
            <button onClick={check} disabled={built.length === 0} className="btn-gold text-sm sm:text-base font-900 px-7 py-2.5 shadow-lg hover:scale-105 transition cursor-pointer disabled:opacity-40">Check Equation ✨</button>
            <button onClick={() => setShowHint(h => !h)} className="bg-purple-900/80 hover:bg-purple-800 border border-purple-400/50 text-purple-200 font-display font-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl transition cursor-pointer">💡 Hint</button>
          </div>
          {state === 'wrong' && (
            <div className="p-2.5 rounded-xl text-xs sm:text-sm font-900 w-full text-center bg-rose-950/90 text-rose-300 border-2 border-rose-400/60 shrink-0">
              That equation tells a different story. Read the sentence again, one step at a time!
            </div>
          )}
          {showHint && (
            <div className="p-2.5 bg-amber-950/90 border border-amber-400/50 text-amber-200 rounded-xl text-xs sm:text-sm font-bold w-full text-center fade-in-up shrink-0">
              💡 {act.hint}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Station 3 — Solve & Check                                          */
/* ------------------------------------------------------------------ */
function SolveStation({ act, muted }) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const handleCheck = () => {
    const num = parseFloat(answer);
    if (!Number.isNaN(num) && Math.abs(num - act.answer) < 1e-9) {
      setFeedback({ success: true, text: `🎉 Amazing job! ${act.check}` });
      speakKey('sim_success', muted);
    } else {
      setFeedback({ success: false, text: 'Not quite — look at the model again and try once more. Need a nudge? Tap 💡 Hint.' });
      speakKey('sim_retry', muted);
    }
  };

  return (
    <div className={BOX}>
      <div className="w-full bg-[#14082c] border border-cyan-400/30 rounded-xl px-4 py-2 text-center text-slate-100 text-sm sm:text-base font-extrabold shrink-0">
        {act.problem}
      </div>

      <div className="flex items-center justify-center w-full">
        {act.kind === 'solve-bars' && (
          <div className="flex flex-col items-center gap-1 w-full drop-shadow-[0_0_14px_rgba(139,92,246,0.45)]">
            <BarModel rows={act.rows} total={act.total} />
          </div>
        )}

        {act.kind === 'solve-table' && (
          <div className="flex flex-col items-center gap-3">
            <table className="border-separate border-spacing-0 rounded-xl overflow-hidden border-2 border-cyan-400/50 text-center">
              <thead>
                <tr className="bg-cyan-500/25 text-cyan-100 font-display text-sm sm:text-base">
                  <th className="px-4 py-1.5 border-r border-cyan-400/30">{act.xLabel}</th>
                  {act.rows.map(([x], i) => <th key={i} className="px-5 py-1.5 border-r border-cyan-400/20 last:border-r-0">{x}</th>)}
                  <th className="px-5 py-1.5 text-rose-300">?</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white/5 text-amber-300 font-display text-sm sm:text-base">
                  <td className="px-4 py-1.5 border-r border-cyan-400/30 text-cyan-100">{act.yLabel}</td>
                  {act.rows.map(([, y], i) => <td key={i} className="px-5 py-1.5 border-r border-cyan-400/20 font-900">{y}</td>)}
                  <td className="px-5 py-1.5 font-900 text-rose-300">25</td>
                </tr>
              </tbody>
            </table>
            <div className="bg-[#100a2c] border-2 border-amber-400/50 rounded-xl px-5 py-2 font-display font-900 text-amber-300 text-base sm:text-lg">
              Rule: Fare = 3 + 2k
            </div>
          </div>
        )}

        {act.kind === 'solve-error' && (
          <div className="flex flex-col gap-2 w-full max-w-md">
            {act.steps.map((s, i) => (
              <div key={i} className={`flex items-center justify-between rounded-xl px-4 py-2 border-2 font-mono font-bold text-sm sm:text-base ${s.bad ? 'bg-rose-950/70 border-rose-400 text-rose-200' : 'bg-white/5 border-white/15 text-slate-100'}`}>
                <span>{s.t}</span>
                {s.bad && <span className="text-xs font-sans font-900 text-rose-300">⚠ something is wrong here</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 w-full justify-center flex-wrap shrink-0">
        <input
          type="number"
          placeholder={`Enter ${act.ask}`}
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCheck()}
          className="bg-[#14082c] border-2 border-cyan-400/70 rounded-xl px-5 py-2.5 text-white font-display font-900 text-base sm:text-lg text-center outline-none focus:border-amber-400 w-56 shadow-inner"
        />
        {act.unit && <span className="text-slate-200 font-900 text-sm">{act.unit}</span>}
        <button onClick={handleCheck} className="btn-gold text-sm sm:text-base font-900 px-7 py-2.5 shadow-lg hover:scale-105 transition cursor-pointer">
          Check Answer ✨
        </button>
        <button
          onClick={() => setShowHint(h => !h)}
          className="bg-purple-900/80 hover:bg-purple-800 border border-purple-400/50 text-purple-200 font-display font-900 text-xs sm:text-sm px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          💡 Hint
        </button>
      </div>

      {showHint && (
        <div className="p-2.5 bg-amber-950/90 border border-amber-400/50 text-amber-200 rounded-xl text-xs sm:text-sm font-bold w-full text-center fade-in-up shrink-0">
          💡 {act.hint}
        </div>
      )}

      {feedback && (
        <div ref={scrollRef} className={`p-3 rounded-2xl text-xs sm:text-base font-900 w-full text-center shadow-xl shrink-0 ${
          feedback.success ? 'bg-emerald-950/90 text-emerald-300 border-2 border-emerald-400/60' : 'bg-rose-950/90 text-rose-300 border-2 border-rose-400/60'
        }`}>
          {feedback.text}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Simulate Phase (layout identical to the previous module)      */
/* ------------------------------------------------------------------ */
export function SimulatePhase({ muted, onNext }) {
  const [station, setStation] = useState(1);
  const [actIdx, setActIdx] = useState(0);

  const currentActivity = STATION_ACTIVITIES[station][actIdx];
  const descKey = `sim_${station}_${actIdx + 1}`;

  useEffect(() => {
    narrate(AUDIO_MAP[descKey], !muted);
  }, [station, actIdx, muted]);

  const nextActivity = () => {
    if (actIdx < 2) {
      setActIdx(i => i + 1);
    } else if (station < 3) {
      setStation(s => s + 1);
      setActIdx(0);
    } else {
      onNext();
    }
  };

  const prevActivity = () => {
    if (actIdx > 0) {
      setActIdx(i => i - 1);
    } else if (station > 1) {
      setStation(s => s - 1);
      setActIdx(2);
    }
  };

  const renderActivity = () => {
    const k = currentActivity.kind;
    const key = `${station}-${actIdx}`;
    if (k === 'decoder') return <DecoderStation key={key} act={currentActivity} muted={muted} />;
    if (k === 'bar') return <BarBuilder key={key} act={currentActivity} muted={muted} />;
    if (k === 'table') return <TableBuilder key={key} act={currentActivity} muted={muted} />;
    if (k === 'tiles') return <TileBuilder key={key} act={currentActivity} muted={muted} />;
    return <SolveStation key={key} act={currentActivity} muted={muted} />;
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <BgSymbols />

      {/* Main Simulation Stations Glass Card Container */}
      <div className="w-full max-w-6xl max-h-[94vh] bg-[#160b36]/95 border-2 border-purple-400/40 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md flex flex-col items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Cyan Accent Bar */}
        <div className="w-24 h-2 bg-cyan-400 rounded-full mb-2.5 shadow-[0_0_18px_rgba(56,189,248,0.85)] shrink-0" />

        {/* Card Header Title */}
        <h2 className="font-display font-900 text-2xl sm:text-3xl text-white flex items-center gap-3 mb-3.5 shrink-0">
          <span className="text-3xl sm:text-4xl">🧪</span>
          <span>Simulation Stations</span>
        </h2>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-7 w-full items-stretch flex-1 min-h-0 overflow-hidden">
          {/* Left Column: Station Sidebar Tabs */}
          <div className="md:col-span-4 flex flex-col justify-between gap-3 shrink-0">
            <div className="flex flex-col gap-3.5">
              {STATIONS.map(st => (
                <button
                  key={st.n}
                  onClick={() => { setStation(st.n); setActIdx(0); }}
                  className={`p-4 sm:p-5 rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                    station === st.n
                      ? 'border-cyan-400 bg-[#1e2852] text-white shadow-[0_0_22px_rgba(56,189,248,0.4)] scale-[1.02]'
                      : 'border-purple-500/25 bg-[#13082b]/80 text-slate-300 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 ${
                      station === st.n ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white'
                    }`}>
                      {st.icon}
                    </div>
                    <div>
                      <p className="font-display font-900 text-base sm:text-lg leading-tight">{st.title}</p>
                      <p className="text-xs font-extrabold text-slate-300 mt-0.5">{st.sub}</p>
                    </div>
                  </div>
                  <span className="text-base">🔓</span>
                </button>
              ))}
            </div>

            {/* Bottom Left CTA Button */}
            <button
              onClick={onNext}
              className="btn-gold font-display font-900 text-base sm:text-lg py-4 px-6 shadow-[0_0_25px_rgba(250,204,21,0.65)] hover:scale-105 transition mt-2 w-full flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Go to Practice Phase!</span>
              <span>→</span>
            </button>
          </div>

          {/* Right Column: Interactive Simulation Box */}
          <div className="md:col-span-8 bg-[#13092e]/95 border-2 border-purple-400/35 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-inner flex-1 min-h-0 overflow-hidden">
            <div className="flex flex-col flex-1 min-h-0 justify-between">
              {/* Header Row */}
              <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-3 shrink-0">
                <h3 className="font-display font-900 text-xl sm:text-2xl text-cyan-300 flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl">{currentActivity.icon}</span>
                  <span>{currentActivity.title}</span>
                </h3>
                <span className="font-display font-900 text-xs sm:text-sm text-slate-200 bg-white/10 px-4 py-1 rounded-full border border-white/15 shrink-0">
                  Activity {actIdx + 1} of 3
                </span>
              </div>

              {/* Activity Description (== spoken narration) */}
              <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-extrabold mb-3 shrink-0">
                {AUDIO_MAP[descKey].text}
              </p>

              {renderActivity()}
            </div>

            {/* Bottom Activity Step Buttons */}
            <div className="flex items-center justify-between border-t border-white/15 pt-4 mt-3 shrink-0">
              <button
                onClick={prevActivity}
                disabled={station === 1 && actIdx === 0}
                className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border-2 border-white/25 text-white font-display font-900 text-sm sm:text-base px-6 py-2.5 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
              >
                ← Previous Activity
              </button>

              <button
                onClick={nextActivity}
                className="btn-gold text-sm sm:text-base font-900 px-8 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:scale-105 transition cursor-pointer"
              >
                <span>{station === 3 && actIdx === 2 ? 'Go to Practice Phase' : 'Next Activity'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
