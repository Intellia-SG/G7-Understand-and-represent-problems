import React from 'react';

/* Colour palette shared by every bar row */
const ROW_COLORS = [
  { fill: '#7c3aed', stroke: '#c4b5fd' },
  { fill: '#0ea5e9', stroke: '#7dd3fc' },
  { fill: '#f97316', stroke: '#fdba74' },
  { fill: '#10b981', stroke: '#6ee7b7' }
];

/** Bar-model renderer: rows of equal unit boxes (+ optional "extra" piece) with a total brace */
export function BarModel({ rows, total, width = 420, unitFill }) {
  const rowH = 38, gap = 12, left = 78, right = 92;
  const maxCount = Math.max(...rows.map(r => r.units + (r.extra ? 1.3 : 0)));
  const bw = Math.min(50, (width - left - right) / maxCount);
  const height = rows.length * (rowH + gap) + 6;
  const barsEnd = left + maxCount * bw;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-w-[440px]" role="img" aria-label="Bar model">
      {rows.map((r, ri) => {
        const y = ri * (rowH + gap) + 3;
        const col = ROW_COLORS[ri % ROW_COLORS.length];
        return (
          <g key={ri}>
            <text x={left - 8} y={y + rowH / 2 + 5} textAnchor="end" fill="#e2e8f0" fontSize="14" fontWeight="800">{r.label}</text>
            {Array.from({ length: r.units }).map((_, ui) => (
              <g key={ui}>
                <rect x={left + ui * bw} y={y} width={bw - 2} height={rowH} rx="6" fill={col.fill} stroke={col.stroke} strokeWidth="2" />
                <text x={left + ui * bw + (bw - 2) / 2} y={y + rowH / 2 + 5} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">
                  {unitFill ? unitFill : r.unitLabel}
                </text>
              </g>
            ))}
            {r.extra && (
              <g>
                <rect x={left + r.units * bw} y={y} width={bw * 1.3 - 2} height={rowH} rx="6" fill="rgba(250,204,21,0.18)" stroke="#facc15" strokeWidth="2" strokeDasharray="5 3" />
                <text x={left + r.units * bw + (bw * 1.3 - 2) / 2} y={y + rowH / 2 + 5} textAnchor="middle" fill="#facc15" fontSize="14" fontWeight="900">{r.extra}</text>
              </g>
            )}
          </g>
        );
      })}
      {total != null && (
        <g>
          <path
            d={`M ${barsEnd + 6} 3 Q ${barsEnd + 16} 3 ${barsEnd + 16} 14 L ${barsEnd + 16} ${height / 2 - 8} Q ${barsEnd + 16} ${height / 2} ${barsEnd + 24} ${height / 2} Q ${barsEnd + 16} ${height / 2} ${barsEnd + 16} ${height / 2 + 8} L ${barsEnd + 16} ${height - 12} Q ${barsEnd + 16} ${height - 3} ${barsEnd + 6} ${height - 3}`}
            fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round"
          />
          <text x={barsEnd + 30} y={height / 2 + 5} fill="#facc15" fontSize="15" fontWeight="900">{total}</text>
        </g>
      )}
    </svg>
  );
}

/** Balance scale */
function BalanceScale({ left, right }) {
  return (
    <svg viewBox="0 0 420 190" className="w-full h-auto max-w-[420px]" role="img" aria-label="Balance scale">
      <polygon points="210,60 180,175 240,175" fill="#4338ca" stroke="#a5b4fc" strokeWidth="3" />
      <circle cx="210" cy="60" r="9" fill="#facc15" />
      <rect x="40" y="55" width="340" height="9" rx="4" fill="#a5b4fc" />
      {[{ x: 40, t: left, c: '#38bdf8' }, { x: 380, t: right, c: '#fb923c' }].map((p, i) => (
        <g key={i}>
          <line x1={p.x} y1="64" x2={p.x - 42} y2="118" stroke="#cbd5e1" strokeWidth="2" />
          <line x1={p.x} y1="64" x2={p.x + 42} y2="118" stroke="#cbd5e1" strokeWidth="2" />
          <path d={`M ${p.x - 62} 118 L ${p.x + 62} 118 Q ${p.x + 55} 150 ${p.x} 150 Q ${p.x - 55} 150 ${p.x - 62} 118 Z`} fill="rgba(255,255,255,0.08)" stroke={p.c} strokeWidth="3" />
          <text x={p.x} y="112" textAnchor="middle" fill={p.c} fontSize="18" fontWeight="900">{p.t}</text>
        </g>
      ))}
      <text x="210" y="26" textAnchor="middle" fill="#facc15" fontSize="20" fontWeight="900">=</text>
    </svg>
  );
}

export function ProblemDiagram({ diagramData }) {
  if (!diagramData) return null;
  const { mode } = diagramData;

  if (mode === 'bars') {
    return (
      <div className="flex justify-center my-2 w-full drop-shadow-[0_0_14px_rgba(139,92,246,0.45)]">
        <BarModel rows={diagramData.rows} total={diagramData.total} />
      </div>
    );
  }

  if (mode === 'balance') {
    return (
      <div className="flex justify-center my-2 w-full drop-shadow-[0_0_14px_rgba(129,140,248,0.5)]">
        <BalanceScale left={diagramData.left} right={diagramData.right} />
      </div>
    );
  }

  if (mode === 'table') {
    const { xLabel, yLabel, rows, step } = diagramData;
    return (
      <div className="my-2 overflow-x-auto">
        <table className="mx-auto border-separate border-spacing-0 rounded-xl overflow-hidden border border-cyan-400/40 text-center">
          <thead>
            <tr className="bg-cyan-500/25 text-cyan-200 font-display text-sm">
              <th className="px-4 py-1.5 border-r border-cyan-400/30">{xLabel}</th>
              {rows.map(([x], i) => <th key={i} className="px-4 py-1.5 border-r border-cyan-400/20 last:border-r-0">{x}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white/5 text-amber-300 font-display text-sm">
              <td className="px-4 py-1.5 border-r border-cyan-400/30 text-cyan-200">{yLabel}</td>
              {rows.map(([, y], i) => <td key={i} className="px-4 py-1.5 border-r border-cyan-400/20 last:border-r-0 font-900">{y}</td>)}
            </tr>
          </tbody>
        </table>
        {step != null && <p className="text-xs font-extrabold text-cyan-300 mt-1">Each step: +{step}</p>}
      </div>
    );
  }

  if (mode === 'detective') {
    const { given = [], ask } = diagramData;
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 my-2 max-w-xl">
        <span className="text-2xl">🔎</span>
        {given.map((g, i) => (
          <span key={i} className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-900 border-2 ${g.includes('✗') ? 'bg-slate-700/40 border-slate-400/40 text-slate-300 line-through' : 'bg-sky-500/20 border-sky-400 text-sky-200'}`}>
            {g.replace(' ✗', '')}
          </span>
        ))}
        <span className="px-3 py-1 rounded-lg text-xs sm:text-sm font-900 border-2 bg-rose-500/20 border-rose-400 text-rose-200">❓ {ask}</span>
      </div>
    );
  }

  if (mode === 'card') {
    return (
      <div className="my-2 flex flex-col items-center gap-1 bg-[#1e1342] border-2 border-amber-400/40 rounded-2xl px-6 py-3 max-w-xl">
        {diagramData.lines.map((l, i) => (
          <p key={i} className="font-display font-900 text-amber-300 text-base sm:text-lg text-center leading-snug">{l}</p>
        ))}
      </div>
    );
  }

  return null;
}
