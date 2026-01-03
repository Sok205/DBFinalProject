import { Component } from 'solid-js';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const Spinner: Component<SpinnerProps> = (props) => {
  const size = () => props.size || 'md';

  return (
    <div
      class={`
        ${sizeClasses[size()]}
        border-2 border-f1-carbon-light
        border-t-f1-red
        rounded-full
        animate-spin
        ${props.class || ''}
      `}
    />
  );
};

export default Spinner;
