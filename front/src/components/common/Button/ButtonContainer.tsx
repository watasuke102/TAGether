// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './ButtonContainer.module.scss';
import React from 'react';

interface Props {
  children: React.ReactElement[];
}

export default function ButtonContainer({children}: Props): React.ReactElement {
  return <div className={`${css.container} ${children.length >= 4 && css.grid}`}>{children}</div>;
}
