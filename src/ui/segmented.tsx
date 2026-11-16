import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';

export interface SegmentedOption<V extends string> {
  value: V;
  label: string;
}

export interface SegmentedProps<V extends string> {
  value: V;
  onValueChange: (value: V) => void;
  options: readonly SegmentedOption<V>[];
  /** Name der Gruppe für Vorleser (z. B. „Zeitraum“). */
  label: string;
  className?: string;
}

/**
 * Umschalter mit Segmenten (Woche | Monat | Jahr). Eine Auswahl als `radiogroup`: Tab führt in die
 * Gruppe, Pfeiltasten, Pos1 und Ende wählen. Die helle Marke gleitet bei Klick zum gewählten
 * Segment (200 ms, ease-in-out); bei Tastatur springt sie sofort (Tastaturaktionen bewegen sich
 * nie). Die Suite hat dafür keinen Baustein; Name nach Zweck (LEITFADEN.md).
 */
export function Segmented<V extends string>({
  value,
  onValueChange,
  options,
  label,
  className,
}: SegmentedProps<V>) {
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const [mark, setMark] = useState<{ x: number; w: number } | null>(null);
  const [instant, setInstant] = useState(true);

  useLayoutEffect(() => {
    const el = refs.current.get(value);
    if (el) setMark({ x: el.offsetLeft, w: el.offsetWidth });
  }, [value, options]);

  const select = (next: V, byKeyboard: boolean) => {
    setInstant(byKeyboard);
    if (next !== value) onValueChange(next);
    if (byKeyboard) refs.current.get(next)?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const index = options.findIndex((o) => o.value === value);
    const last = options.length - 1;
    const to =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? index >= last
          ? 0
          : index + 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? index <= 0
            ? last
            : index - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : null;
    const next = to === null ? undefined : options[to];
    if (!next) return;
    e.preventDefault();
    select(next.value, true);
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      data-slot="ds-segmented"
      className={cn(
        'relative inline-flex h-8 items-center rounded-ds-control border border-ds-line bg-ds-frame p-0.5',
        className,
      )}
    >
      {mark && (
        <span
          aria-hidden="true"
          data-slot="ds-segmented-mark"
          className={cn(
            'absolute top-0.5 bottom-0.5 left-0 rounded-[6px] border border-ds-line bg-ds-core shadow-ds-1',
            instant ? 'transition-none' : 'transition-transform duration-200 ease-ds-in-out',
          )}
          style={{ width: mark.w, transform: `translateX(${String(mark.x)}px)` }}
        />
      )}
      {options.map((o) => {
        const checked = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              if (el) refs.current.set(o.value, el);
              else refs.current.delete(o.value);
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => {
              select(o.value, false);
            }}
            onKeyDown={onKeyDown}
            className={cn(
              'relative z-10 h-full rounded-[6px] px-3 text-[13px] font-medium whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40',
              checked ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              // Ohne gemessene Marke (erstes Zeichnen) trägt das gewählte Segment die Fläche selbst.
              checked && !mark && 'bg-ds-core shadow-ds-1',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
