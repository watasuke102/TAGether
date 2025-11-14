// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './ComboBox.module.scss';
import CheckIcon from '@assets/check.svg';
import React from 'react';
import * as Select from '@radix-ui/react-select';

type Props = {
  id?: string;
  disabled?: boolean;
  value: string;
  on_change: (s: string) => void;
  options: {text: string; value: string}[];
};

export function ComboBox(props: Props): JSX.Element {
  return (
    <Select.Root value={props.value} onValueChange={props.on_change} disabled={props.disabled}>
      <Select.Trigger className={css.trigger} id={props.id ?? ''}>
        <Select.Value placeholder='選択…' />
        <Select.Icon />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content position='popper'>
          <Select.Viewport className={css.viewport}>
            {props.options
              .filter(e => e.value !== '')
              .map((e, i) => (
                <Select.Item key={e.value + i} value={e.value} className={css.item}>
                  <Select.ItemText>{e.text}</Select.ItemText>
                  <Select.ItemIndicator>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
