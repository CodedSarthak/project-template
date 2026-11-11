import { type ReactNode } from 'react';
import { Card, CardTitle, CardDescription } from './card.js';
import { Button, type ButtonVariant } from './button.js';
import { Badge, type BadgeVariant } from './badge.js';

export interface WelcomeFeature {
  id?: string;
  icon?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  onClick?: () => void;
}

export interface WelcomeAction {
  label: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  icon?: ReactNode;
}

export interface WelcomeScreenProps {
  badge?: ReactNode | { label: string; icon?: ReactNode; variant?: BadgeVariant };
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  features?: WelcomeFeature[];
  actions?: WelcomeAction[];
  children?: ReactNode;
  className?: string;
  // Backwards compatibility
  appName?: string;
  onGetStarted?: () => void;
  onExploreApi?: () => void;
}

export function WelcomeScreen({
  badge,
  title,
  subtitle,
  description,
  features = [],
  actions = [],
  children,
  className = '',
  // Backwards compatibility
  appName = 'Application Template',
  onGetStarted,
  onExploreApi,
}: WelcomeScreenProps) {
  const displayTitle = title || (
    <>
      Build faster with <span className="text-[var(--primary)]">{appName}</span>
    </>
  );

  const displayDescription =
    description ||
    subtitle ||
    'All core infrastructure, design tokens, shared contracts, and utilities are pre-configured. Start building your domain features directly.';

  // Backwards compatibility action mapping
  const resolvedActions: WelcomeAction[] =
    actions.length > 0
      ? actions
      : [
          onGetStarted
            ? { label: 'Get Started', onClick: onGetStarted, variant: 'primary' as ButtonVariant }
            : null,
          onExploreApi
            ? { label: 'Explore Features', onClick: onExploreApi, variant: 'secondary' as ButtonVariant }
            : null,
        ].filter(Boolean) as WelcomeAction[];

  return (
    <div
      className={`mx-auto flex max-w-4xl flex-col items-center justify-center px-6 py-12 text-center transition-colors duration-[var(--duration-fast)] ${className}`}
    >
      {/* Top Badge */}
      {badge && (
        <div className="mb-4">
          {typeof badge === 'object' && 'label' in badge ? (
            <Badge variant={badge.variant || 'primary'} icon={badge.icon}>
              {badge.label}
            </Badge>
          ) : (
            badge
          )}
        </div>
      )}

      {/* Hero Title */}
      <h1 className="text-[var(--text-4xl)] sm:text-[var(--text-5xl)] font-bold tracking-tight text-[var(--fg-default)]">
        {displayTitle}
      </h1>

      {/* Subtitle / Description */}
      <p className="mt-4 max-w-2xl text-[var(--text-base)] text-[var(--fg-muted)] leading-relaxed">
        {displayDescription}
      </p>

      {/* Feature Grid */}
      {features.length > 0 && (
        <div className="mt-10 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature, idx) => (
            <Card
              key={feature.id || idx}
              hoverable={!!feature.onClick}
              onClick={feature.onClick}
              className={`p-5 flex flex-col justify-between ${
                feature.onClick ? 'cursor-pointer' : ''
              }`}
            >
              <div>
                {feature.icon && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--active-bg)] text-[var(--primary)] text-lg mb-3">
                    {feature.icon}
                  </div>
                )}
                <CardTitle className="text-[var(--text-base)]">
                  {feature.title}
                </CardTitle>
                <CardDescription className="mt-1.5 text-[var(--text-xs)]">
                  {feature.description}
                </CardDescription>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      {resolvedActions.length > 0 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {resolvedActions.map((action, idx) => (
            <Button
              key={idx}
              variant={action.variant || 'primary'}
              size="md"
              leftIcon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* Custom Child Slots */}
      {children && <div className="mt-8 w-full">{children}</div>}
    </div>
  );
}
