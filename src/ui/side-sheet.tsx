import { X, type LucideIcon } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SideSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Etikett neben dem Titel (z. B. Status). */
  badge?: ReactNode;
  /** Unterzeile für Vorleser und Auge; ohne wird nichts angesagt. */
  description?: string;
  children: ReactNode;
  /** Aktionen unten rechts, genau eine Primäraktion. Ohne: nur „Schließen“. */
  footer?: ReactNode;
}

/**
 * Seitenblatt der Designsprache 2 (LEITFADEN.md, Regel 9 „Seitenblatt, Dialog oder Seite“):
 * gleitet von rechts herein, die Seite dahinter bleibt abgedunkelt und leicht weichgezeichnet
 * sichtbar. Kopf mit Titel, Etikett und Schließen; Inhalt als Zeilen mit Symbol
 * (`SideSheetRow`); Fuß mit Aktionen. Esc und Klick daneben schließen, der Fokus kehrt auf das
 * auslösende Element zurück (Radix). Bei weniger Bewegung blendet es nur ein. Nie auf Seiten mit
 * einem laufenden Gespräch – dort öffnet sich alles in der Seite.
 */
export function SideSheet({
  open,
  onOpenChange,
  title,
  badge,
  description,
  children,
  footer,
}: SideSheetProps) {
  // Ohne Radix-Trigger (Zeile, Kalendereintrag) merkt sich das Seitenblatt das auslösende Element selbst
  // und gibt ihm beim Schließen den Fokus zurück.
  const returnTo = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (open && document.activeElement instanceof HTMLElement)
      returnTo.current = document.activeElement;
  }, [open]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          data-slot="ds-side-sheet-overlay"
          className="fixed inset-0 z-50 bg-ds-scrim backdrop-blur-[2px] data-[state=closed]:animate-ds-scrim-out data-[state=open]:animate-ds-scrim-in"
        />
        <DialogPrimitive.Content
          data-slot="ds-side-sheet"
          {...(description ? {} : { 'aria-describedby': undefined })}
          onCloseAutoFocus={(e) => {
            const target = returnTo.current;
            if (target?.isConnected) {
              e.preventDefault();
              target.focus();
            }
          }}
          className="fixed inset-y-2 right-2 z-50 flex w-[min(30rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-ds-card border border-ds-line bg-ds-core shadow-ds-3 outline-none data-[state=closed]:animate-ds-side-sheet-out data-[state=open]:animate-ds-side-sheet-in"
        >
          <div className="flex items-start gap-3 border-b border-ds-line px-5 py-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <DialogPrimitive.Title className="text-base leading-6 text-foreground">
                  {title}
                </DialogPrimitive.Title>
                {badge}
              </div>
              {description && (
                <DialogPrimitive.Description className="mt-0.5 text-[13px] text-muted-foreground">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close
              aria-label="Schließen"
              className="ds-press -mr-1.5 inline-flex size-8 shrink-0 items-center justify-center rounded-ds-control text-muted-foreground outline-none hover:bg-ds-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <X className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>
          <div className="scrollbar-content flex-1 overflow-y-auto px-5 py-3">{children}</div>
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-ds-line bg-ds-frame px-5 py-3">
            {footer ?? (
              <DialogPrimitive.Close className="ds-press h-9 rounded-ds-control border border-ds-line-strong bg-ds-core px-4 text-sm font-medium outline-none hover:bg-ds-hover focus-visible:ring-2 focus-visible:ring-ring/40">
                Schließen
              </DialogPrimitive.Close>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** Knopf, der das Seitenblatt schließt (für den Fuß, z. B. „Abbrechen“). */
export const SideSheetClose = DialogPrimitive.Close;

export interface SideSheetRowProps {
  icon: LucideIcon;
  /** Gedämpfte Bezeichnung über dem Wert (optional). */
  label?: string;
  children: ReactNode;
  className?: string;
}

/** Zeile im Seitenblatt: Symbol links, Wert (und optional gedämpfte Bezeichnung) rechts. */
export function SideSheetRow({ icon: Icon, label, children, className }: SideSheetRowProps) {
  return (
    <div data-slot="ds-side-sheet-row" className={cn('flex items-start gap-3 py-2.5', className)}>
      <Icon
        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1 text-sm text-foreground">
        {label && <div className="text-xs text-muted-foreground">{label}</div>}
        {children}
      </div>
    </div>
  );
}
