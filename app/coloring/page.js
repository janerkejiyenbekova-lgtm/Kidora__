'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore, useT } from '@/lib/store';
import { burst, sfx } from '@/lib/sfx';
import { celebrate } from '@/lib/celebrate';
import { TEMPLATES as BASE } from '@/lib/shapes';
import { EXTRA } from '@/lib/shapes-ext';
import Icon, { CardTitle } from '@/components/Icons';

const TEMPLATES = { ...BASE, ...EXTRA };
const KEYS = Object.keys(TEMPLATES);
const COLORS = ['#FF6B6B', '#FFC93C', '#51CF66', '#4DABF7', '#CC5DE8', '#FF922B', '#F06595', '#20C997', '#8B5CF6', '#2B2410', '#FFFFFF'];
const WHITE = '#FFFFFF';

export default function Coloring() {
  const { state, dispatch } = useStore();
  const t = useT();
  const [tpl, setTpl] = useState('house');
  const [color, setColor] = useState(COLORS[1]);
  const [fills, setFills] = useState({});
  const [cid, setCid] = useState('');
  const [rewarded, setRewarded] = useState({});
  const svgRef = useRef(null);

  const template = TEMPLATES[tpl];
  const filled = template.shapes.filter((s) => fills[s.id] && fills[s.id] !== WHITE).length;
  const complete = filled === template.shapes.length;

  useEffect(() => {
    if (complete && !rewarded[tpl]) {
      setRewarded((r) => ({ ...r, [tpl]: true }));
      if (cid) dispatch({ type: 'points', child: cid, n: 1 });
      burst(80);
      celebrate(t('cel4'), 5);
    }
  }, [complete, cid, tpl]); // eslint-disable-line react-hooks/exhaustive-deps

  const paint = (id) => {
    if (state.sound) sfx.pop();
    setFills((f) => ({ ...f, [id]: color }));
  };

  const switchTpl = (k) => {
    setTpl(k);
    setFills({});
  };

  const download = () => {
    const clone = svgRef.current.cloneNode(true);
    clone.setAttribute('width', '800');
    clone.setAttribute('height', '800');
    const xml = new XMLSerializer().serializeToString(clone);
    const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = 800;
      c.height = 800;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 800, 800);
      ctx.drawImage(img, 0, 0, 800, 800);
      const a = document.createElement('a');
      a.download = `kidora-${tpl}.png`;
      a.href = c.toDataURL('image/png');
      a.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="page">
      <div className="page-head">
        <h1>
          <Icon name="palette" size={28} /> {t('c_title')}
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
        {KEYS.map((k) => (
          <button key={k} className={`pill ${tpl === k ? 'on' : ''}`} onClick={() => switchTpl(k)}>
            {t('c_' + k)}
          </button>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: 0, gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.5fr)' }}>
        <div className="card">
          <CardTitle icon="brush">{t('c_template')}</CardTitle>
          <p className="muted" style={{ lineHeight: 1.5 }}>{t('c_hint')}</p>
          <div className="palette">
            {COLORS.map((c) => (
              <button key={c} className={`sw ${color === c ? 'on' : ''}`} style={{ background: c }} onClick={() => setColor(c)} aria-label={c} />
            ))}
          </div>
          <div className="row" style={{ flexWrap: 'wrap' }}>
            <button className="btn-ghost btn-sm" onClick={() => setFills({})}>
              <Icon name="undo" size={14} /> {t('c_clear')}
            </button>
            <button className="btn btn-sm" onClick={download}>
              <Icon name="download" size={14} /> {t('c_download')}
            </button>
          </div>
          {complete && (
            <p className="chip" style={{ marginTop: 18 }}>
              <Icon name="star" size={14} /> {t('c_done')}
            </p>
          )}
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 18, fontWeight: 700 }}>
            <span className="muted">{t('c_progress')}</span>
            <span>
              {filled}/{template.shapes.length}
            </span>
          </div>
          <div className="progress">
            <i style={{ width: `${(filled / template.shapes.length) * 100}%` }} />
          </div>
        </div>

        <div className="card">
          <svg ref={svgRef} viewBox={template.viewBox} xmlns="http://www.w3.org/2000/svg" className="coloring-svg">
            {template.shapes.map((s) => {
              const Tag = s.tag;
              return (
                <Tag
                  key={s.id}
                  id={s.id}
                  {...s.attrs}
                  fill={fills[s.id] || WHITE}
                  stroke="#2b2410"
                  strokeWidth={4}
                  strokeLinejoin="round"
                  className="region"
                  onClick={() => paint(s.id)}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
