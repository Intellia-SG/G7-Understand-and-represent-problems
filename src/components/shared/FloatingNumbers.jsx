// src/components/shared/FloatingNumbers.jsx
import React, { useMemo } from 'react';
import './FloatingNumbers.css';

const MATH_SYMBOLS = [
  '?', '2n + 3 = 17', 'x', 'y', 'b', 'b + 10', '48 ÷ 4', 'h = 3d + 8',
  '📊', '🔍', '⚖️', '💡', '✨', '⭐', '11', 't = 35 + 12', '45 ÷ 5 = 9',
  'Given', 'Asked', 'Rel', 'Rule', '2b = 1', 'x = 7'
];

export default function FloatingNumbers() {
  const items = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      symbol: MATH_SYMBOLS[i % MATH_SYMBOLS.length],
      left: `${(i * 5.5 + 3) % 94}%`,
      delay: `${(i * 1.3) % 16}s`,
      duration: `${18 + (i % 5) * 4}s`,
      size: `${1.1 + (i % 4) * 0.4}rem`,
    }));
  }, []);

  return (
    <div className="floating-symbols-container" aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          className="floating-math-symbol"
          style={{
            left: item.left,
            animationDelay: item.delay,
            animationDuration: item.duration,
            fontSize: item.size,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
