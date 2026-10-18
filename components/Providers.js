'use client';

import { StoreProvider } from '@/lib/store';
import Shell from './Shell';

export default function Providers({ children }) {
  return (
    <StoreProvider>
      <Shell>{children}</Shell>
    </StoreProvider>
  );
}
