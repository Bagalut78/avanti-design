/**
 * Geometrie der Mini-Grafiken der Designsprache 2: Verlaufslinie, Fläche mit Verlauf
 * und Bogen als SVG-Pfade. Rein funktional; die Bausteine in src/ui zeichnen nur.
 */

export interface ChartBox {
  readonly width: number;
  readonly height: number;
  /** Innenabstand, damit die Linie am Rand nicht abgeschnitten wird. */
  readonly inset?: number;
}

export interface ChartPoint {
  readonly x: number;
  readonly y: number;
}

const finite = (values: readonly number[]) => values.filter((v) => Number.isFinite(v));

/** Rundet auf zwei Nachkommastellen, damit die Pfade kurz und stabil bleiben. */
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Punkte einer Reihe in der Box: x gleichmäßig verteilt, y zwischen Minimum (unten) und Maximum
 * (oben). Eine flache Reihe liegt in der Mitte. Nicht-endliche Werte werden ausgelassen.
 */
export function chartPoints(values: readonly number[], box: ChartBox): ChartPoint[] {
  const v = finite(values);
  const inset = box.inset ?? 2;
  if (v.length === 0) return [];
  const min = Math.min(...v);
  const max = Math.max(...v);
  const w = box.width - 2 * inset;
  const h = box.height - 2 * inset;
  const step = v.length > 1 ? w / (v.length - 1) : 0;
  return v.map((value, i) => ({
    x: r2(inset + (v.length > 1 ? i * step : w / 2)),
    y: r2(max === min ? inset + h / 2 : inset + h - ((value - min) / (max - min)) * h),
  }));
}

/** Verlaufslinie als Pfad (`M … L …`); leer ohne Werte. */
export function linePath(values: readonly number[], box: ChartBox): string {
  const pts = chartPoints(values, box);
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${String(p.x)} ${String(p.y)}`).join(' ');
}

/** Fläche unter der Linie bis zum unteren Rand (geschlossen); leer mit weniger als zwei Werten. */
export function areaPath(values: readonly number[], box: ChartBox): string {
  const pts = chartPoints(values, box);
  const first = pts[0];
  const last = pts[pts.length - 1];
  if (pts.length < 2 || !first || !last) return '';
  const bottom = box.height - (box.inset ?? 2);
  return `${linePath(values, box)} L${String(last.x)} ${String(r2(bottom))} L${String(first.x)} ${String(r2(bottom))} Z`;
}

/** Anteil 0–1, begrenzt; ohne Gesamtwert 0. */
export function shareOf(value: number, total: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) return 0;
  return Math.min(1, Math.max(0, value / total));
}

/**
 * Halbbogen (von links über oben nach rechts) um den Mittelpunkt (cx, cy) mit Radius r, gefüllt
 * bis zum Anteil `share` (0–1). Bei 0 ein leerer Pfad.
 */
export function arcPath(share: number, cx: number, cy: number, r: number): string {
  const s = Math.min(1, Math.max(0, Number.isFinite(share) ? share : 0));
  if (s === 0) return '';
  const angle = Math.PI * (1 - s); // π = links, 0 = rechts
  const x = r2(cx + r * Math.cos(angle));
  const y = r2(cy - r * Math.sin(angle));
  return `M${String(r2(cx - r))} ${String(r2(cy))} A${String(r)} ${String(r)} 0 0 1 ${String(x)} ${String(y)}`;
}

export type Trend = 'up' | 'down' | 'flat';

export interface Delta {
  /** Veränderung absolut (aktuell − vorher). */
  readonly change: number;
  readonly trend: Trend;
  /** Gut für die Kennzahl? `null`, wenn unverändert. */
  readonly good: boolean | null;
}

/**
 * Veränderung einer Kennzahl. `better`: in welche Richtung die Kennzahl besser wird (Service Level
 * „up“, Wartezeit „down“). Unterschiede unter `epsilon` gelten als unverändert.
 */
export function deltaOf(
  current: number,
  previous: number,
  better: 'up' | 'down',
  epsilon = 1e-9,
): Delta {
  const change = current - previous;
  if (!Number.isFinite(change) || Math.abs(change) < epsilon)
    return { change: 0, trend: 'flat', good: null };
  const trend: Trend = change > 0 ? 'up' : 'down';
  return { change, trend, good: trend === better };
}
