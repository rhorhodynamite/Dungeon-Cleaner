import { useEffect, useRef, useState } from 'react';

interface Props {
  xp: number;
  xpToNextLevel: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export default function XPBar({ xp, xpToNextLevel, color = '#4488ff', height = 14, showLabel = false }: Props) {
  const pct = Math.min(100, Math.round((xp / xpToNextLevel) * 100));
  const prevPct = useRef(pct);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (pct !== prevPct.current) {
      setAnimKey(k => k + 1);
      prevPct.current = pct;
    }
  }, [pct]);

  return (
    <div className="w-full">
      <div
        className="xp-bar-track"
        style={{ height }}
        title={`${xp} / ${xpToNextLevel} XP`}
      >
        <div
          key={animKey}
          className="xp-bar-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            animation: 'xpFill 0.8s ease-out',
          }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1" style={{ fontSize: '0.45rem', color: '#6b5ca5' }}>
          <span>{xp} XP</span>
          <span>{xpToNextLevel} XP</span>
        </div>
      )}
    </div>
  );
}
