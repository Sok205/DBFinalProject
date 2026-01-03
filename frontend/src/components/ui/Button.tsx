import { Component, JSX, splitProps } from 'solid-js';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: JSX.Element;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-f1-red hover:bg-f1-red-dark
    text-white font-semibold
    shadow-f1 hover:shadow-f1-hover
    border-none
  `,
  secondary: `
    bg-f1-carbon hover:bg-f1-carbon-light
    text-white font-semibold
    border border-f1-silver/30 hover:border-f1-silver/50
  `,
  danger: `
    bg-status-critical hover:bg-status-critical-dark
    text-white font-semibold
    shadow-lg
  `,
  ghost: `
    bg-transparent hover:bg-f1-carbon
    text-f1-silver hover:text-white
    border border-f1-silver/30 hover:border-f1-red
  `,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button: Component<ButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    'variant',
    'size',
    'fullWidth',
    'loading',
    'children',
    'class',
    'disabled',
  ]);

  const variant = () => local.variant || 'primary';
  const size = () => local.size || 'md';

  return (
    <button
      class={`
        inline-flex items-center justify-center gap-2
        rounded transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-f1-red/50 focus:ring-offset-2 focus:ring-offset-f1-black
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        uppercase tracking-wider
        ${variantClasses[variant()]}
        ${sizeClasses[size()]}
        ${local.fullWidth ? 'w-full' : ''}
        ${local.class || ''}
      `}
      disabled={local.disabled || local.loading}
      {...others}
    >
      {local.loading && (
        <svg
          class="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {local.children}
    </button>
  );
};

export default Button;
