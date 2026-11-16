import { ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import type { NavGroup, NavItem } from './nav-types';

export type { NavGroup, NavItem, NavSection } from './nav-types';
import { activeNavTarget, navLeaves } from '@/lib/nav';
import { cn } from '@/lib/cn';

export interface NavLinkProps {
  to: string;
  className: string;
  'aria-current': 'page' | undefined;
  onClick?: (() => void) | undefined;
  children: ReactNode;
}

export interface SidebarProps {
  groups: NavGroup[];
  /** Aktueller Pfad: bestimmt den aktiven Eintrag (längster passender). */
  currentPath: string;
  /** Marke oben (Logo). */
  brand?: ReactNode;
  /** Unten: Mandant, Person, Abmelden. */
  footer?: ReactNode;
  /** Link des Routers (Standard: `<a href>`). */
  renderLink?: (props: NavLinkProps) => ReactNode;
  /** Nach einem Klick (z. B. Schublade schließen). */
  onNavigate?: () => void;
}

const defaultLink = ({ to, className, onClick, children, ...rest }: NavLinkProps) => (
  <a href={to} className={className} onClick={onClick} aria-current={rest['aria-current']}>
    {children}
  </a>
);

const rowClass =
  'group/nav relative flex h-8 w-full items-center gap-2.5 rounded-ds-control px-2.5 text-[13px] text-sidebar-foreground outline-none transition-colors duration-150 ease-ds-out hover:bg-white/[0.06] hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring';

/**
 * Seitenleiste der Designsprache 2 (Namen wie in der avanti suite): dunkelblau, Symbole, Gruppen,
 * aufklappbare Bereiche und ein klarer Aktivzustand (helle Fläche, weiße Schrift, türkiser
 * Strich). Der Bereich mit der aktiven Seite ist aufgeklappt.
 */
export function Sidebar({
  groups,
  currentPath,
  brand,
  footer,
  renderLink = defaultLink,
  onNavigate,
}: SidebarProps) {
  const active = activeNavTarget(groups, currentPath);
  const contains = (i: NavItem) => navLeaves([i]).some((l) => l.to === active);
  const [toggled, setToggled] = useState<ReadonlyMap<string, boolean>>(new Map());
  const isOpen = (i: NavItem) => toggled.get(i.label) ?? contains(i);
  const navRef = useRef<HTMLElement>(null);

  // Der aktive Eintrag ist sichtbar, auch wenn er weit unten steht (ohne Bewegung).
  useEffect(() => {
    const el = navRef.current?.querySelector('[aria-current="page"]');
    if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const link = (item: NavItem, nested: boolean) => {
    const current = item.to === active;
    const Icon = item.icon;
    return renderLink({
      to: item.to ?? '/',
      'aria-current': current ? 'page' : undefined,
      onClick: onNavigate,
      className: cn(
        rowClass,
        nested && 'h-7 pl-9 text-[13px] text-sidebar-muted',
        current &&
          'bg-ds-nav-active font-medium text-ds-nav-active-foreground before:absolute before:top-1.5 before:bottom-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-sidebar-primary',
      ),
      children: (
        <>
          {Icon && <Icon className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />}
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {item.badge}
        </>
      ),
    });
  };

  return (
    <div data-slot="ds-sidebar" className="flex h-full flex-col px-3 pt-4 pb-3">
      {brand && <div className="px-2.5 pt-1 pb-5">{brand}</div>}
      <nav
        ref={navRef}
        aria-label="Hauptnavigation"
        className="scrollbar-sidebar -mx-1 flex-1 overflow-y-auto px-1"
      >
        {groups.map((g) => (
          <div key={g.key} className="mb-4 last:mb-0">
            {g.label && (
              <p className="px-2.5 pb-1.5 font-mono text-[10px] tracking-[0.08em] text-sidebar-muted uppercase">
                {g.label}
              </p>
            )}
            <ul className="flex flex-col gap-0.5">
              {g.items.map((item) => {
                if (!item.sections) return <li key={item.label}>{link(item, false)}</li>;
                const open = isOpen(item);
                const Icon = item.icon;
                const id = `ds-nav-${g.key}-${item.label}`.replace(/\W+/g, '-');
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={id}
                      onClick={() => {
                        setToggled((t) => new Map(t).set(item.label, !open));
                      }}
                      className={cn(rowClass, contains(item) && 'text-sidebar-accent-foreground')}
                    >
                      {Icon && (
                        <Icon className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                      )}
                      <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                      {!open && item.badge}
                      <ChevronRight
                        className={cn(
                          'size-3.5 shrink-0 text-sidebar-muted transition-transform duration-150 ease-ds-out',
                          open && 'rotate-90',
                        )}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </button>
                    {open && (
                      <div id={id} className="mt-0.5 mb-1 animate-ds-enter">
                        {item.sections.map((s) => (
                          <div key={s.label ?? item.label} className="mt-0.5">
                            {s.label && (
                              <p className="py-1 pr-2.5 pl-9 text-[11px] text-sidebar-muted">
                                {s.label}
                              </p>
                            )}
                            <ul className="flex flex-col gap-px">
                              {s.items.map((leaf) => (
                                <li key={leaf.to ?? leaf.label}>{link(leaf, true)}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      {footer && <div className="mt-2 border-t border-sidebar-border pt-3">{footer}</div>}
    </div>
  );
}
