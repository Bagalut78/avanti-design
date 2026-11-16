import type { CSSProperties } from 'react';
import { Avatar } from '@/ui/avatar';
import { Badge, type BadgeTone } from '@/ui/badge';
import type { DataColumn } from '@/ui/data-table';
import { CellStack } from '@/ui/table';
import type { SampleAgent, SampleStatus } from './sampleData';

/** Spalten und Formate der Beispieltabelle auf der Musterseite. */

const de = (digits: number) =>
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits });
export const INT = de(0);
export const ONE = de(1);

export const STATUS_TONE: Record<SampleStatus, BadgeTone> = {
  'Im Plan': 'success',
  Verspätet: 'warning',
  Krank: 'danger',
  Urlaub: 'neutral',
};

/** Eintrittsversatz je Element einer Gruppe (Token `--ds-stagger`). */
export const stagger = (i: number): CSSProperties => ({
  animationDelay: `calc(var(--ds-stagger) * ${String(i)})`,
});

export const AGENT_COLUMNS: DataColumn<SampleAgent>[] = [
  {
    key: 'name',
    header: 'Mitarbeiter',
    primary: true,
    sortValue: (a) => a.name,
    cell: (a) => (
      <span className="flex items-center gap-2.5">
        <Avatar name={a.name} />
        <CellStack primary={a.name} secondary={a.team} />
      </span>
    ),
  },
  {
    key: 'skill',
    header: 'Skill',
    sortValue: (a) => a.skill,
    hideBelow: 'md',
    cell: (a) => a.skill,
  },
  {
    key: 'shift',
    header: 'Schicht heute',
    sortValue: (a) => (a.shift === '–' ? null : a.shift),
    hideBelow: 'sm',
    cell: (a) => <CellStack primary={a.shift} secondary={a.shiftNote} />,
  },
  {
    key: 'status',
    header: 'Status',
    sortValue: (a) => a.status,
    cell: (a) => <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>,
  },
  {
    key: 'adherence',
    header: 'Plantreue',
    align: 'right',
    hideBelow: 'lg',
    sortValue: (a) => (a.adherence > 0 ? a.adherence : null),
    cell: (a) => (a.adherence > 0 ? `${INT.format(a.adherence)} %` : '–'),
  },
  {
    key: 'hours',
    header: 'Stunden',
    align: 'right',
    hideBelow: 'md',
    sortValue: (a) => a.hours,
    cell: (a) => (
      <CellStack
        primary={`${ONE.format(a.hours)} h`}
        secondary={`von ${ONE.format(a.contract)} h`}
      />
    ),
  },
];
