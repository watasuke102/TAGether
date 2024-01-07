// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './ComboBox.module.scss';
import React from 'react';
import * as Select from '@radix-ui/react-select';
import CheckIcon from '@assets/check.svg';

type Props = {
  label: string;
  value: string;
  on_change: (s: string) => void;
  options: {text: string; value: string}[];
};

export function ComboBox(props: Props): JSX.Element {
  return (
    <Select.Root value={props.value} onValueChange={props.on_change}>
      <Select.Trigger className={css.trigger}>
        <Select.Value placeholder='選択…' />
        <Select.Icon />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content>
          <Select.Viewport className={css.viewport}>
            {props.options.map((e, i) => (
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
