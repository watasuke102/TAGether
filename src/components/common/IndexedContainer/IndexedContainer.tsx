// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './IndexedContainer.module.scss';
import ChevronLeftIcon from '@assets/chevron-left.svg';
import ChevronRightIcon from '@assets/chevron-right.svg';
import React from 'react';
import Button from '../Button/Button';

interface Props {
  children: React.ReactElement[];
  width?: string;
  per?: number;
  len: number;
}

function Operator(props: {
  SetIndex: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  max_page: number;
}): React.ReactElement {
  return (
    <div className={css.operator}>
      <Button
        icon={<ChevronLeftIcon />}
        OnClick={() => props.index > 0 && props.SetIndex(i => i - 1)}
        variant='material'
        text=''
      />
      <span>
        {props.index + 1}/{props.max_page}
      </span>
      <Button
        icon={<ChevronRightIcon />}
        OnClick={() => props.index + 1 < props.max_page && props.SetIndex(i => i + 1)}
        variant='material'
        text=''
      />
    </div>
  );
}

export default function SelectButton(props: Props): React.ReactElement {
  const [index, SetIndex] = React.useState(0);
  const per = props.per ?? 20;
  const max_page = Math.max(Math.ceil(props.len / per), 1);
  const width_var = {'--item_width': `${props.width ?? '1fr'}`} as React.CSSProperties;

  if (props.children.length < 1) return <span>何もありません</span>;

  return (
    <>
      <Operator SetIndex={SetIndex} index={index} max_page={max_page} />
      <div style={width_var} className={css.list}>
        {props.children.slice(index * per, (index + 1) * per)}
      </div>
      <Operator SetIndex={SetIndex} index={index} max_page={max_page} />
    </>
  );
}
