import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface EmptyStateProps {
  message: string;
  title?: string;
  /** Genau eine Aktion – die, die den leeren Zustand beendet. */
  action?: ReactNode;
  compact?: boolean;
  icon?: LucideIcon;
}

/** Leerer Zustand (Name und Props wie in der avanti suite): Symbol, Titel, ein Satz, eine Aktion. */
export function EmptyState({
  message,
  title,
  action,
  compact = false,
  icon: Icon,
}: EmptyStateProps) {
  return (
    <div
      data-slot="ds-empty-state"
      className={cn(
        'flex animate-ds-fade-in flex-col items-center text-center',
        compact ? 'px-4 py-6' : 'px-6 py-12',
      )}
    >
      {Icon && (
        <span
          className={cn(
            'mb-3 flex items-center justify-center rounded-ds-control border border-ds-line bg-ds-frame shadow-ds-1',
            compact ? 'size-8' : 'size-10',
          )}
        >
          <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
        </span>
      )}
      {title && <p className="text-sm font-medium text-foreground">{title}</p>}
      <p className={cn('max-w-sm text-[13px] text-muted-foreground', title && 'mt-1')}>{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
