import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  badge?: ReactNode;
  /**
   * Pfad über dem Titel (Bereich › Gruppe). In der Suite trägt ihn die `Topbar`; Apps ohne Topbar
   * geben ihn hier mit (Abweichung, LEITFADEN.md „Bausteine“).
   */
  path?: readonly string[];
  /**
   * Ebene der Überschrift (Standard 1). 2 nur, wo ein Seitenkopf als Beispiel in einer Seite steht
   * (Musterseite), damit es genau eine `h1` gibt.
   */
  headingLevel?: 1 | 2;
}

/**
 * Seitenkopf der Designsprache 2 (Name und Props wie in der avanti suite): Pfad, genau eine `h1`
 * mit Badge, gedämpfte Unterzeile; rechts die Aktionen (eine Primäraktion).
 */
export function PageHeader({
  title,
  subtitle,
  actions,
  badge,
  path,
  headingLevel = 1,
}: PageHeaderProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <header
      data-slot="ds-page-header"
      className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3"
    >
      <div className="min-w-0">
        {path && path.length > 0 && (
          <nav aria-label="Pfad" className="mb-1">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              {path.map((p, i) => (
                <li key={`${p}-${String(i)}`} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="size-3" aria-hidden="true" />}
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Heading className="text-[22px] leading-7 text-foreground">{title}</Heading>
          {badge}
        </div>
        {subtitle && <p className="mt-0.5 text-[13px] text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
