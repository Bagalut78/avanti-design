import { ChevronLeft, ChevronRight, Search, SearchX, X, type LucideIcon } from 'lucide-react';
import { useId, useMemo, useState, type MouseEvent, type ReactNode } from 'react';
import {
  filterRows,
  nextSort,
  pageOf,
  searchRows,
  sortRows,
  toggleFilter,
  type SortState,
  type SortValue,
} from '@/lib/table';
import { cn } from '@/lib/cn';
import { Chip } from './chip';
import { EmptyState } from './empty-state';
import { Skeleton } from './skeleton';
import {
  SortableTableHead,
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

export interface DataColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Mit Sortierwert ist der Kopf sortierbar. */
  sortValue?: (row: T) => SortValue;
  align?: 'left' | 'right';
  /** Die Spalte, die das Objekt benennt: wird mit `onOpenRow` zum Knopf. */
  primary?: boolean;
  /** Unter dieser Breite ausgeblendet (schmale Fenster). */
  hideBelow?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface DataFilter<T> {
  key: string;
  label: string;
  options: readonly { value: string; label: string }[];
  valueOf: (row: T) => string;
}

export interface DataTableProps<T> {
  rows: readonly T[];
  columns: readonly DataColumn<T>[];
  rowKey: (row: T) => string;
  /** Name der Tabelle für Vorleser. */
  label: string;
  search?: { placeholder: string; textOf: (row: T) => string };
  filters?: readonly DataFilter<T>[];
  /** Aktionen am Ende jeder Zeile (Knöpfe mit Beschriftung oder `aria-label`). */
  actions?: (row: T) => ReactNode;
  /** Öffnet eine Zeile (z. B. im Blatt). Die benennende Spalte wird ein Knopf; Klick auf die Zeile auch. */
  onOpenRow?: (row: T) => void;
  /** Hervorgehobene Zeile (geöffnet im Blatt). */
  selectedKey?: string | null;
  loading?: boolean;
  empty: { title?: string; message: string; action?: ReactNode; icon?: LucideIcon };
  pageSize?: number;
  pageSizes?: readonly number[];
  /** Rechts in der Werkzeugzeile (z. B. eine Aktion). */
  toolbarEnd?: ReactNode;
  /** Bezeichnung der Zeilen im Zähler, z. B. „Personen“. */
  noun?: string;
}

const HIDE: Record<NonNullable<DataColumn<unknown>['hideBelow']>, string> = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
};

/** Ist das Klickziel ein eigenes Bedienelement in der Zeile? Dann öffnet die Zeile nicht. */
const fromControl = (e: MouseEvent) =>
  e.target instanceof Element && e.target.closest('button, a, input, select, textarea, label');

/** Seitenzahlen um die aktuelle Seite (höchstens fünf). */
function pageWindow(page: number, count: number): number[] {
  const start = Math.max(1, Math.min(page - 2, count - 4));
  return Array.from({ length: Math.min(5, count) }, (_, i) => start + i);
}

/**
 * Datentabelle der Designsprache 2: Suche, Filter-Chips, sortierbare Köpfe, zweizeilige Zellen
 * (`CellStack`), Aktionen in der Zeile, Blättern, Lade- und Leerzustand. Die Logik (suchen,
 * filtern, sortieren, blättern) liegt rein funktional in src/lib/table.ts.
 */
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  label,
  search,
  filters = [],
  actions,
  onOpenRow,
  selectedKey = null,
  loading = false,
  empty,
  pageSize: initialSize = 10,
  pageSizes = [5, 10, 20],
  toolbarEnd,
  noun = 'Einträge',
}: DataTableProps<T>) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<ReadonlyMap<string, ReadonlySet<string>>>(new Map());
  const [sort, setSort] = useState<SortState | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(initialSize);

  const filtered = useMemo(() => {
    const searched = search ? searchRows(rows, query, search.textOf) : [...rows];
    return filterRows(
      searched,
      selected,
      (row, group) => filters.find((f) => f.key === group)?.valueOf(row) ?? '',
    );
  }, [rows, query, search, selected, filters]);
  const sorted = useMemo(
    () =>
      sortRows(
        filtered,
        sort,
        (row, key) => columns.find((c) => c.key === key)?.sortValue?.(row) ?? null,
      ),
    [filtered, sort, columns],
  );
  const current = pageOf(sorted, page, size);
  const narrowed = query.trim() !== '' || [...selected.values()].some((v) => v.size > 0);
  const colSpan = columns.length + (actions ? 1 : 0);

  const reset = () => {
    setQuery('');
    setSelected(new Map());
    setPage(1);
  };

  const open = (row: T, e: MouseEvent<HTMLTableRowElement>) => {
    if (!onOpenRow || fromControl(e)) return;
    // Fokus auf den Knopf der Zeile, damit er nach dem Schließen dorthin zurückkehrt.
    e.currentTarget.querySelector<HTMLButtonElement>('[data-slot="ds-row-open"]')?.focus();
    onOpenRow(row);
  };

  return (
    <div data-slot="ds-data-table" className="flex min-w-0 flex-col">
      {(search !== undefined || filters.length > 0 || toolbarEnd !== undefined) && (
        <div className="flex flex-wrap items-center gap-2 border-b border-ds-line p-2">
          {search && (
            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label={`${label} durchsuchen`}
                placeholder={search.placeholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                className="h-8 w-full rounded-ds-control border border-input bg-ds-core pr-2 pl-8 text-[13px] outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>
          )}
          {filters.map((f) => (
            <div
              key={f.key}
              role="group"
              aria-labelledby={`${id}-${f.key}`}
              className="flex flex-wrap items-center gap-1.5"
            >
              <span id={`${id}-${f.key}`} className="text-xs text-muted-foreground">
                {f.label}
              </span>
              {f.options.map((o) => (
                <Chip
                  key={o.value}
                  selected={selected.get(f.key)?.has(o.value) ?? false}
                  onClick={() => {
                    setSelected((s) => toggleFilter(s, f.key, o.value));
                    setPage(1);
                  }}
                >
                  {o.label}
                </Chip>
              ))}
            </div>
          ))}
          {narrowed && (
            <button
              type="button"
              onClick={reset}
              className="ds-press inline-flex h-8 items-center gap-1 rounded-ds-control px-2 text-[13px] text-muted-foreground outline-none hover:bg-ds-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <X className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
              Zurücksetzen
            </button>
          )}
          {toolbarEnd && <div className="ml-auto flex items-center gap-2">{toolbarEnd}</div>}
        </div>
      )}

      <Table aria-label={label} aria-busy={loading || undefined}>
        <TableHeader>
          <tr>
            {columns.map((c) => {
              const cls = cn(c.align === 'right' && 'text-right', c.hideBelow && HIDE[c.hideBelow]);
              return c.sortValue ? (
                <SortableTableHead
                  key={c.key}
                  className={cls}
                  direction={sort?.key === c.key ? sort.direction : null}
                  onSort={() => {
                    setSort((s) => nextSort(s, c.key));
                  }}
                >
                  {c.header}
                </SortableTableHead>
              ) : (
                <TableHead key={c.key} className={cls}>
                  {c.header}
                </TableHead>
              );
            })}
            {actions && (
              <TableHead className="w-px text-right">
                <span className="sr-only">Aktionen</span>
              </TableHead>
            )}
          </tr>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: Math.min(size, 5) }, (_, i) => (
              <TableRow key={`loading-${String(i)}`} className="hover:bg-transparent">
                <TableCell colSpan={colSpan}>
                  <Skeleton label={i === 0 ? 'Tabelle wird geladen …' : ''} />
                </TableCell>
              </TableRow>
            ))
          ) : current.rows.length === 0 ? (
            <TableEmpty colSpan={colSpan}>
              {narrowed ? (
                <EmptyState
                  compact
                  icon={SearchX}
                  title="Keine Treffer"
                  message="Zu Suche und Filtern passt nichts."
                  action={
                    <button
                      type="button"
                      onClick={reset}
                      className="ds-press h-8 rounded-ds-control border border-ds-line-strong bg-ds-core px-3 text-[13px] font-medium outline-none hover:bg-ds-hover focus-visible:ring-2 focus-visible:ring-ring/40"
                    >
                      Suche und Filter zurücksetzen
                    </button>
                  }
                />
              ) : (
                <EmptyState compact {...empty} />
              )}
            </TableEmpty>
          ) : (
            current.rows.map((row) => {
              const key = rowKey(row);
              return (
                <TableRow
                  key={key}
                  aria-selected={selectedKey === key || undefined}
                  className={cn(onOpenRow && 'cursor-pointer')}
                  onClick={(e) => {
                    open(row, e);
                  }}
                >
                  {columns.map((c) => (
                    <TableCell
                      key={c.key}
                      className={cn(
                        c.align === 'right' && 'text-right',
                        c.hideBelow && HIDE[c.hideBelow],
                        c.className,
                      )}
                    >
                      {c.primary && onOpenRow ? (
                        <button
                          type="button"
                          data-slot="ds-row-open"
                          onClick={() => {
                            onOpenRow(row);
                          }}
                          className="-mx-1 block max-w-full rounded-[6px] px-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                        >
                          {c.cell(row)}
                        </button>
                      ) : (
                        c.cell(row)
                      )}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="w-px text-right">
                      <div className="flex items-center justify-end gap-1">{actions(row)}</div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {!loading && current.total > 0 && (
        <nav
          aria-label={`${label}: Seiten`}
          className="flex flex-wrap items-center justify-between gap-2 border-t border-ds-line px-3 py-1.5 text-[13px] text-muted-foreground"
        >
          <label className="flex items-center gap-2">
            Zeilen je Seite
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(1);
              }}
              className="h-7 rounded-[6px] border border-input bg-ds-core px-1.5 text-[13px] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              {pageSizes.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-1">
            <span className="mr-2 tabular-nums" aria-live="polite">
              {current.from}–{current.to} von {current.total} {noun}
            </span>
            <PageButton
              label="Vorherige Seite"
              disabled={current.page <= 1}
              onClick={() => {
                setPage(current.page - 1);
              }}
            >
              <ChevronLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </PageButton>
            {pageWindow(current.page, current.pageCount).map((n) => (
              <PageButton
                key={n}
                label={`Seite ${String(n)}`}
                current={n === current.page}
                onClick={() => {
                  setPage(n);
                }}
                className="hidden sm:inline-flex"
              >
                {n}
              </PageButton>
            ))}
            <PageButton
              label="Nächste Seite"
              disabled={current.page >= current.pageCount}
              onClick={() => {
                setPage(current.page + 1);
              }}
            >
              <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </PageButton>
          </div>
        </nav>
      )}
    </div>
  );
}

function PageButton({
  label,
  current = false,
  disabled = false,
  onClick,
  className,
  children,
}: {
  label: string;
  current?: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={current ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'ds-press inline-flex size-7 items-center justify-center rounded-[6px] text-[13px] tabular-nums outline-none hover:bg-ds-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-40',
        current && 'border border-ds-line bg-ds-core font-medium text-foreground shadow-ds-1',
        className,
      )}
    >
      {children}
    </button>
  );
}
