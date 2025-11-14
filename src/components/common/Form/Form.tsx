// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
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
