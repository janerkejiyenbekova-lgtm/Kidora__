'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useStore, useT } from '@/lib/store';
import Counter from '@/components/Counter';
import Icon from '@/components/Icons';
import Reveal from '@/components/Reveal';

const ROLES = [
  ['/parent', 'users', 'r_parent_t', 'r_parent_d', true],
  ['/teacher', 'board', 'r_teacher_t', 'r_teacher_d', false],
  ['/kid', 'child', 'r_kid_t', 'r_kid_d', false],
  ['/games', 'gamepad', 'r_games_t', 'r_games_d', false],
  ['/coloring', 'palette', 'r_color_t', 'r_color_d', false],
];

const FEATURES = [
  ['calendar', 'f1t', 'f1d'],
  ['video', 'f2t', 'f2d'],
  ['star', 'f3t', 'f3d'],
  ['bot', 'f4t', 'f4d'],
  ['target', 'f5t', 'f5d'],
  ['brush', 'f6t', 'f6d'],
];

export default function Home() {
  const { state } = useStore();
  const t = useT();
  const heroRef = useRef(null);

  const present = state.children.filter((c) => state.attendance[c.id] === 'present').length;
  const hwDone = Object.values(state.done).reduce((s, o) => s + Object.values(o).filter(Boolean).length, 0);
  const coins = Object.values(state.coins || {}).reduce((s, n) => s + n, 0);

  // Soft light that follows the pointer across the hero
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  }, []);

  const marq = t('h_marq');

  return (
    <>
      <section ref={heroRef} className="hx">
        <div className="hx-grid">
          <div>
            <span className="hx-kick">{t('h_kick')}</span>
            <h1>
              <span className="ln">{t('h_l1')}</span>
              <span className="ln out">{t('h_l2')}</span>
              <span className="ln">
                <span className="hl">{t('h_l3')}</span>
              </span>
            </h1>
            <p className="hx-sub">{t('h_sub')}</p>
            <div className="hx-actions">
              <Link href="/parent" className="btn">
                {t('h_cta1')} <Icon name="arrow" size={16} />
              </Link>
              <Link href="/kid" className="btn btn-ghost" style={{ padding: '13px 22px' }}>
                {t('h_cta2')}
              </Link>
            </div>
          </div>

          <aside className="live">
            <div className="live-head">
              <span>{t('h_live')}</span>
              <span className="live-dot" />
            </div>
            <div className="live-row">
              <span>{t('h_present')}</span>
              <b>
                <Counter to={present} />
              </b>
            </div>
            <div className="live-row">
              <span>{t('h_coins')}</span>
              <b className="y">
                <Counter to={coins} />
              </b>
            </div>
            <div className="live-row">
              <span>{t('h_tasks')}</span>
              <b>
                <Counter to={hwDone} />
              </b>
            </div>
          </aside>
        </div>
      </section>

      <div className="marq" aria-hidden="true">
        <div className="marq-track">
          <span>{marq}</span>
          <span>{marq}</span>
        </div>
      </div>

      <Reveal>
        <div className="sec-head">
          <div>
            <div className="sec-kick">{t('s_roles')}</div>
            <h2>{t('s_roles_t')}</h2>
          </div>
        </div>
      </Reveal>

      <section className="bento">
        {ROLES.map(([href, icon, title, desc, big], i) => (
          <Reveal key={href} delay={i * 80} className={big ? 'big-wrap' : ''}>
            <Link href={href} className={`bcard ${big ? 'big' : ''}`}>
              <div className="bi">
                <Icon name={icon} size={22} />
              </div>
              <h3>{t(title)}</h3>
              <p>{t(desc)}</p>
              <span className="go">
                {t('go')} <Icon name="arrow" size={15} />
              </span>
            </Link>
          </Reveal>
        ))}
      </section>

      <Reveal>
        <div className="sec-head">
          <div>
            <div className="sec-kick">{t('s_feat')}</div>
            <h2>{t('s_feat_t')}</h2>
          </div>
        </div>
      </Reveal>

      <section>
        {FEATURES.map(([icon, title, desc], i) => (
          <Reveal key={title} delay={(i % 3) * 60}>
            <div className="frow">
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <h4>
                <Icon name={icon} size={22} />
                {t(title)}
              </h4>
              <p>{t(desc)}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <Reveal>
        <section className="botx" style={{ marginTop: 72 }}>
          <div>
            <div className="sec-kick">{t('s_bot')}</div>
            <h3>{t('s_bot_t')}</h3>
            <p>{t('s_bot_d')}</p>
          </div>
          <div className="phone">
            <div className="msg">{t('bot_sample')}</div>
            <div className="msg">✓ {t('f4t')}</div>
            <div className="msg">{t('s_bot_t')}</div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="cta">
          <div>
            <h3>{t('s_cta_t')}</h3>
            <p>{t('s_cta_b')}</p>
          </div>
          <Link href="/parent" className="btn">
            {t('s_cta_btn')} <Icon name="arrow" size={16} />
          </Link>
        </section>
      </Reveal>
    </>
  );
}
