// TAGether - Share self-made exam for classmates
// RadioBox.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';
import SelectBox from './SelectBox'

interface Props {
  status: string,
  list: string[],
  onChange: Function,
}

export default function RadioBox(props: Props) {
  return (
    <>
      {
        props.list.map(str => {
          return (
            <SelectBox status={props.status === str} desc={str}
              onChange={() => props.onChange(str)} />
          )
        })
      }
    </>
  );
}
