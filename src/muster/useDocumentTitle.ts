import { useEffect } from 'react';

/** Setzt den Titel des Browser-Tabs, solange die Seite angezeigt wird. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const before = document.title;
    document.title = `${title} · avanti design`;
    return () => {
      document.title = before;
    };
  }, [title]);
}
