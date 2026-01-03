import { Component, JSX } from 'solid-js';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'racing';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  pulse?: boolean;
  class?: string;
  children: JSX.Element;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-f1-carbon-light text-f1-silver border border-f1-silver/30',
  success: 'bg-status-good/20 text-status-good border border-status-good/30',
  warning: 'bg-status-warning/20 text-status-warning border border-status-warning/30',
  danger: 'bg-status-critical/20 text-status-critical border border-status-critical/30',
  info: 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30',
  racing: 'bg-f1-red/20 text-f1-red border border-f1-red/30',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

const Badge: Component<BadgeProps> = (props) => {
  const variant = () => props.variant || 'default';
  const size = () => props.size || 'md';

  return (
    <span
      class={`
        inline-flex items-center gap-1
        font-semibold uppercase tracking-wider
        rounded
        ${variantClasses[variant()]}
        ${sizeClasses[size()]}
        ${props.pulse ? 'animate-pulse-fast' : ''}
        ${props.class || ''}
      `}
    >
      {props.children}
    </span>
  );
};

export default Badge;
