import { motion } from 'motion/react';
import { useId } from 'react';
import { arcPath, areaPath, linePath, shareOf } from '@/lib/charts';
import { cn } from '@/lib/cn';
import { DRAW_SECONDS, EASE_OUT, usePrefersReducedMotion } from './motion';

/**
 * Mini-Grafiken der Designsprache 2 als eigenes SVG (keine Chart-Bibliothek): Verlaufslinie,
 * Fläche mit Verlauf und Bogen. Sie zeichnen sich beim Erscheinen einmal (600 ms, ease-out); bei
 * weniger Bewegung stehen sie sofort. Jede Grafik ist ein `img` mit Beschriftung – die Zahlen
 * stehen zusätzlich als Text daneben (Kennzahl, Legende).
 */

export type ChartTone = 'brand' | 'up' | 'down' | 'neutral';

const STROKE: Record<ChartTone, string> = {
  brand: 'var(--chart-1)',
  up: 'var(--ds-up)',
  down: 'var(--ds-down)',
  neutral: 'var(--muted-foreground)',
};

function useDraw() {
  const still = usePrefersReducedMotion();
  return still
    ? { initial: false as const }
    : {
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: 1, opacity: 1 },
        transition: { duration: DRAW_SECONDS, ease: EASE_OUT },
      };
}

export interface SparklineProps {
  values: readonly number[];
  /** Beschriftung für Vorleser, z. B. „Service Level der letzten 14 Tage“. */
  label: string;
  tone?: ChartTone;
  width?: number;
  height?: number;
  className?: string;
}

/** Verlaufslinie ohne Achsen (für Kennzahl-Kacheln und Tabellenzellen). */
export function Sparkline({
  values,
  label,
  tone = 'brand',
  width = 120,
  height = 36,
  className,
}: SparklineProps) {
  const draw = useDraw();
  const d = linePath(values, { width, height, inset: 2 });
  return (
    <svg
      role="img"
      aria-label={label}
      data-slot="ds-sparkline"
      viewBox={`0 0 ${String(width)} ${String(height)}`}
      width={width}
      height={height}
      className={cn('block shrink-0 overflow-visible', className)}
    >
      {d && (
        <motion.path
          d={d}
          fill="none"
          stroke={STROKE[tone]}
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          {...draw}
        />
      )}
    </svg>
  );
}

export interface AreaChartProps extends SparklineProps {
  /** Beschriftung unter der Fläche (z. B. Tage), höchstens wenige Einträge. */
  ticks?: readonly string[];
}

/** Fläche mit Verlauf: Linie zeichnet sich, die Fläche darunter blendet weich ein. */
export function AreaChart({
  values,
  label,
  tone = 'brand',
  width = 320,
  height = 120,
  ticks,
  className,
}: AreaChartProps) {
  const id = useId();
  const draw = useDraw();
  const still = usePrefersReducedMotion();
  const box = { width, height, inset: 4 };
  const line = linePath(values, box);
  const area = areaPath(values, box);
  return (
    <figure data-slot="ds-area-chart" className={cn('m-0 min-w-0', className)}>
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${String(width)} ${String(height)}`}
        className="block h-auto w-full overflow-visible"
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={STROKE[tone]} stopOpacity={0.22} />
            <stop offset="100%" stopColor={STROKE[tone]} stopOpacity={0} />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0}
            x2={width}
            y1={height * f}
            y2={height * f}
            stroke="var(--ds-line)"
            strokeDasharray="2 4"
          />
        ))}
        {area && (
          <motion.path
            d={area}
            fill={`url(#${id}-fill)`}
            {...(still
              ? { initial: false as const }
              : {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { duration: DRAW_SECONDS, ease: EASE_OUT, delay: 0.15 },
                })}
          />
        )}
        {line && (
          <motion.path
            d={line}
            fill="none"
            stroke={STROKE[tone]}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...draw}
          />
        )}
      </svg>
      {ticks && ticks.length > 0 && (
        <figcaption
          aria-hidden="true"
          className="mt-1 flex justify-between text-[11px] text-muted-foreground"
        >
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}

export interface GaugeProps {
  value: number;
  total: number;
  /** Beschriftung für Vorleser, z. B. „Service Level 82 % von 100 %“. */
  label: string;
  /** Text in der Mitte (groß) und darunter (klein). */
  center?: string;
  caption?: string;
  tone?: ChartTone;
  size?: number;
  className?: string;
}

/** Bogen (Halbkreis) für einen Anteil: Spur in Hellgrau, gefüllter Teil zeichnet sich. */
export function Gauge({
  value,
  total,
  label,
  center,
  caption,
  tone = 'brand',
  size = 200,
  className,
}: GaugeProps) {
  const draw = useDraw();
  const stroke = Math.round(size * 0.09);
  const r = size / 2 - stroke / 2;
  const cx = size / 2;
  const cy = size / 2;
  const h = size / 2 + stroke / 2;
  const share = shareOf(value, total);
  const fill = arcPath(share, cx, cy, r);
  return (
    <div data-slot="ds-gauge" className={cn('relative inline-block', className)}>
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${String(size)} ${String(h)}`}
        width={size}
        height={h}
        className="block max-w-full"
      >
        <path
          d={arcPath(1, cx, cy, r)}
          fill="none"
          stroke="var(--ds-placeholder)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {fill && (
          <motion.path
            d={fill}
            fill="none"
            stroke={STROKE[tone]}
            strokeWidth={stroke}
            strokeLinecap="round"
            {...draw}
          />
        )}
      </svg>
      {(center ?? caption) && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 flex flex-col items-center leading-tight"
        >
          {center && (
            <span className="font-display text-2xl font-semibold text-foreground tabular-nums">
              {center}
            </span>
          )}
          {caption && <span className="text-xs text-muted-foreground">{caption}</span>}
        </div>
      )}
    </div>
  );
}
