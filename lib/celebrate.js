// Fire a celebration overlay from anywhere (games, tasks, coloring, shop)
export function celebrate(text, coins = 0) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('kidora:celebrate', { detail: { text, coins, id: Date.now() } }));
}
