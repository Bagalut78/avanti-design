import { animate } from 'motion/react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

/**
 * Bewegung der Designsprache 2 (LEITFADEN.md „Bewegung“): Hochzählen und Zeichnen sind die
 * einzigen Bewegungen mit motion; alles andere sind CSS-Übergänge aus dem Thema.
 */

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => {
    mq.removeEventListener('change', onChange);
  };
}

const reduced = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(QUERY).matches;

/** `true`, wenn die Person weniger Bewegung wünscht (Systemeinstellung). */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, reduced, () => false);
}

/** Dauer des Hochzählens und Zeichnens in Sekunden (Token `--ds-duration-count`/`-draw`). */
export const COUNT_SECONDS = 0.7;
export const DRAW_SECONDS = 0.6;
/** Kurve „ease-out“ der Designsprache 2 (Token `--ease-ds-out`). */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/**
 * Zählt beim Erscheinen von 0 auf `value` hoch, danach von altem auf neuen Wert. Bei weniger
 * Bewegung sofort der Endwert.
 */
export function useCountUp(value: number): number {
  const still = usePrefersReducedMotion();
  const target = Number.isFinite(value) ? value : 0;
  const [shown, setShown] = useState(still ? target : 0);
  const last = useRef(still ? target : 0);

  useEffect(() => {
    if (still) {
      last.current = target;
      return;
    }
    const controls = animate(last.current, target, {
      duration: COUNT_SECONDS,
      ease: EASE_OUT,
      onUpdate: (v) => {
        last.current = v;
        setShown(v);
      },
    });
    return () => {
      controls.stop();
    };
  }, [target, still]);

  return still ? target : shown;
}
