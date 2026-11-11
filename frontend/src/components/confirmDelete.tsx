import { type ReactNode } from 'react';
import { Modal } from './modal.js';
import { Button } from './button.js';

export type ConfirmVariant = 'destructive' | 'warning' | 'primary';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  title?: ReactNode;
  description?: ReactNode;
  variant?: ConfirmVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  isDeleting?: boolean; // Backwards compatibility alias
  icon?: ReactNode;
  children?: ReactNode;
}

export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Are you sure?',
  description = 'This action cannot be undone. Please confirm to proceed.',
  variant = 'destructive',
  confirmLabel,
  cancelLabel = 'Cancel',
  isLoading = false,
  isDeleting = false,
  icon,
  children,
}: ConfirmDialogProps) {
  const isBusy = isLoading || isDeleting;
  const defaultConfirmText =
    confirmLabel || (variant === 'destructive' ? 'Delete' : 'Confirm');

  const defaultIcon = (
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] text-lg ${
        variant === 'destructive'
          ? 'bg-[var(--destructive)]/10 text-[var(--destructive)] border border-[var(--destructive)]/20'
          : variant === 'warning'
          ? 'bg-[var(--warning)]/15 text-[var(--warning)] border border-[var(--warning)]/25'
          : 'bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20'
      }`}
    >
      {variant === 'destructive' ? '⚠️' : variant === 'warning' ? '⚡' : 'ℹ️'}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      size="sm"
      showCloseButton={!isBusy}
      closeOnOverlayClick={!isBusy}
    >
      <div className="flex flex-col items-start gap-4">
        {icon || defaultIcon}

        <div>
          <h4 className="text-[var(--text-lg)] font-bold text-[var(--fg-default)] tracking-tight">
            {title}
          </h4>
          <p className="mt-1.5 text-[var(--text-sm)] text-[var(--fg-muted)] leading-relaxed">
            {description}
          </p>
        </div>

        {children && <div className="w-full mt-2">{children}</div>}

        <div className="flex w-full items-center justify-end gap-3 mt-4 pt-4 border-t border-[var(--border-muted)]">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onCancel}
            disabled={isBusy}
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            variant={variant === 'destructive' ? 'destructive' : 'primary'}
            size="md"
            onClick={onConfirm}
            isLoading={isBusy}
          >
            {defaultConfirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Backwards-compatible export
export const ConfirmDelete = ConfirmDialog;
