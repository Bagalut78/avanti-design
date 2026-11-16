import {
  BarChart3,
  Database,
  Headphones,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { NavGroup, NavItem } from '@/ui/nav-types';

/**
 * Beispiel-Navigation der Musterseite: das Menü eines erfundenen Kundenservice. Eine App gibt ihr
 * eigenes Menü als `groups` an AppShell/Sidebar; hier steht nur, wie ein Menü mit Bereichen
 * (Bereich › Gruppe › Seite) in die Form der Seitenleiste kommt.
 */

export interface MenuLink {
  readonly label: string;
  readonly to: string;
}

export interface MenuArea {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly groups: readonly {
    readonly label: string | null;
    readonly links: readonly MenuLink[];
  }[];
}

/** Pfad der Musterseite in der Beispiel-Navigation. */
export const DESIGN_PATH = '/design';

export const SAMPLE_MENU: readonly MenuArea[] = [
  {
    id: 'overview',
    label: 'Übersicht',
    icon: LayoutDashboard,
    groups: [{ label: null, links: [{ label: 'Übersicht', to: '/' }] }],
  },
  {
    id: 'service',
    label: 'Anliegen',
    icon: Headphones,
    groups: [
      {
        label: 'Eingang',
        links: [
          { label: 'Offen', to: '/anliegen/offen' },
          { label: 'Erledigt', to: '/anliegen/erledigt' },
        ],
      },
      { label: 'Wissen', links: [{ label: 'Antworten', to: '/anliegen/antworten' }] },
    ],
  },
  {
    id: 'team',
    label: 'Mein Team',
    icon: Users,
    groups: [
      {
        label: null,
        links: [
          { label: 'Personen', to: '/team/personen' },
          { label: 'Anträge', to: '/team/antraege' },
          { label: 'Schichten', to: '/team/schichten' },
        ],
      },
    ],
  },
  {
    id: 'reports',
    label: 'Auswertung',
    icon: BarChart3,
    groups: [
      {
        label: null,
        links: [
          { label: 'Kennzahlen', to: '/auswertung/kennzahlen' },
          { label: 'Berichte', to: '/auswertung/berichte' },
        ],
      },
    ],
  },
  {
    id: 'masterData',
    label: 'Stammdaten',
    icon: Database,
    groups: [
      { label: 'Organisation', links: [{ label: 'Teams', to: '/stammdaten/teams' }] },
      {
        label: 'System',
        links: [
          { label: 'Nutzer', to: '/stammdaten/nutzer' },
          { label: 'Design-Muster', to: DESIGN_PATH },
        ],
      },
    ],
  },
];

/** Ein Menübereich als Eintrag: ein einzelner Link direkt, sonst aufklappbar mit Untergruppen. */
function itemOf(area: MenuArea): NavItem {
  const only = area.groups.length === 1 ? area.groups[0]?.links : undefined;
  const single = only?.length === 1 ? only[0] : undefined;
  if (single) return { label: area.label, to: single.to, icon: area.icon };
  return {
    label: area.label,
    icon: area.icon,
    sections: area.groups.map((g) => ({
      label: g.label,
      items: g.links.map((l) => ({ label: l.label, to: l.to })),
    })),
  };
}

/** Das Menü in der Form der Seitenleiste: Arbeit, darunter Einrichten (Stammdaten). */
export function navGroupsOf(menu: readonly MenuArea[]): NavGroup[] {
  const work = menu.filter((a) => a.id !== 'masterData').map(itemOf);
  const setup = menu.filter((a) => a.id === 'masterData').map(itemOf);
  return [
    { key: 'arbeit', label: 'Arbeit', items: work },
    ...(setup.length > 0 ? [{ key: 'einrichten', label: 'Einrichten', items: setup }] : []),
  ];
}
