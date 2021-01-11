// TAGether - Share self-made exam for classmates
// Form.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Form.module.css'
import React from 'react';
import FormInfo from '../types/FormInfo'


export default function Form(props: FormInfo) {
  return (
    <div>
      <label className={css.label}>{props.label}</label>
      <textarea className={css.form} value={props.value} rows={props.rows}
        onChange={(e) => props.onChange(e)} disabled={props.disabled}
      />
    </div>
  )
}
