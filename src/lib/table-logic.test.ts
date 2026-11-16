import { describe, expect, it } from 'vitest';
import {
  filterRows,
  hueIndexOf,
  initialsOf,
  nextSort,
  normalizeSearch,
  pageOf,
  searchRows,
  sortRows,
  toggleFilter,
  type SortValue,
} from './table-logic';

interface Row {
  readonly name: string;
  readonly team: string;
  readonly hours: number | null;
}

const ROWS: Row[] = [
  { name: 'Jörg Brandt', team: 'Nord', hours: 30 },
  { name: 'Anna Ölmez', team: 'Süd', hours: 12 },
  { name: 'Ben Adler', team: 'Nord', hours: null },
  { name: 'anna Zeller', team: 'Süd', hours: 30 },
];

const valueOf = (r: Row, key: string): SortValue =>
  key === 'hours' ? r.hours : key === 'team' ? r.team : r.name;

describe('searchRows', () => {
  it('alle Wörter, ohne Groß/Klein und Akzente', () => {
    expect(normalizeSearch('  Jörg   BRANDT ')).toBe('jorg brandt');
    expect(searchRows(ROWS, 'joerg', (r) => r.name)).toEqual([]);
    expect(searchRows(ROWS, 'jorg', (r) => r.name).map((r) => r.name)).toEqual(['Jörg Brandt']);
    expect(searchRows(ROWS, 'anna süd', (r) => `${r.name} ${r.team}`)).toHaveLength(2);
    expect(searchRows(ROWS, '   ', (r) => r.name)).toHaveLength(4);
  });
});

describe('filterRows / toggleFilter', () => {
  it('je Gruppe eins der gewählten, Gruppen zusammen alle; leere Gruppe filtert nicht', () => {
    let sel = toggleFilter(new Map(), 'team', 'Süd');
    expect(filterRows(ROWS, sel, (r, g) => (g === 'team' ? r.team : '')).length).toBe(2);
    sel = toggleFilter(sel, 'team', 'Nord');
    expect(filterRows(ROWS, sel, (r) => r.team)).toHaveLength(4);
    sel = toggleFilter(toggleFilter(sel, 'team', 'Nord'), 'team', 'Süd');
    expect(sel.get('team')?.size).toBe(0);
    expect(filterRows(ROWS, sel, (r) => r.team)).toHaveLength(4);
  });

  it('ändert die Eingabe nicht', () => {
    const before = new Map([['team', new Set(['Nord'])]]);
    toggleFilter(before, 'team', 'Süd');
    expect([...(before.get('team') ?? [])]).toEqual(['Nord']);
  });
});

describe('sortRows / nextSort', () => {
  it('Text nach deutscher Sortierung, Zahlen numerisch, leere Werte immer am Ende, stabil', () => {
    const asc = sortRows(ROWS, { key: 'name', direction: 'asc' }, valueOf).map((r) => r.name);
    expect(asc).toEqual(['Anna Ölmez', 'anna Zeller', 'Ben Adler', 'Jörg Brandt']);
    const hoursAsc = sortRows(ROWS, { key: 'hours', direction: 'asc' }, valueOf);
    expect(hoursAsc.map((r) => r.hours)).toEqual([12, 30, 30, null]);
    // stabil: gleiche Werte behalten ihre Reihenfolge
    expect(hoursAsc.slice(1, 3).map((r) => r.name)).toEqual(['Jörg Brandt', 'anna Zeller']);
    const hoursDesc = sortRows(ROWS, { key: 'hours', direction: 'desc' }, valueOf);
    expect(hoursDesc.map((r) => r.hours)).toEqual([30, 30, 12, null]);
    expect(sortRows(ROWS, null, valueOf)).toEqual(ROWS);
  });

  it('Klickfolge aufsteigend → absteigend → aus; anderer Kopf beginnt aufsteigend', () => {
    const a = nextSort(null, 'name');
    expect(a).toEqual({ key: 'name', direction: 'asc' });
    const b = nextSort(a, 'name');
    expect(b).toEqual({ key: 'name', direction: 'desc' });
    expect(nextSort(b, 'name')).toBeNull();
    expect(nextSort(b, 'hours')).toEqual({ key: 'hours', direction: 'asc' });
  });
});

describe('pageOf', () => {
  const rows = Array.from({ length: 23 }, (_, i) => i);

  it('Seiten, Bereich und Grenzen', () => {
    const p1 = pageOf(rows, 1, 10);
    expect(p1).toMatchObject({ page: 1, pageCount: 3, from: 1, to: 10, total: 23 });
    const p3 = pageOf(rows, 3, 10);
    expect(p3.rows).toEqual([20, 21, 22]);
    expect(p3).toMatchObject({ from: 21, to: 23 });
    expect(pageOf(rows, 9, 10).page).toBe(3);
    expect(pageOf(rows, 0, 10).page).toBe(1);
  });

  it('ohne Zeilen eine leere Seite', () => {
    expect(pageOf([], 1, 10)).toEqual({
      rows: [],
      page: 1,
      pageCount: 1,
      from: 0,
      to: 0,
      total: 0,
    });
  });

  it('alle Seiten zusammen ergeben genau die Zeilen', () => {
    const { pageCount } = pageOf(rows, 1, 7);
    const all = Array.from({ length: pageCount }, (_, i) => pageOf(rows, i + 1, 7).rows).flat();
    expect(all).toEqual(rows);
  });
});

describe('initialsOf / hueIndexOf', () => {
  it('erster und letzter Name, ein Wort zwei Buchstaben, leer ?', () => {
    expect(initialsOf('Anna Maria Ölmez')).toBe('AÖ');
    expect(initialsOf('Brandt, Jörg')).toBe('BJ');
    expect(initialsOf('admin')).toBe('AD');
    expect(initialsOf('  ')).toBe('?');
    expect(initialsOf('(extern) Ben')).toBe('EB');
  });

  it('stabil und im Bereich', () => {
    expect(hueIndexOf('Anna', 5)).toBe(hueIndexOf('Anna', 5));
    for (const t of ['a', 'Ben', 'Jörg Brandt', '']) {
      const i = hueIndexOf(t, 5);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(5);
    }
  });
});
