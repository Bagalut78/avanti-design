import { describe, expect, it } from 'vitest';
import css from '../../themes/avanti.css?raw';
import { contrastRatio, readCssVariables } from './contrast';

/**
 * Prüft die tatsächlich ausgelieferten Design-Tokens gegen WCAG 2.1 AA:
 * Text 4.5:1, große Schrift und bedeutungstragende UI-Elemente (Rahmen, Fokus) 3:1.
 */
const vars = readCssVariables(css);

function token(name: string): string {
  const value = vars.get(name);
  if (value === undefined) throw new Error(`Token ${name} fehlt in themes/avanti.css`);
  return value;
}

function ratio(fg: string, bg: string): number {
  const r = contrastRatio(token(fg), token(bg));
  if (!r.ok) throw new Error(r.error.message);
  return r.value;
}

const TEXT = 4.5;
const UI = 3;

describe('Design-Tokens: Kontrast', () => {
  it.each([
    ['--foreground', '--background'],
    ['--foreground', '--card'],
    ['--muted-foreground', '--background'],
    ['--muted-foreground', '--card'],
    ['--muted-foreground', '--muted'],
    ['--primary-foreground', '--primary'],
    ['--primary', '--card'],
    ['--primary', '--background'],
    ['--destructive', '--card'],
    ['--destructive-foreground', '--destructive'],
    ['--secondary-foreground', '--secondary'],
    ['--sidebar-foreground', '--sidebar'],
    ['--sidebar-muted', '--sidebar'],
    ['--sidebar-primary', '--sidebar'],
    ['--sidebar-accent-foreground', '--sidebar'],
    ['--color-brand-orange-accessible', '--card'],
    ['--color-score-high', '--card'],
  ])('%s auf %s erreicht 4.5:1', (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(TEXT);
  });

  it.each([
    ['--input', '--card'],
    ['--ring', '--card'],
    ['--ring', '--background'],
    ['--sidebar-ring', '--sidebar'],
    ['--ds-success-fg', '--ds-success-line'],
    ['--ds-warning-fg', '--ds-warning-line'],
    ['--ds-danger-fg', '--ds-danger-line'],
    ['--ds-info-fg', '--ds-info-line'],
  ])('%s auf %s erreicht 3:1 (UI-Element)', (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(UI);
  });
});

describe('Designsprache 2: Text auf den neuen Flächen', () => {
  it.each([
    ['--foreground', '--ds-frame'],
    ['--foreground', '--ds-core'],
    ['--foreground', '--ds-workspace'],
    ['--foreground', '--ds-hover'],
    ['--muted-foreground', '--ds-frame'],
    ['--muted-foreground', '--ds-core'],
    ['--muted-foreground', '--ds-workspace'],
    ['--muted-foreground', '--ds-hover'],
    ['--ds-nav-active-foreground', '--ds-canvas'],
    ['--sidebar-foreground', '--ds-canvas'],
    ['--sidebar-muted', '--ds-canvas'],
    ['--ds-up', '--ds-core'],
    ['--ds-down', '--ds-core'],
    ['--ds-up', '--ds-frame'],
    ['--ds-down', '--ds-frame'],
    ['--ds-success-fg', '--ds-success-bg'],
    ['--ds-warning-fg', '--ds-warning-bg'],
    ['--ds-danger-fg', '--ds-danger-bg'],
    ['--ds-info-fg', '--ds-info-bg'],
    ['--ds-neutral-fg', '--ds-neutral-bg'],
  ])('%s auf %s erreicht 4.5:1', (fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(TEXT);
  });
});
