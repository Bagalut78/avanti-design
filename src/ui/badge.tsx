import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { badgeTone, type BadgeTone } from './badge-tone';

export type { BadgeTone, BadgeVariant } from './badge-tone';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const TONE: Record<BadgeTone, string> = {
  default: 'border-ds-info-line bg-ds-info-bg text-ds-info-fg',
  info: 'border-ds-info-line bg-ds-info-bg text-ds-info-fg',
  success: 'border-ds-success-line bg-ds-success-bg text-ds-success-fg',
  warning: 'border-ds-warning-line bg-ds-warning-bg text-ds-warning-fg',
  destructive: 'border-ds-danger-line bg-ds-danger-bg text-ds-danger-fg',
  danger: 'border-ds-danger-line bg-ds-danger-bg text-ds-danger-fg',
  muted: 'border-ds-neutral-line bg-ds-neutral-bg text-ds-neutral-fg',
  neutral: 'border-ds-neutral-line bg-ds-neutral-bg text-ds-neutral-fg',
  outline: 'border-ds-line-strong bg-ds-core text-foreground',
};

/** Getöntes Etikett mit feiner Linie (Designsprache 2). Farbe nie allein: immer mit Text. */
export function Badge({ tone = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      data-slot="ds-badge"
      data-tone={badgeTone(tone)}
      className={cn(
        'inline-flex h-5 shrink-0 items-center gap-1 rounded-ds-badge border px-1.5 text-[11px] leading-none font-medium whitespace-nowrap',
        TONE[tone],
        className,
      )}
      {...props}
    />
  );
}
