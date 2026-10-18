'use client';

import { useEffect, useState } from 'react';

export default function Counter({ to }) {
  const [v, setV] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const dur = 900;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      setV(Math.round(to * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);

  return <>{v}</>;
}
