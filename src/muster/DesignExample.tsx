import {
  CalendarDays,
  Clock,
  Download,
  Gauge as GaugeIcon,
  Headphones,
  Hourglass,
  Pencil,
  PhoneIncoming,
  Timer,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/ui/button';
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
import { DataTable } from '@/ui/data-table';
import { KpiTile } from '@/ui/kpi-tile';
import { AreaChart, Gauge } from '@/ui/mini-charts';
import { PageHeader } from '@/ui/page-header';
import { Segmented } from '@/ui/segmented';
import { SideSheet, SideSheetClose, SideSheetRow } from '@/ui/side-sheet';
import { AGENT_COLUMNS, INT, ONE, STATUS_TONE, stagger } from './designColumns';
import {
  SAMPLE_AGENTS,
  SAMPLE_CALLS_BY_DAY,
  SAMPLE_COVERAGE,
  SAMPLE_KPIS,
  type SampleAgent,
} from './sampleData';

const TEAM_FILTER = {
  key: 'team',
  label: 'Team',
  options: ['Team Nord', 'Team Süd', 'Team West'].map((t) => ({ value: t, label: t.slice(5) })),
  valueOf: (a: SampleAgent) => a.team,
};

const STATUS_FILTER = {
  key: 'status',
  label: 'Status',
  options: (['Im Plan', 'Verspätet', 'Krank', 'Urlaub'] as const).map((s) => ({
    value: s,
    label: s,
  })),
  valueOf: (a: SampleAgent) => a.status,
};

/** Seitenblatt mit den Angaben zu einer Person (Beispiel für „Seitenblatt statt Seite“). */
export function AgentSideSheet({
  agent,
  onClose,
}: {
  agent: SampleAgent | null;
  onClose: () => void;
}) {
  return (
    <SideSheet
      open={agent !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={agent?.name ?? ''}
      badge={agent && <Badge tone={STATUS_TONE[agent.status]}>{agent.status}</Badge>}
      footer={
        <>
          <SideSheetClose asChild>
            <Button variant="outline">Schließen</Button>
          </SideSheetClose>
          <Button>
            <Pencil aria-hidden="true" />
            Schicht bearbeiten
          </Button>
        </>
      }
    >
      {agent && (
        <>
          <SideSheetRow icon={Users} label="Team">
            {agent.team}
          </SideSheetRow>
          <SideSheetRow icon={Headphones} label="Skill">
            {agent.skill}
          </SideSheetRow>
          <SideSheetRow icon={Clock} label="Schicht heute">
            {agent.shift}
            <div className="text-xs text-muted-foreground">{agent.shiftNote}</div>
          </SideSheetRow>
          <SideSheetRow icon={Timer} label="Stunden diese Woche">
            {ONE.format(agent.hours)} h von {ONE.format(agent.contract)} h
          </SideSheetRow>
          <SideSheetRow icon={GaugeIcon} label="Plantreue">
            {agent.adherence > 0 ? `${INT.format(agent.adherence)} %` : 'keine Schicht'}
          </SideSheetRow>
        </>
      )}
    </SideSheet>
  );
}

type Range = 'woche' | 'monat' | 'jahr';

/**
 * Beispielseite am Ende der Musterseite: Seitenkopf, vier Kennzahl-Kacheln, Karte mit Grafik,
 * Datentabelle und Seitenblatt beim Klick auf eine Zeile – alles aus festen Beispieldaten.
 */
export function DesignExample() {
  const [range, setRange] = useState<Range>('woche');
  const [open, setOpen] = useState<SampleAgent | null>(null);
  const share = SAMPLE_COVERAGE.planned / SAMPLE_COVERAGE.needed;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Woche im Blick"
        headingLevel={2}
        subtitle="KW 47 · 16.–22. November 2026 · Beispieldaten"
        badge={<Badge tone="neutral">Beispiel</Badge>}
        actions={
          <Button variant="outline">
            <Download aria-hidden="true" />
            Exportieren
          </Button>
        }
      />

      <Card className="animate-ds-enter" style={stagger(0)}>
        <CardHeader>
          <CardHeading>
            <CardTitle>Kennzahlen</CardTitle>
            <CardDescription>Anrufe, Erreichbarkeit und Ausfälle in einem Blick.</CardDescription>
          </CardHeading>
          <CardAction>
            <Segmented
              label="Zeitraum"
              value={range}
              onValueChange={setRange}
              options={[
                { value: 'woche', label: 'Woche' },
                { value: 'monat', label: 'Monat' },
                { value: 'jahr', label: 'Jahr' },
              ]}
            />
          </CardAction>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
          {[
            <KpiTile
              key="calls"
              icon={PhoneIncoming}
              label="Angebotene Anrufe"
              value={SAMPLE_KPIS.calls.value}
              previous={SAMPLE_KPIS.calls.previous}
              comparison="ggü. Vorwoche"
              trend={SAMPLE_KPIS.calls.trend}
            />,
            <KpiTile
              key="sl"
              icon={GaugeIcon}
              label="Service Level"
              value={SAMPLE_KPIS.serviceLevel.value}
              previous={SAMPLE_KPIS.serviceLevel.previous}
              format={(n) => `${ONE.format(n)} %`}
              formatChange={(n) => `${ONE.format(n)} Pp.`}
              comparison="ggü. Vorwoche"
              trend={SAMPLE_KPIS.serviceLevel.trend}
            />,
            <KpiTile
              key="asa"
              icon={Hourglass}
              label="Mittlere Wartezeit"
              value={SAMPLE_KPIS.asa.value}
              previous={SAMPLE_KPIS.asa.previous}
              better="down"
              format={(n) => `${INT.format(n)} s`}
              comparison="ggü. Vorwoche"
              trend={SAMPLE_KPIS.asa.trend}
            />,
            <KpiTile
              key="shrinkage"
              icon={CalendarDays}
              label="Shrinkage"
              value={SAMPLE_KPIS.shrinkage.value}
              previous={SAMPLE_KPIS.shrinkage.previous}
              better="down"
              format={(n) => `${ONE.format(n)} %`}
              formatChange={(n) => `${ONE.format(n)} Pp.`}
              comparison="ggü. Vorwoche"
              trend={SAMPLE_KPIS.shrinkage.trend}
            />,
          ].map((tile) => (
            <div key={tile.key} className="p-4 xl:border-l xl:border-ds-line xl:first:border-l-0">
              {tile}
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <span>Vorwoche: 17.150 Anrufe, Service Level 78,9 %.</span>
          <a href="#beispiel-tabelle" className="font-medium text-primary hover:underline">
            Zu den Mitarbeitern
          </a>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="animate-ds-enter" style={stagger(1)}>
          <CardHeader>
            <CardHeading>
              <CardTitle>Anrufe je Tag</CardTitle>
              <CardDescription>Angebotene Anrufe der Woche, alle Einheiten.</CardDescription>
            </CardHeading>
            <CardAction>
              <Badge tone="info">{INT.format(SAMPLE_KPIS.calls.value)} Anrufe</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <AreaChart
              values={SAMPLE_CALLS_BY_DAY.map((d) => d.calls)}
              label={`Anrufe je Tag: ${SAMPLE_CALLS_BY_DAY.map((d) => `${d.day} ${INT.format(d.calls)}`).join(', ')}`}
              ticks={SAMPLE_CALLS_BY_DAY.map((d) => d.day)}
              width={560}
              height={160}
            />
          </CardContent>
        </Card>
        <Card className="animate-ds-enter" style={stagger(2)}>
          <CardHeader>
            <CardHeading>
              <CardTitle>Besetzung</CardTitle>
              <CardDescription>Geplante gegen benötigte Stunden.</CardDescription>
            </CardHeading>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <Gauge
              value={SAMPLE_COVERAGE.planned}
              total={SAMPLE_COVERAGE.needed}
              label={`Besetzung ${INT.format(share * 100)} %: ${INT.format(SAMPLE_COVERAGE.planned)} von ${INT.format(SAMPLE_COVERAGE.needed)} Stunden`}
              center={`${INT.format(share * 100)} %`}
              caption="der benötigten Stunden"
              size={200}
            />
            <dl className="grid w-full grid-cols-2 gap-2 text-[13px]">
              <div className="rounded-ds-control border border-ds-line bg-ds-frame px-3 py-2">
                <dt className="text-xs text-muted-foreground">Geplant</dt>
                <dd className="font-medium tabular-nums">
                  {INT.format(SAMPLE_COVERAGE.planned)} h
                </dd>
              </div>
              <div className="rounded-ds-control border border-ds-line bg-ds-frame px-3 py-2">
                <dt className="text-xs text-muted-foreground">Fehlen</dt>
                <dd className="font-medium text-ds-warning-fg tabular-nums">
                  {INT.format(SAMPLE_COVERAGE.needed - SAMPLE_COVERAGE.planned)} h
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card id="beispiel-tabelle" className="animate-ds-enter" style={stagger(3)}>
        <CardHeader>
          <CardHeading>
            <CardTitle>Mitarbeiter heute</CardTitle>
            <CardDescription>Schicht, Status und Stunden je Person.</CardDescription>
          </CardHeading>
          <CardAction>
            <Badge tone="neutral">{SAMPLE_AGENTS.length} Personen</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="overflow-hidden p-0">
          <DataTable
            rows={SAMPLE_AGENTS}
            columns={AGENT_COLUMNS}
            rowKey={(a) => a.id}
            label="Mitarbeiter heute"
            noun="Personen"
            search={{ placeholder: 'Name oder Skill …', textOf: (a) => `${a.name} ${a.skill}` }}
            filters={[TEAM_FILTER, STATUS_FILTER]}
            onOpenRow={setOpen}
            selectedKey={open?.id ?? null}
            actions={(a) => (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`${a.name} bearbeiten`}
                onClick={() => {
                  setOpen(a);
                }}
              >
                <Pencil aria-hidden="true" />
              </Button>
            )}
            empty={{ message: 'Heute ist niemand eingeplant.' }}
            pageSize={5}
          />
        </CardContent>
      </Card>

      <AgentSideSheet
        agent={open}
        onClose={() => {
          setOpen(null);
        }}
      />
    </div>
  );
}
