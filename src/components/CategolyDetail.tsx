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
import Modal from './Modal';
import Button from './Button';
import Categoly from '../types/Categoly';
import ModalData from '../types/ModalData';

interface CategolyDetailData {
  data: Categoly,
  close: Function
}


export default function CategolyDetail(props: CategolyDetailData) {
  const [isShuffleEnabled, SetIsShuffleEnabled] = React.useState('false');
  const data: Categoly = props.data;

  const Push = (s: string) => {
    let url: string = ''
    if (s == 'edit') {
      url = '/edit?id=' + data.id;
    } else if(s == 'exam') {
      url = '/exam?id=' + data.id;
      url += '&shuffle=' + isShuffleEnabled;
    } else {
      url = '/examtable?id=' + data.id;
    }
    Router.push(url);
  };

  return (
    <>
      <div className={css.container}>
        <textarea disabled={true} value={data.title} id={css.title}/>

        <div className={css.updated_at}>
          <div className='fas fa-clock'></div>
          <p>{data.updated_at}</p>
        </div>
        <Tag tag={data.tag} />
        <textarea disabled={true} value={data.desc} id={css.desc} />


        {/* シャッフルするかどうかを決めるチェックボックスなど */}
        <div className={css.shuffle_checkbox}>
          <input type='checkbox' value={isShuffleEnabled}
            onChange={e => SetIsShuffleEnabled(e.target.checked? 'true':'false')}/>
          <p>問題順をシャッフル</p>
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
            text: '問題の一覧表示', icon: 'fas fa-list',
            onClick: () => Push('table'), type: 'material'
          }} />
          <Button {...{
            text: 'この問題を解く', icon: 'fas fa-arrow-right',
            onClick: () => Push('exam'), type: 'filled'
          }} />
        </div>

      </div>
    </>
  );
}
