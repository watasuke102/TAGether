// TAGether - Share self-made exam for classmates
// SelectBox.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';
import CheckBox from './SelectButton';

interface Props {
  status: string[];
  list: string[];
  onChange: (list: string[]) => void;
}

export default function MultiSelectBox(props: Props): React.ReactElement {
  return (
    <>
      {props.list.map(str => {
        const index = props.status.indexOf(str);
        return (
          <CheckBox
            type='multi'
            key={`select_${str}`}
            status={index !== -1}
            desc={str}
            onChange={() => {
              const list = JSON.parse(JSON.stringify(props.status));
              index !== -1 ? list.splice(index, 1) : list.push(str);
              props.onChange(list);
            }}
          />
        );
      })}
    </>
  );
}
