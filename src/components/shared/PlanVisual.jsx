// src/components/shared/PlanVisual.jsx
// Visual renderer for word problem representations (TRD §5.1 / PRD §12)
// Supports: "bar-model-part-whole", "bar-model-comparison", "table", "diagram", "request-annotated"
// Accessible: Full text labels on all parts, never color-only.

import React from 'react';

export default function PlanVisual({ type, data, compact = false }) {
  if (!data) return null;

  switch (type) {
    case 'bar-model-part-whole':
      return <PartWholeBarVisual data={data} compact={compact} />;

    case 'bar-model-comparison':
      return <ComparisonBarVisual data={data} compact={compact} />;

    case 'table':
      return <TableVisual data={data} compact={compact} />;

    case 'diagram':
      return <DiagramVisual data={data} compact={compact} />;

    case 'request-annotated':
      return <AnnotatedRequestVisual data={data} compact={compact} />;

    default:
      return null;
  }
}

/**
 * 1. Part-Whole Bar Model
 * Shows whole bar across the top/bottom and distinct segments with full text labels
 */
function PartWholeBarVisual({ data, compact }) {
  const parts = data.parts || [
    { label: 'Decorations', value: '$180', percent: 40 },
    { label: 'Snacks & Drinks', value: '?', percent: 60, isUnknown: true }
  ];
  const wholeLabel = data.whole?.label || 'Total Budget';
  const wholeValue = data.whole?.value != null ? (typeof data.whole.value === 'number' ? `$${data.whole.value}` : data.whole.value) : '$450';

  const partColors = [
    { fill: '#7c3aed', border: '#a78bfa', text: '#ede9fe' },
    { fill: '#0284c7', border: '#38bdf8', text: '#e0f2fe' },
    { fill: '#d97706', border: '#fbbf24', text: '#fef3c7' },
  ];

  return (
    <div className={`plan-visual-wrap part-whole-wrap ${compact ? 'compact' : ''}`} style={{
      background: 'rgba(15, 23, 42, 0.75)',
      borderRadius: '14px',
      padding: compact ? '12px' : '20px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      width: '100%',
      maxWidth: compact ? '480px' : '620px',
      margin: '0 auto',
      boxSizing: 'border-box'
    }}>
      {/* Whole bar bracket / indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 12px',
        marginBottom: '10px',
        background: 'rgba(251, 191, 36, 0.15)',
        border: '1px dashed #fbbf24',
        borderRadius: '8px',
        color: '#fef08a',
        fontWeight: '700',
        fontSize: compact ? '0.85rem' : '1rem'
      }}>
        <span>📐 {wholeLabel}</span>
        <span style={{ fontSize: compact ? '1rem' : '1.2rem', color: '#fef08a' }}>{wholeValue} (Whole)</span>
      </div>

      {/* Part Segments Container */}
      <div style={{
        display: 'flex',
        width: '100%',
        height: compact ? '44px' : '56px',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.25)',
        background: '#0f172a'
      }}>
        {parts.map((p, idx) => {
          const col = partColors[idx % partColors.length];
          const pct = p.percent || Math.round(100 / parts.length);
          return (
            <div
              key={idx}
              style={{
                width: `${pct}%`,
                background: col.fill,
                borderRight: idx < parts.length - 1 ? '2px solid #fff' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2px 4px',
                textAlign: 'center',
                transition: 'width 0.3s ease'
              }}
              title={`${p.label}: ${p.value}`}
            >
              <span style={{
                color: '#fff',
                fontSize: compact ? '0.75rem' : '0.9rem',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}>
                {p.label}
              </span>
              <span style={{
                color: p.isUnknown ? '#fef08a' : col.text,
                fontSize: compact ? '0.85rem' : '1.05rem',
                fontWeight: '900'
              }}>
                {p.value} {p.isUnknown ? '(Unknown)' : ''}
              </span>
            </div>
          );
        })}
      </div>

      {/* Text legend ensuring accessibility (never color-only) */}
      <div style={{
        marginTop: '10px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '0.8rem',
        color: '#cbd5e1'
      }}>
        {parts.map((p, idx) => (
          <span key={idx} style={{
            background: 'rgba(255,255,255,0.08)',
            padding: '3px 8px',
            borderRadius: '6px'
          }}>
            <strong>Part {idx + 1}:</strong> {p.label} = {p.value} {p.isUnknown ? '(To Find)' : ''}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * 2. Comparison Bar Model
 * Shows two quantities compared with equal unit blocks
 */
function ComparisonBarVisual({ data, compact }) {
  const qtyA = data.quantityA || { label: 'Main Hall', units: 3, value: 60 };
  const qtyB = data.quantityB || { label: 'Lounge', units: 1, value: 20, isUnknown: true };
  const total = data.totalBracket?.label || `Total = ${qtyA.value + qtyB.value} guests`;

  const renderUnits = (count, color, isUnknown = false, unitText = '1 unit') => {
    return Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        style={{
          flex: '1 1 0',
          height: compact ? '36px' : '46px',
          background: color.bg,
          border: `2px solid ${color.border}`,
          borderRadius: '6px',
          marginRight: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: color.text,
          fontWeight: '800',
          fontSize: compact ? '0.75rem' : '0.9rem'
        }}
      >
        {isUnknown ? '?' : unitText}
      </div>
    ));
  };

  return (
    <div className={`plan-visual-wrap comp-bar-wrap ${compact ? 'compact' : ''}`} style={{
      background: 'rgba(15, 23, 42, 0.75)',
      borderRadius: '14px',
      padding: compact ? '12px' : '18px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      width: '100%',
      maxWidth: compact ? '480px' : '620px',
      margin: '0 auto',
      boxSizing: 'border-box'
    }}>
      {/* Quantity A Row */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: '#e2e8f0',
          fontSize: compact ? '0.8rem' : '0.95rem',
          fontWeight: '700',
          marginBottom: '4px'
        }}>
          <span>{qtyA.label} ({qtyA.units} units)</span>
          <span style={{ color: '#93c5fd' }}>{qtyA.value != null ? `${qtyA.value}` : ''}</span>
        </div>
        <div style={{ display: 'flex', width: '100%' }}>
          {renderUnits(qtyA.units, { bg: 'rgba(59, 130, 246, 0.5)', border: '#3b82f6', text: '#eff6ff' })}
        </div>
      </div>

      {/* Quantity B Row */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: '#e2e8f0',
          fontSize: compact ? '0.8rem' : '0.95rem',
          fontWeight: '700',
          marginBottom: '4px'
        }}>
          <span>{qtyB.label} ({qtyB.units} unit)</span>
          <span style={{ color: '#fef08a' }}>{qtyB.isUnknown ? '? (Unknown)' : qtyB.value}</span>
        </div>
        <div style={{ display: 'flex', width: `${(qtyB.units / Math.max(qtyA.units, 1)) * 100}%` }}>
          {renderUnits(qtyB.units, { bg: 'rgba(168, 85, 247, 0.5)', border: '#a855f7', text: '#faf5ff' }, qtyB.isUnknown)}
        </div>
      </div>

      {/* Total or Comparison Summary */}
      <div style={{
        marginTop: '8px',
        padding: '6px 12px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: compact ? '0.8rem' : '0.9rem',
        color: '#f8fafc',
        fontWeight: '600'
      }}>
        <span>Total Units: {qtyA.units + qtyB.units} units</span>
        <span style={{ color: '#facc15' }}>{total}</span>
      </div>
    </div>
  );
}

/**
 * 3. Table Representation
 * Shows structured columns and rows
 */
function TableVisual({ data, compact }) {
  const columns = data.columns || ['Cartons', 'Packs', 'Total Cost'];
  const rows = data.rows || [
    [1, 8, '$32'],
    [2, 16, '$64'],
    [3, 24, '$96']
  ];

  return (
    <div className={`plan-visual-wrap table-wrap ${compact ? 'compact' : ''}`} style={{
      background: 'rgba(15, 23, 42, 0.85)',
      borderRadius: '14px',
      padding: compact ? '10px' : '16px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      width: '100%',
      maxWidth: compact ? '480px' : '620px',
      margin: '0 auto',
      overflowX: 'auto',
      boxSizing: 'border-box'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'center',
        fontSize: compact ? '0.8rem' : '0.95rem'
      }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.12)', color: '#38bdf8' }}>
            {columns.map((col, idx) => (
              <th key={idx} style={{
                padding: compact ? '6px 8px' : '10px 12px',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: '700'
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} style={{
              background: rIdx % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
              color: '#f1f5f9'
            }}>
              {row.map((cell, cIdx) => (
                <td key={cIdx} style={{
                  padding: compact ? '6px 8px' : '8px 12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontWeight: cIdx === 0 ? '700' : '500'
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * 4. Diagram Representation
 * SVG floorplan / spatial layout with clear measurements
 */
function DiagramVisual({ data, compact }) {
  const dims = data.dimensions || {
    outerLength: '36 m',
    outerWidth: '18 m',
    walkwayMargin: '2 m border',
    innerArea: '32 m × 14 m table floor'
  };

  return (
    <div className={`plan-visual-wrap diagram-wrap ${compact ? 'compact' : ''}`} style={{
      background: 'rgba(15, 23, 42, 0.85)',
      borderRadius: '14px',
      padding: compact ? '12px' : '18px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      width: '100%',
      maxWidth: compact ? '480px' : '620px',
      margin: '0 auto',
      textAlign: 'center',
      boxSizing: 'border-box'
    }}>
      <div style={{ color: '#c084fc', fontWeight: '700', marginBottom: '8px', fontSize: compact ? '0.85rem' : '1rem' }}>
        🗺️ {data.title || 'Venue Spatial Layout Plan'}
      </div>

      <svg
        viewBox="0 0 400 200"
        style={{ width: '100%', height: 'auto', maxHeight: compact ? '140px' : '190px' }}
        role="img"
        aria-label="Venue layout diagram"
      >
        {/* Outer Hall Rect */}
        <rect x="20" y="20" width="360" height="160" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="3" />
        <text x="200" y="16" textAnchor="middle" fill="#818cf8" fontSize="13" fontWeight="800">
          Length: {dims.outerLength}
        </text>
        <text x="12" y="105" textAnchor="middle" fill="#818cf8" fontSize="13" fontWeight="800" transform="rotate(-90 12 105)">
          Width: {dims.outerWidth}
        </text>

        {/* Walkway margin area */}
        <rect x="45" y="45" width="310" height="110" rx="6" fill="#312e81" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" />
        <text x="200" y="40" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="700">
          Walkway Margin: {dims.walkwayMargin}
        </text>

        {/* Inner Table Seating Area */}
        <rect x="70" y="70" width="260" height="60" rx="4" fill="#047857" stroke="#34d399" strokeWidth="2" />
        <text x="200" y="105" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="800">
          🍽️ Inner Banquet Area
        </text>
      </svg>

      <div style={{
        marginTop: '6px',
        fontSize: '0.8rem',
        color: '#94a3b8'
      }}>
        {dims.innerArea}
      </div>
    </div>
  );
}

/**
 * 5. Annotated Request Visual
 * Renders problem statement with color-coded, text-labelled tags for Given, Unknown, and Noise
 */
function AnnotatedRequestVisual({ data, compact }) {
  const story = data.story || 'A client requests seating for 120 guests...';
  const given = data.given || [];
  const unknown = data.unknown || '';
  const noise = data.irrelevantDetail || null;

  return (
    <div className={`plan-visual-wrap annot-wrap ${compact ? 'compact' : ''}`} style={{
      background: 'rgba(15, 23, 42, 0.85)',
      borderRadius: '14px',
      padding: compact ? '12px' : '18px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      width: '100%',
      maxWidth: compact ? '480px' : '620px',
      margin: '0 auto',
      textAlign: 'left',
      boxSizing: 'border-box'
    }}>
      <div style={{
        fontSize: compact ? '0.85rem' : '0.95rem',
        lineHeight: 1.5,
        color: '#f8fafc',
        marginBottom: '12px'
      }}>
        {story}
      </div>

      {/* Annotated Pill Badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {given.map((g, idx) => (
          <div key={idx} style={{
            background: 'rgba(34, 197, 94, 0.15)',
            borderLeft: '4px solid #22c55e',
            padding: '4px 10px',
            borderRadius: '0 6px 6px 0',
            fontSize: '0.85rem',
            color: '#bbf7d0'
          }}>
            <strong>[GIVEN]:</strong> {g}
          </div>
        ))}

        {unknown && (
          <div style={{
            background: 'rgba(234, 179, 8, 0.15)',
            borderLeft: '4px solid #eab308',
            padding: '4px 10px',
            borderRadius: '0 6px 6px 0',
            fontSize: '0.85rem',
            color: '#fef08a'
          }}>
            <strong>[UNKNOWN TO FIND]:</strong> {unknown}
          </div>
        )}

        {noise && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            borderLeft: '4px solid #ef4444',
            padding: '4px 10px',
            borderRadius: '0 6px 6px 0',
            fontSize: '0.85rem',
            color: '#fca5a5'
          }}>
            <strong>[IRRELEVANT NOISE]:</strong> {noise}
          </div>
        )}
      </div>
    </div>
  );
}
