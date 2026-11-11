import { useEffect, type ReactNode } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  size?: ModalSize;
  icon?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  icon,
  children,
  footer,
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[var(--z-overlay)] bg-[var(--bg-overlay)] backdrop-blur-sm transition-opacity duration-[var(--duration-normal)]"
        onClick={() => closeOnOverlayClick && onClose()}
      />

      {/* Dialog container */}
      <div
        className={`relative z-[var(--z-modal)] w-full rounded-[var(--dialog-radius)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-[var(--dialog-shadow)] transition-all duration-[var(--duration-normal)] ease-[var(--ease-out)] ${sizeStyles[size]} ${className}`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between pb-4 border-b border-[var(--border-muted)] gap-4">
            <div className="flex items-center gap-3">
              {icon && <div className="inline-flex shrink-0">{icon}</div>}
              <div>
                {title && (
                  <h3 className="text-[var(--text-lg)] font-semibold tracking-tight text-[var(--fg-default)]">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-1 text-[var(--text-xs)] text-[var(--fg-muted)] leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-[var(--radius-sm)] p-1.5 text-[var(--fg-muted)] hover:text-[var(--fg-default)] hover:bg-[var(--hover-bg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        {children && <div className="mt-5">{children}</div>}

        {/* Footer */}
        {footer && (
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-muted)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

