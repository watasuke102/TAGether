// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './IndexedContainer.module.scss';
import React from 'react';
import Button from '../Button/Button';
import ChevronLeftIcon from '@assets/chevron-left.svg';
import ChevronRightIcon from '@assets/chevron-right.svg';

interface Props {
  children: React.ReactElement[];
  width?: string;
  per?: number;
  len: number;
}

export default function SelectButton(props: Props): React.ReactElement {
  const [index, SetIndex] = React.useState(0);
  const per = props.per ?? 20;
  const max_page = Math.max(Math.ceil(props.len / per), 1);
  const width_var = {'--item_width': `${props.width ?? '1fr'}`} as React.CSSProperties;

  if (props.children.length < 1) return <span>何もありません</span>;

  const Operator = () => (
    <div className={css.operator}>
      <Button icon={<ChevronLeftIcon />} OnClick={() => index > 0 && SetIndex(i => i - 1)} type='material' text='' />
      <span>
        {index + 1}/{max_page}
      </span>
      <Button
        icon={<ChevronRightIcon />}
        OnClick={() => index + 1 < max_page && SetIndex(i => i + 1)}
        type='material'
        text=''
      />
    </div>
  );

  return (
    <>
      <Operator />
      <div style={width_var} className={css.list}>
        {props.children.slice(index * per, (index + 1) * per)}
      </div>
      <Operator />
    </>
  );
}
