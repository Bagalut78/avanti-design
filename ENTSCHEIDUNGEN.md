# Entscheidungen beim Aufbau

Was beim Umzug der Designsprache 2 in dieses Repo entschieden wurde. Wo die Vorgabe keine Antwort
gab, ist die einfachste Variante gewählt und mit **BITTE PRÜFEN** markiert.

## Umbenennung „Seitenblatt“

1. **`Sheet` heißt `SideSheet`** (`SideSheetRow`, `SideSheetClose`, Datei `side-sheet.tsx`), im
   Text „Seitenblatt“ – wie vorgegeben. Damit `grep -ri sheet src` nur noch das Seitenblatt zeigt,
   sind auch die zugehörigen Namen umbenannt: `data-slot` `ds-side-sheet`, `ds-side-sheet-overlay`,
   `ds-side-sheet-row`; im Thema `animate-ds-side-sheet-in/out`, Keyframes `ds-side-sheet-in/out`
   und `--ds-side-sheet-x`. **Werte, Dauer und Kurven sind unverändert.** **BITTE PRÜFEN:** Apps,
   die die alten Token-Namen (`animate-ds-sheet-*`, `--ds-sheet-x`) schon benutzen, müssen sie beim
   Umstellen mit umbenennen.

## Thema

2. **Inhalt von `themes/avanti.css`:** Marken-Tokens (`brand-*`, `score-*`), die Grundfarben der
   Oberfläche (`primary`, `foreground`, `sidebar-*`, …), Schriften, Basis-Stile, die beiden
   Scrollleisten-Klassen und der vollständige Block der Designsprache 2. **Nicht übernommen** sind
   die Tokens der Arbeitsansichten der Quell-App (Korridore, Deckung, Pausen, Telefonie …) und der
   Import von `tw-animate-css`: Kein Baustein benutzt sie, und sie sind fachlich, nicht Marke.
   **BITTE PRÜFEN**, ob eine weitere App einige davon als gemeinsame Tokens braucht.
3. **Logo:** Im Quellmaterial gibt es kein avanti-Logo, nur das der Quell-App. Die Logo-Regeln
   (weiß auf dem Rahmen, Höhe 22 px bzw. 20 px) stehen als Kommentar im Thema; die App gibt ihr Logo
   über `brand`/`mobileBrand` hinein. Die Musterseite zeigt eine Wortmarke als Platzhalter.
   **BITTE PRÜFEN:** Soll die avanti-Wortmarke als Datei in dieses Repo?
4. **Kein Dark Mode** (wie in der Quelle); alles läuft über Tokens.

## Leitfaden

5. **Markenneutral formuliert:** Wo die Regeln Marke nannten, steht die Rolle: „dunkelblauer
   Rahmen“ → „dunkler Rahmen in der führenden Markenfarbe“, „Poppins“ → „Display-Schrift“,
   „türkiser Strich“ → „Strich in der Akzentfarbe (`sidebar-primary`)“, „Orange ist nie eine
   Buttonfläche“ → „Eine Statusfarbe ist nie eine Knopffläche“. Regel 7 verwies auf zwei Ansichten
   der Quell-App; jetzt allgemein: Arbeitsansichten, die eine Lage grafisch zeigen, bleiben grafisch.
   Verweise auf Referenz-Screenshots und Pfade der Quell-App sind entfernt. Regel 9 (mit „nichts
   überlagert ein laufendes Gespräch“) und Regel 12 stehen vollständig drin. **BITTE PRÜFEN.**
6. Die **Tabelle der Bausteine gegen die avanti suite** steht in LEITFADEN.md; Abweichungen sind
   ohne Bezug auf die Quell-App begründet. `motion.ts` (`usePrefersReducedMotion`, `useCountUp`)
   ist als eigene Zeile ergänzt.

## Code

7. **Importe über Aliase:** `@/lib/…` statt `../cn` und `../../../lib/design`; Bausteine
   untereinander weiter relativ (`./badge`). So schreibt shadcn die Importe beim Einbau auf die
   Aliase der App um.
8. **`src/lib/table.ts` heißt `src/lib/table-logic.ts`.** Beim Probe-Einbau mit `shadcn add` hat
   die CLI `@/lib/table` in `table.tsx` auf den Baustein `table` umgeschrieben (sie löst Importe
   über den Dateinamen auf), der Typecheck der App schlug fehl. Ein Test verbietet jetzt gleiche
   Dateinamen über Einträge hinweg.
9. **`Result`** (`src/lib/result.ts`) ist neu: `contrast.ts` importierte es aus einem Modul der
   Quell-App. Gleiche Form (`{ ok, value }` / `{ ok, error }`).
10. **`class-variance-authority` ist nicht eingetragen,** weil kein Baustein es benutzt (die
    Varianten sind Tabellen von Klassen). Es kommt dazu, sobald ein Baustein es braucht.

## Tests

11. **Alle Tests sind übernommen,** die Bausteine-Tests aus `v2.test.tsx` unverändert bis auf
    Namen (`Sheet` → `SideSheet`) in `src/ui/ui.test.tsx`. Datenänderungen ohne Einfluss auf das
    Geprüfte: In `nav.test.ts` heißt der Pfad `/schichtplanung` jetzt `/dienstplan` (die Prüfung
    auf App-Reste findet sonst „schichtplan“).
12. **Musterseite (`design.test.tsx`):** Die drei Zugangstests der Quelle prüften Rollen und
    Router der Quell-App (Admin sieht die Seite, Planer bekommt „Kein Zugriff“, Agent landet im
    Portal). Rollen und Router gibt es hier nach Festlegung 6 nicht. Sie sind durch drei Tests
    derselben Stelle ersetzt: Eintrag „Design-Muster“ unter Stammdaten › System; unbekannter Pfad
    → kein Eintrag aktiv, die Seite läuft; Klick in der Navigation macht den Eintrag aktiv (ohne
    Router). Die übrigen fünf Tests sind mit den neuen Beispieldaten übernommen.
    **BITTE PRÜFEN.**
13. **Neue Tests:** `Chip – Regel 12 › behält beim Umschalten Größe und Textposition`,
    `src/ui/theme-tokens.test.ts` (jede benutzte `ds`-Klasse, Variable und Farbe ist im Thema
    definiert) und `src/registry.test.ts` (Schema und Abhängigkeiten der Registry).

## Musterseite

14. **Beispiel-Navigation** eines erfundenen Kundenservice (Übersicht, Anliegen, Mein Team,
    Auswertung, Stammdaten). Die Links führen auf Hash-Pfade (`#/team/antraege`), damit die gebaute
    Seite ohne Server und Router läuft; der Inhalt bleibt die Musterseite, nur der aktive Eintrag
    wechselt.
15. **Ergänzt:** ein Abschnitt „Knopf“ (Varianten, Größen, gesperrt), damit wirklich jeder
    Baustein mit seinen Zuständen zu sehen ist, und offene **Anträge**, die im Seitenblatt öffnen
    (Festlegung 6 nennt Anträge als Beispieldaten).
16. **Beispielnamen:** erfundene, häufige Namen aus dem Quellmaterial (z. B. „Lena Hoffmann“),
    keine echten Personen. **BITTE PRÜFEN**, ob es noch neutraler sein soll (z. B. „Person A“).

## Registry

17. **Abhängigkeiten untereinander** stehen als `Bagalut78/avanti-design/<name>`. Bloße Namen
    löst shadcn im eigenen Standard-Register auf (`button` wäre dann der shadcn-Knopf). Diese
    Adressen zeigen auf den Zweig `main`: **Vor dem Merge** findet `shadcn add` die abhängigen
    Einträge deshalb noch nicht. Geprüft ist der Einbau mit der gebauten Registry als lokale Dateien
    in einer Probe-App (Vite, React, TypeScript, Tailwind 4): 21 Dateien angelegt, Typecheck und
    Build grün.
18. **Das Thema ist kein Pflicht-Eintrag der Bausteine;** es wird einmal eingebaut (ANWENDEN,
    Schritt 1), sonst würde jeder `add` die CSS-Datei erneut schreiben wollen. Ziel ist
    `src/styles/avanti.css`. **BITTE PRÜFEN**, ob Apps einen anderen Ort brauchen.
19. **`public/r/` ist nicht eingecheckt:** Die CLI liest `registry.json` und die Quelldateien direkt
    aus dem Repo; `npm run registry:build` (in der CI) prüft nur, dass der Build fehlerfrei läuft.
    Die CLI ist in `package.json` auf `shadcn@4.23.0` festgelegt, ANWENDEN.md nennt wie vorgegeben
    `shadcn@latest`.

## Werkzeuge

20. Vite warnt erst ab 600 kB je Paket: Die Musterseite ist eine Vorführung in einem Paket
    (React, radix-ui, motion, lucide-react, rund 510 kB, 160 kB gzip).
