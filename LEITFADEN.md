# Leitfaden – Designsprache 2

Regeln der Designsprache 2 für alle avanti-Apps. Ziel ist eine moderne Oberfläche mit **Tiefe und
Bewegung** statt flacher Flächen, ohne Informationsdichte zu verlieren. Der Leitfaden ist
markenneutral: Farbwerte, Schriften und Logo-Regeln stehen im Thema
([`themes/avanti.css`](themes/avanti.css)); hier stehen nur Rollen und Token-Namen. Wie eine
bestehende App umgestellt wird, steht in [ANWENDEN.md](ANWENDEN.md).

Zu sehen ist alles auf der Musterseite (`npm run dev`): jeder Baustein mit seinen Zuständen und am
Ende eine Beispielseite.

## Regeln

1. **Ebenen.** Drei Ebenen, von hinten nach vorn: der **dunkle Rahmen** in der führenden
   Markenfarbe (`ds-canvas`, zugleich Hintergrund der Seitenleiste), die **abgerundete
   Arbeitsfläche** (`ds-workspace`, Radius 18 px, weicher Schatten) und darauf **Karten mit
   getöntem Rand und weißem Kern** (`ds-frame` mit feiner Linie, darin `ds-core`). Kopf und
   Fußzeile stehen auf dem getönten Rand, der Inhalt im weißen Kern. Linien sind fein (`ds-line`),
   nie dunkel.
2. **Schatten.** Sehr weich, in der führenden Markenfarbe getönt, genau drei Stufen: `shadow-ds-1`
   (Karten, aktive Segmente, Steuerung in Ruhe), `shadow-ds-2` (Arbeitsfläche), `shadow-ds-3`
   (Seitenblatt, Schublade). Kein Schatten als Hover-Effekt an Karten; Rückmeldung gibt die Fläche
   (`ds-hover`) oder der Druck.
3. **Radien.** Arbeitsfläche 18 px (`rounded-ds-workspace`), Karte 14 px (`rounded-ds-card`), Kern
   10 px (`rounded-ds-core`), Steuerung 8 px (`rounded-ds-control`), Badge 6 px
   (`rounded-ds-badge`). Innen kleiner als außen, damit die Ränder parallel laufen.
4. **Kartenaufbau – immer gleich:** Titel (Display-Schrift, 14 px), darunter eine gedämpfte
   Unterzeile mit dem Zweck, **rechts die Steuerung** (Umschalter, Auswahl, Zähler-Badge), dann der
   Inhalt im weißen Kern, unten optional eine **Fußzeile** (Hinweis links, Weiter-Link rechts).
   `compact` für Seitenleisten und dichte Raster.
5. **Tabellen.** In einer Karte: Werkzeugzeile mit Suche und **Filter-Chips** (je Gruppe „eins der
   gewählten“, Gruppen zusammen „alle“), **sortierbare Köpfe** (Knopf im Kopf, `aria-sort`,
   Klickfolge auf → ab → aus), **zweizeilige Zellen** (Wert, darunter gedämpft der Kontext), Avatar
   mit Initialen vor Namen, **getönte Badges** für Status, **Aktionen am Zeilenende**, **Blättern**
   unten (Zeilen je Seite, „1–10 von 23“, Seitenknöpfe). Die benennende Spalte ist ein Knopf, der
   das Objekt im Seitenblatt öffnet; ein Klick auf die Zeile tut dasselbe.
6. **Dichte vor Dekoration bleibt.** Zeilen in Rastern und Tabellen **40 px** (zweizeilige Zellen
   passen hinein: 13/16 px + 11/14 px), Köpfe 36 px, Text 13 px, Titel der Seite 22 px – die
   Schriftgrößen ändern sich nicht. Tiefe und Bewegung kommen dazu, Informationsdichte geht nicht
   verloren. Schmale Fenster blenden Spalten aus (`hideBelow`), die Seite scrollt nie seitlich.
7. **Zahlen mit Kontext.** Eine Kennzahl steht nie allein: **große Zahl** (Display-Schrift, 28 px),
   darunter die **Veränderung** als getöntes Etikett mit Pfeil und Vorzeichen (besser grün,
   schlechter rot, gleich grau – je Kennzahl festgelegt, ob „mehr“ besser ist) und der Bezug
   („ggü. Vorwoche“), rechts ein **Mini-Verlauf**. Für Vorleser ein Satz mit Endwert und Bewertung.
   Arbeitsansichten, die eine Lage grafisch zeigen (Raster, Kurven), bleiben grafisch und tragen
   Zahlen im Tooltip oder in der Zusammenfassung; auf Übersichts- und Berichtsseiten stehen Zahlen
   sichtbar.
8. **Grafiken sind eigene Bausteine** in eigenem SVG (keine Chart-Bibliothek): Verlaufslinie,
   Fläche mit Verlauf, Bogen. Jede ist ein `img` mit Beschriftung; die Werte stehen zusätzlich als
   Text daneben.
9. **Seitenblatt, Dialog oder Seite:**
   - **Seitenblatt** – ein Objekt im Zusammenhang einer Liste, Tabelle oder eines Kalenders
     ansehen oder bearbeiten (Abwesenheit, Zeitkorrektur, Ausfall melden, Einteilung,
     Öffnungszeiten, Antrag mit Auswirkung, Zeitleiste einer Person). Es gleitet von rechts herein,
     die Seite bleibt abgedunkelt und leicht weichgezeichnet sichtbar. Kopf: Titel, Badge,
     Schließen; Inhalt als Zeilen mit Symbol; Fuß mit den Aktionen (genau eine Primäraktion). Esc
     und Klick daneben schließen, der Fokus kehrt auf das auslösende Element zurück.
   - **Dialog** – kurze Rückfrage oder Bestätigung mit höchstens einem Feld (Begründung,
     Ablehnungsgrund, Löschen).
   - **Eigene Seite** – lange oder mehrstufige Eingaben.
   - **Nichts überlagert ein laufendes Gespräch** (aus der avanti suite): Auf Seiten, auf denen
     jemand gerade mit einem Kunden spricht oder schreibt, öffnet sich alles **in der Seite**
     (Bereich direkt über der Aktionsleiste), weder als Seitenblatt noch als Dialog. Das
     Seitenblatt gilt für Listen, Verwaltung und Auswertung.
   - **Name:** Das Blatt von rechts heißt „Seitenblatt“ (`SideSheet`), weil „Sheet“ in der avanti
     suite das Aktenblatt eines Vorgangs bezeichnet.
10. **Aktivzustand mit Fläche.** In der Seitenleiste trägt der aktive Eintrag eine helle Fläche
    (`ds-nav-active`), weiße Schrift und einen Strich in der Akzentfarbe links (`sidebar-primary`);
    Bereiche haben Symbole, stehen in Gruppen („Arbeit“, „Einrichten“) und klappen auf, der Bereich
    der aktiven Seite ist offen.
11. **Zustände.** Laden: **Platzhalter** in der Form des Inhalts, erst nach 300 ms und einmal weich
    eingeblendet, ohne Puls (`Skeleton`). Leer: Symbol, Titel, ein Satz, **genau eine** Aktion
    (`EmptyState`); ohne Treffer bei Suche/Filter ein eigener Zustand mit „zurücksetzen“. Fehler:
    deutscher Satz mit dem nächsten Schritt.
12. **Ein Zustandswechsel ändert nie die Größe.** Gewählt, aktiv, geladen, fehlerhaft: Ein
    Bedienelement behält Breite, Höhe und die Position seines Textes. Was im neuen Zustand
    dazukommt (Häkchen, Lade-Symbol, Zähler), hat seinen Platz schon vorher und blendet nur ein.
    Nachbarn rücken nie. Beispiel `Chip`: Der Platz für das Häkchen ist links immer frei, rechts
    steht derselbe Abstand.

Dazu gilt weiter:

- **Eine Primäraktion je Ansicht.** Eine Statusfarbe ist nie eine Knopffläche.
- **Farbe ist nie die einzige Information:** Etiketten tragen Text, Veränderungen Pfeil und
  Vorzeichen, gewählte Chips ein Häkchen.
- **Fokusringe bleiben sichtbar.** Text erreicht 4,5:1, bedeutungstragende Linien und Rahmen 3:1
  (WCAG 2.1 AA); das Thema belegt das mit einem Test.
- **Sprache:** Deutsch, die Oberfläche duzt, sachlich und freundlich.

## Bewegung

Grundlage sind die Bewegungsregeln der avanti suite: kurz, nur `transform`/`opacity`, Erscheinen
`ease-out`, Platzwechsel `ease-in-out`, nie `ease-in`, nie `transition-all`, Ausblenden kürzer als
Einblenden, Tastaturaktionen bewegen sich nie. Dazu kommt `motion` für Hochzählen und Zeichnen.

| Bewegung                                     | Dauer, Kurve                                                                      | Wo                                               |
| -------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------ |
| Erscheinen (`animate-ds-enter`)              | 180 ms, ease-out, 4 px von unten, Versatz 40 ms je Element (`--ds-stagger`)       | Karten, aufgeklappte Bereiche                    |
| Einblenden (`animate-ds-fade-in`)            | 160 ms, nur Deckkraft                                                             | leere Zustände, Inhalt nach dem Laden            |
| Platzhalter (`animate-ds-placeholder-in`)    | 160 ms nach 300 ms Vorlauf                                                        | `Skeleton` – kurze Ladezeiten blitzen nicht auf  |
| Seitenblatt (`animate-ds-side-sheet-in/out`) | 200 ms rein, 150 ms raus, von rechts; Fläche dahinter 200/150 ms                  | `SideSheet`                                      |
| Druck (`ds-press`)                           | 160 ms, `scale(0.97)` beim Halten                                                 | Chips, Seitenknöpfe, Schließen, Abschnitts-Links |
| Hover                                        | 150–160 ms, nur Farbe/Fläche                                                      | Zeilen, Menüeinträge                             |
| Marke des Umschalters                        | 200 ms, ease-in-out bei Klick; **sofort** bei Tastatur                            | `Segmented`                                      |
| Hochzählen                                   | 700 ms (`--ds-duration-count`), ease-out, einmal beim Erscheinen                  | `KpiTile`                                        |
| Zeichnen                                     | 600 ms (`--ds-duration-draw`), ease-out, einmal; Fläche blendet 150 ms später ein | Mini-Grafiken                                    |

Hochzählen und Zeichnen sind länger als 200 ms, weil sie selten passieren (einmal beim Öffnen einer
Seite) und den Blick auf die Zahl lenken sollen; die Suite lässt Zahlen springen – hier ist es eine
bewusste Abweichung für Übersichtsseiten. **Nichts blinkt, nichts wiederholt sich** (kein Puls, kein
Schimmer, keine Endlosschleife), keine Bewegung an Tastatur-Navigation, keine Bewegung beim
Routenwechsel. **`prefers-reduced-motion: reduce`** nimmt den Weg heraus (`--ds-enter-y: 0`,
`--ds-side-sheet-x: 0`, `--ds-press-scale: 1`, kein Versatz), Ein- und Ausblenden bleiben; Zahlen
stehen sofort auf dem Endwert, Grafiken sofort fertig (`usePrefersReducedMotion`,
`MotionConfig reducedMotion="user"` im Rahmen der App).

## Tokens

Alle Namen tragen das Präfix `ds`, damit keine Klasse der App (z. B. Tailwinds `ease-out`) ihre
Bedeutung ändert. Die Werte setzt das Thema; ein Test prüft, dass jedes Token, das ein Baustein
benutzt, im Thema definiert ist.

| Token                                                                                     | Rolle                                                       |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `ds-canvas`                                                                               | Rahmen hinter der Arbeitsfläche, Seitenleiste               |
| `ds-workspace`                                                                            | abgerundete Arbeitsfläche                                   |
| `ds-frame` / `ds-core`                                                                    | getönter Rand und weißer Kern der Karte                     |
| `ds-line` / `ds-line-strong`                                                              | feine Linien / Rahmen von Steuerung                         |
| `ds-hover` / `ds-placeholder`                                                             | Hover-Fläche / Platzhalter, Spur des Bogens                 |
| `ds-scrim`                                                                                | Fläche hinter dem Seitenblatt (mit 2 px Weichzeichnung)     |
| `ds-nav-active` / `ds-nav-active-foreground`                                              | aktiver Menüeintrag                                         |
| `ds-up` / `ds-down`                                                                       | Veränderung besser / schlechter, Verlaufslinien             |
| `ds-{success,warning,danger,info,neutral}-{bg,fg,line}`                                   | getönte Badges, Avatare, Veränderung (Text ≥ 4,5:1)         |
| `shadow-ds-1…3`, `rounded-ds-*`                                                           | siehe Regeln 2 und 3                                        |
| `ease-ds-out` / `ease-ds-in-out`                                                          | Erscheinen / Platzwechsel, Kurven wie in der Suite          |
| `--ds-duration*`, `--ds-enter-y`, `--ds-side-sheet-x`, `--ds-press-scale`, `--ds-stagger` | siehe Bewegung; unter reduced motion ohne Weg               |
| `primary`, `foreground`, `muted-foreground`, `ring`, `input`, `destructive`, `sidebar-*`  | Grundfarben der Oberfläche (Aktion, Text, Fokus, Felder, …) |

## Bausteine gegen die avanti suite

Namen und Props folgen den Bausteinen der avanti suite (`apps/suite/src/ui`, Stand 16.11.2026),
damit eine Umstellung der Suite ein Umfärben ist, kein Umbau. Abweichungen mit Begründung:

| Baustein (Datei in `src/ui`)                                                                                               | In der Suite                                                             | Abweichung und Begründung                                                                                                                                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppShell` (`app-shell.tsx`)                                                                                               | `AppShell`                                                               | Props: `groups`, `currentPath`, `brand`, `footer`, `renderLink`, `mobileBrand` statt Mandanten-/Rollenprops der Suite – der Rahmen kennt keine App-Logik; den Router-Link gibt die App hinein, damit der Baustein ohne Router testbar bleibt.             |
| `Sidebar`, `NavItem`, `NavGroup` (`sidebar.tsx`, `nav-types.ts`)                                                           | `Sidebar`, `NavItem`, `NavGroup`                                         | `NavItem` hat `sections` (aufklappbare Bereiche mit Untergruppen) statt `subgroup`/`area`, damit Menüs mit drei Ebenen (Bereich › Gruppe › Seite) passen. Die Gruppen baut die App (in der Suite `buildGroups`; Beispiel: `navGroupsOf` der Musterseite). |
| `PageHeader` (`page-header.tsx`)                                                                                           | `PageHeader` (`title`, `subtitle`, `actions`, `badge`)                   | zusätzlich `path` (Pfad über dem Titel; in der Suite trägt ihn die `Topbar`, die nicht jede App hat) und `headingLevel` (nur für Beispiele innerhalb einer Seite).                                                                                        |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` (`card.tsx`)                             | gleich, mit `compact`                                                    | zusätzlich `CardHeading` (Titel und Unterzeile) und `CardAction` (Steuerung rechts).                                                                                                                                                                      |
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `SortableTableHead`, `TableEmpty`, `TableCell` (`table.tsx`) | gleich                                                                   | zusätzlich `CellStack` (zweizeilige Zelle).                                                                                                                                                                                                               |
| `DataTable` (`data-table.tsx`)                                                                                             | –                                                                        | neu: Suche, Filter-Chips, Sortieren, Blättern, Laden, Leer in einem Baustein; Logik in `src/lib/table-logic.ts`.                                                                                                                                          |
| `Button` (`button.tsx`)                                                                                                    | `Button` (Varianten `default` … `primary`, Größen `default` … `icon-sm`) | gleich; `asChild` erlaubt (Router-Link als Knopf). Druck über `ds-press` statt `transition-all`.                                                                                                                                                          |
| `Badge` (`badge.tsx`)                                                                                                      | `Badge` mit `tone` (Varianten und Aliase)                                | gleich; getönt **mit Linie**.                                                                                                                                                                                                                             |
| `Chip` (`chip.tsx`)                                                                                                        | `Chip` mit `selected`                                                    | gleich; gewählt mit Häkchen (nicht nur Farbe), Größe bleibt beim Umschalten (Regel 12).                                                                                                                                                                   |
| `Skeleton` (`skeleton.tsx`)                                                                                                | `Skeleton` (`label`, `className`, `lines`)                               | gleich; ohne Puls (Regel „nichts wiederholt sich“).                                                                                                                                                                                                       |
| `EmptyState` (`empty-state.tsx`)                                                                                           | `EmptyState` (`message`, `title`, `action`, `compact`, `icon`)           | gleich.                                                                                                                                                                                                                                                   |
| `KpiTile` (`kpi-tile.tsx`)                                                                                                 | – (die Suite lässt Zahlen springen)                                      | neu; Name nach Zweck.                                                                                                                                                                                                                                     |
| `Sparkline`, `AreaChart`, `Gauge` (`mini-charts.tsx`)                                                                      | `BalkenDiagramm`, `LinienDiagramm`                                       | andere Bausteine: Mini-Grafiken ohne Achsen für Kacheln und Karten; englische Namen wie alle Bausteine hier.                                                                                                                                              |
| `SideSheet`, `SideSheetRow`, `SideSheetClose` (`side-sheet.tsx`)                                                           | nur `ProbeSheet` (fachlich)                                              | neu und allgemein; heißt „Seitenblatt“, weil `Sheet` in der Suite das Aktenblatt eines Vorgangs ist.                                                                                                                                                      |
| `Segmented` (`segmented.tsx`)                                                                                              | – (`Tabs` mit gleitendem Strich)                                         | neu; `radiogroup` mit Pfeiltasten, Marke gleitet wie der Tab-Strich der Suite.                                                                                                                                                                            |
| `Avatar` (`avatar.tsx`)                                                                                                    | –                                                                        | neu; nur Initialen, keine Fotos (Personaldaten, kein Bildspeicher).                                                                                                                                                                                       |
| `usePrefersReducedMotion`, `useCountUp` (`motion.ts`)                                                                      | –                                                                        | Hilfen für Hochzählen und Zeichnen (Abschnitt Bewegung).                                                                                                                                                                                                  |

Alle Bausteine haben Tests (Tastatur, Fokus, Zustände, reduced motion) in `src/ui/ui.test.tsx`.

## Für alle, die am Code arbeiten

- **Tokens statt Hex.** Farben kommen ausschließlich aus dem Thema (CSS-Variablen in `:root`, als
  Tailwind-Klassen über `@theme inline`). Fehlt ein Wert, wird dort ein Token ergänzt. Ausnahme:
  von Kunden gepflegte Farben (z. B. Arten von Abwesenheiten) als Daten.
- **Bausteine statt Einzelfall.** Wiederkehrendes gehört nach `src/ui`, reine Logik ohne React nach
  `src/lib` (Ergebnis statt Exception).
- **Keine neue Schrift, kein neues Icon-Set** (lucide-react), keine Chart-Bibliothek. Neue
  Bibliotheken nur, wenn frei lizenziert, gepflegt, ohne Datenabfluss und ohne Doppelung – mit
  Begründung im README.
