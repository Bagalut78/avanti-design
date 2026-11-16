import { describe, expect, it } from 'vitest';
import theme from '../../themes/avanti.css?raw';

/**
 * Jede Klasse und Variable, die ein Baustein benutzt, ist im Thema definiert – sonst sähe ein
 * Baustein in einer App mit dem Thema anders aus als auf der Musterseite.
 */

const sources = import.meta.glob<string>(['./*.tsx', './*.ts', '!./*.test.*'], {
  query: '?raw',
  import: 'default',
  eager: true,
});

/** Quelltext ohne Kommentare, `data-slot`-Namen und erzeugte Ids (keine Klassen). */
function codeOf(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
    .replace(/data-slot=(?:\\?"|')[^"']*(?:\\?"|')/g, '')
    .replace(/\[data-slot=[^\]]*\]/g, '')
    .replace(/`ds-nav-\$\{[^`]*`/g, '');
}

/** Alle Namen `ds-…` aus Klassen (`bg-ds-frame`, `ds-press`, `duration-(--ds-duration-fast)`). */
function dsNamesOf(code: string): Set<string> {
  const names = new Set<string>();
  for (const m of code.matchAll(/(?<![a-z0-9])ds-[a-z0-9]+(?:-[a-z0-9]+)*/g)) names.add(m[0]);
  return names;
}

/** Alle Variablen aus `var(--…)` und Tailwinds Kurzform `(--…)`. */
function variablesOf(code: string): Set<string> {
  return new Set([...code.matchAll(/\((--[a-z0-9-]+)\)/g)].flatMap((m) => (m[1] ? [m[1]] : [])));
}

/** Farbnamen aus Farb-Klassen (`bg-primary`, `text-muted-foreground`, `before:bg-sidebar-primary`). */
function colorNamesOf(code: string): Set<string> {
  const names = new Set<string>();
  for (const m of code.matchAll(
    /(?<![\w-])(?:[a-z-]+:)*(?:bg|text|border|ring-offset|ring(?!-offset)|outline|divide|fill|stroke)-([a-z][a-z0-9-]*)(?:\/[\d.]+)?(?![\w[-])/g,
  )) {
    if (m[1]) names.add(m[1]);
  }
  return names;
}

/** Keine Farben: Größen, Richtungen, Stile – und Farben, die Tailwind selbst mitbringt. */
const NOT_A_THEME_COLOR =
  /^(width|xs|sm|base|lg|xl|\d?xl|left|right|center|start|end|justify|collapse|separate|solid|dashed|dotted|none|hidden|inset|b|t|l|r|x|y|s|e|offset|opacity|white|black|transparent|current|inherit|clip|ellipsis|wrap|nowrap|balance|pretty|(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+)$/;

const declared = new Set([...theme.matchAll(/(--[a-z0-9-]+)\s*:/g)].flatMap((m) => m[1] ?? []));
const utilities = new Set(
  [...theme.matchAll(/@utility\s+([a-z0-9-]+)/g)].flatMap((m) => (m[1] ? [m[1]] : [])),
);
const keyframes = new Set(
  [...theme.matchAll(/@keyframes\s+([a-z0-9-]+)/g)].flatMap((m) => (m[1] ? [m[1]] : [])),
);

/** Ein `ds`-Name ist im Thema, wenn es ihn als Variable, Utility oder Tailwind-Token gibt. */
function definesDs(name: string): boolean {
  return (
    utilities.has(name) ||
    ['--', '--color-', '--radius-', '--shadow-', '--ease-', '--animate-'].some((p) =>
      declared.has(`${p}${name}`),
    )
  );
}

const files = Object.entries(sources);
const code = files.map(([, s]) => codeOf(s)).join('\n');

describe('Thema avanti deckt die Bausteine ab', () => {
  it('liest die Bausteine (Plausibilität des Tests)', () => {
    expect(files.length).toBeGreaterThanOrEqual(17);
    expect(dsNamesOf(code)).toContain('ds-press');
    expect(dsNamesOf(code)).toContain('ds-frame');
    expect(variablesOf(code)).toContain('--ds-up');
    expect(colorNamesOf(code)).toContain('muted-foreground');
  });

  it('jede in src/ui benutzte ds-Klasse bzw. Variable ist im Thema definiert', () => {
    const missing = [...dsNamesOf(code)].filter((n) => !definesDs(n));
    expect(missing).toEqual([]);
    const missingVars = [...variablesOf(code)].filter((v) => !declared.has(v));
    expect(missingVars).toEqual([]);
  });

  it('jede Farbe aus einer Farb-Klasse ist ein Token des Themas', () => {
    const missing = [...colorNamesOf(code)].filter(
      (n) => !NOT_A_THEME_COLOR.test(n) && !declared.has(`--color-${n}`),
    );
    expect(missing).toEqual([]);
  });

  it('jede Animation des Themas hat ihre Keyframes', () => {
    const animations = [...theme.matchAll(/--animate-[a-z0-9-]+:\s*([a-z0-9-]+)\s/g)].flatMap(
      (m) => (m[1] ? [m[1]] : []),
    );
    expect(animations.length).toBeGreaterThan(0);
    expect(animations.filter((a) => !keyframes.has(a))).toEqual([]);
  });

  it('Hilfsklassen der Bausteine (Scrollleisten) stehen im Thema', () => {
    const helpers = new Set(
      [...code.matchAll(/\b(scrollbar-[a-z]+)\b/g)].flatMap((m) => m[1] ?? []),
    );
    expect(helpers.size).toBeGreaterThan(0);
    for (const h of helpers) expect(theme).toContain(`.${h} {`);
  });
});
