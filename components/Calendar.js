'use client';

import { useEffect, useState } from 'react';
import { useStore, useT } from '@/lib/store';
import { monthEvents, upcoming, loc } from '@/lib/holidays';
import Icon from './Icons';

const WD = {
  uz: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
  ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
};
const LOCALE = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-US' };
const TAG = { holiday: 'cal_holiday', kids: 'cal_kids', custom: 'cal_custom' };
const pad = (n) => String(n).padStart(2, '0');

export default function Calendar() {
  const { state } = useStore();
  const t = useT();
  const lang = state.lang;
  const custom = state.celebrations || [];
  const [now, setNow] = useState(null);
  const [cur, setCur] = useState(null);
  const [sel, setSel] = useState(null);

  useEffect(() => {
    const d = new Date();
    setNow(d);
    setCur({ y: d.getFullYear(), m: d.getMonth() });
  }, []);

  if (!now || !cur) return null;

  const map = monthEvents(cur.y, cur.m, custom);
  const first = new Date(cur.y, cur.m, 1);
  const offset = (first.getDay() + 6) % 7;
  const days = new Date(cur.y, cur.m + 1, 0).getDate();
  const isToday = (d) => now.getFullYear() === cur.y && now.getMonth() === cur.m && now.getDate() === d;
  const shift = (k) => {
    const d = new Date(cur.y, cur.m + k, 1);
    setCur({ y: d.getFullYear(), m: d.getMonth() });
    setSel(null);
  };
  const monthName = new Intl.DateTimeFormat(LOCALE[lang] || 'en-US', { month: 'long', year: 'numeric' }).format(first);
  const coming = upcoming(now, custom, 5);

  const row = (ev, key, dateLabel) => (
    <div className="cal-ev" key={key}>
      <span className="em">{ev.e || ev.emoji || '📌'}</span>
      <div>
        <b>
          {loc(ev.title, lang)}
          <span className={`cal-tag ${ev.kind}`}>{t(TAG[ev.kind] || 'cal_custom')}</span>
        </b>
        {dateLabel && <small>{dateLabel}</small>}
        <small>
          <i>{t('cal_tip')}:</i> {loc(ev.tip, lang)}
        </small>
      </div>
    </div>
  );

  const selEvents = sel ? map[sel] || [] : [];

  return (
    <div className="cal">
      <div>
        <div className="cal-head">
          <button className="cal-nav" onClick={() => shift(-1)} aria-label="previous">
            <span style={{ display: 'inline-flex', transform: 'scaleX(-1)' }}>
              <Icon name="arrow" size={16} />
            </span>
          </button>
          <b>{monthName}</b>
          <button className="cal-nav" onClick={() => shift(1)} aria-label="next">
            <Icon name="arrow" size={16} />
          </button>
        </div>
        <div className="cal-grid">
          {WD[lang].map((w) => (
            <div key={w} className="cal-wd">
              {w}
            </div>
          ))}
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`b${i}`} />
          ))}
          {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
            const evs = map[d] || [];
            const cls = ['cal-day', isToday(d) && 'today', evs.length && 'ev', sel === d && 'sel'].filter(Boolean).join(' ');
            return (
              <button key={d} className={cls} onClick={() => setSel(sel === d ? null : d)}>
                <span>{d}</span>
                {evs.length > 0 && <span className="dot">{evs.slice(0, 2).map((e) => e.e || e.emoji || '📌').join('')}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {sel ? (
          <>
            <h4 className="cal-sub">
              {pad(sel)}.{pad(cur.m + 1)}.{cur.y}
            </h4>
            <div className="cal-list">
              {selEvents.length ? selEvents.map((ev, i) => row(ev, `s${i}`)) : <p className="empty">{t('cal_none')}</p>}
            </div>
            <button className="btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => setSel(null)}>
              {t('cal_back')}
            </button>
          </>
        ) : (
          <>
            <h4 className="cal-sub">{t('cal_upcoming')}</h4>
            <div className="cal-list">
              {coming.map((c, i) => row(c.ev, `u${i}`, `${pad(c.date.getDate())}.${pad(c.date.getMonth() + 1)}.${c.date.getFullYear()}`))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
