import { useState } from 'react';
import React from 'react';
import { CLASS_COLORS } from './PixelCharacter';

interface Props {
  charId: string;
  name?: string;
  size?: number;
  selected?: boolean;
  fallback?: React.ReactNode;
}

export default function Portrait({ charId, name, size = 1, selected = false, fallback }: Props) {
  const [error, setError] = useState(false);
  const color = CLASS_COLORS[charId] ?? '#6b5ca5';
  const px = Math.round(80 * size);

  return (
    <div className="flex flex-col items-center gap-1" style={{ flexShrink: 0 }}>
      <div
        style={{
          width: px,
          height: px,
          border: `2px solid ${selected ? color : `${color}88`}`,
          boxShadow: selected
            ? `0 0 0 2px ${color}, 0 0 16px ${color}99`
            : `0 0 6px ${color}33`,
          background: '#0a0618',
          position: 'relative',
          overflow: 'hidden',
          transform: selected ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.1s, box-shadow 0.1s, border-color 0.1s',
        }}
      >
        {!error ? (
          <img
            src={`/portraits/${charId}.png`}
            alt={charId}
            draggable={false}
            onError={() => setError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
              userSelect: 'none',
              WebkitUserDrag: 'none',
            } as React.CSSProperties}
          />
        ) : fallback ? (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {fallback}
          </div>
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color, fontSize: `${Math.max(0.4, size * 0.5)}rem`, opacity: 0.4,
          }}>
            ?
          </div>
        )}

        {/* Corner accents */}
        {([
          { top: 0, left: 0 }, { top: 0, right: 0 },
          { bottom: 0, left: 0 }, { bottom: 0, right: 0 },
        ] as React.CSSProperties[]).map((pos, i) => (
          <div key={i} style={{ position: 'absolute', ...pos, width: 5, height: 5, background: color, opacity: 0.8 }} />
        ))}
      </div>

      {name && (
        <div style={{
          color,
          fontSize: `${Math.max(0.28, size * 0.3)}rem`,
          fontFamily: '"Press Start 2P"',
          textAlign: 'center',
          maxWidth: px,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {name}
        </div>
      )}
    </div>
  );
}
