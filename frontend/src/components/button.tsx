import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 active:scale-[0.98]',
  secondary:
    'bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border-default)] hover:bg-[var(--hover-bg)] active:scale-[0.98]',
  outline:
    'bg-transparent text-[var(--fg-default)] border border-[var(--border-default)] hover:bg-[var(--hover-bg)] active:scale-[0.98]',
  ghost:
    'bg-transparent text-[var(--fg-muted)] hover:text-[var(--fg-default)] hover:bg-[var(--hover-bg)] active:scale-[0.98]',
  destructive:
    'bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:opacity-90 active:scale-[0.98]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-[var(--control-sm)] px-3 text-[var(--text-xs)] gap-1.5',
  md: 'h-[var(--control-md)] px-4 text-[var(--text-sm)] gap-2',
  lg: 'h-[var(--control-lg)] px-5 text-[var(--text-base)] gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center font-medium rounded-[var(--button-radius)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:bg-[var(--disabled-bg)] disabled:text-[var(--disabled-fg)] ${
          variantStyles[variant]
        } ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

