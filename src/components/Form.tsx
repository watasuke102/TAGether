// TAGether - Share self-made exam for classmates
// categoly-detail.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Form.module.css'
import React from 'react';
import FormInfo from '../types/FormInfo'


export default function Form(props) {
  const info:FormInfo = props.info;
  return (
    <div>
      <label className={css.label}>{info.label}</label>
      <textarea className={css.form} value={info.value} rows={info.rows}
        onChange={(e) => info.onChange(e)} disabled={info.disabled}
      />
    </div>
  )
}
