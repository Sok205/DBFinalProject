import { Component, JSX, splitProps } from 'solid-js';

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: Component<InputProps> = (props) => {
  const [local, others] = splitProps(props, ['label', 'error', 'fullWidth', 'class']);

  return (
    <div class={`${local.fullWidth ? 'w-full' : ''}`}>
      {local.label && (
        <label class="block text-sm font-semibold text-f1-silver mb-2 uppercase tracking-wider">
          {local.label}
        </label>
      )}
      <input
        class={`
          w-full px-4 py-2.5
          bg-f1-carbon border border-f1-carbon-light
          rounded
          text-white placeholder-f1-silver/50
          transition-all duration-200
          focus:outline-none focus:border-f1-red focus:ring-2 focus:ring-f1-red/20
          hover:border-f1-silver/50
          disabled:opacity-50 disabled:cursor-not-allowed
          ${local.error ? 'border-status-critical focus:border-status-critical focus:ring-status-critical/20' : ''}
          ${local.class || ''}
        `}
        {...others}
      />
      {local.error && (
        <p class="mt-1 text-sm text-status-critical">{local.error}</p>
      )}
    </div>
  );
};

export default Input;
