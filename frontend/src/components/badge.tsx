import { type HTMLAttributes, type ReactNode } from 'react';

export type BadgeVariant =
  | 'neutral'
  | 'primary'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'info';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral:
    'bg-[var(--bg-muted)] text-[var(--fg-muted)] border border-[var(--border-default)]',
  primary:
    'bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20',
  success:
    'bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20',
  warning:
    'bg-[var(--warning)]/15 text-[var(--warning)] border border-[var(--warning)]/25',
  destructive:
    'bg-[var(--destructive)]/10 text-[var(--destructive)] border border-[var(--destructive)]/20',
  info:
    'bg-[var(--info)]/10 text-[var(--info)] border border-[var(--info)]/20',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[11px] px-2 py-0.5 gap-1',
  md: 'text-[var(--text-xs)] px-2.5 py-1 gap-1.5',
};

export function Badge({
  variant = 'neutral',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full tracking-tight transition-colors duration-[var(--duration-fast)] ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

