import { err, ok, type Result } from './result';

/** Farbe als sRGB-Kanäle 0–255 und Deckkraft 0–1. */
export interface Rgba {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

export interface ColorParseError {
  readonly code: 'INVALID_COLOR';
  readonly message: string;
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const RGBA = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*\.?\d+)\s*)?\)$/i;

/** Liest `#rgb`, `#rrggbb`, `rgb(r, g, b)` und `rgba(r, g, b, a)`. */
export function parseColor(input: string): Result<Rgba, ColorParseError> {
  const value = input.trim();
  const hex = HEX.exec(value);
  if (hex?.[1] !== undefined) {
    const digits = hex[1].length === 3 ? hex[1].replace(/./g, (c) => c + c) : hex[1];
    const n = Number.parseInt(digits, 16);
    return ok({ r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 });
  }
  const rgba = RGBA.exec(value);
  if (rgba) {
    const [r, g, b] = [rgba[1], rgba[2], rgba[3]].map(Number);
    const a = rgba[4] === undefined ? 1 : Number(rgba[4]);
    if (
      r !== undefined &&
      g !== undefined &&
      b !== undefined &&
      [r, g, b].every((c) => c <= 255) &&
      a <= 1
    ) {
      return ok({ r, g, b, a });
    }
  }
  return err({ code: 'INVALID_COLOR', message: `Keine gültige Farbe: „${input}“` });
}

/** Legt eine (halb)transparente Farbe über einen deckenden Hintergrund. */
export function composite(fg: Rgba, bg: Rgba): Rgba {
  const mix = (f: number, b: number): number => f * fg.a + b * (1 - fg.a);
  return { r: mix(fg.r, bg.r), g: mix(fg.g, bg.g), b: mix(fg.b, bg.b), a: 1 };
}

/** Relative Leuchtdichte nach WCAG 2.1. */
export function relativeLuminance({ r, g, b }: Rgba): number {
  const channel = (c: number): number => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * Kontrastverhältnis nach WCAG 2.1 (1–21). Eine transparente Vordergrundfarbe wird vorher
 * auf den Hintergrund gelegt; der Hintergrund gilt als deckend.
 */
export function contrastRatio(
  foreground: string,
  background: string,
): Result<number, ColorParseError> {
  const fg = parseColor(foreground);
  if (!fg.ok) return fg;
  const bg = parseColor(background);
  if (!bg.ok) return bg;
  const opaqueBg = { ...bg.value, a: 1 };
  const l1 = relativeLuminance(composite(fg.value, opaqueBg));
  const l2 = relativeLuminance(opaqueBg);
  return ok((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05));
}

/** Liest alle Custom Properties (`--name: wert;`) aus einem Stylesheet; die erste Definition gilt. */
export function readCssVariables(css: string): ReadonlyMap<string, string> {
  const variables = new Map<string, string>();
  for (const match of css.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)) {
    const [, name, value] = match;
    if (name !== undefined && value !== undefined && !variables.has(name)) {
      variables.set(name, value.replace(/\/\*.*?\*\//g, '').trim());
    }
  }
  return variables;
}
