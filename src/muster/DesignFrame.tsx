import { ArrowUpRight, LogOut } from 'lucide-react';
import { MotionConfig } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';
import { AppShell } from '@/ui/app-shell';
import { DESIGN_PATH, SAMPLE_MENU, navGroupsOf } from './designNav';

const footerLink =
  'flex h-8 items-center gap-2.5 rounded-ds-control px-2.5 text-[13px] text-sidebar-foreground outline-none transition-colors hover:bg-white/[0.06] hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring';

/** Pfad aus dem Hash (`#/team/antraege`); Sprungmarken der Seite (`#rahmen`) zählen nicht. */
function pathOfHash(hash: string): string | null {
  return hash.startsWith('#/') ? hash.slice(1) : null;
}

/** Aktueller Pfad der Beispiel-Navigation; ohne Router, damit die Seite statisch läuft. */
function useSamplePath(): string {
  const [path, setPath] = useState(() => pathOfHash(window.location.hash) ?? DESIGN_PATH);
  useEffect(() => {
    const onChange = () => {
      const next = pathOfHash(window.location.hash);
      if (next !== null) setPath(next);
    };
    window.addEventListener('hashchange', onChange);
    return () => {
      window.removeEventListener('hashchange', onChange);
    };
  }, []);
  return path;
}

/** Wortmarke als Platzhalter: Das Logo bringt die App mit (siehe themes/avanti.css). */
function Wordmark({ className }: { className: string }) {
  return (
    <span className={className}>
      avanti <span className="font-sans font-normal text-sidebar-muted">design</span>
    </span>
  );
}

/** Sprunglink zum Inhalt (erstes Element im Tab-Weg). */
function SkipLink() {
  return (
    <a
      href="#inhalt"
      className="sr-only rounded-ds-control bg-ds-core px-3 py-2 text-sm font-medium text-foreground shadow-ds-3 focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60]"
    >
      Zum Inhalt springen
    </a>
  );
}

/**
 * App-Rahmen der Musterseite: AppShell mit der Beispiel-Navigation. Die Links führen auf
 * Hash-Pfade, damit die gebaute Seite ohne Server und ohne Router läuft; der Inhalt bleibt die
 * Musterseite, nur der aktive Eintrag wechselt.
 */
export function DesignFrame({ children }: { children: ReactNode }) {
  const path = useSamplePath();
  const groups = navGroupsOf(SAMPLE_MENU);

  return (
    <MotionConfig reducedMotion="user">
      <SkipLink />
      <AppShell
        groups={groups}
        currentPath={path}
        brand={<Wordmark className="font-display text-[19px] leading-[22px] text-white" />}
        mobileBrand={<Wordmark className="font-display text-[17px] leading-5 text-white" />}
        renderLink={({ to, className, children: label, onClick, ...rest }) => (
          <a
            href={`#${to}`}
            className={className}
            aria-current={rest['aria-current']}
            onClick={onClick}
          >
            {label}
          </a>
        )}
        footer={
          <section aria-label="Angemeldet" className="flex flex-col gap-0.5">
            <a href="#/hilfe" className={footerLink}>
              <span className="flex-1">Hilfe</span>
              <ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-3.5" />
            </a>
            <div className="flex flex-col px-2.5 pt-2 pb-1 text-xs">
              <span className="text-[13px] text-sidebar-accent-foreground">Beispiel-Service</span>
              <span className="truncate text-sidebar-foreground">person@beispiel.example</span>
              <span className="text-sidebar-muted">Teamleitung</span>
            </div>
            <button type="button" className={footerLink}>
              <LogOut aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0" />
              Abmelden
            </button>
          </section>
        }
      >
        {children}
      </AppShell>
    </MotionConfig>
  );
}
