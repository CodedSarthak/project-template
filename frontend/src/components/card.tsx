import { type HTMLAttributes, type ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
}

export function Card({ children, hoverable = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--card-radius)] shadow-[var(--shadow-sm)] p-6 transition-all duration-[var(--duration-fast)] ${
        hoverable
          ? 'hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`flex flex-col space-y-1.5 pb-4 ${className}`}>{children}</div>;
}

export function CardTitle({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`text-[var(--text-lg)] font-semibold tracking-tight text-[var(--fg-default)] ${className}`}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-[var(--text-sm)] text-[var(--fg-muted)] leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`text-[var(--text-sm)] text-[var(--fg-default)] ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center pt-4 border-t border-[var(--border-muted)] ${className}`}
    >
      {children}
    </div>
  );
}

