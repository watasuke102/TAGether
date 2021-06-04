// TAGether - Share self-made exam for classmates
// TagDetail.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/TagDetail.module.scss';
import React from 'react';
import Router from 'next/router';
import Modal from '../components/Modal';
import Form from '../components/Form';
import Button from '../components/Button';
import TagData from '../types/TagData';

interface Props {
  tag: TagData
  isOpen: boolean
  close: Function
}


export default function TagDetail(props: Props): React.ReactElement {
  const [edited_name, SetEditedName] = React.useState(props.tag.name);
  const [edited_desc, SetEditedDesc] = React.useState(props.tag.description);
  return (
    <Modal isOpen={props.isOpen} close={props.close}>
      <div className={css.window}>
        <div className={css.heading}>
          <span className='fas fa-tag' />
          <span>タグ詳細・編集</span>
          <hr />
        </div>


        {/* 編集 */}
        <div className={css.forms}>
          <Form {...{
            label: '名前', rows: 1, value: edited_name,
            disabled: (!props.tag.id) ? true : false,
            onChange: e => SetEditedName(e.target.value)
          }} />
          <Form {...{
            label: '説明', rows: 4, value: edited_desc,
            disabled: (!props.tag.id) ? true : false,
            onChange: e => SetEditedDesc(e.target.value)
          }} />
        </div>

        {/* ボタン */}
        <div className={css.window_buttons}>
          <Button type='material' icon='fas fa-times' text='閉じる'
            onClick={props.close} />
          <Button type='material' icon='fas fa-check' text='編集結果を適用'
            onClick={props.close} />
          <Button type='material' icon='fas fa-pen' text='このタグのカテゴリを解く'
            onClick={props.close} />
        </div>
      </div>
    </Modal >
  );
}
