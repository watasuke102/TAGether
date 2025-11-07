import React from 'react';

interface Props {
  className?: string;
  onSubmit?: () => void;
  children: React.ReactNode;
}

export function Form(props: Props) {
  return (
    <form
      className={props.className}
      onSubmit={e => {
        e.preventDefault();
        props.onSubmit?.();
      }}
    >
      {props.children}
    </form>
  );
}
