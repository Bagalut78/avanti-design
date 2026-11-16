import { Menu, X } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { useState, type ReactNode } from 'react';
import { Sidebar, type SidebarProps } from './sidebar';

export interface AppShellProps extends Omit<SidebarProps, 'onNavigate'> {
  children: ReactNode;
  /** Marke in der Kopfzeile schmaler Fenster (Logo). */
  mobileBrand?: ReactNode;
}

/**
 * App-Rahmen der Designsprache 2 (Name wie in der avanti suite): Die dunkelblaue Seitenleiste ist
 * der Hintergrund; der Inhalt liegt darauf als abgerundete, helle Arbeitsfläche mit weichem
 * Schatten. Unter 768 px: Kopfzeile mit Menüknopf, die Leiste als Schublade (Radix-Dialog: Fokus,
 * Esc, Scroll-Sperre).
 */
export function AppShell({ children, mobileBrand, ...sidebar }: AppShellProps) {
  const [open, setOpen] = useState(false);
  return (
    <div data-slot="ds-app-shell" className="flex h-dvh bg-ds-canvas">
      <aside className="hidden w-60 shrink-0 md:block">
        <Sidebar {...sidebar} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col md:py-2 md:pr-2">
        <header className="flex h-14 shrink-0 items-center gap-3 px-4 md:hidden">
          <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Trigger
              aria-label="Menü öffnen"
              className="-ml-2 flex size-10 items-center justify-center rounded-ds-control text-sidebar-foreground outline-none hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            >
              <Menu className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ds-scrim data-[state=closed]:animate-ds-scrim-out data-[state=open]:animate-ds-scrim-in" />
              <DialogPrimitive.Content
                aria-describedby={undefined}
                className="fixed inset-y-0 left-0 z-50 w-[17rem] max-w-[85vw] bg-ds-canvas shadow-ds-3 outline-none data-[state=closed]:animate-ds-scrim-out data-[state=open]:animate-ds-fade-in"
              >
                <DialogPrimitive.Title className="sr-only">Menü</DialogPrimitive.Title>
                <DialogPrimitive.Close
                  aria-label="Menü schließen"
                  className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-ds-control text-sidebar-foreground outline-none hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                >
                  <X className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </DialogPrimitive.Close>
                <Sidebar
                  {...sidebar}
                  onNavigate={() => {
                    setOpen(false);
                  }}
                />
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
          {mobileBrand}
        </header>
        <main
          id="inhalt"
          tabIndex={-1}
          data-slot="ds-workspace"
          className="scrollbar-content min-h-0 flex-1 overflow-auto bg-ds-workspace shadow-ds-2 outline-none md:rounded-ds-workspace"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
