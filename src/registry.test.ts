import { describe, expect, it } from 'vitest';
import registry from '../registry.json';

/**
 * Prüft registry.json gegen das Schema von shadcn (https://ui.shadcn.com/schema/registry.json)
 * und gegen den Code: Jede Datei gehört zu genau einem Eintrag, und jeder Import einer Datei ist
 * als Paket oder als Eintrag dieser Registry angegeben.
 */

const ADDRESS = 'Bagalut78/avanti-design/';

const sources = import.meta.glob<string>(
  ['./ui/*.ts', './ui/*.tsx', './lib/*.ts', '../themes/*.css', '!./**/*.test.*'],
  { query: '?raw', import: 'default', eager: true },
);

/** Pfad wie in registry.json (vom Wurzelverzeichnis aus). */
const repoPath = (globKey: string) => globKey.replace(/^\.\.\//, '').replace(/^\.\//, 'src/');
const files = new Map(Object.entries(sources).map(([k, v]) => [repoPath(k), v]));

interface RegistryFile {
  path: string;
  type: string;
  target?: string;
}
interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
}

const items = registry.items as RegistryItem[];
const byName = new Map(items.map((i) => [i.name, i]));
const itemOfFile = new Map(items.flatMap((i) => i.files.map((f) => [f.path, i] as const)));

const ITEM_TYPES = new Set([
  'registry:lib',
  'registry:block',
  'registry:component',
  'registry:ui',
  'registry:hook',
  'registry:theme',
  'registry:style',
  'registry:item',
  'registry:file',
  'registry:page',
]);

/** Importierte Module einer Datei (ohne reine Typ-Importe von React). */
const importsOf = (code: string) =>
  [...code.matchAll(/^import\s[\s\S]*?\sfrom\s'([^']+)';?$/gm)].flatMap((m) => m[1] ?? []);

/** Paketname eines Imports: `motion/react` → `motion`, `@scope/pkg/x` → `@scope/pkg`. */
const packageOf = (spec: string) =>
  spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : (spec.split('/')[0] ?? spec);

describe('registry.json', () => {
  it('folgt dem Schema: Wurzel und Einträge mit Pflichtfeldern, eindeutige Namen', () => {
    expect(registry.$schema).toBe('https://ui.shadcn.com/schema/registry.json');
    expect(registry.name).toBe('avanti-design');
    expect(registry.homepage).toMatch(/^https:\/\//);
    expect(new Set(items.map((i) => i.name)).size).toBe(items.length);
    for (const item of items) {
      expect(item.name).toMatch(/^[a-z][a-z0-9-]*$/);
      expect(ITEM_TYPES.has(item.type), item.name).toBe(true);
      expect(item.title, item.name).toBeTruthy();
      expect(item.description, item.name).toBeTruthy();
      expect(item.files.length, item.name).toBeGreaterThan(0);
      for (const f of item.files) {
        expect(ITEM_TYPES.has(f.type), f.path).toBe(true);
        if (f.type === 'registry:file' || f.type === 'registry:page')
          expect(f.target, f.path).toBeTruthy();
      }
    }
  });

  it('jede Datei eines Eintrags existiert', () => {
    for (const item of items)
      for (const f of item.files) expect(files.has(f.path), `${item.name}: ${f.path}`).toBe(true);
  });

  it('je Baustein und je Helfer ein Eintrag, dazu das Thema', () => {
    const covered = [...files.keys()].filter((p) => p !== 'src/lib/index.ts');
    expect(covered.filter((p) => !itemOfFile.has(p))).toEqual([]);
    expect(byName.get('avanti-theme')?.files[0]?.path).toBe('themes/avanti.css');
    for (const name of ['side-sheet', 'app-shell', 'sidebar', 'data-table', 'kpi-tile', 'chip'])
      expect(byName.has(name), name).toBe(true);
  });

  it('keine zwei Dateien mit gleichem Namen (shadcn löst Importe über den Dateinamen auf)', () => {
    const names = items.flatMap((i) =>
      i.files.map((f) => f.path.slice(f.path.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '')),
    );
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
  });

  it('Abhängigkeiten untereinander zeigen auf Einträge dieser Registry', () => {
    for (const item of items)
      for (const dep of item.registryDependencies ?? []) {
        expect(dep.startsWith(ADDRESS), `${item.name}: ${dep}`).toBe(true);
        expect(byName.has(dep.slice(ADDRESS.length)), `${item.name}: ${dep}`).toBe(true);
      }
  });

  it('jeder Import ist als Paket oder als Eintrag angegeben', () => {
    const problems: string[] = [];
    for (const item of items) {
      const deps = new Set(item.dependencies ?? []);
      const regDeps = new Set(
        (item.registryDependencies ?? []).map((d) => d.slice(ADDRESS.length)),
      );
      for (const f of item.files) {
        if (!f.path.endsWith('.ts') && !f.path.endsWith('.tsx')) continue;
        for (const spec of importsOf(files.get(f.path) ?? '')) {
          if (spec === 'react') continue;
          let target: string | undefined;
          if (spec.startsWith('./')) {
            const base = `${f.path.slice(0, f.path.lastIndexOf('/'))}/${spec.slice(2)}`;
            target = itemOfFile.get(`${base}.ts`)?.name ?? itemOfFile.get(`${base}.tsx`)?.name;
          } else if (spec.startsWith('@/')) {
            target = itemOfFile.get(`src/${spec.slice(2)}.ts`)?.name;
            target ??= itemOfFile.get(`src/${spec.slice(2)}.tsx`)?.name;
          } else {
            if (!deps.has(packageOf(spec))) problems.push(`${item.name}: Paket ${spec}`);
            continue;
          }
          if (!target) problems.push(`${item.name}: ${spec} gehört zu keinem Eintrag`);
          else if (target !== item.name && !regDeps.has(target))
            problems.push(`${item.name}: ${spec} → ${target} fehlt in registryDependencies`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('das Thema nennt die Schriften, die es lädt, als Abhängigkeit', () => {
    const theme = files.get('themes/avanti.css') ?? '';
    const fonts = [...theme.matchAll(/@import '(@fontsource[^']+)'/g)].flatMap((m) =>
      m[1] ? [packageOf(m[1])] : [],
    );
    expect(fonts.length).toBeGreaterThan(0);
    for (const f of fonts) expect(byName.get('avanti-theme')?.dependencies).toContain(f);
  });
});
