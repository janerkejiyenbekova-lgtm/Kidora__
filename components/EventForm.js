'use client';

import { useState } from 'react';
import { useStore, useT } from '@/lib/store';
import { uid } from '@/lib/data';
import Icon from './Icons';

export default function EventForm() {
  const { dispatch } = useStore();
  const t = useT();
  const [f, setF] = useState({ date: '', title: '', tip: '' });
  const [ok, setOk] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!f.date || !f.title.trim()) return;
    dispatch({
      type: 'add',
      list: 'celebrations',
      item: { id: uid(), date: f.date, title: f.title.trim(), tip: f.tip.trim(), emoji: '📌' },
    });
    setF({ date: '', title: '', tip: '' });
    setOk(true);
    setTimeout(() => setOk(false), 1800);
  };

  return (
    <form className="form" style={{ marginTop: 0 }} onSubmit={submit}>
      <input className="input" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} aria-label={t('cal_date')} />
      <input className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder={t('cal_name')} />
      <textarea className="input" value={f.tip} onChange={(e) => setF({ ...f, tip: e.target.value })} placeholder={t('cal_tip_in')} />
      <div className="row">
        <button className="btn btn-sm" type="submit">
          <Icon name="plus" size={15} /> {t('cal_add')}
        </button>
        {ok && (
          <span className="chip">
            <Icon name="check" size={14} /> {t('cal_added')}
          </span>
        )}
      </div>
    </form>
  );
}
