// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
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
      {props.list.map((str, i) => {
        const index = props.status.indexOf(str);
        return (
          <CheckBox
            type='check'
            id={i === 0 ? 'multiselect-first' : ''}
            key={`select_${str}`}
            status={index !== -1}
            desc={str}
            onChange={() => {
              const list = JSON.parse(JSON.stringify(props.status));
              if (index === -1) {
                list.push(str);
              } else {
                list.splice(index, 1);
              }
              props.onChange(list);
            }}
          />
        );
      })}
    </>
  );
}
