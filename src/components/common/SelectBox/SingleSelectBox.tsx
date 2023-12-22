// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import React from 'react';
import {SelectButton} from '.';

interface Props {
  status: string;
  list: string[];
  onChange: (str: string) => void;
}

export default function SingleSelectBox(props: Props): React.ReactElement {
  return (
    <>
      {props.list.map((str, i) => {
        return (
          <SelectButton
            type='radio'
            id={i === 0 ? 'singleselect-first' : ''}
            key={`select_${str}`}
            status={props.status === str}
            desc={str}
            onChange={() => props.onChange(str)}
          />
        );
      })}
    </>
  );
}
