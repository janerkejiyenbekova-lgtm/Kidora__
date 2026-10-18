'use client';

import { useEffect, useMemo, useState } from 'react';
import { sfx } from '@/lib/sfx';
import Icon from './Icons';

export default function Celebrate() {
  const [c, setC] = useState(null);

  useEffect(() => {
    let timer;
    const onCelebrate = (e) => {
      setC(e.detail);
      sfx.levelUp();
      clearTimeout(timer);
      timer = setTimeout(() => setC(null), 2300);
    };
    window.addEventListener('kidora:celebrate', onCelebrate);
    return () => {
      window.removeEventListener('kidora:celebrate', onCelebrate);
      clearTimeout(timer);
    };
  }, []);

  const stars = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        i,
        dx: (Math.random() - 0.5) * 560,
        dy: (Math.random() - 0.5) * 460,
        r: Math.random() * 540 - 270,
        d: Math.random() * 0.25,
      })),
    [c?.id]
  );

  if (!c) return null;

  return (
    <div className="cel" key={c.id}>
      <div className="cel-card">
        <div className="cel-text">{c.text}</div>
        {c.coins > 0 && (
          <div className="cel-coins">
            <Icon name="coin" size={22} /> +{c.coins}
          </div>
        )}
      </div>
      {stars.map((s) => (
        <span
          key={s.i}
          className="cel-star"
          style={{ '--dx': `${s.dx}px`, '--dy': `${s.dy}px`, '--r': `${s.r}deg`, animationDelay: `${s.d}s` }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
