// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './Card.module.scss';
import React from 'react';

interface Props {
  children: React.ReactElement | React.ReactElement[];
  onClick?: () => void;
}

export default function ExamCard(props: Props): React.ReactElement {
  return (
    <div className={css.card} onClick={props.onClick}>
      {props.children}
    </div>
  );
}
