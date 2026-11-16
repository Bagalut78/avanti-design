/**
 * Suchen, Filtern, Sortieren und Blättern der Datentabelle der Designsprache 2.
 * Rein funktional und generisch; die Tabelle in src/ui zeigt nur an.
 */

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  readonly key: string;
  readonly direction: SortDirection;
}

/** Sortierwert einer Zelle: Zahl oder Text; `null` sortiert immer ans Ende. */
export type SortValue = number | string | null;

const collator = new Intl.Collator('de', { numeric: true, sensitivity: 'base' });

/** Normalisiert Suchtext: klein, ohne Akzente, Leerraum zusammengefasst. */
export function normalizeSearch(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Zeilen, deren Suchtext alle Wörter der Suche enthält (Reihenfolge egal). Leere Suche: alle.
 */
export function searchRows<T>(rows: readonly T[], query: string, textOf: (row: T) => string): T[] {
  const words = normalizeSearch(query).split(' ').filter(Boolean);
  if (words.length === 0) return [...rows];
  return rows.filter((row) => {
    const text = normalizeSearch(textOf(row));
    return words.every((w) => text.includes(w));
  });
}

/**
 * Filter-Chips: Je Gruppe gilt „eins der gewählten“, über Gruppen hinweg „alle“. Eine Gruppe ohne
 * Auswahl filtert nicht.
 */
export function filterRows<T>(
  rows: readonly T[],
  selected: ReadonlyMap<string, ReadonlySet<string>>,
  valueOf: (row: T, group: string) => string,
): T[] {
  const active = [...selected].filter(([, values]) => values.size > 0);
  if (active.length === 0) return [...rows];
  return rows.filter((row) => active.every(([group, values]) => values.has(valueOf(row, group))));
}

/** Schaltet einen Wert einer Filtergruppe um (neue Map, Eingabe bleibt unverändert). */
export function toggleFilter(
  selected: ReadonlyMap<string, ReadonlySet<string>>,
  group: string,
  value: string,
): Map<string, Set<string>> {
  const next = new Map([...selected].map(([g, v]) => [g, new Set(v)]));
  const values = next.get(group) ?? new Set<string>();
  if (values.has(value)) values.delete(value);
  else values.add(value);
  next.set(group, values);
  return next;
}

function compare(a: SortValue, b: SortValue): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return collator.compare(String(a), String(b));
}

/**
 * Sortiert stabil nach einer Spalte. Leere Werte stehen in beiden Richtungen am Ende. Ohne
 * Sortierung bleibt die Reihenfolge.
 */
export function sortRows<T>(
  rows: readonly T[],
  sort: SortState | null,
  valueOf: (row: T, key: string) => SortValue,
): T[] {
  if (!sort) return [...rows];
  const sign = sort.direction === 'asc' ? 1 : -1;
  return rows
    .map((row, index) => ({ row, index, value: valueOf(row, sort.key) }))
    .sort((a, b) => {
      if (a.value === null || b.value === null)
        return compare(a.value, b.value) || a.index - b.index;
      return sign * compare(a.value, b.value) || a.index - b.index;
    })
    .map((x) => x.row);
}

/** Nächste Sortierung beim Klick auf einen Kopf: aufsteigend → absteigend → aus. */
export function nextSort(current: SortState | null, key: string): SortState | null {
  if (current?.key !== key) return { key, direction: 'asc' };
  return current.direction === 'asc' ? { key, direction: 'desc' } : null;
}

export interface Page<T> {
  readonly rows: T[];
  /** 1-basiert, auf den gültigen Bereich begrenzt. */
  readonly page: number;
  readonly pageCount: number;
  /** 1-basierte Position der ersten und letzten Zeile (0, 0 ohne Zeilen). */
  readonly from: number;
  readonly to: number;
  readonly total: number;
}

/** Eine Seite der Zeilen; die Seitenzahl wird in den gültigen Bereich gezogen. */
export function pageOf<T>(rows: readonly T[], page: number, pageSize: number): Page<T> {
  const size = Math.max(1, Math.floor(pageSize));
  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(pageCount, Math.max(1, Math.floor(page)));
  const start = (current - 1) * size;
  const slice = rows.slice(start, start + size);
  return {
    rows: slice,
    page: current,
    pageCount,
    from: slice.length > 0 ? start + 1 : 0,
    to: start + slice.length,
    total: rows.length,
  };
}

/**
 * Initialen für den Avatar: erster Buchstabe des ersten und des letzten Worts, groß; ein Wort:
 * die ersten zwei Buchstaben. Leer: „?“.
 */
export function initialsOf(name: string): string {
  const words = name
    .trim()
    .split(/[\s,]+/)
    .filter((w) => /\p{L}/u.test(w));
  const letters = (w: string) => w.match(/\p{L}/gu) ?? [];
  const first = words[0];
  const last = words[words.length - 1];
  if (!first || !last) return '?';
  if (words.length === 1) {
    return letters(first).slice(0, 2).join('').toUpperCase();
  }
  return ((letters(first)[0] ?? '') + (letters(last)[0] ?? '')).toUpperCase();
}

/** Stabiler Farbindex 0…n−1 aus einem Text (für Avatar-Töne). */
export function hueIndexOf(text: string, n: number): number {
  let h = 0;
  for (const c of text) h = (h * 31 + (c.codePointAt(0) ?? 0)) >>> 0;
  return n > 0 ? h % n : 0;
}
