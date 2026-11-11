import { type ReactNode } from 'react';
import { Badge, type BadgeVariant } from './badge.js';

export interface SidebarItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  active?: boolean;
  badge?: ReactNode;
  badgeVariant?: BadgeVariant;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
}

export interface SidebarSection {
  id: string;
  title?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  items: Array<SidebarItem | SidebarSection>;
  header?: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

function isSection(item: SidebarItem | SidebarSection): item is SidebarSection {
  return 'items' in item && Array.isArray((item as SidebarSection).items);
}

export function Sidebar({
  items,
  header,
  footer,
  collapsed = false,
  onToggleCollapse,
  className = '',
}: SidebarProps) {
  const renderItem = (item: SidebarItem) => (
    <button
      key={item.id}
      type="button"
      onClick={item.onClick}
      disabled={item.disabled}
      className={`group flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-[var(--text-sm)] font-medium transition-colors duration-[var(--duration-fast)] disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)] ${
        item.active
          ? 'bg-[var(--active-bg)] text-[var(--primary)]'
          : 'text-[var(--fg-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--fg-default)]'
      }`}
    >
      {item.icon && (
        <span className="text-[var(--icon-md)] shrink-0 inline-flex items-center justify-center">
          {item.icon}
        </span>
      )}
      {!collapsed && (
        <span className="truncate flex-1 text-left">{item.label}</span>
      )}
      {!collapsed && item.badge !== undefined && (
        <Badge variant={item.badgeVariant || 'neutral'} size="sm">
          {item.badge}
        </Badge>
      )}
    </button>
  );

  return (
    <aside
      className={`flex flex-col border-r border-[var(--border-default)] bg-[var(--bg-surface)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] ${
        collapsed ? 'w-[var(--sidebar-width-collapsed)]' : 'w-[var(--sidebar-width)]'
      } min-h-[calc(100vh-var(--header-height))] p-3 shrink-0 ${className}`}
    >
      {/* Optional header slot or collapse toggle */}
      {(header || onToggleCollapse) && (
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--border-muted)]">
          {!collapsed && header}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="p-1.5 rounded-[var(--radius-sm)] text-[var(--fg-muted)] hover:text-[var(--fg-default)] hover:bg-[var(--hover-bg)] transition-colors ml-auto"
            >
              {collapsed ? '▶' : '◀'}
            </button>
          )}
        </div>
      )}

      {/* Navigation Sections */}
      <nav className="flex-1 space-y-4 overflow-y-auto">
        {items.map((entry) => {
          if (isSection(entry)) {
            return (
              <div key={entry.id} className="space-y-1">
                {!collapsed && entry.title && (
                  <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">
                    {entry.title}
                  </p>
                )}
                {entry.items.map(renderItem)}
              </div>
            );
          }
          return renderItem(entry);
        })}
      </nav>

      {/* Optional footer slot */}
      {footer && (
        <div className="mt-auto pt-3 border-t border-[var(--border-muted)]">
          {footer}
        </div>
      )}
    </aside>
  );
}
