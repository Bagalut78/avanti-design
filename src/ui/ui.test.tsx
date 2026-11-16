import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { Calendar, Inbox, LayoutDashboard, Users } from 'lucide-react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { arcPath, linePath } from '@/lib/charts';
import { AppShell } from './app-shell';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { Button } from './button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
} from './card';
import { Chip } from './chip';
import { DataTable, type DataColumn } from './data-table';
import { EmptyState } from './empty-state';
import { KpiTile } from './kpi-tile';
import { AreaChart, Gauge, Sparkline } from './mini-charts';
import type { NavGroup } from './nav-types';
import { PageHeader } from './page-header';
import { Segmented } from './segmented';
import { SideSheet, SideSheetRow } from './side-sheet';
import { Sidebar } from './sidebar';
import { Skeleton } from './skeleton';
import { CellStack } from './table';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

/** Simuliert die Systemeinstellung „weniger Bewegung“. */
function reduceMotion() {
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: query.includes('reduce'),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  );
}

describe('Badge', () => {
  it('getönt mit Linie, Aliase der Suite', () => {
    render(
      <>
        <Badge tone="success">Genehmigt</Badge>
        <Badge tone="danger">Abgelehnt</Badge>
        <Badge tone="neutral">Offen</Badge>
        <Badge>Info</Badge>
      </>,
    );
    const ok = screen.getByText('Genehmigt');
    expect(ok.dataset.tone).toBe('success');
    expect(ok.className).toContain('border');
    expect(ok.className).toContain('bg-ds-success-bg');
    expect(screen.getByText('Abgelehnt').dataset.tone).toBe('destructive');
    expect(screen.getByText('Offen').dataset.tone).toBe('muted');
    expect(screen.getByText('Info').dataset.tone).toBe('default');
  });
});

describe('Button', () => {
  it('Varianten der Suite, type="button", Druck ohne transition-all, sichtbarer Fokus', () => {
    const onClick = vi.fn();
    render(
      <>
        <Button onClick={onClick}>Speichern</Button>
        <Button variant="outline" size="sm">
          Abbrechen
        </Button>
        <Button asChild variant="link">
          <a href="/ziel">Weiter</a>
        </Button>
      </>,
    );
    const save = screen.getByRole('button', { name: 'Speichern' });
    expect(save.getAttribute('type')).toBe('button');
    expect(save.dataset.variant).toBe('default');
    expect(save.className).toContain('ds-press');
    expect(save.className).not.toContain('transition-all');
    expect(save.className).toContain('focus-visible:ring-2');
    fireEvent.click(save);
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: 'Abbrechen' }).className).toContain('h-8');
    const link = screen.getByRole('link', { name: 'Weiter' });
    expect(link.getAttribute('href')).toBe('/ziel');
    expect(link.hasAttribute('type')).toBe(false);
  });
});

describe('Avatar', () => {
  it('Initialen, dekorativ, stabiler Ton', () => {
    const { container } = render(
      <>
        <Avatar name="Anna Ölmez" />
        <Avatar name="Anna Ölmez" />
      </>,
    );
    const [a, b] = container.querySelectorAll<HTMLElement>('[data-slot="ds-avatar"]');
    expect(a?.textContent).toBe('AÖ');
    expect(a?.getAttribute('aria-hidden')).toBe('true');
    expect(a?.className).toBe(b?.className);
    expect(container.querySelector('img')).toBeNull();
  });
});

describe('Chip', () => {
  it('Umschalter mit aria-pressed und Häkchen, fokussierbar', () => {
    function Demo() {
      const [on, setOn] = useState(false);
      return (
        <Chip
          selected={on}
          onClick={() => {
            setOn(!on);
          }}
        >
          Nord
        </Chip>
      );
    }
    render(<Demo />);
    const chip = screen.getByRole('button', { name: 'Nord' });
    expect(chip.getAttribute('aria-pressed')).toBe('false');
    expect(chip.className).toContain('focus-visible:ring-2');
    expect(chip.className).toContain('ds-press');
    const check = chip.querySelector('[data-slot="ds-chip-check"]');
    expect(check).not.toBeNull();
    expect(check?.getAttribute('class')).toContain('opacity-0');
    // Maß und Abstände hängen nicht vom Zustand ab: nur Farbe und Häkchen wechseln.
    const sizing = (el: Element) =>
      el.className.split(' ').filter((c) => /^(h-|px-|pl-|pr-|gap-|text-\[|font-|border$)/.test(c));
    const before = sizing(chip);
    fireEvent.click(chip);
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    expect(check?.getAttribute('class')).toContain('opacity-100');
    expect(check?.getAttribute('class')).toContain('absolute');
    expect(sizing(chip)).toEqual(before);
  });
});

describe('Chip – Regel 12', () => {
  it('behält beim Umschalten Größe und Textposition', () => {
    function Demo() {
      const [on, setOn] = useState(false);
      return (
        <Chip
          selected={on}
          onClick={() => {
            setOn(!on);
          }}
        >
          Süd
        </Chip>
      );
    }
    render(<Demo />);
    const chip = screen.getByRole('button', { name: 'Süd' });
    const check = chip.querySelector('[data-slot="ds-chip-check"]');
    const layout = (el: Element) =>
      el.className
        .split(' ')
        .filter((c) =>
          /^(h-|w-|min-|max-|p[xylr]?-|gap-|text-\[|leading-|font-|border$|justify-)/.test(c),
        )
        .sort();
    const before = { chip: layout(chip), text: chip.lastChild?.textContent };
    // Gleicher Abstand links und rechts, das Häkchen liegt außerhalb des Flusses.
    expect(before.chip).toContain('px-5');
    expect(before.chip.some((c) => /^p[lr]-/.test(c))).toBe(false);
    expect(check?.getAttribute('class')).toContain('absolute');
    for (const state of ['true', 'false']) {
      fireEvent.click(chip);
      expect(chip.getAttribute('aria-pressed')).toBe(state);
      // Häkchen ist in beiden Zuständen da und blendet nur über die Deckkraft.
      expect(chip.querySelector('[data-slot="ds-chip-check"]')).toBe(check);
      expect(check?.getAttribute('class')).toContain('transition-opacity');
      expect(layout(chip)).toEqual(before.chip);
      expect(chip.lastChild?.textContent).toBe(before.text);
    }
  });
});

describe('Card', () => {
  it('Aufbau: Kopf mit Titel, Unterzeile und Steuerung, weißer Kern, Fußzeile', () => {
    render(
      <Card>
        <CardHeader>
          <CardHeading>
            <CardTitle>Deckung</CardTitle>
            <CardDescription>Bedarf gegen Besetzung</CardDescription>
          </CardHeading>
          <CardAction>
            <button type="button">Woche</button>
          </CardAction>
        </CardHeader>
        <CardContent>Inhalt</CardContent>
        <CardFooter>Stand heute</CardFooter>
      </Card>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Deckung' })).toBeTruthy();
    const card = screen.getByText('Inhalt').closest('[data-slot="ds-card"]');
    expect(card?.className).toContain('bg-ds-frame');
    expect(card?.className).toContain('shadow-ds-1');
    expect(screen.getByText('Inhalt').className).toContain('bg-ds-core');
    expect(screen.getByText('Stand heute').dataset.slot).toBe('ds-card-footer');
  });
});

describe('PageHeader', () => {
  it('genau eine h1, Pfad, Unterzeile, Badge und Aktionen', () => {
    render(
      <PageHeader
        title="Rückblick"
        subtitle="Was geplant war und was kam"
        path={['Planung', 'Bedarf']}
        badge={<Badge tone="neutral">Woche 46</Badge>}
        actions={<button type="button">Exportieren</button>}
      />,
    );
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const path = screen.getByRole('navigation', { name: 'Pfad' });
    expect(
      within(path)
        .getAllByRole('listitem')
        .map((li) => li.textContent),
    ).toEqual(['Planung', 'Bedarf']);
    expect(screen.getByText('Woche 46')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Exportieren' })).toBeTruthy();
  });
});

describe('KpiTile', () => {
  it('Endwert, Veränderung mit Vorzeichen und Bewertung für Vorleser', () => {
    render(
      <KpiTile
        label="Service Level"
        value={82}
        previous={78}
        format={(n) => `${String(Math.round(n))} %`}
        formatChange={(n) => `${String(Math.round(n))} Pp.`}
        comparison="ggü. Vorwoche"
        trend={[70, 75, 78, 82]}
      />,
    );
    expect(
      screen.getByText('Service Level: 82 %; +4 Pp. ggü. Vorwoche, besser').className,
    ).toContain('sr-only');
    const change = document.querySelector<HTMLElement>('[data-slot="ds-kpi-change"]');
    expect(change?.textContent).toBe('+4 Pp.');
    expect(change?.dataset.tone).toBe('success');
    expect(document.querySelector('[data-slot="ds-sparkline"]')).not.toBeNull();
  });

  it('schlechter in Richtung „down“, unverändert grau', () => {
    render(
      <>
        <KpiTile label="Wartezeit" value={40} previous={30} better="down" />
        <KpiTile label="Krankenquote" value={5} previous={5} />
      </>,
    );
    expect(screen.getByText('Wartezeit: 40; +10, schlechter')).toBeTruthy();
    expect(screen.getByText('Krankenquote: 5; 0, unverändert')).toBeTruthy();
    const tones = [...document.querySelectorAll<HTMLElement>('[data-slot="ds-kpi-change"]')].map(
      (e) => e.dataset.tone,
    );
    expect(tones).toEqual(['destructive', 'muted']);
  });

  it('zählt hoch bis zum Endwert', async () => {
    render(<KpiTile label="Anrufe" value={1234} />);
    const value = document.querySelector('[data-slot="ds-kpi-value"]');
    await waitFor(() => {
      expect(value?.textContent).toBe('1.234');
    });
  });

  it('bei weniger Bewegung sofort der Endwert', () => {
    reduceMotion();
    render(<KpiTile label="Anrufe" value={1234} />);
    expect(document.querySelector('[data-slot="ds-kpi-value"]')?.textContent).toBe('1.234');
  });
});

describe('Mini-Grafiken', () => {
  it('Verlaufslinie: Pfad aus den Werten, img mit Beschriftung', () => {
    render(<Sparkline values={[1, 3, 2]} label="Verlauf" width={100} height={40} />);
    const svg = screen.getByRole('img', { name: 'Verlauf' });
    expect(svg.querySelector('path')?.getAttribute('d')).toBe(
      linePath([1, 3, 2], { width: 100, height: 40, inset: 2 }),
    );
  });

  it('ohne Werte kein Pfad, aber beschriftet', () => {
    render(<Sparkline values={[]} label="Keine Daten" />);
    expect(screen.getByRole('img', { name: 'Keine Daten' }).querySelector('path')).toBeNull();
  });

  it('Fläche mit Verlauf: Linie, Fläche und Farbverlauf', () => {
    render(<AreaChart values={[4, 8, 6, 9]} label="Anrufe je Tag" ticks={['Mo', 'Di']} />);
    const svg = screen.getByRole('img', { name: 'Anrufe je Tag' });
    expect(svg.querySelector('linearGradient')).not.toBeNull();
    const fills = [...svg.querySelectorAll('path')].map((p) => p.getAttribute('fill'));
    expect(fills.some((f) => f?.startsWith('url(#'))).toBe(true);
    expect(fills).toContain('none');
  });

  it('Bogen: Spur und gefüllter Anteil', () => {
    render(<Gauge value={30} total={120} label="Anteil 25 %" center="25 %" size={200} />);
    const paths = screen.getByRole('img', { name: 'Anteil 25 %' }).querySelectorAll('path');
    expect(paths).toHaveLength(2);
    const stroke = Math.round(200 * 0.09);
    expect(paths[1]?.getAttribute('d')).toBe(arcPath(0.25, 100, 100, 100 - stroke / 2));
  });
});

describe('Skeleton und EmptyState', () => {
  it('Platzhalter: Status mit Vorlesetext, ohne Wiederholung', () => {
    render(<Skeleton lines={3} label="Lädt Kennzahlen" />);
    const status = screen.getByRole('status');
    expect(within(status).getByText('Lädt Kennzahlen')).toBeTruthy();
    expect(status.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
    expect(status.className).not.toContain('animate-pulse');
    expect(status.className).toContain('animate-ds-placeholder-in');
  });

  it('leerer Zustand: Titel, Satz, eine Aktion', () => {
    render(
      <EmptyState
        icon={Inbox}
        title="Keine Anträge"
        message="Gerade wartet nichts auf dich."
        action={<button type="button">Aktualisieren</button>}
      />,
    );
    expect(screen.getByText('Keine Anträge')).toBeTruthy();
    expect(screen.getByText('Gerade wartet nichts auf dich.')).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });
});

describe('Segmented', () => {
  function Demo({ onChange }: { onChange?: (v: string) => void }) {
    const [v, setV] = useState<'w' | 'm' | 'j'>('w');
    return (
      <Segmented
        label="Zeitraum"
        value={v}
        onValueChange={(next) => {
          setV(next);
          onChange?.(next);
        }}
        options={[
          { value: 'w', label: 'Woche' },
          { value: 'm', label: 'Monat' },
          { value: 'j', label: 'Jahr' },
        ]}
      />
    );
  }

  it('radiogroup: Klick wählt, nur das gewählte ist in der Tab-Reihenfolge', () => {
    render(<Demo />);
    const group = screen.getByRole('radiogroup', { name: 'Zeitraum' });
    const [w, m] = within(group).getAllByRole('radio');
    expect(w?.getAttribute('aria-checked')).toBe('true');
    expect(w?.tabIndex).toBe(0);
    expect(m?.tabIndex).toBe(-1);
    if (m) fireEvent.click(m);
    expect(m?.getAttribute('aria-checked')).toBe('true');
  });

  it('Pfeiltasten, Pos1 und Ende wählen und fokussieren; Marke springt ohne Übergang', () => {
    render(<Demo />);
    const radios = screen.getAllByRole('radio');
    radios[0]?.focus();
    fireEvent.keyDown(radios[0] as HTMLElement, { key: 'ArrowRight' });
    expect(radios[1]?.getAttribute('aria-checked')).toBe('true');
    expect(document.activeElement).toBe(radios[1]);
    expect(document.querySelector('[data-slot="ds-segmented-mark"]')?.className).toContain(
      'transition-none',
    );
    fireEvent.keyDown(radios[1] as HTMLElement, { key: 'End' });
    expect(radios[2]?.getAttribute('aria-checked')).toBe('true');
    fireEvent.keyDown(radios[2] as HTMLElement, { key: 'ArrowRight' });
    expect(radios[0]?.getAttribute('aria-checked')).toBe('true');
    fireEvent.keyDown(radios[0] as HTMLElement, { key: 'ArrowLeft' });
    expect(radios[2]?.getAttribute('aria-checked')).toBe('true');
    fireEvent.keyDown(radios[2] as HTMLElement, { key: 'Home' });
    expect(radios[0]?.getAttribute('aria-checked')).toBe('true');
  });

  it('bei Klick gleitet die Marke (ease-in-out)', () => {
    render(<Demo />);
    fireEvent.click(screen.getByRole('radio', { name: 'Jahr' }));
    expect(document.querySelector('[data-slot="ds-segmented-mark"]')?.className).toContain(
      'ease-ds-in-out',
    );
  });
});

interface Person {
  id: string;
  name: string;
  team: string;
  hours: number;
}

const PEOPLE: Person[] = Array.from({ length: 12 }, (_, i) => ({
  id: `p${String(i + 1)}`,
  name: `Person ${String.fromCharCode(76 - i)}`, // L, K, J, …
  team: i % 3 === 0 ? 'Nord' : 'Süd',
  hours: (i * 7) % 40,
}));

const COLUMNS: DataColumn<Person>[] = [
  {
    key: 'name',
    header: 'Name',
    primary: true,
    sortValue: (p) => p.name,
    cell: (p) => <CellStack primary={p.name} secondary={p.team} />,
  },
  {
    key: 'hours',
    header: 'Stunden',
    align: 'right',
    sortValue: (p) => p.hours,
    cell: (p) => p.hours,
  },
];

function renderTable(props: Partial<Parameters<typeof DataTable<Person>>[0]> = {}) {
  return render(
    <DataTable
      rows={PEOPLE}
      columns={COLUMNS}
      rowKey={(p) => p.id}
      label="Personen"
      noun="Personen"
      search={{ placeholder: 'Name suchen …', textOf: (p) => p.name }}
      filters={[
        {
          key: 'team',
          label: 'Team',
          options: [
            { value: 'Nord', label: 'Nord' },
            { value: 'Süd', label: 'Süd' },
          ],
          valueOf: (p) => p.team,
        },
      ]}
      empty={{ title: 'Noch keine Personen', message: 'Lege die erste Person an.' }}
      pageSize={5}
      {...props}
    />,
  );
}

const bodyNames = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map(
      (r) =>
        within(r).queryAllByRole('cell')[0]?.querySelector('[data-slot="ds-cell-stack"] span')
          ?.textContent,
    );

describe('DataTable', () => {
  it('blättert: Zähler, Seiten, vor und zurück', () => {
    renderTable();
    expect(screen.getByText('1–5 von 12 Personen')).toBeTruthy();
    expect(bodyNames()).toHaveLength(5);
    fireEvent.click(screen.getByRole('button', { name: 'Nächste Seite' }));
    expect(screen.getByText('6–10 von 12 Personen')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Seite 2' }).getAttribute('aria-current')).toBe(
      'page',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Seite 3' }));
    expect(bodyNames()).toHaveLength(2);
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Nächste Seite' }).disabled).toBe(
      true,
    );
    fireEvent.change(screen.getByLabelText('Zeilen je Seite'), { target: { value: '20' } });
    expect(screen.getByText('1–12 von 12 Personen')).toBeTruthy();
  });

  it('sortiert per Tastatur über den Knopf im Kopf, aria-sort folgt', () => {
    renderTable();
    const head = screen.getByRole('columnheader', { name: /Name/ });
    expect(head.getAttribute('aria-sort')).toBe('none');
    const button = within(head).getByRole('button', { name: /Name/ });
    button.focus();
    expect(document.activeElement).toBe(button);
    fireEvent.click(button); // Enter/Leertaste lösen bei nativen Knöpfen click aus
    expect(head.getAttribute('aria-sort')).toBe('ascending');
    expect(bodyNames()[0]).toBe('Person A');
    fireEvent.click(button);
    expect(head.getAttribute('aria-sort')).toBe('descending');
    expect(bodyNames()[0]).toBe('Person L');
    fireEvent.click(button);
    expect(head.getAttribute('aria-sort')).toBe('none');
  });

  it('sucht und filtert per Chip, setzt zurück; ohne Treffer eigener Zustand', () => {
    renderTable();
    fireEvent.change(screen.getByRole('searchbox', { name: 'Personen durchsuchen' }), {
      target: { value: 'person k' },
    });
    expect(bodyNames()).toEqual(['Person K']);
    fireEvent.click(screen.getByRole('button', { name: 'Nord' }));
    expect(screen.getByText('Keine Treffer')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Suche und Filter zurücksetzen' }));
    expect(screen.getByText('1–5 von 12 Personen')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Nord' }));
    expect(screen.getByText('1–4 von 4 Personen')).toBeTruthy();
    expect(screen.getByRole('group', { name: 'Team' })).toBeTruthy();
  });

  it('leer: leerer Zustand mit Titel; laden: Platzhalter und aria-busy', () => {
    const { unmount } = renderTable({ rows: [] });
    expect(screen.getByText('Noch keine Personen')).toBeTruthy();
    expect(screen.queryByRole('navigation', { name: 'Personen: Seiten' })).toBeNull();
    unmount();
    renderTable({ loading: true });
    expect(screen.getByRole('table').getAttribute('aria-busy')).toBe('true');
    expect(screen.getByText('Tabelle wird geladen …')).toBeTruthy();
  });

  it('Zeile öffnen per Knopf oder Klick; Aktionen in der Zeile öffnen nicht', () => {
    const open = vi.fn();
    const act1 = vi.fn();
    renderTable({
      onOpenRow: open,
      actions: (p) => (
        <button type="button" aria-label={`${p.name} bearbeiten`} onClick={act1}>
          ✎
        </button>
      ),
    });
    const firstRow = screen.getAllByRole('row')[1];
    const openButton = firstRow?.querySelector<HTMLButtonElement>('[data-slot="ds-row-open"]');
    if (openButton) fireEvent.click(openButton);
    expect(open).toHaveBeenLastCalledWith(PEOPLE[0]);
    const row = screen.getAllByRole('row')[2];
    if (row) fireEvent.click(within(row).getAllByRole('cell')[1] as HTMLElement);
    expect(open).toHaveBeenLastCalledWith(PEOPLE[1]);
    expect(document.activeElement?.getAttribute('data-slot')).toBe('ds-row-open');
    fireEvent.click(screen.getByRole('button', { name: 'Person J bearbeiten' }));
    expect(act1).toHaveBeenCalledOnce();
    expect(open).toHaveBeenCalledTimes(2);
  });

  it('Zeilen 40 px: Zellen h-10', () => {
    renderTable();
    expect(screen.getAllByRole('cell')[0]?.className).toContain('h-10');
  });
});

describe('SideSheet', () => {
  function Demo() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
          }}
        >
          Anna öffnen
        </button>
        <SideSheet
          open={open}
          onOpenChange={setOpen}
          title="Anna Ölmez: Urlaub"
          badge={<Badge tone="success">Genehmigt</Badge>}
          footer={<button type="button">Bearbeiten</button>}
        >
          <SideSheetRow icon={Calendar} label="Zeitraum">
            Mo 23.11. – Fr 27.11.
          </SideSheetRow>
        </SideSheet>
      </>
    );
  }

  it('Kopf, Zeilen mit Symbol, Fuß; Esc schließt, Fokus zurück', async () => {
    render(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Anna öffnen' });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Anna Ölmez: Urlaub' });
    expect(within(dialog).getByText('Genehmigt')).toBeTruthy();
    expect(within(dialog).getByText('Zeitraum')).toBeTruthy();
    expect(within(dialog).getByRole('button', { name: 'Bearbeiten' })).toBeTruthy();
    expect(dialog.className).toContain('data-[state=open]:animate-ds-side-sheet-in');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });
  });

  it('Klick daneben und „Schließen“ schließen', async () => {
    render(<Demo />);
    fireEvent.click(screen.getByRole('button', { name: 'Anna öffnen' }));
    await screen.findByRole('dialog');
    const overlay = document.querySelector('[data-slot="ds-side-sheet-overlay"]');
    expect(overlay?.className).toContain('backdrop-blur');
    // Radix schließt bei Klick außerhalb des Inhalts (pointerdown, dann click; Listener nach einem Tick)
    await new Promise((r) => setTimeout(r, 10));
    if (overlay) {
      fireEvent.pointerDown(overlay);
      fireEvent.click(overlay);
    }
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Anna öffnen' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Schließen' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });
});

const GROUPS: NavGroup[] = [
  {
    key: 'arbeit',
    label: 'Arbeit',
    items: [
      { label: 'Übersicht', to: '/', icon: LayoutDashboard },
      {
        label: 'Mein Team',
        icon: Users,
        sections: [
          {
            label: null,
            items: [
              { label: 'Anträge', to: '/urlaubsplanung/antraege' },
              { label: 'Auffälligkeiten', to: '/zeiterfassung/plan-ist' },
            ],
          },
        ],
      },
    ],
  },
];

describe('Sidebar und AppShell', () => {
  it('Gruppen mit Überschrift, Symbole, aktiver Eintrag mit aria-current und Fläche', () => {
    render(<Sidebar groups={GROUPS} currentPath="/zeiterfassung/plan-ist" />);
    expect(screen.getByText('Arbeit')).toBeTruthy();
    const active = screen.getByRole('link', { name: 'Auffälligkeiten' });
    expect(active.getAttribute('aria-current')).toBe('page');
    expect(active.className).toContain('bg-ds-nav-active');
    expect(screen.getByRole('link', { name: 'Übersicht' }).getAttribute('aria-current')).toBeNull();
    // Bereich mit der aktiven Seite ist aufgeklappt
    expect(screen.getByRole('button', { name: 'Mein Team' }).getAttribute('aria-expanded')).toBe(
      'true',
    );
  });

  it('Bereiche auf- und zuklappen per Knopf (Tastatur: Enter/Leertaste)', () => {
    render(<Sidebar groups={GROUPS} currentPath="/" />);
    const team = screen.getByRole('button', { name: 'Mein Team' });
    expect(team.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('link', { name: 'Anträge' })).toBeNull();
    fireEvent.click(team);
    expect(team.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('link', { name: 'Anträge' })).toBeTruthy();
    expect(team.className).toContain('focus-visible:ring-2');
  });

  it('eigener Link des Routers', () => {
    render(
      <Sidebar
        groups={GROUPS}
        currentPath="/"
        renderLink={({ to, className, children, ...rest }) => (
          <a href={`#${to}`} className={className} aria-current={rest['aria-current']} data-router>
            {children}
          </a>
        )}
      />,
    );
    expect(screen.getByRole('link', { name: 'Übersicht' }).getAttribute('href')).toBe('#/');
  });

  it('App-Rahmen: Inhalt als abgerundete Arbeitsfläche, Navigation daneben', () => {
    render(
      <AppShell groups={GROUPS} currentPath="/">
        <p>Seiteninhalt</p>
      </AppShell>,
    );
    const main = screen.getByRole('main');
    expect(main.id).toBe('inhalt');
    expect(main.className).toContain('rounded-ds-workspace');
    expect(main.className).toContain('bg-ds-workspace');
    expect(within(main).getByText('Seiteninhalt')).toBeTruthy();
    expect(screen.getAllByRole('navigation', { name: 'Hauptnavigation' }).length).toBeGreaterThan(
      0,
    );
  });

  it('schmale Fenster: Menü öffnet die Leiste als Schublade', async () => {
    render(
      <AppShell groups={GROUPS} currentPath="/">
        <p>Inhalt</p>
      </AppShell>,
    );
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    });
    const drawer = await screen.findByRole('dialog', { name: 'Menü' });
    expect(within(drawer).getByRole('link', { name: 'Übersicht' })).toBeTruthy();
  });
});
