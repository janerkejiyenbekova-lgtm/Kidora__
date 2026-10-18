'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore, useT } from '@/lib/store';
import { uid, MOODS, AVATARS, SHOP } from '@/lib/data';
import { burst, sfx } from '@/lib/sfx';
import { celebrate } from '@/lib/celebrate';
import Icon, { CardTitle } from '@/components/Icons';

const BADGES = [
  [1, 'k_b1'],
  [3, 'k_b2'],
  [5, 'k_b3'],
  [8, 'k_b4'],
  [10, 'k_b5'],
];

export default function Kid() {
  const { state, dispatch } = useStore();
  const t = useT();
  const [cid, setCid] = useState(null);
  const [learn, setLearn] = useState('');
  const [shopMsg, setShopMsg] = useState('');

  const child = state.children.find((c) => c.id === cid);

  if (!child) {
    return (
      <div className="page">
        <h1 style={{ justifyContent: 'center', marginBottom: 28 }}>
          <Icon name="child" size={28} /> {t('k_pick')}
        </h1>
        <div className="grid-kids">
          {state.children.map((c, i) => (
            <button
              key={c.id}
              className="big-kid"
              onClick={() => {
                setCid(c.id);
                if (state.sound) sfx.pop();
              }}
            >
              <span>{AVATARS[i % AVATARS.length]}</span>
              {c.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const done = state.done[child.id] || {};
  const hw = state.homework.filter((h) => h.group === 'all' || h.group === child.group);
  const videos = state.videos.filter((v) => v.group === 'all' || v.group === child.group);
  const stars = Object.values(done).filter(Boolean).length + (state.points[child.id] || 0);
  const coins = state.coins[child.id] || 0;
  const owned = state.owned[child.id] || [];
  const learned = state.learned.filter((l) => l.childId === child.id);
  const next = BADGES.find(([n]) => stars < n);
  const pct = next ? Math.round((stars / next[0]) * 100) : 100;

  const toggleTask = (h) => {
    const willBeDone = !done[h.id];
    dispatch({ type: 'done', child: child.id, hw: h.id });
    if (willBeDone) {
      burst(60);
      if (state.sound) sfx.success();
      celebrate(t('cel2'), 10);
    }
  };

  const pickMood = (m) => {
    dispatch({ type: 'mood', child: child.id, mood: m });
    if (state.sound) sfx.ding();
  };

  const submitLearn = (e) => {
    e.preventDefault();
    if (!learn.trim()) return;
    dispatch({
      type: 'add',
      list: 'learned',
      item: { id: uid(), childId: child.id, text: learn.trim(), date: new Date().toISOString().slice(0, 10) },
    });
    setLearn('');
    burst(40);
    celebrate(t('cel3'), 5);
  };

  const buy = (item) => {
    if (owned.includes(item.id)) return;
    if (coins < item.cost) {
      setShopMsg(t('need_coins'));
      setTimeout(() => setShopMsg(''), 2200);
      if (state.sound) sfx.wrong();
      return;
    }
    dispatch({ type: 'buy', child: child.id, item });
    burst(70);
    celebrate(t(item.key), 0);
  };

  return (
    <div className="page">
      <div className="page-head">
        <h1>
          {t('k_title')}, {child.name}!
        </h1>
        <div className="row" style={{ flexWrap: 'wrap' }}>
          <span className="coin-pill">
            <Icon name="coin" size={18} /> {coins} {t('coins_label')}
          </span>
          <button className="btn-ghost btn-sm" onClick={() => setCid(null)}>
            <Icon name="undo" size={15} /> {t('k_back')}
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 0 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <CardTitle icon="star">{t('k_stars')}</CardTitle>
          <div className="stars">{stars}</div>
          {next && (
            <>
              <div className="progress">
                <i style={{ width: `${pct}%` }} />
              </div>
              <p className="muted">
                {t('k_next')}: {t(next[1])} — {next[0] - stars} {t('k_need')}
              </p>
            </>
          )}
          <div className="badges" style={{ justifyContent: 'center', marginTop: 18 }}>
            {BADGES.map(([n, key]) => (
              <span key={key} className={`badge ${stars >= n ? 'on' : ''}`}>
                {t(key)}
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <CardTitle icon="heart">{t('k_mood_q')}</CardTitle>
          <div className="moods">
            {MOODS.map((m) => (
              <button key={m} className={`mood-btn ${state.moods[child.id] === m ? 'on' : ''}`} onClick={() => pickMood(m)}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <CardTitle icon="check">{t('k_tasks')}</CardTitle>
          {hw.length === 0 && <p className="empty">{t('k_nothing')}</p>}
          {hw.map((h) => {
            const isDone = !!done[h.id];
            return (
              <button key={h.id} className={`task ${isDone ? 'done' : ''}`} onClick={() => toggleTask(h)}>
                <span className="emo">{h.emoji}</span>
                <span className="t" style={{ flex: 1 }}>
                  {h.title}
                </span>
                <span className="shop-price">+10</span>
                <span className="check">{isDone && <Icon name="check" size={16} />}</span>
              </button>
            );
          })}
        </div>

        <div className="card">
          <CardTitle icon="video">{t('k_videos')}</CardTitle>
          {videos.length === 0 && <p className="empty">{t('empty')}</p>}
          {videos.map((v) => (
            <a key={v.id} href={v.url} target="_blank" rel="noreferrer" className="vid">
              <span className="emo">{v.emoji}</span>
              {v.title}
              <small>
                {t('watch')} <Icon name="arrow" size={14} />
              </small>
            </a>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <CardTitle icon="shop">{t('shop_title')}</CardTitle>
          <div className="shop-grid">
            {SHOP.map((item) => {
              const isOwned = owned.includes(item.id);
              return (
                <button key={item.id} className={`shop-item ${isOwned ? 'owned' : ''}`} disabled={isOwned} onClick={() => buy(item)}>
                  <span className="se">{item.emoji}</span>
                  <span>{t(item.key)}</span>
                  <span className="shop-price">
                    {isOwned ? (
                      <>
                        <Icon name="check" size={14} /> {t('owned')}
                      </>
                    ) : (
                      <>
                        <Icon name="coin" size={14} /> {item.cost} · {t('buy')}
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          {shopMsg && <p className="err" style={{ marginTop: 12 }}>{shopMsg}</p>}
          <div style={{ marginTop: 18 }}>
            <h3 className="muted" style={{ fontSize: '.9rem' }}>{t('owned_title')}</h3>
            <div className="collection">
              {owned.length === 0 && <p className="muted small">—</p>}
              {owned.map((id) => (
                <span key={id}>{SHOP.find((s) => s.id === id)?.emoji}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <CardTitle icon="sparkle">{t('k_learned')}</CardTitle>
          <form className="form" style={{ marginTop: 0 }} onSubmit={submitLearn}>
            <textarea className="input" value={learn} onChange={(e) => setLearn(e.target.value)} placeholder={t('k_learned_ph')} />
            <button className="btn btn-sm" type="submit">
              <Icon name="check" size={15} /> {t('send')}
            </button>
          </form>
          <div className="stack" style={{ marginTop: 14 }}>
            {learned.map((l) => (
              <div key={l.id} className="item">
                <span className="ib">
                  <Icon name="star" size={16} />
                </span>
                <span className="txt">{l.text}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18 }}>
            <div className="grid-kids">
              <Link href="/games" className="play-card">
                <Icon name="gamepad" size={34} />
                {t('k_play')}
              </Link>
              <Link href="/coloring" className="play-card">
                <Icon name="palette" size={34} />
                {t('k_color')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
