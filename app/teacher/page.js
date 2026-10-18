'use client';

import { useState } from 'react';
import { useStore, useT } from '@/lib/store';
import { GROUPS, uid, TEACHER_ACCOUNTS } from '@/lib/data';
import Feed from '@/components/Feed';
import WeekChart from '@/components/WeekChart';
import Icon, { CardTitle } from '@/components/Icons';
import Calendar from '@/components/Calendar';
import EventForm from '@/components/EventForm';

function Gate() {
  const { dispatch } = useStore();
  const t = useT();
  const [login, setLogin] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const acc = TEACHER_ACCOUNTS.find((a) => a.login === login.trim().toLowerCase() && a.pw === pw);
    if (!acc) return setErr(t('t_bad'));
    dispatch({ type: 'tlogin', group: acc.group });
  };

  return (
    <div className="page">
      <h1 style={{ justifyContent: 'center' }}>
        <Icon name="lock" size={28} /> {t('t_login')}
      </h1>
      <div className="auth-wrap">
        <div className="card auth-card">
          <form className="form" onSubmit={submit}>
            <input className="input" value={login} onChange={(e) => setLogin(e.target.value)} placeholder={t('t_user')} autoComplete="username" />
            <input className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder={t('a_pw')} autoComplete="current-password" />
            {err && <p className="err">{err}</p>}
            <button className="btn" type="submit">
              <Icon name="lock" size={16} /> {t('a_btn_login')}
            </button>
            <p className="muted small">{t('t_demo')}</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Teacher() {
  const { state, dispatch } = useStore();
  const t = useT();

  const [sch, setSch] = useState({ time: '', title: '', emoji: '📚' });
  const [vid, setVid] = useState({ title: '', url: '', emoji: '🎬', group: 'all' });
  const [hw, setHw] = useState({ title: '', emoji: '📝', group: 'all' });
  const [ann, setAnn] = useState('');
  const [cam, setCam] = useState(state.cameraUrl);
  const [flash, setFlash] = useState('');

  const group = state.tSession;
  if (!group) return <Gate />;

  const kids = state.children.filter((c) => c.group === group);
  const present = kids.filter((c) => state.attendance[c.id] === 'present').length;
  const absent = kids.filter((c) => state.attendance[c.id] === 'absent').length;
  const unmarked = kids.length - present - absent;

  const schedule = [...state.schedule].sort((a, b) => a.time.localeCompare(b.time));
  const label = (g) => (g === 'all' ? t('all') : g);
  const childName = (id) => state.children.find((c) => c.id === id)?.name || '';
  const notify = () => {
    setFlash(t('sent'));
    setTimeout(() => setFlash(''), 1800);
  };
  const today = () => new Date().toISOString().slice(0, 10);

  const addSch = (e) => {
    e.preventDefault();
    if (!sch.time || !sch.title) return;
    dispatch({ type: 'add', list: 'schedule', item: { id: uid(), ...sch } });
    setSch({ ...sch, title: '' });
    notify();
  };

  const addVid = (e) => {
    e.preventDefault();
    if (!vid.title || !vid.url) return;
    dispatch({ type: 'add', list: 'videos', item: { id: uid(), ...vid } });
    setVid({ ...vid, title: '', url: '' });
    notify();
  };

  const addHw = (e) => {
    e.preventDefault();
    if (!hw.title) return;
    dispatch({ type: 'add', list: 'homework', item: { id: uid(), ...hw } });
    setHw({ ...hw, title: '' });
    notify();
  };

  const addAnn = (e) => {
    e.preventDefault();
    if (!ann.trim()) return;
    dispatch({ type: 'add', list: 'announcements', item: { id: uid(), text: ann.trim(), date: today() } });
    setAnn('');
    notify();
  };

  const saveCam = (e) => {
    e.preventDefault();
    dispatch({ type: 'set', key: 'cameraUrl', value: cam.trim() });
    notify();
  };

  return (
    <div className="page">
      <div className="page-head">
        <h1>
          <Icon name="board" size={28} /> {t('t_title')} · {group}
        </h1>
        <div className="row">
          {flash && (
            <span className="chip">
              <Icon name="check" size={14} /> {flash}
            </span>
          )}
          <button className="btn-ghost btn-sm" onClick={() => dispatch({ type: 'tlogout' })}>
            <Icon name="logout" size={14} /> {t('t_logout')}
          </button>
        </div>
      </div>

      <div className="grid-4">
        <div className="card stat">
          <b>{kids.length}</b>
          <span className="muted">{t('t_total')}</span>
        </div>
        <div className="card stat">
          <b>{present}</b>
          <span className="muted">{t('t_stat_in')}</span>
        </div>
        <div className="card stat">
          <b>{absent}</b>
          <span className="muted">{t('t_stat_out')}</span>
        </div>
        <div className="card stat">
          <b>{unmarked}</b>
          <span className="muted">{t('t_stat_none')}</span>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 0 }}>
        <div className="card">
          <div className="page-head" style={{ marginBottom: 12 }}>
            <CardTitle icon="check">{t('t_att')}</CardTitle>
            <button className="btn btn-sm" onClick={() => dispatch({ type: 'bulk', group })}>
              <Icon name="check" size={15} /> {t('t_bulk')}
            </button>
          </div>
          <p className="muted small" style={{ marginBottom: 14 }}>{t('t_att_hint')}</p>
          <div className="att-list">
            {kids.map((c) => {
              const s = state.attendance[c.id];
              return (
                <div key={c.id} className={`att-row ${s || ''}`}>
                  <div className="avatar sm">{c.name[0]}</div>
                  <div className="att-name">
                    <b>{c.name}</b>
                    <small className="muted">
                      {c.age} {t('years')}
                    </small>
                  </div>
                  <div className="att-btns">
                    <button
                      className={`att-btn yes ${s === 'present' ? 'on' : ''}`}
                      onClick={() => dispatch({ type: 'mark', id: c.id, value: 'present' })}
                    >
                      <Icon name="check" size={15} /> {t('t_yes')}
                    </button>
                    <button
                      className={`att-btn no ${s === 'absent' ? 'on' : ''}`}
                      onClick={() => dispatch({ type: 'mark', id: c.id, value: 'absent' })}
                    >
                      <Icon name="close" size={15} /> {t('t_no')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <CardTitle icon="chart">{t('t_week')}</CardTitle>
          <WeekChart />
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <CardTitle icon="clock">{t('t_sched')}</CardTitle>
          <div className="stack" style={{ marginBottom: 16 }}>
            {schedule.map((s) => (
              <div key={s.id} className="item">
                <span className="time">{s.time}</span>
                <span className="emo">{s.emoji}</span>
                <span className="txt">{s.title}</span>
                <button className="btn-ghost btn-sm btn-danger" onClick={() => dispatch({ type: 'remove', list: 'schedule', id: s.id })}>
                  <Icon name="trash" size={14} />
                </button>
              </div>
            ))}
          </div>
          <form className="form" onSubmit={addSch}>
            <h3 className="muted" style={{ fontSize: '.9rem' }}>{t('t_add_sched')}</h3>
            <div className="form-row">
              <input className="input" type="time" value={sch.time} onChange={(e) => setSch({ ...sch, time: e.target.value })} />
              <input className="input" value={sch.emoji} onChange={(e) => setSch({ ...sch, emoji: e.target.value })} placeholder={t('emoji')} />
            </div>
            <input className="input" value={sch.title} onChange={(e) => setSch({ ...sch, title: e.target.value })} placeholder={t('title')} />
            <button className="btn btn-sm" type="submit">
              <Icon name="plus" size={15} /> {t('add')}
            </button>
          </form>
        </div>

        <div className="card">
          <CardTitle icon="video">{t('t_video')}</CardTitle>
          <div className="stack" style={{ marginBottom: 16 }}>
            {state.videos.map((v) => (
              <div key={v.id} className="item">
                <span className="emo">{v.emoji}</span>
                <span className="txt">
                  {v.title}
                  <br />
                  <small>{label(v.group)}</small>
                </span>
                <button className="btn-ghost btn-sm btn-danger" onClick={() => dispatch({ type: 'remove', list: 'videos', id: v.id })}>
                  <Icon name="trash" size={14} />
                </button>
              </div>
            ))}
          </div>
          <form className="form" onSubmit={addVid}>
            <div className="form-row">
              <input className="input" value={vid.emoji} onChange={(e) => setVid({ ...vid, emoji: e.target.value })} placeholder={t('emoji')} />
              <input className="input" value={vid.title} onChange={(e) => setVid({ ...vid, title: e.target.value })} placeholder={t('title')} />
            </div>
            <input className="input" value={vid.url} onChange={(e) => setVid({ ...vid, url: e.target.value })} placeholder={t('t_video_url')} />
            <select className="input" value={vid.group} onChange={(e) => setVid({ ...vid, group: e.target.value })}>
              {GROUPS.map((g) => (
                <option key={g} value={g}>{label(g)}</option>
              ))}
            </select>
            <button className="btn btn-sm" type="submit">
              <Icon name="plus" size={15} /> {t('add')}
            </button>
          </form>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <CardTitle icon="calendar">{t('cal_title')}</CardTitle>
          <Calendar />
        </div>
        <div className="card">
          <CardTitle icon="plus">{t('cal_add')}</CardTitle>
          <EventForm />
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <CardTitle icon="book">{t('t_hw')}</CardTitle>
          <div className="stack" style={{ marginBottom: 16 }}>
            {state.homework.map((h) => (
              <div key={h.id} className="item">
                <span className="emo">{h.emoji}</span>
                <span className="txt">
                  {h.title}
                  <br />
                  <small>{label(h.group)}</small>
                </span>
                <button className="btn-ghost btn-sm btn-danger" onClick={() => dispatch({ type: 'remove', list: 'homework', id: h.id })}>
                  <Icon name="trash" size={14} />
                </button>
              </div>
            ))}
          </div>
          <form className="form" onSubmit={addHw}>
            <div className="form-row">
              <input className="input" value={hw.emoji} onChange={(e) => setHw({ ...hw, emoji: e.target.value })} placeholder={t('emoji')} />
              <input className="input" value={hw.title} onChange={(e) => setHw({ ...hw, title: e.target.value })} placeholder={t('t_hw_text')} />
            </div>
            <select className="input" value={hw.group} onChange={(e) => setHw({ ...hw, group: e.target.value })}>
              {GROUPS.map((g) => (
                <option key={g} value={g}>{label(g)}</option>
              ))}
            </select>
            <button className="btn btn-sm" type="submit">
              <Icon name="plus" size={15} /> {t('add')}
            </button>
          </form>
        </div>

        <div className="card">
          <CardTitle icon="bell">{t('t_ann')}</CardTitle>
          <form className="form" style={{ marginTop: 0 }} onSubmit={addAnn}>
            <textarea className="input" value={ann} onChange={(e) => setAnn(e.target.value)} placeholder={t('t_ann_text')} />
            <button className="btn btn-sm" type="submit">
              <Icon name="mail" size={15} /> {t('send')}
            </button>
          </form>

          <div style={{ marginTop: 28 }}>
            <CardTitle icon="message">{t('t_inbox')}</CardTitle>
            <div className="stack">
              {state.messages.length === 0 && <p className="empty">{t('t_inbox_none')}</p>}
              {state.messages.map((m) => (
                <div key={m.id} className="item">
                  <span className="ib">
                    <Icon name="message" size={16} />
                  </span>
                  <span className="txt">
                    <b>{childName(m.childId)}</b>
                    <br />
                    {m.text}
                  </span>
                  <button className="btn-ghost btn-sm btn-danger" onClick={() => dispatch({ type: 'remove', list: 'messages', id: m.id })}>
                    <Icon name="close" size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <CardTitle icon="layers">{t('t_feed')}</CardTitle>
          <Feed events={state.events} children={state.children} t={t} limit={12} />
        </div>

        <div className="card">
          <CardTitle icon="camera">{t('t_cam')}</CardTitle>
          <form className="form" style={{ marginTop: 0 }} onSubmit={saveCam}>
            <input className="input" value={cam} onChange={(e) => setCam(e.target.value)} placeholder={t('t_cam_ph')} />
            <button className="btn btn-sm" type="submit">
              <Icon name="check" size={15} /> {t('save')}
            </button>
          </form>

          <div style={{ marginTop: 28 }}>
            <button
              className="btn-ghost btn-sm"
              onClick={() => {
                if (confirm(t('reset') + '?')) dispatch({ type: 'reset' });
              }}
            >
              <Icon name="undo" size={15} /> {t('reset')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
