/** Varianten wie in der avanti suite. */
export type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'outline' | 'muted';

/** Töne wie in der avanti suite (Aliase: neutral = muted, info = default, danger = destructive). */
export type BadgeTone = BadgeVariant | 'neutral' | 'info' | 'danger';

/** Normalisierter Ton (Aliase aufgelöst) – für Tests und `data-tone`. */
export function badgeTone(tone: BadgeTone): BadgeVariant {
  if (tone === 'neutral') return 'muted';
  if (tone === 'info') return 'default';
  if (tone === 'danger') return 'destructive';
  return tone;
}
