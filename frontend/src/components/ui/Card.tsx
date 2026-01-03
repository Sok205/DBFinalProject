import { Component, JSX, splitProps } from 'solid-js';

type CardVariant = 'default' | 'racing' | 'warning' | 'carbon';

interface CardProps {
  variant?: CardVariant;
  hover?: boolean;
  class?: string;
  children: JSX.Element;
}

interface CardHeaderProps {
  class?: string;
  children: JSX.Element;
}

interface CardBodyProps {
  class?: string;
  children: JSX.Element;
}

interface CardFooterProps {
  class?: string;
  children: JSX.Element;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-f1-carbon border border-f1-carbon-light',
  racing: 'bg-gradient-to-br from-f1-red to-f1-red-dark border-none',
  warning: 'bg-f1-carbon border-l-4 border-l-status-warning border border-f1-carbon-light',
  carbon: 'carbon-texture border border-f1-carbon-light',
};

const Card: Component<CardProps> & {
  Header: Component<CardHeaderProps>;
  Body: Component<CardBodyProps>;
  Footer: Component<CardFooterProps>;
} = (props) => {
  const [local, others] = splitProps(props, ['variant', 'hover', 'class', 'children']);
  const variant = () => local.variant || 'default';

  return (
    <div
      class={`
        rounded-lg overflow-hidden
        shadow-card
        ${local.hover ? 'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1' : ''}
        ${variantClasses[variant()]}
        ${local.class || ''}
      `}
      {...others}
    >
      {local.children}
    </div>
  );
};

const CardHeader: Component<CardHeaderProps> = (props) => {
  return (
    <div
      class={`
        px-5 py-4
        border-b border-f1-carbon-light/50
        ${props.class || ''}
      `}
    >
      {props.children}
    </div>
  );
};

const CardBody: Component<CardBodyProps> = (props) => {
  return (
    <div class={`px-5 py-4 ${props.class || ''}`}>
      {props.children}
    </div>
  );
};

const CardFooter: Component<CardFooterProps> = (props) => {
  return (
    <div
      class={`
        px-5 py-3
        border-t border-f1-carbon-light/50
        bg-f1-black/30
        ${props.class || ''}
      `}
    >
      {props.children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
