# Anwenden – eine bestehende App umstellen

Schrittfolge, um eine bestehende avanti-App (Vite, React, TypeScript, Tailwind 4) auf die
Designsprache 2 umzustellen. Die Regeln stehen in [LEITFADEN.md](LEITFADEN.md), alle Bausteine mit
ihren Zuständen zeigt die Musterseite dieses Repos (`npm run dev`).

Bausteine kommen mit der shadcn-CLI direkt aus diesem Repo:

```sh
npx shadcn@latest add Bagalut78/avanti-design/<name>
```

Die CLI liest `registry.json` aus dem Repo, kopiert die Dateien in die App, trägt die Pakete ein und
holt die Bausteine, von denen ein Baustein abhängt, gleich mit. Die Dateien gehören danach der App;
Änderungen am Aussehen gehören aber hierher zurück, damit alle Apps gleich bleiben. Eine Liste aller
Namen steht in `registry.json`.

Jeder Schritt endet mit „Fertig, wenn …“. Erst dann folgt der nächste; dazwischen läuft die App.

## Vorbereitung (einmal)

1. Alias `@` auf `src` in `tsconfig.json` (`"paths": { "@/*": ["./src/*"] }`) und in
   `vite.config.ts` (`resolve.alias`).
2. `components.json` im Wurzelverzeichnis der App. Die Bausteine kommen in einen eigenen Ordner,
   damit sie nichts überschreiben, was die App schon hat:

   ```json
   {
     "$schema": "https://ui.shadcn.com/schema.json",
     "style": "new-york",
     "rsc": false,
     "tsx": true,
     "tailwind": {
       "config": "",
       "css": "src/styles.css",
       "baseColor": "neutral",
       "cssVariables": true
     },
     "iconLibrary": "lucide",
     "aliases": {
       "components": "@/components",
       "ui": "@/components/ds",
       "lib": "@/lib/ds",
       "utils": "@/lib/ds/cn",
       "hooks": "@/hooks"
     }
   }
   ```

Fertig, wenn `npx shadcn@latest add Bagalut78/avanti-design/lib-cn --dry-run` die Datei
`src/lib/ds/cn.ts` ankündigt.

## 1. Thema einbinden

```sh
npx shadcn@latest add Bagalut78/avanti-design/avanti-theme
```

Das legt `src/styles/avanti.css` an (Marke, Schriften, alle `ds`-Tokens) und trägt die Schriften
als Pakete ein. Im zentralen Stylesheet der App direkt nach Tailwind einbinden und die bisherigen
Marken-Tokens der App dort entfernen, wo sie doppelt sind:

```css
@import 'tailwindcss';
@import './styles/avanti.css';
```

Fertig, wenn die Schriften lokal laden (kein Aufruf zu Google Fonts im Netzwerk-Tab), eine Probe
wie `<div class="bg-ds-frame rounded-ds-card shadow-ds-1">` getönt und gerundet erscheint und die
bestehenden Seiten unverändert aussehen.

## 2. App-Rahmen

```sh
npx shadcn@latest add Bagalut78/avanti-design/app-shell
```

Bringt `AppShell` und `Sidebar` mit. Der Rahmen kennt weder Router noch Rollen: Die App gibt ihr
Menü als `groups` (Gruppen › Bereiche › Seiten, siehe `NavGroup`), den aktuellen Pfad als
`currentPath`, das Logo als `brand`/`mobileBrand`, unten `footer` (Konto, Abmelden) und ihren
Router-Link über `renderLink`. Den Rahmen in `MotionConfig reducedMotion="user"` (aus
`motion/react`) legen. Inhalt kommt als `children` auf die Arbeitsfläche (`<main id="inhalt">`).

Fertig, wenn jede Seite im neuen Rahmen läuft: dunkler Rahmen mit Seitenleiste, Inhalt auf der
abgerundeten Arbeitsfläche, aktiver Eintrag mit heller Fläche und Strich, der Bereich der aktiven
Seite aufgeklappt, unter 768 px Kopfzeile mit Menüknopf und Schublade (Esc schließt).

## 3. Seitenkopf und Karten

```sh
npx shadcn@latest add Bagalut78/avanti-design/page-header
npx shadcn@latest add Bagalut78/avanti-design/card
npx shadcn@latest add Bagalut78/avanti-design/button
npx shadcn@latest add Bagalut78/avanti-design/badge
```

Jede Seite beginnt mit `PageHeader` (genau eine `h1`, Pfad, Unterzeile, rechts eine Primäraktion).
Inhalte stehen in `Card` nach Regel 4: `CardHeader` mit `CardHeading` (Titel, Unterzeile) und
`CardAction`, Inhalt in `CardContent`, optional `CardFooter`.

Fertig, wenn jede umgestellte Seite genau eine `h1` hat, keine Karte mehr ohne getönten Rand und
weißen Kern übrig ist und je Ansicht genau ein Knopf `default`/`primary` ist.

## 4. Tabellen

```sh
npx shadcn@latest add Bagalut78/avanti-design/data-table
npx shadcn@latest add Bagalut78/avanti-design/avatar
```

`data-table` bringt `table`, `chip`, `skeleton` und `empty-state` mit. Listen mit Suche, Filtern,
Sortieren und Blättern werden zu `DataTable` (Spalten mit `sortValue`, `hideBelow`, eine Spalte
`primary`); einfache Tabellen nutzen die `Table`-Bausteine mit `CellStack` und `SortableTableHead`.
Status als `Badge`, Personen mit `Avatar` vor dem Namen.

Fertig, wenn Zeilen 40 px hoch sind, Köpfe sortierbar sind (`aria-sort`), Laden einen Platzhalter
statt Drehkreisel zeigt, Leer genau eine Aktion anbietet, „Keine Treffer“ zurücksetzen lässt und
die Seite bei schmalem Fenster nicht seitlich scrollt.

## 5. Kennzahlen und Grafiken

```sh
npx shadcn@latest add Bagalut78/avanti-design/kpi-tile
npx shadcn@latest add Bagalut78/avanti-design/mini-charts
npx shadcn@latest add Bagalut78/avanti-design/segmented
```

Kennzahlen werden zu `KpiTile` mit `previous`, `better` und `comparison`, Verläufe zu `Sparkline`
oder `AreaChart`, Anteile zu `Gauge`. Zeiträume wählt `Segmented` rechts im Kartenkopf. Keine
Chart-Bibliothek.

Fertig, wenn keine Kennzahl mehr ohne Veränderung und Bezug dasteht, jede Grafik eine Beschriftung
für Vorleser hat und die Werte zusätzlich als Text daneben stehen.

## 6. Seitenblatt statt Dialog

```sh
npx shadcn@latest add Bagalut78/avanti-design/side-sheet
```

Objekte aus Listen, Tabellen und Kalendern öffnen im `SideSheet` (Zeilen mit `SideSheetRow`, im
Fuß genau eine Primäraktion, `SideSheetClose` für „Abbrechen“). `DataTable` öffnet über
`onOpenRow` und markiert die Zeile mit `selectedKey`. Dialoge bleiben nur für kurze Rückfragen mit
höchstens einem Feld, lange Eingaben bekommen eine eigene Seite.

**Ausnahme laufendes Gespräch:** Auf Seiten, auf denen jemand gerade mit einem Kunden spricht oder
schreibt, öffnet sich nichts als Seitenblatt und nichts als Dialog, sondern alles in der Seite
(Bereich direkt über der Aktionsleiste).

Fertig, wenn kein Dialog mehr ein Objekt zeigt oder bearbeitet, Esc und Klick daneben das
Seitenblatt schließen, der Fokus danach auf der Zeile steht und auf Gesprächsseiten nichts die
Seite überlagert.

## 7. Bewegung

```sh
npx shadcn@latest add Bagalut78/avanti-design/motion
```

Karten und aufgeklappte Bereiche erscheinen mit `animate-ds-enter`, Gruppen versetzt über
`animationDelay: calc(var(--ds-stagger) * i)`; Inhalt nach dem Laden mit `animate-ds-fade-in`;
drückbare Elemente tragen `ds-press`. Eigene Übergänge nur mit den Tokens (`ease-ds-out`,
`ease-ds-in-out`, `--ds-duration*`), nur `transform` und `opacity`, nie `transition-all`.

Fertig, wenn `grep -rn "transition-all\|animate-pulse\|animate-spin" src` nichts mehr findet,
Tastaturaktionen sich nicht bewegen und mit „Bewegung reduzieren“ im System Zahlen sofort auf dem
Endwert und Grafiken sofort fertig stehen.
