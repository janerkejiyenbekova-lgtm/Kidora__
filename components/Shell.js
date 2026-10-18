'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useStore, useT } from '@/lib/store';
import { setSfx, sfx } from '@/lib/sfx';
import Logo from './Logo';
import Icon from './Icons';
import Celebrate from './Celebrate';

const LINKS = [
  ['/', 'home', 'home'],
  ['/parent', 'parent', 'users'],
  ['/teacher', 'teacher', 'board'],
  ['/kid', 'kid', 'child'],
  ['/games', 'games', 'gamepad'],
  ['/coloring', 'coloring', 'palette'],
];

export default function Shell({ children }) {
  const { state, dispatch } = useStore();
  const t = useT();
  const path = usePathname();
  const firstRoute = useRef(true);

  useEffect(() => {
    setSfx(state.sound);
  }, [state.sound]);

  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    sfx.whoosh();
  }, [path]);

  useEffect(() => {
    let lastHover = null;
    const down = (e) => {
      const el = e.target.closest?.('button,a,select');
      if (!el || el.closest('.mc,.sw,.mood-btn,.big-kid,.quiz-opt,.hole')) return;
      sfx.click();
    };
    const over = (e) => {
      const el = e.target.closest?.('.btn,.btn-ghost,.card.role,.big-kid,.play-card,.att,.task,.pill,.shop-item');
      if (el !== lastHover) {
        lastHover = el;
        if (el) sfx.hover();
      }
    };
    document.addEventListener('pointerdown', down);
    document.addEventListener('pointerover', over);
    return () => {
      document.removeEventListener('pointerdown', down);
      document.removeEventListener('pointerover', over);
    };
  }, []);

  return (
    <>
      <div className="blob b1" />
      <div className="blob b2" />

      <header className="header">
        <Link href="/" className="brand">
          <Logo size={34} />
          <span className="brand-name">Kidora</span>
        </Link>

        <nav className="nav">
          {LINKS.map(([href, key, icon]) => (
            <Link key={href} href={href} className={path === href ? 'active' : ''} title={t(key)}>
              <Icon name={icon} size={15} />
              <span>{t(key)}</span>
            </Link>
          ))}
        </nav>

        <div className="tools">
          <select
            className="lang"
            aria-label="Language"
            value={state.lang}
            onChange={(e) => dispatch({ type: 'set', key: 'lang', value: e.target.value })}
          >
            <option value="uz">O‘zbek</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
          <button
            className="btn-ghost icon"
            title={state.sound ? t('sound_on') : t('sound_off')}
            aria-label="Sound"
            onClick={() => dispatch({ type: 'set', key: 'sound', value: !state.sound })}
          >
            <Icon name={state.sound ? 'volume' : 'mute'} size={17} />
          </button>
          <button
            className="btn-ghost icon"
            title={state.theme === 'dark' ? t('theme_light') : t('theme_dark')}
            aria-label="Theme"
            onClick={() => dispatch({ type: 'set', key: 'theme', value: state.theme === 'dark' ? 'light' : 'dark' })}
          >
            <Icon name={state.theme === 'dark' ? 'sun' : 'moon'} size={17} />
          </button>
        </div>
      </header>

      <main className="wrap">{children}</main>

      <footer className="foot">
        <Logo size={18} /> <span>Kidora · {t('tagline')}</span>
        <a className="tg" href="https://t.me/hackaton26_bot" target="_blank" rel="noopener noreferrer" aria-label={t('ftr_bot')}>
          <Icon name="tg" size={16} /> @hackaton26_bot
        </a>
      </footer>

      <Celebrate />
    </>
  );
}
