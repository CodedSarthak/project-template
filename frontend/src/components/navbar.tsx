import { type ReactNode } from 'react';

export interface NavLinkItem {
  id: string;
  label: ReactNode;
  href?: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export interface NavbarUserProfile {
  name?: string;
  email?: string;
  avatarUrl?: string;
  initials?: string;
  role?: string;
}

export interface NavbarProps {
  brand?: ReactNode;
  title?: string;
  logo?: ReactNode;
  navLinks?: NavLinkItem[];
  searchSlot?: ReactNode;
  user?: NavbarUserProfile | null;
  userSlot?: ReactNode;
  onUserClick?: () => void;
  actions?: ReactNode;
  className?: string;
  // Backwards compatibility props
  appName?: string;
  userName?: string;
  userEmail?: string;
  onOpenProfile?: () => void;
}

export function Navbar({
  brand,
  title,
  logo,
  navLinks = [],
  searchSlot,
  user,
  userSlot,
  onUserClick,
  actions,
  className = '',
  // Backwards compatibility mappings
  appName = 'App Template',
  userName,
  userEmail,
  onOpenProfile,
}: NavbarProps) {
  const displayTitle = title || appName;
  const resolvedUser: NavbarUserProfile | null = user
    ? user
    : userName || userEmail
    ? { name: userName, email: userEmail }
    : null;
  const handleProfileClick = onUserClick || onOpenProfile;

  return (
    <header
      className={`sticky top-0 z-[var(--z-sticky)] flex h-[var(--header-height)] w-full items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-surface)] px-6 backdrop-blur-md transition-colors duration-[var(--duration-fast)] ${className}`}
    >
      {/* Left: Brand & Navigation */}
      <div className="flex items-center gap-6">
        {brand ? (
          brand
        ) : (
          <div className="flex items-center gap-3">
            {logo ? (
              logo
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-[var(--text-sm)] shadow-[var(--shadow-xs)]">
                {displayTitle.charAt(0)}
              </div>
            )}
            <span className="font-semibold text-[var(--fg-default)] text-[var(--text-base)] tracking-tight">
              {displayTitle}
            </span>
          </div>
        )}

        {/* Optional Navigation Links */}
        {navLinks.length > 0 && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className={`flex items-center gap-2 px-3 py-1.5 text-[var(--text-sm)] font-medium rounded-[var(--radius-md)] transition-colors duration-[var(--duration-fast)] ${
                  item.active
                    ? 'bg-[var(--active-bg)] text-[var(--primary)]'
                    : 'text-[var(--fg-muted)] hover:text-[var(--fg-default)] hover:bg-[var(--hover-bg)]'
                }`}
              >
                {item.icon && <span className="inline-flex shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Center: Search slot */}
      {searchSlot && (
        <div className="hidden lg:flex flex-1 max-w-md mx-6">{searchSlot}</div>
      )}

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center gap-3">
        {actions}

        {/* User profile section */}
        {userSlot ? (
          userSlot
        ) : resolvedUser ? (
          <button
            onClick={handleProfileClick}
            type="button"
            className="flex items-center gap-2.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-subtle)] py-1 pl-1.5 pr-3 text-[var(--text-xs)] font-medium text-[var(--fg-default)] transition-colors duration-[var(--duration-fast)] hover:border-[var(--border-strong)] hover:bg-[var(--hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {resolvedUser.avatarUrl ? (
              <img
                src={resolvedUser.avatarUrl}
                alt={resolvedUser.name || 'User avatar'}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold text-[11px]">
                {(resolvedUser.initials ||
                  resolvedUser.name ||
                  resolvedUser.email ||
                  'U'
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
            <div className="flex flex-col text-left max-w-[120px]">
              <span className="truncate font-medium text-[var(--fg-default)] leading-tight">
                {resolvedUser.name || resolvedUser.email}
              </span>
              {resolvedUser.role && (
                <span className="text-[10px] text-[var(--fg-muted)] leading-tight">
                  {resolvedUser.role}
                </span>
              )}
            </div>
          </button>
        ) : null}
      </div>
    </header>
  );
}
