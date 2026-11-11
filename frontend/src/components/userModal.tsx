import { type ReactNode } from 'react';
import { Modal } from './modal.js';
import { Button } from './button.js';
import { Badge } from './badge.js';

export interface UserProfileField {
  label: string;
  value: ReactNode;
}

export interface UserProfileData {
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  badge?: string;
  fields?: UserProfileField[];
  [key: string]: unknown;
}

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  user?: UserProfileData | null;
  fields?: UserProfileField[];
  onLogout?: () => void;
  logoutLabel?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function UserModal({
  isOpen,
  onClose,
  title = 'Account Profile',
  user,
  fields,
  onLogout,
  logoutLabel = 'Sign out',
  actions,
  children,
  className = '',
}: UserModalProps) {
  const resolvedFields: UserProfileField[] =
    fields ||
    user?.fields ||
    [
      user?.id ? { label: 'User ID', value: String(user.id) } : null,
      user?.email ? { label: 'Email', value: String(user.email) } : null,
    ].filter(Boolean) as UserProfileField[];

  const initials = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={title}
      className={className}
      footer={
        <>
          {onLogout && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              {logoutLabel}
            </Button>
          )}
          {actions}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="ml-auto"
          >
            Close
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* User Card Header */}
        <div className="flex items-center gap-4">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || 'User avatar'}
              className="h-14 w-14 rounded-[var(--radius-lg)] object-cover border border-[var(--border-default)] shadow-[var(--shadow-xs)]"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--primary)] text-[var(--primary-foreground)] text-[var(--text-xl)] font-bold shadow-[var(--shadow-xs)]">
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-[var(--text-base)] font-bold text-[var(--fg-default)] truncate">
                {user?.name || user?.email || 'User'}
              </h4>
              {user?.badge && (
                <Badge variant="primary" size="sm">
                  {user.badge}
                </Badge>
              )}
            </div>
            {user?.email && user?.name && (
              <p className="text-[var(--text-xs)] text-[var(--fg-muted)] truncate mt-0.5">
                {user.email}
              </p>
            )}
          </div>
        </div>

        {/* Dynamic Detail Fields */}
        {resolvedFields.length > 0 && (
          <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-subtle)] p-3.5 space-y-2">
            {resolvedFields.map((field, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-[var(--text-xs)] gap-2"
              >
                <span className="font-medium text-[var(--fg-muted)]">{field.label}</span>
                <span className="font-semibold text-[var(--fg-default)] truncate">
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Custom Application Slot */}
        {children}
      </div>
    </Modal>
  );
}
