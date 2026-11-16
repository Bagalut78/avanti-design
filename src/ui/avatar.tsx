import { hueIndexOf, initialsOf } from '@/lib/table-logic';
import { cn } from '@/lib/cn';

/** Töne aus der Marke (Text auf Fläche ≥ 4,5:1, siehe tokens.test.ts). */
const TONES = [
  'bg-ds-info-bg text-ds-info-fg',
  'bg-ds-success-bg text-ds-success-fg',
  'bg-ds-warning-bg text-ds-warning-fg',
  'bg-ds-neutral-bg text-ds-neutral-fg',
  'bg-ds-danger-bg text-ds-danger-fg',
] as const;

export interface AvatarProps {
  /** Voller Name; daraus Initialen und ein stabiler Farbton. */
  name: string;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Avatar mit Initialen – bewusst ohne Fotos (Personaldaten, kein Bildspeicher). Für Vorleser
 * dekorativ: Der Name steht immer daneben.
 */
export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <span
      data-slot="ds-avatar"
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-medium select-none',
        size === 'sm' ? 'size-6 text-[10px]' : 'size-7 text-[11px]',
        TONES[hueIndexOf(name, TONES.length)],
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
