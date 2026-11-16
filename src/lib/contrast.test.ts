import { describe, expect, it } from 'vitest';
import {
  composite,
  contrastRatio,
  parseColor,
  readCssVariables,
  relativeLuminance,
} from './contrast';

const ratio = (fg: string, bg: string): number => {
  const r = contrastRatio(fg, bg);
  if (!r.ok) throw new Error(r.error.message);
  return r.value;
};

describe('parseColor', () => {
  it('liest kurze und lange Hex-Werte gleich', () => {
    expect(parseColor('#fff')).toEqual(parseColor('#ffffff'));
    expect(parseColor('#172b52')).toEqual({ ok: true, value: { r: 0x17, g: 0x2b, b: 0x52, a: 1 } });
  });

  it('liest rgb() und rgba()', () => {
    expect(parseColor('rgb(1, 2, 3)')).toEqual({ ok: true, value: { r: 1, g: 2, b: 3, a: 1 } });
    expect(parseColor('rgba(255, 255, 255, 0.5)')).toEqual({
      ok: true,
      value: { r: 255, g: 255, b: 255, a: 0.5 },
    });
  });

  it.each(['', 'blue', '#12', '#1234567', 'rgb(300, 0, 0)', 'rgba(0, 0, 0, 2)'])(
    'meldet „%s“ als ungültig',
    (input) => {
      const result = parseColor(input);
      expect(result.ok).toBe(false);
    },
  );
});

describe('relativeLuminance', () => {
  it('ist 0 für Schwarz und 1 für Weiß', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0, a: 1 })).toBe(0);
    expect(relativeLuminance({ r: 255, g: 255, b: 255, a: 1 })).toBeCloseTo(1, 12);
  });

  it('steigt mit jedem Kanal monoton', () => {
    for (let v = 1; v <= 255; v++) {
      const lower = relativeLuminance({ r: v - 1, g: v - 1, b: v - 1, a: 1 });
      expect(relativeLuminance({ r: v, g: v, b: v, a: 1 })).toBeGreaterThan(lower);
    }
  });
});

describe('contrastRatio', () => {
  it('ergibt 21 für Schwarz auf Weiß und 1 für gleiche Farben', () => {
    expect(ratio('#000', '#fff')).toBeCloseTo(21, 10);
    expect(ratio('#172b52', '#172b52')).toBe(1);
  });

  it('ist symmetrisch für deckende Farben', () => {
    expect(ratio('#172b52', '#f6f7f9')).toBeCloseTo(ratio('#f6f7f9', '#172b52'), 12);
  });

  it('legt transparente Vordergrundfarben auf den Hintergrund', () => {
    expect(ratio('rgba(255, 255, 255, 0)', '#172b52')).toBe(1);
    expect(ratio('rgba(255, 255, 255, 1)', '#172b52')).toBeCloseTo(ratio('#fff', '#172b52'), 12);
    const half = ratio('rgba(255, 255, 255, 0.5)', '#000');
    expect(half).toBeGreaterThan(1);
    expect(half).toBeLessThan(21);
  });

  it('gibt Parse-Fehler weiter', () => {
    expect(contrastRatio('nope', '#fff').ok).toBe(false);
    expect(contrastRatio('#fff', 'nope').ok).toBe(false);
  });
});

describe('composite', () => {
  it('mischt linear nach Deckkraft', () => {
    const mixed = composite({ r: 200, g: 100, b: 0, a: 0.25 }, { r: 0, g: 100, b: 200, a: 1 });
    expect(mixed).toEqual({ r: 50, g: 100, b: 150, a: 1 });
  });
});

describe('readCssVariables', () => {
  it('liest Werte ohne Kommentare, erste Definition gewinnt', () => {
    const vars = readCssVariables(
      ':root { --a: #fff; --b: rgba(0, 0, 0, 0.5); /* x */ }\n.x { --a: #000; --c: #123; /* Kommentar */ }',
    );
    expect(vars.get('--a')).toBe('#fff');
    expect(vars.get('--b')).toBe('rgba(0, 0, 0, 0.5)');
    expect(vars.get('--c')).toBe('#123');
  });
});
