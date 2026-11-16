import { cn } from '@/lib/cn';

export interface SkeletonProps {
  /** Vorlesetext, Standard „Wird geladen …“. */
  label?: string;
  className?: string;
  lines?: number;
}

/**
 * Platzhalter beim Laden (Name und Props wie in der avanti suite). Ruhig: Die Balken erscheinen
 * nach 300 ms einmal weich (kurze Ladezeiten blitzen nicht auf) und pulsieren nicht – nichts
 * blinkt, nichts wiederholt sich.
 */
export function Skeleton({ label = 'Wird geladen …', className, lines = 1 }: SkeletonProps) {
  const count = Math.max(1, Math.floor(lines));
  return (
    <div
      data-slot="ds-skeleton"
      role="status"
      aria-live="polite"
      className={cn('flex animate-ds-placeholder-in flex-col gap-2', className)}
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            'block h-3 rounded-full bg-ds-placeholder',
            count > 1 && i === count - 1 ? 'w-3/5' : 'w-full',
          )}
        />
      ))}
    </div>
  );
}
