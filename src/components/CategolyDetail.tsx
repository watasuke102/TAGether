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
  const [isShuffleEnabled, SetIsShuffleEnabled] = React.useState('');
  const data: Categoly = props.data;
  const Push = (s: string) => {
    let url: string = ''
    if (s == 'edit') {
      url = '/edit?id=' + data.id;
    } else {
      url = '/exam?id=' + data.id;
      url += '&shuffle=' + isShuffleEnabled;
    }
    Router.push(url);
  };

  return (
    <div className={css.container}>
      <h1>{data.title}</h1>

      <div className={css.updated_at}>
        <div className='fas fa-clock'></div>
        <p>{data.updated_at}</p>
      </div>
      <Tag tag={data.tag} />

      <h2>{data.desc}</h2>

      {/* シャッフルするかどうかを決めるチェックボックスなど */}
      <div className={css.shuffle_checkbox}>
        <input type='checkbox' value={isShuffleEnabled}
          onChange={e => { SetIsShuffleEnabled(e.target.checked? 'true':'false'); console.log(isShuffleEnabled) }}/>
        <p>問題の順番をランダムにする</p>
      </div>

      <div className={css.buttons}>
        <Button {...{
          text: '閉じる', icon: 'fas fa-times',
          onClick: () => props.close(), type: 'material'
        }} />
        <Button {...{
          text: '編集する', icon: 'fas fa-pen',
          onClick: () => Push('edit'), type: 'material'
        }} />
        <Button {...{
          text: 'この問題を解く', icon: 'fas fa-arrow-right',
          onClick: () => Push('exam'), type: 'filled'
        }} />
      </div>
    </div>
  );
}
