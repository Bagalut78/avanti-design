import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import type { SortDirection } from '@/lib/table-logic';
import { cn } from '@/lib/cn';

/**
 * Tabellen-Bausteine der Designsprache 2 (Namen wie in der avanti suite). Dichte bleibt: Zeilen
 * 40 px, Köpfe 36 px, Text 13 px. Die Tabelle sitzt im weißen Kern einer Karte; sie scrollt in
 * sich, die Seite nie seitlich.
 */
export function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div data-slot="ds-table-container" className="relative w-full min-w-0 overflow-x-auto">
      <table
        data-slot="ds-table"
        className={cn('w-full border-collapse text-[13px] tabular-nums', className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="ds-table-header"
      className={cn('border-b border-ds-line bg-ds-core', className)}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="ds-table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="ds-table-row"
      className={cn(
        'border-b border-ds-line transition-colors duration-150 ease-ds-out hover:bg-ds-hover aria-selected:bg-ds-info-bg/50',
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, scope = 'col', ...props }: ComponentProps<'th'>) {
  return (
    <th
      data-slot="ds-table-head"
      scope={scope}
      className={cn(
        'h-9 px-3 text-left align-middle text-xs font-medium whitespace-nowrap text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

export interface SortableTableHeadProps extends Omit<ComponentProps<'th'>, 'onClick'> {
  /** Aktuelle Richtung dieser Spalte, `null` = nicht sortiert. */
  direction: SortDirection | null;
  onSort: () => void;
  children: ReactNode;
}

/** Sortierbarer Kopf: Knopf im Kopf (Tastatur: Tab, Enter/Leertaste), `aria-sort` am `th`. */
export function SortableTableHead({
  direction,
  onSort,
  children,
  className,
  ...props
}: SortableTableHeadProps) {
  const Icon = direction === 'asc' ? ArrowUp : direction === 'desc' ? ArrowDown : ChevronsUpDown;
  return (
    <TableHead
      aria-sort={direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'}
      className={cn('px-1.5', className)}
      {...props}
    >
      <button
        type="button"
        onClick={onSort}
        className={cn(
          'inline-flex h-7 items-center gap-1 rounded-[6px] px-1.5 outline-none transition-colors hover:bg-ds-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40',
          direction && 'text-foreground',
        )}
      >
        {children}
        <Icon
          className={cn('size-3.5', direction ? 'opacity-100' : 'opacity-50')}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </button>
    </TableHead>
  );
}

export function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      data-slot="ds-table-cell"
      className={cn('h-10 px-3 py-1 align-middle whitespace-nowrap', className)}
      {...props}
    />
  );
}

/** Zweizeilige Zelle: oben der Wert, darunter gedämpft der Kontext – passt in 40 px. */
export function CellStack({
  primary,
  secondary,
  className,
}: {
  primary: ReactNode;
  secondary?: ReactNode;
  className?: string;
}) {
  return (
    <span data-slot="ds-cell-stack" className={cn('flex min-w-0 flex-col', className)}>
      <span className="truncate text-[13px] leading-4 text-foreground">{primary}</span>
      {secondary !== undefined && secondary !== null && (
        <span className="truncate text-[11px] leading-[14px] text-muted-foreground">
          {secondary}
        </span>
      )}
    </span>
  );
}

/** Leere Tabelle: eine Zeile über alle Spalten mit dem leeren Zustand. */
export function TableEmpty({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr data-slot="ds-table-empty">
      <td colSpan={colSpan} className="p-0">
        {children}
      </td>
    </tr>
  );
}
