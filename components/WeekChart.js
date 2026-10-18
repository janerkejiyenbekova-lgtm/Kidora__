'use client';

import { useEffect, useState } from 'react';
import { useStore, useT } from '@/lib/store';

const ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon → Sun

export default function WeekChart() {
  const { state } = useStore();
  const t = useT();
  const [today, setToday] = useState(-1);

  useEffect(() => setToday(new Date().getDay()), []);

  const present = state.children.filter((c) => state.attendance[c.id] === 'present').length;
  const values = ORDER.map((wd) => (wd === today ? present : state.history.find((h) => h.wd === wd)?.p ?? 0));
  const max = Math.max(state.children.length, 1);

  return (
    <div className="bars">
      {ORDER.map((wd, i) => (
        <div key={wd} className={`bar-col ${wd === today ? 'today' : ''}`}>
          <small className="bar-val">{values[i]}</small>
          <div className="bar-track">
            <i style={{ height: `${(values[i] / max) * 100}%` }} />
          </div>
          <small className="muted">{t('d' + wd)}</small>
        </div>
      ))}
    </div>
  );
}
