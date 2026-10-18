'use client';

import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { SEED, uid, normPhone } from './data';
import { T } from './i18n';
import { EXT } from './i18n-ext';
import { HOME } from './i18n-home';
import { AUTH } from './i18n-auth';
import { CAL } from './i18n-cal';

const KEY = 'kidora-v6';
const Ctx = createContext(null);
const KIND = { schedule: 'sched', videos: 'video', homework: 'hw', announcements: 'ann', learned: 'learn', messages: 'msg' };
const COIN = { task: 10, star: 5, learn: 5 };

function logEv(s, ev) {
  return { ...s, events: [{ id: uid(), time: Date.now(), ...ev }, ...(s.events || [])].slice(0, 40) };
}
const addCoins = (s, childId, n) => ({ ...s, coins: { ...s.coins, [childId]: Math.max(0, (s.coins?.[childId] || 0) + n) } });

function reducer(state, a) {
  switch (a.type) {
    case 'load':
      return { ...state, ...a.payload };
    case 'set':
      return { ...state, [a.key]: a.value };
    case 'mark': {
      const s = { ...state, attendance: { ...state.attendance, [a.id]: a.value } };
      return logEv(s, { kind: 'attend', child: a.id, value: a.value });
    }
    case 'bulk': {
      const att = { ...state.attendance };
      state.children.filter((c) => !a.group || c.group === a.group).forEach((c) => (att[c.id] = 'present'));
      return logEv({ ...state, attendance: att }, { kind: 'bulk' });
    }
    case 'add': {
      let s = { ...state, [a.list]: [a.item, ...(state[a.list] || [])] };
      const kind = KIND[a.list];
      if (kind) s = logEv(s, { kind, child: a.item.childId, value: a.item.title || a.item.text });
      if (a.list === 'learned') s = addCoins(s, a.item.childId, COIN.learn);
      return s;
    }
    case 'remove':
      return { ...state, [a.list]: state[a.list].filter((x) => x.id !== a.id) };
    case 'done': {
      const cur = state.done[a.child] || {};
      const now = !cur[a.hw];
      let s = { ...state, done: { ...state.done, [a.child]: { ...cur, [a.hw]: now } } };
      s = addCoins(s, a.child, now ? COIN.task : -COIN.task);
      if (now) {
        const h = state.homework.find((x) => x.id === a.hw);
        s = logEv(s, { kind: 'done', child: a.child, value: h?.title || '' });
      }
      return s;
    }
    case 'mood':
      return logEv({ ...state, moods: { ...state.moods, [a.child]: a.mood } }, { kind: 'mood', child: a.child, value: a.mood });
    case 'points': {
      let s = { ...state, points: { ...state.points, [a.child]: (state.points[a.child] || 0) + a.n } };
      s = addCoins(s, a.child, a.n * COIN.star);
      return logEv(s, { kind: 'points', child: a.child, value: a.n });
    }
    case 'buy': {
      const owned = state.owned[a.child] || [];
      const coins = state.coins[a.child] || 0;
      if (owned.includes(a.item.id) || coins < a.item.cost) return state;
      let s = { ...state, owned: { ...state.owned, [a.child]: [...owned, a.item.id] } };
      s = addCoins(s, a.child, -a.item.cost);
      return logEv(s, { kind: 'buy', child: a.child, value: a.item.emoji });
    }
    case 'login':
      return { ...state, session: a.id };
    case 'logout':
      return { ...state, session: null };
    case 'register': {
      const ph = normPhone(a.parent.phone);
      const existing = state.parents.find((p) => normPhone(p.phone) === ph);
      const parentId = existing ? existing.id : uid();
      const parents = existing ? state.parents : [...state.parents, { id: parentId, name: a.parent.name, phone: ph, pw: a.parent.pw || '1234' }];
      const child = { id: uid(), name: a.child.name, age: Number(a.child.age) || 4, group: a.child.group, parentId };
      const s = { ...state, parents, children: [...state.children, child], session: parentId };
      return logEv(s, { kind: 'reg', child: child.id, value: child.name });
    }
    case 'tlogin':
      return { ...state, tSession: a.group };
    case 'tlogout':
      return { ...state, tSession: null };
    case 'reset':
      return { ...SEED, lang: state.lang, theme: state.theme, sound: state.sound };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, SEED);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) dispatch({ type: 'load', payload: JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, ready]);

  // Sync between open tabs/pages of the same browser in real time
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== KEY || !e.newValue) return;
      try {
        dispatch({ type: 'load', payload: JSON.parse(e.newValue) });
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  useEffect(() => {
    document.documentElement.lang = state.lang;
  }, [state.lang]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useStore() {
  return useContext(Ctx);
}

const lookup = (lang, key) =>
  CAL[lang]?.[key] ?? AUTH[lang]?.[key] ?? HOME[lang]?.[key] ?? EXT[lang]?.[key] ?? T[lang]?.[key] ?? HOME.uz[key] ?? EXT.uz[key] ?? T.uz[key] ?? key;

export function useT() {
  const { state } = useStore();
  return (key) => lookup(state.lang, key);
}

export function evText(ev, t, children) {
  const name = children.find((c) => c.id === ev.child)?.name || '';
  switch (ev.kind) {
    case 'attend': return `${name}: ${t(ev.value)}`;
    case 'done': return `${name} ✓ ${ev.value}`;
    case 'mood': return `${name} ${ev.value} ${t('ev_mood')}`;
    case 'points': return `${name} +${ev.value} ${t('ev_points')}`;
    case 'sched': return `${t('ev_sched')}: ${ev.value}`;
    case 'video': return `${t('ev_video')}: ${ev.value}`;
    case 'hw': return `${t('ev_hw')}: ${ev.value}`;
    case 'ann': return `${t('ev_ann')}: ${ev.value}`;
    case 'msg': return `${name} → ${t('ev_msg')}: ${ev.value}`;
    case 'learn': return `${name}: ${ev.value}`;
    case 'reg': return `${t('ev_reg')}: ${ev.value}`;
    case 'buy': return `${name} ${ev.value} ${t('ev_buy')}`;
    case 'bulk': return t('ev_bulk');
    default: return '';
  }
}
