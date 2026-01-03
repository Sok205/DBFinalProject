import { Component, JSX, splitProps } from 'solid-js';

interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  children: JSX.Element;
}

const Select: Component<SelectProps> = (props) => {
  const [local, others] = splitProps(props, ['label', 'error', 'fullWidth', 'class', 'children']);

  return (
    <div class={`${local.fullWidth ? 'w-full' : ''}`}>
      {local.label && (
        <label class="block text-sm font-semibold text-f1-silver mb-2 uppercase tracking-wider">
          {local.label}
        </label>
      )}
      <div class="relative">
        <select
          class={`
            w-full px-4 py-2.5 pr-10
            bg-f1-carbon border border-f1-carbon-light
            rounded
            text-white
            transition-all duration-200
            focus:outline-none focus:border-f1-red focus:ring-2 focus:ring-f1-red/20
            hover:border-f1-silver/50
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none cursor-pointer
            ${local.error ? 'border-status-critical focus:border-status-critical focus:ring-status-critical/20' : ''}
            ${local.class || ''}
          `}
          {...others}
        >
          {local.children}
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            class="w-4 h-4 text-f1-silver"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {local.error && (
        <p class="mt-1 text-sm text-status-critical">{local.error}</p>
      )}
    </div>
  );
};

export default Select;
