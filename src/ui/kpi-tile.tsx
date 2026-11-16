import { ArrowDownRight, ArrowRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { deltaOf } from '@/lib/charts';
import { cn } from '@/lib/cn';
import { Badge } from './badge';
import { Sparkline } from './mini-charts';
import { useCountUp } from './motion';

const INTEGER = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });

export interface KpiTileProps {
  label: string;
  value: number;
  /** Anzeige der Zahl (Standard: ganze Zahl, deutsch). Auch fürs Hochzählen genutzt. */
  format?: (n: number) => string;
  /** Vorwert für die Veränderung; ohne keinen Vergleich. */
  previous?: number;
  /** In welche Richtung die Kennzahl besser wird (Standard „up“). */
  better?: 'up' | 'down';
  /** Bezug der Veränderung, z. B. „ggü. Vorwoche“. */
  comparison?: string;
  /** Format der Veränderung (Standard wie `format`, mit Vorzeichen). */
  formatChange?: (n: number) => string;
  /** Mini-Verlauf (z. B. die letzten 14 Tage). */
  trend?: readonly number[];
  icon?: LucideIcon;
  className?: string;
}

const signed = (text: string, n: number) => (n > 0 ? `+${text}` : n < 0 ? `−${text}` : text);

/**
 * Kennzahl-Kachel: große Zahl, die beim Erscheinen hochzählt (bei weniger Bewegung sofort), die
 * Veränderung als getöntes Etikett (besser grün, schlechter rot, gleich grau – mit Pfeil und
 * Vorzeichen, nie nur Farbe) und rechts ein Mini-Verlauf. Für Vorleser ein Satz mit Endwert.
 * Die Suite hat keine Kachel; Name nach Zweck (LEITFADEN.md).
 */
export function KpiTile({
  label,
  value,
  format = (n) => INTEGER.format(n),
  previous,
  better = 'up',
  comparison,
  formatChange,
  trend,
  icon: Icon,
  className,
}: KpiTileProps) {
  const shown = useCountUp(value);
  const delta = previous === undefined ? null : deltaOf(value, previous, better);
  const changeText = delta
    ? signed((formatChange ?? format)(Math.abs(delta.change)), delta.change)
    : null;
  const tone = !delta || delta.good === null ? 'muted' : delta.good ? 'success' : 'destructive';
  const Arrow =
    delta?.trend === 'up' ? ArrowUpRight : delta?.trend === 'down' ? ArrowDownRight : ArrowRight;
  const judgement =
    !delta || delta.good === null ? 'unverändert' : delta.good ? 'besser' : 'schlechter';
  const sentence = [
    `${label}: ${format(value)}`,
    changeText && `${changeText}${comparison ? ` ${comparison}` : ''}, ${judgement}`,
  ]
    .filter(Boolean)
    .join('; ');

  return (
    <div data-slot="ds-kpi-tile" className={cn('flex min-w-0 flex-col gap-2', className)}>
      <p className="sr-only">{sentence}</p>
      <div aria-hidden="true" className="flex items-center gap-1.5 text-[13px] text-foreground">
        {Icon && <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} />}
        <span className="truncate">{label}</span>
      </div>
      <div aria-hidden="true" className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div
            data-slot="ds-kpi-value"
            className="font-display text-[28px] leading-8 font-semibold text-foreground tabular-nums"
          >
            {format(shown)}
          </div>
          {changeText && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <Badge tone={tone} data-slot="ds-kpi-change" className="tabular-nums">
                <Arrow className="size-3" strokeWidth={2} />
                {changeText}
              </Badge>
              {comparison && <span className="text-xs text-muted-foreground">{comparison}</span>}
            </div>
          )}
        </div>
        {trend && trend.length > 1 && (
          <Sparkline
            values={trend}
            label={`Verlauf ${label}`}
            tone={tone === 'success' ? 'up' : tone === 'destructive' ? 'down' : 'brand'}
            width={96}
            height={36}
          />
        )}
      </div>
    </div>
  );
}
