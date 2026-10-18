'use client';

import { useEffect, useState } from 'react';
import { useStore, useT } from '@/lib/store';
import { burst, sfx } from "@/lib/sfx";
import { celebrate } from "@/lib/celebrate";
import Icon from '@/components/Icons';

const EMOJIS = ['🐶', '🐱', '🦊', '🐸', '🐼', '🦄', '🐵', '🐥', '🐙', '🦋', '🌈', '🍎'];
const CRITTERS = ['🐰', '🐻', '🦊', '🐸', '🐼', '🐵', '🐯', '🐨'];
const LEVELS = [
  { pairs: 3, cols: 3 },
  { pairs: 4, cols: 4 },
  { pairs: 6, cols: 4 },
];
const TOTAL_ROUNDS = 5;
const MOLE_TIME = 30;

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

function makeDeck(pairs) {
  const pool = shuffle(EMOJIS).slice(0, pairs);
  return shuffle([...pool, ...pool]).map((emoji) => ({ emoji, open: false, matched: false }));
}

/* ---------- Memory ---------- */
function Memory({ onWin, sound }) {
  const t = useT();
  const [lvl, setLvl] = useState(0);
  const [g, setG] = useState(() => ({ cards: makeDeck(LEVELS[0].pairs), pick: [], moves: 0, won: false }));

  useEffect(() => {
    if (g.pick.length !== 2) return;
    const id = setTimeout(() => {
      setG((prev) => {
        if (prev.pick.length !== 2) return prev;
        const [a, b] = prev.pick;
        const same = prev.cards[a].emoji === prev.cards[b].emoji;
        const cards = prev.cards.map((c, k) => {
          if (k !== a && k !== b) return c;
          return same ? { ...c, matched: true, open: true } : { ...c, open: false };
        });
        if (same && sound) sfx.match();
        else if (sound) sfx.wrong();
        return { ...prev, cards, pick: [], won: cards.every((c) => c.matched) };
      });
    }, 700);
    return () => clearTimeout(id);
  }, [g.pick, sound]);

  useEffect(() => {
    if (g.won) onWin();
  }, [g.won]); // eslint-disable-line react-hooks/exhaustive-deps

  const flip = (i) => {
    if (g.pick.length === 2 || g.cards[i].open || g.cards[i].matched) return;
    if (sound) sfx.flip();
    setG((prev) => {
      if (prev.pick.length === 2) return prev;
      const c = prev.cards[i];
      if (c.open || c.matched) return prev;
      const pick = [...prev.pick, i];
      return {
        ...prev,
        cards: prev.cards.map((x, k) => (k === i ? { ...x, open: true } : x)),
        pick,
        moves: pick.length === 2 ? prev.moves + 1 : prev.moves,
      };
    });
  };

  const start = (l) => {
    setLvl(l);
    setG({ cards: makeDeck(LEVELS[l].pairs), pick: [], moves: 0, won: false });
  };

  const { cols } = LEVELS[lvl];

  return (
    <>
      <div className="page-head" style={{ marginBottom: 0 }}>
        <div className="levels">
          <span className="muted">{t('g_level')}</span>
          {LEVELS.map((_, l) => (
            <button key={l} className={`pill ${lvl === l ? 'on' : ''}`} onClick={() => start(l)}>
              {l + 1}
            </button>
          ))}
        </div>
        <div className="row">
          <span className="chip">
            {t('g_moves')}: {g.moves}
          </span>
          <button className="btn-ghost btn-sm" onClick={() => start(lvl)}>
            <Icon name="undo" size={14} /> {t('g_again')}
          </button>
        </div>
      </div>

      {g.won && (
        <p className="chip" style={{ marginTop: 16 }}>
          <Icon name="star" size={14} /> {t('g_won')}
        </p>
      )}

      <div className="mem-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {g.cards.map((c, i) => (
          <button key={i} className={`mc ${c.open ? 'open' : ''} ${c.matched ? 'matched' : ''}`} onClick={() => flip(i)}>
            <div className="mc-in">
              <div className="mc-face mc-front">?</div>
              <div className="mc-face mc-back">{c.emoji}</div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

/* ---------- Counting quiz ---------- */
function makeQ() {
  let a, b, ans, op;
  if (Math.random() < 0.5) {
    op = '+';
    a = randInt(1, 10);
    b = randInt(1, 10);
    ans = a + b;
  } else {
    op = '−';
    a = randInt(2, 15);
    b = randInt(1, a);
    ans = a - b;
  }
  const set = new Set([ans]);
  while (set.size < 4) set.add(Math.max(0, ans + randInt(-4, 4)));
  return { a, b, op, ans, opts: shuffle([...set]) };
}

function Quiz({ onFinish, sound }) {
  const t = useT();
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [q, setQ] = useState(makeQ);
  const [picked, setPicked] = useState(null);

  const finished = round > TOTAL_ROUNDS;

  useEffect(() => {
    if (finished) onFinish(score);
  }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps

  const answer = (v) => {
    if (picked !== null) return;
    setPicked(v);
    if (v === q.ans) {
      setScore((s) => s + 1);
      if (sound) sfx.success();
    } else if (sound) sfx.wrong();
  };

  const next = () => {
    setRound((r) => r + 1);
    setQ(makeQ());
    setPicked(null);
  };

  const restart = () => {
    setRound(1);
    setScore(0);
    setQ(makeQ());
    setPicked(null);
  };

  if (finished) {
    return (
      <div className="quiz">
        <h2 style={{ fontWeight: 900, fontSize: '1.6rem' }}>{t('g_finish')}</h2>
        <div className="stars" style={{ margin: '12px 0' }}>
          {score}/{TOTAL_ROUNDS}
        </div>
        <p className="muted" style={{ marginBottom: 18 }}>{t('g_score')}</p>
        <button className="btn" onClick={restart}>
          {t('g_restart')}
        </button>
      </div>
    );
  }

  return (
    <div className="quiz">
      <span className="chip">
        {t('g_round')} {round}/{TOTAL_ROUNDS} · {t('g_score')}: {score}
      </span>
      <div className="quiz-q">
        {q.a} {q.op} {q.b} = ?
      </div>
      <div className="quiz-opts">
        {q.opts.map((v) => {
          const cls = picked === null ? '' : v === q.ans ? 'ok' : v === picked ? 'bad' : '';
          return (
            <button key={v} className={`quiz-opt ${cls}`} disabled={picked !== null} onClick={() => answer(v)}>
              {v}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <button className="btn btn-sm" style={{ marginTop: 22 }} onClick={next}>
          {t('g_next')} <Icon name="arrow" size={14} />
        </button>
      )}
    </div>
  );
}

/* ---------- Catch the critters ---------- */
function Mole({ onEnd, sound }) {
  const t = useT();
  const [phase, setPhase] = useState('ready');
  const [active, setActive] = useState(null);
  const [animal, setAnimal] = useState(CRITTERS[0]);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(MOLE_TIME);

  useEffect(() => {
    if (phase !== 'play') return;
    const timer = setInterval(() => setLeft((l) => l - 1), 1000);
    const spawn = setInterval(() => {
      const i = randInt(0, 8);
      setAnimal(CRITTERS[randInt(0, CRITTERS.length - 1)]);
      setActive(i);
      setTimeout(() => setActive((cur) => (cur === i ? null : cur)), 850);
    }, 700);
    return () => {
      clearInterval(timer);
      clearInterval(spawn);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === 'play' && left <= 0) {
      setPhase('end');
      setActive(null);
      onEnd(score);
    }
  }, [left, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => {
    setScore(0);
    setLeft(MOLE_TIME);
    setActive(null);
    setPhase('play');
  };

  const hit = (i) => {
    if (phase !== 'play' || active !== i) return;
    setScore((s) => s + 1);
    setActive(null);
    if (sound) sfx.mole();
  };

  return (
    <div className="quiz">
      {phase === 'ready' && (
        <>
          <p className="muted" style={{ marginBottom: 18 }}>{t('g_mole_hint')}</p>
          <button className="btn" onClick={start}>
            <Icon name="play" size={16} /> {t('g_start')}
          </button>
        </>
      )}

      {phase !== 'ready' && (
        <div className="row" style={{ justifyContent: 'center', marginBottom: 6 }}>
          <span className="chip">
            <Icon name="clock" size={14} /> {t('g_time')}: {Math.max(0, left)}s
          </span>
          <span className="chip">
            <Icon name="target" size={14} /> {t('g_hits')}: {score}
          </span>
        </div>
      )}

      {phase === 'play' && (
        <div className="mole-grid">
          {Array.from({ length: 9 }, (_, i) => (
            <button key={i} className="hole" onClick={() => hit(i)} aria-label={`hole ${i + 1}`}>
              {active === i && <span key={`${i}-${animal}-${score}`} className="up">{animal}</span>}
            </button>
          ))}
        </div>
      )}

      {phase === 'end' && (
        <>
          <h2 style={{ fontWeight: 900, fontSize: '1.6rem', marginTop: 10 }}>{t('g_mole_end')}</h2>
          <div className="stars" style={{ margin: '12px 0' }}>
            {score}
          </div>
          <button className="btn" onClick={start}>
            {t('g_restart')}
          </button>
        </>
      )}
    </div>
  );
}

/* ---------- Page ---------- */
export default function Games() {
  const { state, dispatch } = useStore();
  const t = useT();
  const [cid, setCid] = useState('');
  const [tab, setTab] = useState('memory');
  const [msg, setMsg] = useState('');

  const award = (n) => {
    if (!cid) {
      setMsg(t('g_nochild'));
      return;
    }
    dispatch({ type: 'points', child: cid, n });
    burst(60);
    celebrate(t("cel1"), n * 5);
    if (state.sound) sfx.levelUp();
    const name = state.children.find((c) => c.id === cid)?.name;
    setMsg(`${name} +${n} ${t('g_earned')}`);
    setTimeout(() => setMsg(''), 3000);
  };

  const TABS = [
    ['memory', 'brain', 'g_memory'],
    ['math', 'sparkle', 'g_math'],
    ['mole', 'target', 'g_mole'],
  ];

  return (
    <div className="page">
      <div className="page-head">
        <h1>
          <Icon name="gamepad" size={28} /> {t('g_title')}
        </h1>
        <select className="input" style={{ maxWidth: 260 }} value={cid} onChange={(e) => setCid(e.target.value)}>
          <option value="">{t('g_pick')}</option>
          {state.children.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="tabs">
        {TABS.map(([key, icon, label]) => (
          <button key={key} className={`pill ${tab === key ? 'on' : ''}`} onClick={() => setTab(key)}>
            <Icon name={icon === 'brain' ? 'star' : icon} size={15} /> {t(label)}
          </button>
        ))}
      </div>

      {msg && (
        <p className="chip" style={{ marginBottom: 14 }}>
          <Icon name="star" size={14} /> {msg}
        </p>
      )}

      <div className="card">
        {tab === 'memory' && <Memory onWin={() => award(2)} sound={state.sound} />}
        {tab === 'math' && <Quiz onFinish={(score) => score > 0 && award(score)} sound={state.sound} />}
        {tab === 'mole' && <Mole onEnd={(score) => score > 0 && award(Math.ceil(score / 2))} sound={state.sound} />}
      </div>
    </div>
  );
}
