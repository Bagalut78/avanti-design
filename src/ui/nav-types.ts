import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/** Ein Eintrag der Seitenleiste: mit `to` ein Link, mit `sections` ein aufklappbarer Bereich. */
export interface NavItem {
  label: string;
  to?: string;
  icon?: LucideIcon;
  /** Weitere Pfade, unter denen der Eintrag aktiv ist. */
  activeFor?: string[];
  /** Zähler o. Ä. rechts (mit eigener Beschriftung für Vorleser). */
  badge?: ReactNode;
  sections?: NavSection[];
}

export interface NavSection {
  /** Überschrift der Untergruppe; `null` = ohne. */
  label: string | null;
  items: NavItem[];
}

export interface NavGroup {
  key: string;
  /** Überschrift der Gruppe; `null` = ohne. */
  label: string | null;
  items: NavItem[];
}
