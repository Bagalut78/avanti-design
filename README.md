# avanti design

Die Designsprache 2 für alle avanti-Apps an einem Ort: Leitfaden, Thema mit allen Tokens,
Bausteine (React) und reine Helfer. Jede App bezieht sie von hier – zuerst die avanti suite, später
weitere. Dieses Repo ist die einzige Quelle der Designsprache; Änderungen am Aussehen entstehen hier
und gehen von hier in die Apps.

- **[LEITFADEN.md](LEITFADEN.md)** – die Regeln, markenneutral.
- **[ANWENDEN.md](ANWENDEN.md)** – eine bestehende App Schritt für Schritt umstellen.
- **[ENTSCHEIDUNGEN.md](ENTSCHEIDUNGEN.md)** – was beim Aufbau entschieden wurde und noch zu prüfen
  ist.

## Aufbau

```
LEITFADEN.md        Regeln der Designsprache, ohne Bezug auf eine einzelne App
ANWENDEN.md         Schrittfolge, um eine bestehende App umzustellen
themes/avanti.css   Marke avanti: Farben, Schriften, Logo-Regeln, alle ds-Tokens
src/ui/             Bausteine (AppShell, Sidebar, PageHeader, Card, DataTable, SideSheet, …)
src/lib/            reine Helfer ohne React (Grafik-Pfade, Tabelle, Navigation, Kontrast)
src/muster/         Musterseite mit Beispieldaten (jeder Baustein, am Ende eine Beispielseite)
registry.json       shadcn-Registry: ein Eintrag je Baustein, dazu Thema und Helfer
```

Stack: Vite, React, TypeScript (strict), Tailwind 4, radix-ui, lucide-react, motion, vitest. Es
gibt keine weitere Bibliothek; die shadcn-CLI läuft nur über `npx` (Registry bauen, Bausteine in
Apps einbauen) und ist keine Abhängigkeit.

## Bausteine in eine App holen

```sh
npx shadcn@latest add Bagalut78/avanti-design/<name>
```

Die CLI liest `registry.json` direkt aus diesem Repo (Zweig `main`), kopiert die Dateien in die App
und bringt Pakete und abhängige Bausteine mit. Namen: `avanti-theme`, `app-shell`, `sidebar`,
`page-header`, `card`, `button`, `badge`, `chip`, `avatar`, `table`, `data-table`, `skeleton`,
`empty-state`, `kpi-tile`, `mini-charts`, `segmented`, `side-sheet`, `motion` und die Helfer
`lib-cn`, `lib-result`, `lib-charts`, `lib-contrast`, `lib-nav`, `lib-table`. Vorbereitung und
Reihenfolge stehen in [ANWENDEN.md](ANWENDEN.md).

## Befehle

| Befehl                   | Zweck                                                               |
| ------------------------ | ------------------------------------------------------------------- |
| `npm ci`                 | Abhängigkeiten installieren                                         |
| `npm run dev`            | Musterseite lokal ansehen                                           |
| `npm run check`          | Typprüfung, ESLint ohne Warnungen, Prettier, Tests und Build        |
| `npm run build`          | Musterseite als statische Seite nach `dist/`                        |
| `npm run test`           | nur die Tests (Vitest)                                              |
| `npm run format`         | Prettier schreibt alle Dateien                                      |
| `npm run registry:build` | `shadcn build`: prüft `registry.json` und erzeugt `public/r/*.json` |

Die Tests prüfen außer den Bausteinen und Helfern auch das Thema (Kontrast nach WCAG 2.1 AA, jedes
benutzte Token ist definiert) und `registry.json` (Schema, jede Datei in genau einem Eintrag, jeder
Import als Paket oder Eintrag angegeben).

## Lizenz

Eine Lizenz ist noch nicht festgelegt – das entscheidet Matthias, bis dahin liegt keine
LICENSE-Datei bei.
