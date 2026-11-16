import {
  CalendarOff,
  Calendar,
  Check,
  Clock,
  Download,
  Inbox,
  MessageSquareText,
  PhoneIncoming,
  Plus,
  Users,
  X,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useDocumentTitle } from './useDocumentTitle';
import { Button } from '@/ui/button';
import { Avatar } from '@/ui/avatar';
import { Badge } from '@/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
} from '@/ui/card';
import { Chip } from '@/ui/chip';
import { DataTable } from '@/ui/data-table';
import { EmptyState } from '@/ui/empty-state';
import { KpiTile } from '@/ui/kpi-tile';
import { AreaChart, Gauge, Sparkline } from '@/ui/mini-charts';
import { PageHeader } from '@/ui/page-header';
import { Segmented } from '@/ui/segmented';
import { SideSheet, SideSheetClose, SideSheetRow } from '@/ui/side-sheet';
import { Skeleton } from '@/ui/skeleton';
import { AgentSideSheet, DesignExample } from './DesignExample';
import { AGENT_COLUMNS, ONE, stagger } from './designColumns';
import { SAMPLE_AGENTS, SAMPLE_KPIS, SAMPLE_REQUESTS, type SampleRequest } from './sampleData';

const SECTIONS = [
  ['rahmen', 'Ebenen und Karte'],
  ['kennzahlen', 'Kennzahl-Kachel'],
  ['grafiken', 'Mini-Grafiken'],
  ['etiketten', 'Badge, Avatar, Chip'],
  ['knopf', 'Knopf'],
  ['umschalter', 'Umschalter'],
  ['tabelle', 'Datentabelle'],
  ['zustaende', 'Laden und leer'],
  ['seitenblatt', 'Seitenblatt'],
  ['beispiel', 'Beispielseite'],
] as const;

/** Seitenblatt zu einem Antrag: Zeilen mit Symbol, genau eine Primäraktion im Fuß. */
function RequestSideSheet({
  request,
  onClose,
}: {
  request: SampleRequest | null;
  onClose: () => void;
}) {
  return (
    <SideSheet
      open={request !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={request ? `${request.person}: ${request.kind}` : ''}
      badge={<Badge tone="warning">Wartet</Badge>}
      description={request?.team ?? ''}
      footer={
        <>
          <SideSheetClose asChild>
            <Button variant="outline">Ablehnen</Button>
          </SideSheetClose>
          <SideSheetClose asChild>
            <Button>
              <Check aria-hidden="true" />
              Genehmigen
            </Button>
          </SideSheetClose>
        </>
      }
    >
      {request && (
        <>
          <SideSheetRow icon={Calendar} label="Zeitraum">
            {request.period}
          </SideSheetRow>
          <SideSheetRow icon={MessageSquareText} label="Begründung">
            {request.reason}
          </SideSheetRow>
          <SideSheetRow icon={Users} label="Auswirkung">
            {request.impact}
          </SideSheetRow>
        </>
      )}
    </SideSheet>
  );
}

/** Abschnitt der Musterseite: Überschrift (h2) mit Anker, darunter die Bausteine. */
function Section({
  id,
  title,
  note,
  children,
}: {
  id: (typeof SECTIONS)[number][0];
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-titel`} className="scroll-mt-6">
      <div className="mb-3">
        <h2 id={`${id}-titel`} className="text-base text-foreground">
          {title}
        </h2>
        <p className="text-[13px] text-muted-foreground">{note}</p>
      </div>
      {children}
    </section>
  );
}

/** Kleine Bühne für einen Zustand mit Beschriftung darüber. */
function Stage({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

/**
 * Musterseite der Designsprache 2: jeder Baustein mit seinen Zuständen und am Ende eine
 * Beispielseite aus festen Daten. Sie läuft im App-Rahmen (`DesignFrame`). Regeln: LEITFADEN.md.
 */
export function DesignPage() {
  useDocumentTitle('Design-Muster');
  const [chips, setChips] = useState<ReadonlySet<string>>(new Set(['Nord']));
  const [view, setView] = useState<'tag' | 'woche' | 'monat'>('woche');
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [request, setRequest] = useState<SampleRequest | null>(null);

  return (
    <div className="mx-auto flex max-w-[1240px] flex-col gap-10 px-4 py-6 md:px-8 md:py-8">
      <PageHeader
        title="Design-Muster"
        path={['Stammdaten', 'System']}
        subtitle="Bausteine der Designsprache 2 mit ihren Zuständen, am Ende eine Beispielseite aus festen Beispieldaten."
        badge={<Badge tone="info">Designsprache 2</Badge>}
      />

      <nav aria-label="Abschnitte" className="-mt-4">
        <ul className="flex flex-wrap gap-1.5">
          {SECTIONS.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="ds-press inline-flex h-7 items-center rounded-ds-control border border-ds-line bg-ds-core px-2.5 text-xs text-foreground outline-none hover:bg-ds-hover focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Section
        id="rahmen"
        title="Ebenen und Karte"
        note="Drei Ebenen: dunkler Rahmen, helle Arbeitsfläche, Karte mit getöntem Rand und weißem Kern. Karten sind immer gleich aufgebaut: Titel, gedämpfte Unterzeile, Steuerung rechts, Inhalt, Fußzeile."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="animate-ds-enter" style={stagger(0)}>
            <CardHeader>
              <CardHeading>
                <CardTitle as="h3">Karte mit allen Teilen</CardTitle>
                <CardDescription>Gedämpfte Unterzeile mit dem Zweck.</CardDescription>
              </CardHeading>
              <CardAction>
                <Badge tone="neutral">3 offen</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-[13px] text-foreground">
                Der Inhalt steht im weißen Kern. Text 13 px, Zeilen 40 px – die Dichte bleibt.
              </p>
            </CardContent>
            <CardFooter>
              <span>Fußzeile: Hinweis links</span>
              <a href="#rahmen" className="font-medium text-primary hover:underline">
                Weiter-Link rechts
              </a>
            </CardFooter>
          </Card>
          <Card compact className="animate-ds-enter" style={stagger(1)}>
            <CardHeader compact>
              <CardHeading>
                <CardTitle as="h3">Kompakte Karte</CardTitle>
                <CardDescription>Für Seitenleisten und dichte Raster.</CardDescription>
              </CardHeading>
            </CardHeader>
            <CardContent compact>
              <ul className="flex flex-col divide-y divide-ds-line text-[13px]">
                {SAMPLE_AGENTS.slice(0, 3).map((a) => (
                  <li key={a.id} className="flex h-10 items-center gap-2.5">
                    <Avatar name={a.name} size="sm" />
                    <span className="flex-1 truncate">{a.name}</span>
                    <span className="text-muted-foreground tabular-nums">{a.shift}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        id="kennzahlen"
        title="Kennzahl-Kachel"
        note="Große Zahl, die beim Erscheinen hochzählt, Veränderung mit Pfeil und Vorzeichen (besser grün, schlechter rot, gleich grau) und ein Mini-Verlauf."
      >
        <Card>
          <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <Stage label="besser (steigt)">
              <KpiTile
                icon={PhoneIncoming}
                label="Angebotene Anrufe"
                value={SAMPLE_KPIS.calls.value}
                previous={SAMPLE_KPIS.calls.previous}
                comparison="ggü. Vorwoche"
                trend={SAMPLE_KPIS.calls.trend}
              />
            </Stage>
            <Stage label="besser (sinkt)">
              <KpiTile
                icon={Clock}
                label="Mittlere Wartezeit"
                value={SAMPLE_KPIS.asa.value}
                previous={SAMPLE_KPIS.asa.previous}
                better="down"
                format={(n) => `${String(Math.round(n))} s`}
                comparison="ggü. Vorwoche"
                trend={SAMPLE_KPIS.asa.trend}
              />
            </Stage>
            <Stage label="schlechter">
              <KpiTile
                icon={CalendarOff}
                label="Shrinkage"
                value={SAMPLE_KPIS.shrinkage.value}
                previous={SAMPLE_KPIS.shrinkage.previous}
                better="down"
                format={(n) => `${ONE.format(n)} %`}
                formatChange={(n) => `${ONE.format(n)} Pp.`}
                comparison="ggü. Vorwoche"
                trend={SAMPLE_KPIS.shrinkage.trend}
              />
            </Stage>
            <Stage label="unverändert, ohne Verlauf">
              <KpiTile icon={Users} label="Aktive Mitarbeiter" value={148} previous={148} />
            </Stage>
          </CardContent>
        </Card>
      </Section>

      <Section
        id="grafiken"
        title="Mini-Grafiken"
        note="Eigenes SVG ohne Chart-Bibliothek: Verlaufslinie, Fläche mit Verlauf, Bogen. Sie zeichnen sich beim Erscheinen einmal; jede hat eine Beschriftung für Vorleser."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardHeading>
                <CardTitle as="h3">Verlaufslinie</CardTitle>
                <CardDescription>Marke, besser, schlechter, neutral</CardDescription>
              </CardHeading>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {(
                [
                  ['brand', SAMPLE_KPIS.calls.trend],
                  ['up', SAMPLE_KPIS.serviceLevel.trend],
                  ['down', SAMPLE_KPIS.shrinkage.trend],
                  ['neutral', SAMPLE_KPIS.asa.trend],
                ] as const
              ).map(([tone, values]) => (
                <div key={tone} className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase">
                    {tone}
                  </span>
                  <Sparkline values={values} tone={tone} label={`Verlaufslinie ${tone}`} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardHeading>
                <CardTitle as="h3">Fläche mit Verlauf</CardTitle>
                <CardDescription>Service Level der letzten 14 Tage</CardDescription>
              </CardHeading>
            </CardHeader>
            <CardContent>
              <AreaChart
                values={SAMPLE_KPIS.serviceLevel.trend}
                tone="up"
                label="Service Level der letzten 14 Tage zwischen 74 und 89 Prozent"
                ticks={['vor 14 Tagen', 'heute']}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardHeading>
                <CardTitle as="h3">Bogen</CardTitle>
                <CardDescription>Anteil an einem Ziel</CardDescription>
              </CardHeading>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Gauge
                value={82}
                total={100}
                label="Service Level 82 % von 100 %"
                center="82 %"
                caption="Service Level"
                size={180}
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        id="etiketten"
        title="Badge, Avatar, Chip"
        note="Getönte Etiketten mit feiner Linie (nie nur Farbe), Avatare mit Initialen statt Fotos, Filter-Chips zum Umschalten."
      >
        <Card>
          <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Stage label="Badge">
              <div className="flex flex-wrap gap-1.5">
                <Badge tone="success">Genehmigt</Badge>
                <Badge tone="warning">Wartet</Badge>
                <Badge tone="danger">Abgelehnt</Badge>
                <Badge tone="info">Info</Badge>
                <Badge tone="neutral">Entwurf</Badge>
                <Badge tone="outline">Umriss</Badge>
              </div>
            </Stage>
            <Stage label="Avatar">
              <div className="flex flex-wrap items-center gap-2">
                {SAMPLE_AGENTS.slice(0, 5).map((a) => (
                  <span key={a.id} className="flex items-center gap-1.5 text-[13px]">
                    <Avatar name={a.name} />
                    {a.name.split(' ')[0]}
                  </span>
                ))}
                <Avatar name="Ben Zimmermann" size="sm" />
              </div>
            </Stage>
            <Stage label="Chip">
              <div role="group" aria-label="Team (Beispiel)" className="flex flex-wrap gap-1.5">
                {['Nord', 'Süd', 'West'].map((t) => (
                  <Chip
                    key={t}
                    selected={chips.has(t)}
                    onClick={() => {
                      setChips((s) => {
                        const next = new Set(s);
                        if (next.has(t)) next.delete(t);
                        else next.add(t);
                        return next;
                      });
                    }}
                  >
                    {t}
                  </Chip>
                ))}
              </div>
            </Stage>
          </CardContent>
        </Card>
      </Section>

      <Section
        id="knopf"
        title="Knopf"
        note="Varianten und Größen wie in der avanti suite. Genau eine Primäraktion je Ansicht; Druck gibt Rückmeldung, Orange ist nie eine Knopffläche."
      >
        <Card>
          <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Stage label="Varianten">
              <div className="flex flex-wrap items-center gap-2">
                <Button>Primär</Button>
                <Button variant="outline">Umriss</Button>
                <Button variant="secondary">Zweitrangig</Button>
                <Button variant="ghost">Ohne Fläche</Button>
                <Button variant="destructive">Löschen</Button>
                <Button variant="link">Link</Button>
              </div>
            </Stage>
            <Stage label="Größen">
              <div className="flex flex-wrap items-center gap-2">
                <Button size="lg">Groß</Button>
                <Button>Standard</Button>
                <Button size="sm">Klein</Button>
                <Button size="xs">Sehr klein</Button>
                <Button size="icon" variant="outline" aria-label="Exportieren">
                  <Download aria-hidden="true" />
                </Button>
                <Button size="icon-sm" variant="ghost" aria-label="Entfernen">
                  <X aria-hidden="true" />
                </Button>
              </div>
            </Stage>
            <Stage label="Mit Symbol, gesperrt">
              <div className="flex flex-wrap items-center gap-2">
                <Button>
                  <Plus aria-hidden="true" />
                  Anlegen
                </Button>
                <Button disabled>Gesperrt</Button>
                <Button variant="outline" disabled>
                  Gesperrt
                </Button>
              </div>
            </Stage>
          </CardContent>
        </Card>
      </Section>

      <Section
        id="umschalter"
        title="Umschalter"
        note="Segmente für wenige gleichrangige Ansichten. Pfeiltasten wählen; die Marke gleitet bei Klick und springt bei Tastatur sofort."
      >
        <Card>
          <CardContent className="flex flex-wrap items-center gap-4">
            <Segmented
              label="Ansicht"
              value={view}
              onValueChange={setView}
              options={[
                { value: 'tag', label: 'Tag' },
                { value: 'woche', label: 'Woche' },
                { value: 'monat', label: 'Monat' },
              ]}
            />
            <span className="text-[13px] text-muted-foreground">
              Gewählt: <span className="text-foreground">{view}</span>
            </span>
          </CardContent>
        </Card>
      </Section>

      <Section
        id="tabelle"
        title="Datentabelle"
        note="Suche, Filter-Chips, sortierbare Köpfe, zweizeilige Zellen, Aktionen in der Zeile, Blättern – bei 40 px Zeilenhöhe. Hier im Lade- und im leeren Zustand; die volle Tabelle zeigt die Beispielseite."
      >
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardHeading>
                <CardTitle as="h3">Lädt</CardTitle>
                <CardDescription>Platzhalter statt Drehkreisel</CardDescription>
              </CardHeading>
            </CardHeader>
            <CardContent className="overflow-hidden p-0">
              <DataTable
                rows={SAMPLE_AGENTS}
                columns={AGENT_COLUMNS.slice(0, 4)}
                rowKey={(a) => a.id}
                label="Tabelle lädt (Beispiel)"
                loading
                empty={{ message: '' }}
                pageSize={5}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardHeading>
                <CardTitle as="h3">Leer</CardTitle>
                <CardDescription>Ein Satz und genau eine Aktion</CardDescription>
              </CardHeading>
            </CardHeader>
            <CardContent className="overflow-hidden p-0">
              <DataTable
                rows={[]}
                columns={AGENT_COLUMNS.slice(0, 4)}
                rowKey={(a) => a.id}
                label="Leere Tabelle (Beispiel)"
                empty={{
                  icon: Inbox,
                  title: 'Noch niemand eingeplant',
                  message: 'Für heute gibt es noch keine Schichten.',
                  action: (
                    <Button size="sm">
                      <Plus aria-hidden="true" />
                      Schicht anlegen
                    </Button>
                  ),
                }}
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        id="zustaende"
        title="Laden und leer"
        note="Platzhalter erscheinen nach kurzer Zeit weich und bleiben ruhig – nichts blinkt, nichts wiederholt sich. Leere Zustände sagen, was fehlt, und bieten eine Aktion."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardContent>
              <Stage label="Ladezustand">
                <Skeleton lines={4} label="Beispiel lädt" />
              </Stage>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-0">
              <EmptyState
                icon={Inbox}
                title="Keine offenen Anträge"
                message="Gerade wartet nichts auf eine Entscheidung."
                compact
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        id="seitenblatt"
        title="Seitenblatt"
        note="Ein Objekt im Zusammenhang ansehen oder bearbeiten: Das Seitenblatt gleitet von rechts herein, die Seite bleibt abgedunkelt sichtbar. Esc oder Klick daneben schließen, der Fokus kehrt zurück."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardContent className="flex flex-col items-start gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSideSheetOpen(true);
                }}
              >
                Seitenblatt öffnen
              </Button>
              <span className="text-[13px] text-muted-foreground">
                Dialog bleibt für kurze Rückfragen; lange Eingaben bekommen eine eigene Seite. Bei
                einem laufenden Gespräch öffnet sich alles in der Seite, nie als Seitenblatt oder
                Dialog.
              </span>
            </CardContent>
          </Card>
          <Card compact>
            <CardHeader compact>
              <CardHeading>
                <CardTitle as="h3">Offene Anträge</CardTitle>
                <CardDescription>Ein Klick öffnet den Antrag im Seitenblatt.</CardDescription>
              </CardHeading>
              <CardAction>
                <Badge tone="warning">{SAMPLE_REQUESTS.length} offen</Badge>
              </CardAction>
            </CardHeader>
            <CardContent compact className="p-0">
              <ul className="flex flex-col divide-y divide-ds-line text-[13px]">
                {SAMPLE_REQUESTS.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setRequest(r);
                      }}
                      className="flex h-10 w-full items-center gap-2.5 px-3 text-left outline-none transition-colors duration-150 ease-ds-out hover:bg-ds-hover focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset"
                    >
                      <Avatar name={r.person} size="sm" />
                      <span className="flex-1 truncate">{r.person}</span>
                      <span className="text-muted-foreground">{r.kind}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <RequestSideSheet
          request={request}
          onClose={() => {
            setRequest(null);
          }}
        />
        <AgentSideSheet
          agent={sideSheetOpen ? (SAMPLE_AGENTS[0] ?? null) : null}
          onClose={() => {
            setSideSheetOpen(false);
          }}
        />
      </Section>

      <Section
        id="beispiel"
        title="Beispielseite"
        note="Alles zusammen: Seitenkopf, vier Kennzahl-Kacheln, Karte mit Grafik, Datentabelle und ein Seitenblatt beim Klick auf eine Zeile."
      >
        <div className="rounded-ds-workspace border border-dashed border-ds-line-strong p-3 md:p-5">
          <DesignExample />
        </div>
      </Section>
    </div>
  );
}
