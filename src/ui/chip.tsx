import { Check } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/cn';

export interface ChipProps extends ComponentPropsWithRef<'button'> {
  selected?: boolean;
}

/**
 * Filter-Chip (Name und Props wie in der avanti suite): umschaltbarer Knopf mit `aria-pressed`.
 * Gewählt: dunkle Linie, Häkchen und getönte Fläche – nicht nur Farbe.
 *
 * Die Größe ändert sich beim Umschalten nicht (LEITFADEN.md, Regel 12): Der
 * Platz für das Häkchen ist links immer frei, rechts steht derselbe Abstand, damit der Text in
 * beiden Zuständen mittig und an derselben Stelle steht. Das Häkchen blendet nur ein und aus.
 */
export function Chip({ selected = false, className, children, type, ...props }: ChipProps) {
  return (
    <button
      type={type === 'submit' || type === 'reset' ? type : 'button'}
      data-slot="ds-chip"
      aria-pressed={selected}
      className={cn(
        'ds-press relative inline-flex h-8 items-center justify-center rounded-ds-control border px-5 text-[13px] font-medium whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1',
        selected
          ? 'border-primary bg-ds-info-bg text-primary'
          : 'border-ds-line-strong bg-ds-core text-foreground hover:bg-ds-hover',
        className,
      )}
      {...props}
    >
      <Check
        data-slot="ds-chip-check"
        className={cn(
          'pointer-events-none absolute top-1/2 left-1 size-3 -translate-y-1/2 transition-opacity duration-(--ds-duration-fast)',
          selected ? 'opacity-100' : 'opacity-0',
        )}
        strokeWidth={2.5}
        aria-hidden="true"
      />
      {children}
    </button>
  );
}
