// TAGether - Share self-made exam for classmates
// CategolyDetail.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/CategolyDetail.module.css'
import React from 'react';
import Router from 'next/router';
import Tag from './Tag'
import Button from './Button';
import Categoly from '../types/Categoly'

interface CategolyDetailData {
  data: Categoly,
  close: Function
}

export default function categoly_detail(props: CategolyDetailData) {
  const data: Categoly = props.data;

  return (
    <div className={css.container}>
      <h1>{data.title}</h1>

      <div className={css.updated_at}>
        <div className='fas fa-clock'></div>
        <p>{data.updated_at}</p>
      </div>
      <Tag tag={data.tag} />

      <h2>{data.desc}</h2>

      <div className={css.buttons}>
        <Button {...{
          text: '閉じる', icon: 'fas fa-times',
          onClick: () => props.close(), type: 'material'
        }} />
        <Button {...{
          text: 'この問題を解く', icon: 'fas fa-arrow-right',
          onClick: () => Router.push('/exam?id='+data.id), type: 'filled'
        }} />
      </div>
    </div>
  );
}
