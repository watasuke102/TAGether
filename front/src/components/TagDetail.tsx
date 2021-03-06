// TAGether - Share self-made exam for classmates
// TagDetail.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/components/TagDetail.module.scss';
import React from 'react';
import Router from 'next/router';
import Modal from '../components/Modal';
import Form from '../components/Form';
import Button from '../components/Button';
import TagData from '../types/TagData';
import Toast from './Toast';
import ButtonContainer from './ButtonContainer';

interface Props {
  tag: TagData
  isOpen: boolean
  close: Function
  createMode?: boolean
  onComplete?: Function
}


export default function TagDetail(props: Props): React.ReactElement {
  const [isToastOpen, SetIsToastOpen] = React.useState(false);
  const [toast_body, SetToastBody] = React.useState('');
  const [edited_name, SetEditedName] = React.useState(props.tag.name);
  const [edited_desc, SetEditedDesc] = React.useState(props.tag.description);
  const disabled: boolean = (!props.createMode && props.tag.id === undefined);

  function UpdateTag() {
    if (disabled) {
      SetToastBody('編集できないタグです');
      SetIsToastOpen(true);
      return;
    }
    if (edited_name === '') {
      SetToastBody('タグ名を入力してください');
      SetIsToastOpen(true);
      return;
    }

    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        const result = JSON.parse(req.responseText);
        if (result.isSuccess) {
          if (props.onComplete) {
            props.onComplete({
              id: props.tag.id ?? result.result.insertId, name: edited_name,
              description: edited_desc
            });
          }
          // 新規作成モードであれば終了
          if (props.createMode) {
            return;
          }
          SetToastBody('編集結果を適用しました');
        } else {
          SetToastBody('適用できませんでした');
        }
        SetIsToastOpen(true);
      }
    };
    req.open(props.createMode ? 'POST' : 'PUT', process.env.EDIT_URL + '/tag');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({
      id: props.tag.id,
      name: edited_name, description: edited_desc
    }));
  }

  return (
    <>
      <Modal isOpen={props.isOpen} close={props.close}>
        <div className={css.window}>
          <div className={css.heading}>
            <span className='fas fa-tag' />
            <span>{props.createMode ? 'タグの新規作成' : 'タグ詳細・編集'}</span>
            <hr />
          </div>


          {/* 編集 */}
          <div className={css.forms}>
            <Form {...{
              label: 'タグ名', rows: 1, value: edited_name,
              disabled: disabled,
              onChange: e => SetEditedName(e.target.value)
            }} />
            <Form {...{
              label: '説明', rows: 4, value: edited_desc,
              disabled: disabled,
              onChange: e => SetEditedDesc(e.target.value)
            }} />
          </div>

          {/* ボタン */}
          <ButtonContainer>
            <Button type='material' icon='fas fa-times' text='閉じる'
              onClick={props.close} />
            {props.createMode ?
              <></> :
              <Button type='material' icon='fas fa-pen' text='このタグのカテゴリを解く'
                onClick={() => Router.push(`/exam?tag=${props.tag.name}`)} />
            }
            <Button type='filled' icon='fas fa-check' text='編集結果を適用'
              onClick={UpdateTag} />
          </ButtonContainer>
        </div>

        <Toast isOpen={isToastOpen} close={() => SetIsToastOpen(false)} top={20}>
          <div className={css.toast_body}>
            <span className='fas fa-bell' />
            {toast_body}
          </div>
        </Toast>

      </Modal >
    </>
  );
}
