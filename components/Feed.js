'use client';

import { evText } from '@/lib/store';

export default function Feed({ events, children, t, limit = 8 }) {
  const list = events.slice(0, limit);
  if (!list.length) return <p className="empty">{t('empty')}</p>;

  return (
    <div className="feed">
      {list.map((e) => (
        <div key={e.id} className="feed-item">
          <span className="feed-time">
            {new Date(e.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span>{evText(e, t, children)}</span>
        </div>
      ))}
    </div>
  );
}
