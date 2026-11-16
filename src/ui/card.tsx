import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/**
 * Karte der Designsprache 2 (Namen und Props wie in der avanti suite): getönter Rahmen mit feiner
 * Linie und sehr weichem Schatten; darin Kopf (Titel, gedämpfte Unterzeile, Steuerung rechts),
 * weißer Kern (`CardContent`) und Fußzeile. `compact` verringert die Abstände.
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
}

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
}

export function Card({ compact = false, className, ...props }: CardProps) {
  return (
    <div
      data-slot="ds-card"
      data-compact={compact || undefined}
      className={cn(
        'group/card flex min-w-0 flex-col rounded-ds-card border border-ds-line bg-ds-frame text-card-foreground shadow-ds-1',
        compact ? 'p-0.5' : 'p-1',
        className,
      )}
      {...props}
    />
  );
}

/** Kopf: links Titel und Unterzeile, rechts Steuerung (`CardAction`). */
export function CardHeader({ compact = false, className, ...props }: CardSectionProps) {
  return (
    <div
      data-slot="ds-card-header"
      className={cn(
        'flex min-h-11 flex-wrap items-start justify-between gap-x-3 gap-y-2',
        compact ? 'px-2.5 py-2' : 'px-3 py-2.5',
        className,
      )}
      {...props}
    />
  );
}

/** Titel und Unterzeile untereinander (linke Seite des Kopfs). */
export function CardHeading({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="ds-card-heading" className={cn('min-w-0', className)} {...props} />;
}

export function CardTitle({
  className,
  as: Heading = 'h2',
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { as?: 'h2' | 'h3' }) {
  return (
    <Heading
      data-slot="ds-card-title"
      className={cn('font-display text-sm leading-5 font-semibold text-foreground', className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="ds-card-description"
      className={cn('text-xs leading-4 text-muted-foreground', className)}
      {...props}
    />
  );
}

/** Steuerung rechts im Kopf (Umschalter, Auswahl, Zähler). */
export function CardAction({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="ds-card-action"
      className={cn('ml-auto flex shrink-0 items-center gap-2', className)}
      {...props}
    />
  );
}

/** Weißer Kern mit Linie; hier steht der Inhalt. */
export function CardContent({ compact = false, className, ...props }: CardSectionProps) {
  return (
    <div
      data-slot="ds-card-content"
      className={cn(
        'min-w-0 flex-1 rounded-ds-core border border-ds-line bg-ds-core',
        compact ? 'p-3' : 'p-4',
        className,
      )}
      {...props}
    />
  );
}

/** Fußzeile auf dem Rahmen: Hinweis links, Weiter-Link rechts. */
export function CardFooter({ compact = false, className, ...props }: CardSectionProps) {
  return (
    <div
      data-slot="ds-card-footer"
      className={cn(
        'flex min-h-9 flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground',
        compact ? 'px-2.5 py-1.5' : 'px-3 py-2',
        className,
      )}
      {...props}
    />
  );
}
