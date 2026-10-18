'use client';

import { useState } from 'react';
import { useStore, useT } from '@/lib/store';
import { uid, GROUPS, TEACHERS, normPhone } from '@/lib/data';
import { sfx } from '@/lib/sfx';
import { celebrate } from '@/lib/celebrate';
import Feed from '@/components/Feed';
import Icon, { CardTitle } from '@/components/Icons';
import Calendar from '@/components/Calendar';

function Auth() {
  const { state, dispatch } = useStore();
  const t = useT();
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ phone: '', pw: '', pname: '', cname: '', age: '4', group: 'Quyonchalar' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    setErr('');
    const ph = normPhone(f.phone);
    if (ph.length < 9) return setErr(t('a_required'));

    if (mode === 'login') {
      const p = state.parents.find((x) => normPhone(x.phone) === ph);
      if (!p) return setErr(t('a_notfound'));
      if (p.pw !== f.pw) return setErr(t('a_badpw'));
      dispatch({ type: 'login', id: p.id });
      if (state.sound) sfx.coin();
      return;
    }

    if (!f.pname.trim() || !f.cname.trim()) return setErr(t('a_required'));
    if (f.pw.length < 4) return setErr(t('a_pw_short'));
    dispatch({
      type: 'register',
      parent: { name: f.pname.trim(), phone: ph, pw: f.pw },
      child: { name: f.cname.trim(), age: f.age, group: f.group },
    });
    celebrate(t('a_done'), 0);
  };

  return (
    <div className="page">
      <h1 style={{ justifyContent: 'center' }}>
        <Icon name="users" size={28} /> {t('a_title')}
      </h1>
      <div className="auth-wrap">
        <div className="card auth-card">
          <div className="tabs" style={{ justifyContent: 'center' }}>
            <button className={`pill ${mode === 'login' ? 'on' : ''}`} onClick={() => setMode('login')}>
              {t('a_login')}
            </button>
            <button className={`pill ${mode === 'register' ? 'on' : ''}`} onClick={() => setMode('register')}>
              {t('a_register')}
            </button>
          </div>

          <form className="form" onSubmit={submit}>
            <input className="input" value={f.phone} onChange={set('phone')} placeholder={t('a_phone')} inputMode="tel" />
            <input className="input" type="password" value={f.pw} onChange={set('pw')} placeholder={t('a_pw')} autoComplete="current-password" />
            {mode === 'register' && (
              <>
                <input className="input" value={f.pname} onChange={set('pname')} placeholder={t('a_pname')} />
                <input className="input" value={f.cname} onChange={set('cname')} placeholder={t('a_cname')} />
                <div className="form-row">
                  <input className="input" type="number" min="2" max="7" value={f.age} onChange={set('age')} placeholder={t('a_age')} />
                  <select className="input" value={f.group} onChange={set('group')}>
                    {GROUPS.filter((g) => g !== 'all').map((g) => (
                      <option key={g} value={g}>
                        {g} · {TEACHERS[g]}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {err && <p className="err">{err}</p>}
            <button className="btn" type="submit">
              <Icon name={mode === 'login' ? 'lock' : 'plus'} size={16} />
              {mode === 'login' ? t('a_btn_login') : t('a_btn_reg')}
            </button>
            <p className="muted small">{t('a_demo')}</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Parent() {
  const { state, dispatch } = useStore();
  const t = useT();
  const [cid, setCid] = useState(null);
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const parent = state.parents.find((p) => p.id === state.session);
  if (!parent) return <Auth />;

  const kids = state.children.filter((c) => c.parentId === parent.id);
  const child = kids.find((c) => c.id === cid) || kids[0];
  if (!child) return <Auth />;

  const status = state.attendance[child.id];
  const done = state.done[child.id] || {};
  const mood = state.moods[child.id];
  const coins = state.coins[child.id] || 0;
  const schedule = [...state.schedule].sort((a, b) => a.time.localeCompare(b.time));
  const hw = state.homework.filter((h) => h.group === 'all' || h.group === child.group);
  const videos = state.videos.filter((v) => v.group === 'all' || v.group === child.group);
  const doneCount = hw.filter((h) => done[h.id]).length;
  const stars = Object.values(done).filter(Boolean).length + (state.points[child.id] || 0);
  const pct = Math.min(100, Math.round((stars / 10) * 100));
  const feed = state.events.filter(
    (e) => e.child === child.id || ['sched', 'ann', 'video', 'hw', 'bulk'].includes(e.kind)
  );

  const botMsg = `${child.name} — ${t(status || 'nostatus')}. ${schedule
    .slice(0, 3)
    .map((s) => s.title)
    .join(', ')}. ✓ ${doneCount}/${hw.length}`;

  const sendMsg = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    dispatch({
      type: 'add',
      list: 'messages',
      item: { id: uid(), childId: child.id, text: msg.trim(), date: new Date().toISOString().slice(0, 10) },
    });
    setMsg('');
    setSent(true);
    if (state.sound) sfx.coin();
    setTimeout(() => setSent(false), 1800);
  };

  return (
    <div className="page">
      <div className="page-head">
        <h1>
          <Icon name="users" size={28} /> {t('a_welcome')}, {parent.name}
        </h1>
        <div className="parent-bar">
          {kids.map((c) => (
            <button key={c.id} className={`pill ${c.id === child.id ? 'on' : ''}`} onClick={() => setCid(c.id)}>
              {c.name}
            </button>
          ))}
          <button
            className="btn-ghost btn-sm"
            onClick={() => dispatch({ type: 'logout' })}
          >
            <Icon name="logout" size={14} /> {t('a_logout')}
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 0 }}>
        <div className="card child-card">
          <div className="avatar">{child.name[0]}</div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 2 }}>{child.name}</h2>
            <p className="muted">
              {child.group} · {child.age} {t('years')}
            </p>
            <p className="muted small">
              {t('a_teacher')}: {TEACHERS[child.group]}
            </p>
            <span className={`status ${status || ''}`}>{t(status || 'nostatus')}</span>
          </div>
          {mood && <div className="mood-big">{mood}</div>}
        </div>

        <div className="card">
          <CardTitle icon="star">{t('p_progress')}</CardTitle>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="stars">{stars}</span>
            <span className="coin-pill">
              <Icon name="coin" size={16} /> {coins}
            </span>
          </div>
          <div className="progress">
            <i style={{ width: `${pct}%` }} />
          </div>
          <p className="muted">
            {t('p_mood')}: {mood || t('none')}
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <CardTitle icon="calendar">{t('cal_title')}</CardTitle>
        <Calendar />
      </div>

      <div className="grid-2">
        <div className="card">
          <CardTitle icon="bell">{t('p_notif')}</CardTitle>
          <div className="stack">
            {state.announcements.length === 0 && <p className="empty">{t('p_none')}</p>}
            {state.announcements.map((n) => (
              <div key={n.id} className="item">
                <span className="ib">
                  <Icon name="bell" size={16} />
                </span>
                <div className="txt">
                  {n.text}
                  <br />
                  <small>{n.date}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <CardTitle icon="clock">{t('p_schedule')}</CardTitle>
          <div className="stack">
            {schedule.map((s) => (
              <div key={s.id} className="item">
                <span className="time">{s.time}</span>
                <span className="emo">{s.emoji}</span>
                <span className="txt">{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <CardTitle icon="book">{t('p_hw')}</CardTitle>
          <div className="stack">
            {hw.length === 0 && <p className="empty">{t('empty')}</p>}
            {hw.map((h) => (
              <div key={h.id} className="item">
                <span className="emo">{h.emoji}</span>
                <span className="txt">{h.title}</span>
                <span className={`status ${done[h.id] ? 'present' : ''}`} style={{ marginTop: 0 }}>
                  {done[h.id] ? '✓' : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <CardTitle icon="video">{t('p_videos')}</CardTitle>
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
          <CardTitle icon="layers">{t('p_feed')}</CardTitle>
          <Feed events={feed} children={state.children} t={t} />
        </div>

        <div className="card">
          <CardTitle icon="camera">{t('p_camera')}</CardTitle>
          {state.cameraUrl ? (
            <iframe className="cam" src={state.cameraUrl} title="camera" allow="autoplay" />
          ) : (
            <p className="empty">{t('p_cam_none')}</p>
          )}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <CardTitle icon="bot">{t('p_bot')}</CardTitle>
          <p className="muted" style={{ marginBottom: 12 }}>
            {t('p_bot_hint')}
          </p>
          <div className="bubble" style={{ background: 'var(--bg)' }}>
            {botMsg}
          </div>
        </div>

        <div className="card">
          <CardTitle icon="message">{t('p_msg_title')}</CardTitle>
          <form className="form" style={{ marginTop: 0 }} onSubmit={sendMsg}>
            <textarea className="input" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={t('p_msg_ph')} />
            <div className="row">
              <button className="btn btn-sm" type="submit">
                <Icon name="mail" size={15} /> {t('send')}
              </button>
              {sent && (
                <span className="chip">
                  <Icon name="check" size={14} /> {t('p_msg_sent')}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
