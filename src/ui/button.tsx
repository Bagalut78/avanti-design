import { Slot } from 'radix-ui';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/** Varianten wie in der avanti suite (`primary` = `default`: die eine Primäraktion, Dunkelblau). */
export type ButtonVariant =
  'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary';

export type ButtonSize = 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-sm';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Abweichung von der Suite (`asChild?: never`): erlaubt einen Link als Knopf (Router-`Link`
   * der App), ohne dass der Baustein einen Router kennt.
   */
  asChild?: boolean;
}

const VARIANT: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground shadow-ds-1 hover:bg-primary/90',
  primary: 'bg-primary text-primary-foreground shadow-ds-1 hover:bg-primary/90',
  destructive: 'bg-destructive text-white shadow-ds-1 hover:bg-destructive/90',
  outline: 'border border-ds-line-strong bg-ds-core text-foreground shadow-ds-1 hover:bg-ds-hover',
  secondary: 'bg-ds-frame text-foreground hover:bg-ds-placeholder',
  ghost: 'text-foreground hover:bg-ds-hover',
  link: 'text-primary underline-offset-4 hover:underline',
};

const SIZE: Record<ButtonSize, string> = {
  default: 'h-9 px-4 has-[>svg]:px-3.5',
  xs: "h-6 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
  sm: 'h-8 gap-1.5 px-3',
  lg: 'h-11 px-6 text-[15px]',
  icon: 'size-9',
  'icon-sm': 'size-8',
};

/**
 * Knopf der Designsprache 2 (Name, Varianten und Größen wie in der avanti suite): Höhen wie bisher
 * (36 px), Radius der Steuerung, weicher Schatten an Flächenknöpfen, Druck-Rückmeldung
 * (`ds-press`: nur Farbe, Schatten, Deckkraft und `transform`, nie `transition-all`). Orange ist
 * nie eine Knopffläche; genau eine Primäraktion je Ansicht.
 */
export function Button({
  variant = 'default',
  size = 'default',
  asChild = false,
  className,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      data-slot="ds-button"
      data-variant={variant}
      {...(asChild ? {} : { type: type ?? 'button' })}
      className={cn(
        "ds-press inline-flex shrink-0 items-center justify-center gap-2 rounded-ds-control text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:[stroke-width:1.75] [&_svg:not([class*='size-'])]:size-4",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...props}
    />
  );
}
