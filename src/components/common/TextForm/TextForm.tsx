// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './TextForm.module.scss';
import React from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import FormInfo from '@mytypes/FormInfo';

export default function TextForm(props: FormInfo): JSX.Element {
  return (
    <div>
      {props.label && (
        <label htmlFor={props.id ?? ''} className={css.label}>
          {props.label}
        </label>
      )}
      {props.oneline ? (
        <input
          type='text'
          id={props.id ?? ''}
          className={css.form}
          value={props.value}
          spellCheck={false}
          tabIndex={props.layer ?? 1}
          onChange={e => props.OnChange(e)}
          disabled={props.disabled}
          autoComplete={props.autoComplete}
        />
      ) : (
        <ReactTextareaAutosize
          id={props.id ?? ''}
          className={css.form}
          value={props.value}
          minRows={1}
          spellCheck={false}
          tabIndex={props.layer ?? 1}
          onChange={e => props.OnChange(e)}
          disabled={props.disabled}
        />
      )}
    </div>
  );
}
