import { describe, expect, it } from 'vitest';
import { arcPath, areaPath, chartPoints, deltaOf, linePath, shareOf } from './charts';

const BOX = { width: 100, height: 40, inset: 0 };

describe('chartPoints', () => {
  it('verteilt x gleichmäßig und legt Minimum unten, Maximum oben', () => {
    const pts = chartPoints([1, 3, 2], BOX);
    expect(pts.map((p) => p.x)).toEqual([0, 50, 100]);
    expect(pts[0]?.y).toBe(40);
    expect(pts[1]?.y).toBe(0);
    expect(pts[2]?.y).toBe(20);
  });

  it('flache Reihe in der Mitte, ein Wert in der Mitte, nicht-endliche ausgelassen', () => {
    expect(chartPoints([5, 5], BOX).map((p) => p.y)).toEqual([20, 20]);
    expect(chartPoints([7], BOX)).toEqual([{ x: 50, y: 20 }]);
    expect(chartPoints([1, Number.NaN, 3], BOX)).toHaveLength(2);
    expect(chartPoints([], BOX)).toEqual([]);
  });

  it('bleibt mit Innenabstand in der Box', () => {
    const box = { width: 80, height: 24, inset: 2 };
    for (const p of chartPoints([3, 9, -4, 12, 0], box)) {
      expect(p.x).toBeGreaterThanOrEqual(2);
      expect(p.x).toBeLessThanOrEqual(78);
      expect(p.y).toBeGreaterThanOrEqual(2);
      expect(p.y).toBeLessThanOrEqual(22);
    }
  });
});

describe('linePath / areaPath', () => {
  it('Linie beginnt mit M und hat je Wert einen Punkt', () => {
    const d = linePath([1, 2, 3, 4], BOX);
    expect(d.startsWith('M0 40')).toBe(true);
    expect(d.match(/[ML]/g)).toHaveLength(4);
    expect(linePath([], BOX)).toBe('');
  });

  it('Fläche schließt am unteren Rand', () => {
    const d = areaPath([1, 2, 3], BOX);
    expect(d.startsWith(linePath([1, 2, 3], BOX))).toBe(true);
    expect(d.endsWith('L100 40 L0 40 Z')).toBe(true);
    expect(areaPath([1], BOX)).toBe('');
  });
});

describe('shareOf / arcPath', () => {
  it('Anteil begrenzt auf 0–1, ohne Gesamtwert 0', () => {
    expect(shareOf(30, 120)).toBe(0.25);
    expect(shareOf(200, 100)).toBe(1);
    expect(shareOf(-5, 100)).toBe(0);
    expect(shareOf(5, 0)).toBe(0);
  });

  it('Bogen endet auf dem Kreis; voll = rechts, halb = oben, 0 = leer', () => {
    const end = (d: string) => d.split(' ').slice(-2).map(Number);
    expect(end(arcPath(1, 50, 50, 40))).toEqual([90, 50]);
    expect(end(arcPath(0.5, 50, 50, 40))).toEqual([50, 10]);
    expect(arcPath(0, 50, 50, 40)).toBe('');
    for (const s of [0.1, 0.33, 0.7, 0.95]) {
      const [x = 0, y = 0] = end(arcPath(s, 50, 50, 40));
      expect(Math.hypot(x - 50, y - 50)).toBeCloseTo(40, 1);
    }
  });
});

describe('deltaOf', () => {
  it('Richtung und Bewertung je nach besserer Richtung', () => {
    expect(deltaOf(92, 88, 'up')).toEqual({ change: 4, trend: 'up', good: true });
    expect(deltaOf(92, 88, 'down')).toEqual({ change: 4, trend: 'up', good: false });
    expect(deltaOf(20, 25, 'down')).toEqual({ change: -5, trend: 'down', good: true });
  });

  it('unverändert innerhalb von epsilon', () => {
    expect(deltaOf(1, 1 + 1e-12, 'up')).toEqual({ change: 0, trend: 'flat', good: null });
  });
});
