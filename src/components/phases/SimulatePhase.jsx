// src/components/phases/SimulatePhase.jsx
import React, { useState, useEffect } from 'react';
import './SimulatePhase.css';
import { BarModel } from '../ProblemDiagram.jsx';
import { AUDIO_MAP } from '../../audioMap.js';
import { useAudio } from '../../hooks/useAudio.js';

const STATIONS = [
  { id: 0, n: 1, icon: '🔍', name: 'Story Decoder', sub: 'Highlight given, asked & related clues' },
  { id: 1, n: 2, icon: '🧱', name: 'Model Maker', sub: 'Build bars, tables & equations' },
  { id: 2, n: 3, icon: '🧩', name: 'Solve & Check', sub: 'Solve independently & verify' }
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
      letter: 'Let t = number of tickets sold on Saturday, so t = 35 + 12 = 47.',
      hint: 'The price of a ticket is a distractor — the question asks how MANY tickets, not the amount of money.'
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
      hint: '"3 times as many" tells you how Leo and Mia are related. The colour of the bins is a distractor.'
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
      hint: 'The fixed fee and price per message describe how the bill is calculated. The phone case is not part of the plan.'
    }
  ],
  2: [
    {
      id: 1, title: 'Activity 1: Sticker Bar Model', icon: '📊', kind: 'bar',
      problem: 'Sam has 3 times as many stickers as Mia. Together they have 48 stickers. How many stickers does Mia have?',
      rows: [{ label: 'Mia', target: 1 }, { label: 'Sam', target: 3 }],
      total: 48, unitName: 'stickers',
      hint: '"3 times as many" means Sam needs 3 boxes for every 1 box of Mia.',
      solution: ['Total boxes = 1 + 3 = 4 units', '4 units = 48', '1 unit = 48 ÷ 4 = 12', 'Mia = 1 unit = 12 stickers ✅']
    },
    {
      id: 2, title: 'Activity 2: Sunflower Growth Table', icon: '🌻', kind: 'table',
      problem: 'A sunflower is 8 cm tall on Day 0 and grows 3 cm every day.',
      xLabel: 'Day (d)', yLabel: 'Height (h cm)',
      rows: [[1, 11], [2, 14], [3, 17], [4, 20]], prefilled: 2, step: 3,
      rules: ['h = 3d + 8', 'h = 8d + 3', 'h = 11d', 'h = d + 11'], correctRule: 0,
      hint: 'Each day adds 3 cm, and the plant already started at 8 cm on Day 0.',
      check: 'Check Day 3: 3 × 3 + 8 = 17 ✅'
    },
    {
      id: 3, title: 'Activity 3: Equation Tile Builder', icon: '🧮', kind: 'tiles',
      problem: 'Mia thinks of a number, n. Doubling it and then subtracting 5 gives 19.',
      bank: ['2n', 'n', '−', '+', '5', '=', '19', '3'],
      answers: [['2n', '−', '5', '=', '19'], ['19', '=', '2n', '−', '5']],
      hint: 'Doubling n is written 2n. Then subtract 5, and the result equals 19.',
      solution: ['2n − 5 = 19', '2n = 24 (add 5 to both sides)', 'n = 12 (divide by 2)', 'Check: 2 × 12 − 5 = 19 ✅']
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

const BOX = 'flex flex-col items-center gap-3 bg-[#17123d] border-2 border-cyan-400/30 rounded-2xl p-4 shadow-xl flex-1 min-h-0 overflow-y-auto w-full';

function DecoderStation({ act, sounds }) {
  const [tool, setTool] = useState('given');
  const [marks, setMarks] = useState({});
  const [wrong, setWrong] = useState([]);
  const [status, setStatus] = useState(null);
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
      if (sounds) sounds.correct();
    } else {
      setStatus({ right: act.segments.length - bad.length, total: act.segments.length });
      if (sounds) sounds.wrong();
    }
  };

  return (
    <div className={BOX}>
      <div className="flex items-center gap-2 bg-[#120a28] px-3 py-2 rounded-xl border border-cyan-400/30 w-full justify-center flex-wrap shrink-0">
        <span className="text-xs sm:text-sm font-extrabold text-slate-200">Highlighter:</span>
        {Object.entries(ROLE_STYLES).map(([key, r]) => (
          <button
            key={key}
            onClick={() => setTool(key)}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-900 border-2 transition cursor-pointer ${
              tool === key ? `${r.active} scale-105 shadow-md` : `bg-white/5 ${r.tool} hover:bg-white/10`
            }`}
          >
            {r.emoji} {r.label}
          </button>
        ))}
        <button
          onClick={() => setTool('erase')}
          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-900 border-2 transition cursor-pointer ${
            tool === 'erase' ? 'bg-white text-slate-900 border-white scale-105' : 'bg-white/5 border-white/30 text-slate-200 hover:bg-white/10'
          }`}
        >
          🧽 Erase
        </button>
      </div>

      <div className="w-full bg-[#100a2c] border-2 border-purple-400/30 rounded-2xl p-3.5 flex flex-wrap gap-2.5 justify-center items-center content-center">
        {act.segments.map((seg, i) => {
          const m = marks[i];
          const isWrong = wrong.includes(i);
          return (
            <button
              key={i}
              onClick={() => apply(i)}
              className={`px-3 py-2 rounded-xl border-2 text-left text-sm font-extrabold leading-snug transition cursor-pointer ${
                m ? ROLE_STYLES[m].chip : 'bg-white/5 border-white/20 text-slate-100 hover:bg-white/10'
              } ${isWrong ? '!border-rose-500 ring-2 ring-rose-500 anim-shake' : ''}`}
            >
              {seg.t}
            </button>
          );
        })}
      </div>

      {status === 'ok' ? (
        <div className="w-full bg-emerald-950/90 border-2 border-emerald-400/60 rounded-2xl p-3.5 text-center anim-slide-up shrink-0">
          <p className="font-display font-900 text-emerald-300 text-sm sm:text-base mb-1">🕵️ Case Cracked! Detective Card</p>
          <p className="text-slate-100 text-xs sm:text-sm font-extrabold">❓ Unknown: <span className="text-rose-300">{act.unknown}</span></p>
          <p className="text-slate-100 text-xs sm:text-sm font-extrabold">🔤 {act.letter}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 justify-center shrink-0">
            <button onClick={check} className="btn btn-primary text-sm sm:text-base px-6 py-2.5">
              Check My Clues ✨
            </button>
            <button
              onClick={() => setShowHint(h => !h)}
              className="btn btn-secondary text-xs sm:text-sm px-4 py-2"
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
            <div className="p-2.5 bg-amber-950/90 border border-amber-400/50 text-amber-200 rounded-xl text-xs sm:text-sm font-bold w-full text-center anim-slide-up shrink-0">
              💡 {act.hint}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function BarBuilder({ act, sounds }) {
  const [counts, setCounts] = useState(act.rows.map(() => 1));
  const [state, setState] = useState(null);
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
    if (sounds) {
      if (ok) sounds.correct();
      else sounds.wrong();
    }
  };

  return (
    <div className={BOX}>
      <div className="w-full bg-[#120a28] border border-cyan-400/30 rounded-xl px-4 py-2 text-center text-slate-100 text-sm sm:text-base font-extrabold shrink-0">
        {act.problem}
      </div>

      <div className="flex flex-col gap-2.5 w-full items-center justify-center my-auto">
        {act.rows.map((r, i) => (
          <div key={r.label} className="flex items-center gap-3 w-full max-w-xl">
            <span className="w-14 text-right font-display font-900 text-slate-100 text-sm sm:text-base">{r.label}</span>
            <button onClick={() => change(i, -1)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-900 text-lg cursor-pointer">−</button>
            <div className="flex gap-1.5 flex-1 min-h-[2.5rem] items-center">
              {Array.from({ length: counts[i] }).map((_, k) => (
                <div key={k} className="h-10 w-12 sm:w-14 rounded-lg border-2 flex items-center justify-center font-display font-900 text-white text-sm bg-violet-600 border-violet-300">
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
        <div className="w-full bg-emerald-950/90 border-2 border-emerald-400/60 rounded-2xl p-3 anim-slide-up shrink-0">
          {act.solution.map((l, i) => (
            <p key={i} className="text-emerald-200 font-mono text-xs sm:text-sm font-bold text-center">{l}</p>
          ))}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 justify-center shrink-0">
            <button onClick={check} className="btn btn-primary text-sm sm:text-base px-6 py-2.5">
              Check My Model ✨
            </button>
            <button onClick={() => setShowHint(h => !h)} className="btn btn-secondary text-xs sm:text-sm px-4 py-2">
              💡 Hint
            </button>
          </div>
          {state === 'wrong' && (
            <div className="p-2.5 rounded-xl text-xs sm:text-sm font-900 w-full text-center bg-rose-950/90 text-rose-300 border-2 border-rose-400/60 shrink-0">
              The picture doesn't match the story yet. Re-read the problem and adjust the boxes!
            </div>
          )}
          {showHint && (
            <div className="p-2.5 bg-amber-950/90 border border-amber-400/50 text-amber-200 rounded-xl text-xs sm:text-sm font-bold w-full text-center anim-slide-up shrink-0">
              💡 {act.hint}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TableBuilder({ act, sounds }) {
  const hidden = act.rows.slice(act.prefilled);
  const [vals, setVals] = useState(hidden.map(() => ''));
  const [stage, setStage] = useState('fill');
  const [fillState, setFillState] = useState(null);
  const [ruleWrong, setRuleWrong] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const checkFill = () => {
    const res = hidden.map((r, i) => Number(vals[i]) === r[1] && vals[i] !== '');
    setFillState(res);
    if (res.every(Boolean)) {
      setStage('rule');
      if (sounds) sounds.correct();
    } else {
      if (sounds) sounds.wrong();
    }
  };

  const pickRule = (i) => {
    if (i === act.correctRule) {
      setStage('done');
      setRuleWrong(null);
      if (sounds) sounds.correct();
    } else {
      setRuleWrong(i);
      if (sounds) sounds.wrong();
    }
  };

  return (
    <div className={BOX}>
      <div className="w-full bg-[#120a28] border border-cyan-400/30 rounded-xl px-4 py-2 text-center text-slate-100 text-sm sm:text-base font-extrabold shrink-0">
        {act.problem}
      </div>

      <div className="overflow-x-auto max-w-full my-auto">
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
                        className={`w-16 bg-[#14082c] border-2 rounded-lg text-center text-white font-900 py-1 outline-none ${
                          bad ? 'border-rose-400 anim-shake' : ok ? 'border-emerald-400' : 'border-cyan-400/60 focus:border-amber-400'
                        }`}
                        placeholder="?"
                      />
                    ) : <span className="font-900">{y}</span>}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {stage === 'fill' && (
        <>
          <p className="text-slate-200 text-xs sm:text-sm font-extrabold shrink-0">Step 1: Type the missing heights.</p>
          <div className="flex items-center gap-3 justify-center shrink-0">
            <button onClick={checkFill} className="btn btn-primary text-sm sm:text-base px-6 py-2.5">
              Check the Table ✨
            </button>
            <button onClick={() => setShowHint(h => !h)} className="btn btn-secondary text-xs sm:text-sm px-4 py-2">
              💡 Hint
            </button>
          </div>
          {showHint && (
            <div className="p-2.5 bg-amber-950/90 border border-amber-400/50 text-amber-200 rounded-xl text-xs sm:text-sm font-bold w-full text-center anim-slide-up shrink-0">
              💡 {act.hint}
            </div>
          )}
        </>
      )}

      {stage === 'rule' && (
        <div className="w-full flex flex-col items-center gap-2 anim-slide-up shrink-0">
          <p className="text-slate-100 text-xs sm:text-sm font-extrabold">Step 2: Which rule matches the pattern?</p>
          <div className="grid grid-cols-2 gap-2.5 w-full max-w-md">
            {act.rules.map((r, i) => (
              <button
                key={r}
                onClick={() => pickRule(i)}
                className={`py-2 px-3 rounded-xl border-2 font-display font-900 text-sm sm:text-base cursor-pointer transition ${
                  ruleWrong === i ? 'bg-rose-600 border-rose-300 text-white anim-shake' : 'bg-[#14082e] border-purple-400/40 text-white hover:border-cyan-400'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 'done' && (
        <div className="w-full bg-emerald-950/90 border-2 border-emerald-400/60 rounded-2xl p-3 text-center anim-slide-up shrink-0">
          <p className="font-display font-900 text-emerald-300 text-sm sm:text-base">Rule found: {act.rules[act.correctRule]}</p>
          <p className="text-emerald-200 font-mono text-xs sm:text-sm font-bold">{act.check}</p>
        </div>
      )}
    </div>
  );
}

function TileBuilder({ act, sounds }) {
  const [seq, setSeq] = useState([]);
  const [state, setState] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const built = seq.map(i => act.bank[i]);
  const add = (i) => { if (state === 'ok' || seq.includes(i) || seq.length >= 7) return; setState(null); setSeq(s => [...s, i]); };
  const undo = () => { setState(null); setSeq(s => s.slice(0, -1)); };
  const clear = () => { setState(null); setSeq([]); };

  const check = () => {
    const ok = act.answers.some(a => a.length === built.length && a.every((t, i) => t === built[i]));
    setState(ok ? 'ok' : 'wrong');
    if (sounds) {
      if (ok) sounds.correct();
      else sounds.wrong();
    }
  };

  return (
    <div className={BOX}>
      <div className="w-full bg-[#120a28] border border-cyan-400/30 rounded-xl px-4 py-2 text-center text-slate-100 text-sm sm:text-base font-extrabold shrink-0">
        {act.problem}
      </div>

      <div className={`w-full min-h-[3.5rem] rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 px-3 py-2 flex-wrap shrink-0 ${
        state === 'ok' ? 'border-emerald-400 bg-emerald-950/50' : state === 'wrong' ? 'border-rose-400 bg-rose-950/40 anim-shake' : 'border-cyan-400/50 bg-[#14082c]'
      }`}>
        {built.length === 0 && <span className="text-slate-400 font-extrabold text-sm">Tap tiles below to build the equation…</span>}
        {built.map((t, i) => (
          <span key={i} className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-display font-900 text-lg shadow-md">{t}</span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2.5 justify-center shrink-0">
        {act.bank.map((t, i) => (
          <button
            key={i}
            disabled={seq.includes(i)}
            onClick={() => add(i)}
            className={`min-w-[3rem] px-3.5 py-1.5 rounded-xl border-2 font-display font-900 text-lg transition cursor-pointer ${
              seq.includes(i) ? 'opacity-25 border-white/10 text-slate-500' : 'bg-[#14082e] border-cyan-400/60 text-white hover:bg-cyan-500/20 hover:scale-105'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {state === 'ok' ? (
        <div className="w-full bg-emerald-950/90 border-2 border-emerald-400/60 rounded-2xl p-3 anim-slide-up shrink-0">
          {act.solution.map((l, i) => <p key={i} className="text-emerald-200 font-mono text-xs sm:text-sm font-bold text-center">{l}</p>)}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 justify-center shrink-0">
            <button onClick={undo} className="btn btn-outline text-xs px-3 py-1.5">↩ Undo</button>
            <button onClick={clear} className="btn btn-outline text-xs px-3 py-1.5">🗑 Clear</button>
            <button onClick={check} disabled={built.length === 0} className="btn btn-primary text-xs sm:text-sm px-5 py-2">Check ✨</button>
            <button onClick={() => setShowHint(h => !h)} className="btn btn-secondary text-xs px-3 py-1.5">💡 Hint</button>
          </div>
          {showHint && (
            <div className="p-2 bg-amber-950/90 border border-amber-400/50 text-amber-200 rounded-xl text-xs font-bold w-full text-center anim-slide-up shrink-0">
              💡 {act.hint}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SolveStation({ act, sounds }) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const handleCheck = () => {
    const num = parseFloat(answer);
    if (!Number.isNaN(num) && Math.abs(num - act.answer) < 1e-9) {
      setFeedback({ success: true, text: `🎉 Amazing job! ${act.check}` });
      if (sounds) sounds.correct();
    } else {
      setFeedback({ success: false, text: 'Not quite — check the clues and try once more!' });
      if (sounds) sounds.wrong();
    }
  };

  return (
    <div className={BOX}>
      <div className="w-full bg-[#120a28] border border-cyan-400/30 rounded-xl px-4 py-2 text-center text-slate-100 text-sm sm:text-base font-extrabold shrink-0">
        {act.problem}
      </div>

      <div className="flex items-center justify-center w-full my-auto">
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
            <div className="bg-[#100a2c] border-2 border-amber-400/50 rounded-xl px-5 py-1.5 font-display font-900 text-amber-300 text-base">
              Rule: Fare = 3 + 2k
            </div>
          </div>
        )}

        {act.kind === 'solve-error' && (
          <div className="flex flex-col gap-2 w-full max-w-md">
            {act.steps.map((s, i) => (
              <div key={i} className={`flex items-center justify-between rounded-xl px-4 py-2 border-2 font-mono font-bold text-sm sm:text-base ${
                s.bad ? 'bg-rose-950/70 border-rose-400 text-rose-200' : 'bg-white/5 border-white/15 text-slate-100'
              }`}>
                <span>{s.t}</span>
                {s.bad && <span className="text-xs font-sans font-900 text-rose-300">⚠ error step</span>}
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
          className="bg-[#14082c] border-2 border-cyan-400/70 rounded-xl px-4 py-2 text-white font-display font-900 text-base text-center outline-none focus:border-amber-400 w-44"
        />
        {act.unit && <span className="text-slate-200 font-900 text-sm">{act.unit}</span>}
        <button onClick={handleCheck} className="btn btn-primary text-sm px-6 py-2">
          Check Answer ✨
        </button>
        <button onClick={() => setShowHint(h => !h)} className="btn btn-secondary text-xs px-3 py-1.5">
          💡 Hint
        </button>
      </div>

      {showHint && (
        <div className="p-2 bg-amber-950/90 border border-amber-400/50 text-amber-200 rounded-xl text-xs font-bold w-full text-center anim-slide-up shrink-0">
          💡 {act.hint}
        </div>
      )}

      {feedback && (
        <div className={`p-2.5 rounded-xl text-xs sm:text-sm font-900 w-full text-center shrink-0 ${
          feedback.success ? 'bg-emerald-950/90 text-emerald-300 border-2 border-emerald-400/60' : 'bg-rose-950/90 text-rose-300 border-2 border-rose-400/60'
        }`}>
          {feedback.text}
        </div>
      )}
    </div>
  );
}

export default function SimulatePhase({ state, dispatch }) {
  const [stationIdx, setStationIdx] = useState(state?.currentSimStation || 0);
  const [actIdx, setActIdx] = useState(0);
  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled ?? true);

  const station = STATIONS[stationIdx] || STATIONS[0];
  const act = STATION_ACTIVITIES[station.n][actIdx];

  useEffect(() => {
    stopAll();
    const audioKey = `sim_${station.n}_${actIdx + 1}`;
    if (AUDIO_MAP[audioKey]) {
      narrate([AUDIO_MAP[audioKey]]);
    }
    return () => stopAll();
  }, [stationIdx, actIdx, narrate, stopAll, station.n]);

  function handleNextActivity() {
    stopAll();
    if (actIdx < 2) {
      setActIdx(i => i + 1);
    } else {
      // Completed station
      if (stationIdx < 2) {
        if (sounds) sounds.badge();
        setStationIdx(s => s + 1);
        setActIdx(0);
        dispatch({ type: 'COMPLETE_SIM_STATION', payload: stationIdx });
      } else {
        // Completed all stations -> go to practice
        if (sounds) sounds.levelUp();
        dispatch({ type: 'COMPLETE_PHASE', payload: 'simulate' });
        dispatch({ type: 'SET_PHASE', payload: 'play' });
      }
    }
  }

  function handlePrevActivity() {
    stopAll();
    if (actIdx > 0) {
      setActIdx(i => i - 1);
    } else if (stationIdx > 0) {
      setStationIdx(s => s - 1);
      setActIdx(2);
    }
  }

  return (
    <div className="sim-wrap">
      <div className="sim-card glass-card">
        {/* Stations Tab Bar */}
        <div className="sim-tabs" role="tablist">
          {STATIONS.map((st) => (
            <button
              key={st.id}
              role="tab"
              aria-selected={stationIdx === st.id}
              className={`sim-tab ${stationIdx === st.id ? 'active' : ''} ${state?.simStationsComplete?.[st.id] ? 'done' : ''}`}
              onClick={() => {
                stopAll();
                setStationIdx(st.id);
                setActIdx(0);
              }}
            >
              <span className="tab-icon">{st.icon}</span>
              <span className="tab-name">Station {st.n}: {st.name}</span>
            </button>
          ))}
        </div>

        {/* Sub-activity selector pills */}
        <div className="sim-sub-activity-pills">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              className={`sim-sub-pill ${actIdx === idx ? 'active' : ''}`}
              onClick={() => {
                stopAll();
                setActIdx(idx);
              }}
            >
              Activity {idx + 1}
            </button>
          ))}
        </div>

        {/* Station Content Area */}
        <div className="sim-station-area">
          {stationIdx === 0 && <DecoderStation act={act} sounds={sounds} />}
          {stationIdx === 1 && act.kind === 'bar' && <BarBuilder act={act} sounds={sounds} />}
          {stationIdx === 1 && act.kind === 'table' && <TableBuilder act={act} sounds={sounds} />}
          {stationIdx === 1 && act.kind === 'tiles' && <TileBuilder act={act} sounds={sounds} />}
          {stationIdx === 2 && <SolveStation act={act} sounds={sounds} />}
        </div>

        {/* Footer Navigation */}
        <div className="sim-footer">
          <button
            className="btn btn-outline btn-sm"
            onClick={handlePrevActivity}
            disabled={stationIdx === 0 && actIdx === 0}
          >
            ← Previous Activity
          </button>

          <div className="sim-progress-dots">
            {[0, 1, 2].map((idx) => (
              <span
                key={idx}
                className={`sim-dot ${stationIdx === idx ? 'active' : state?.simStationsComplete?.[idx] ? 'done' : ''}`}
              />
            ))}
          </div>

          <button className="btn btn-primary btn-sm" onClick={handleNextActivity}>
            {stationIdx === 2 && actIdx === 2 ? 'Go to Practice 🎮' : 'Next Activity →'}
          </button>
        </div>
      </div>
    </div>
  );
}
