// TAGether - Share self-made exam for classmates
// Button.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/components/ButtonContainer.module.scss';
import React from 'react';

interface Props {
  children: React.ReactElement[]
}

export default function ButtonContainer({ children }: Props): React.ReactElement {
  console.log(children.length);
  return (
    <div className={`${css.container} ${children.length >= 4 && css.grid}`}>
      {children}
    </div>
  );
}