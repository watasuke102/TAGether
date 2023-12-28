// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './Form.module.scss';
import React from 'react';
import FormInfo from '@mytypes/FormInfo';

export default function Form(props: FormInfo): JSX.Element {
  return (
    <div>
      {props.label && <label className={css.label}>{props.label}</label>}
      <textarea
        id={props.id ?? ''}
        className={css.form}
        value={props.value}
        rows={props.rows}
        spellCheck={false}
        tabIndex={props.layer ?? 1}
        onChange={e => props.OnChange(e)}
        disabled={props.disabled}
      />
    </div>
  );
}