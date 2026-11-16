import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { DESIGN_PATH, SAMPLE_MENU, navGroupsOf } from './designNav';

beforeEach(() => {
  window.location.hash = '';
});
afterEach(cleanup);

const systemLinks = (menu = SAMPLE_MENU) =>
  menu
    .find((a) => a.id === 'masterData')
    ?.groups.find((g) => g.label === 'System')
    ?.links.map((l) => l.label) ?? [];

describe('Musterseite – Beispiel-Navigation', () => {
  it('Eintrag „Design-Muster“ unter Stammdaten > System', () => {
    expect(systemLinks()).toEqual(['Nutzer', 'Design-Muster']);
    const design = SAMPLE_MENU.flatMap((a) => a.groups.flatMap((g) => g.links)).find(
      (l) => l.label === 'Design-Muster',
    );
    expect(design?.to).toBe(DESIGN_PATH);
  });

  it('unbekannter Pfad: kein Eintrag aktiv, die Seite läuft trotzdem', async () => {
    window.location.hash = '#/gibt-es-nicht';
    render(<App />);
    expect((await screen.findByRole('heading', { level: 1 })).textContent).toBe('Design-Muster');
    const nav = screen.getByRole('navigation', { name: 'Hauptnavigation' });
    expect(nav.querySelector('[aria-current="page"]')).toBeNull();
  });

  it('Klick in der Navigation macht den Eintrag aktiv (Hash-Pfad, ohne Router)', async () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: 'Hauptnavigation' });
    const overview = within(nav).getByRole('link', { name: 'Übersicht' });
    expect(overview.getAttribute('href')).toBe('#/');
    act(() => {
      window.location.hash = '#/';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    await waitFor(() => {
      expect(overview.getAttribute('aria-current')).toBe('page');
    });
    // Sprungmarken der Seite ändern den aktiven Eintrag nicht.
    act(() => {
      window.location.hash = '#tabelle';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(overview.getAttribute('aria-current')).toBe('page');
  });
});

describe('Musterseite – Inhalt', () => {
  it('läuft im neuen App-Rahmen mit aktivem Eintrag; genau eine h1', async () => {
    render(<App />);
    expect((await screen.findByRole('heading', { level: 1 })).textContent).toBe('Design-Muster');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(document.querySelector('[data-slot="ds-app-shell"]')).not.toBeNull();
    expect(screen.getByRole('main').dataset.slot).toBe('ds-workspace');
    const nav = screen.getByRole('navigation', { name: 'Hauptnavigation' });
    const active = within(nav).getByRole('link', { name: 'Design-Muster' });
    expect(active.getAttribute('aria-current')).toBe('page');
    expect(
      within(nav).getByRole('button', { name: 'Stammdaten' }).getAttribute('aria-expanded'),
    ).toBe('true');
  });

  it('jeder Baustein hat einen Abschnitt, am Ende die Beispielseite', async () => {
    render(<App />);
    await screen.findByRole('heading', { level: 1 });
    const titles = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    for (const t of [
      'Ebenen und Karte',
      'Kennzahl-Kachel',
      'Mini-Grafiken',
      'Badge, Avatar, Chip',
      'Knopf',
      'Umschalter',
      'Datentabelle',
      'Laden und leer',
      'Seitenblatt',
      'Beispielseite',
    ])
      expect(titles).toContain(t);
    const sections = [...document.querySelectorAll('main section[aria-labelledby]')];
    expect(sections.at(-1)?.id).toBe('beispiel');
    const example = screen.getByRole('region', { name: 'Beispielseite' });
    expect(within(example).getByRole('heading', { name: 'Woche im Blick' })).toBeTruthy();
    expect(within(example).getAllByText(/ggü\. Vorwoche/).length).toBeGreaterThanOrEqual(4);
    expect(within(example).getByRole('img', { name: /^Anrufe je Tag/ })).toBeTruthy();
    expect(within(example).getByRole('table', { name: 'Mitarbeiter heute' })).toBeTruthy();
  });

  it('Klick auf eine Zeile der Beispieltabelle öffnet das Seitenblatt; Esc schließt, Fokus zurück', async () => {
    render(<App />);
    const table = await screen.findByRole('table', { name: 'Mitarbeiter heute' });
    const first = within(table).getAllByRole('row')[1];
    const button = first?.querySelector<HTMLButtonElement>('[data-slot="ds-row-open"]');
    expect(button).toBeTruthy();
    if (!button) return;
    button.focus();
    fireEvent.click(button);
    const sideSheet = await screen.findByRole('dialog', { name: 'Lena Hoffmann' });
    expect(within(sideSheet).getByText('Team Nord')).toBeTruthy();
    expect(within(sideSheet).getByRole('button', { name: 'Schicht bearbeiten' })).toBeTruthy();
    fireEvent.keyDown(sideSheet, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(button);
    });
  });
});

describe('navGroupsOf', () => {
  it('Arbeit mit den Arbeitsbereichen, Einrichten mit Stammdaten; Übersicht ist ein Link', () => {
    const groups = navGroupsOf(SAMPLE_MENU);
    expect(groups.map((g) => g.label)).toEqual(['Arbeit', 'Einrichten']);
    const work = groups[0]?.items ?? [];
    expect(work.map((i) => i.label)).toEqual(['Übersicht', 'Anliegen', 'Mein Team', 'Auswertung']);
    expect(work[0]?.to).toBe('/');
    expect(work[1]?.sections?.map((s) => s.label)).toEqual(['Eingang', 'Wissen']);
    expect(work.every((i) => i.icon)).toBe(true);
  });

  it('ohne Stammdaten: keine Gruppe „Einrichten“', () => {
    const groups = navGroupsOf(SAMPLE_MENU.filter((a) => a.id !== 'masterData'));
    expect(groups.map((g) => g.label)).not.toContain('Einrichten');
  });
});
