// TAGether - Share self-made exam for classmates
// IndexedContainer.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './IndexedContainer.module.scss';
import React from 'react';
import Button from '../Button/Button';

interface Props {
  children: React.ReactElement[];
  width?: string;
  per?: number;
  len: number;
}

export default function SelectButton(props: Props): React.ReactElement {
  const [index, SetIndex] = React.useState(0);
  const per = props.per ?? 20;
  const max_page = Math.ceil(props.len / per);
  const width_var = {'--item_width': `${props.width ?? '1fr'}`} as React.CSSProperties;

  if (props.children.length < 1) return <span>何もありません</span>;

  return (
    <>
      <div className={css.operator}>
        <Button icon='fas fa-angle-left' onClick={() => index > 0 && SetIndex(i => i - 1)} type='material' text='' />
        <span>
          {index + 1}/{max_page}
        </span>
        <Button
          icon='fas fa-angle-right'
          onClick={() => index + 1 < max_page && SetIndex(i => i + 1)}
          type='material'
          text=''
        />
      </div>

      <div style={width_var} className={css.list}>
        {props.children.slice(index * per, (index + 1) * per)}
      </div>
    </>
  );
}
