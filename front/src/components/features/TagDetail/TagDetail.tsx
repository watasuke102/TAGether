// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './TagDetail.module.scss';
import Router from 'next/router';
import React from 'react';
import Button from '@/common/Button/Button';
import ButtonContainer from '@/common/Button/ButtonContainer';
import Modal from '@/common/Modal/Modal';
import Form from '@/common/TextForm/Form';
import Toast from '@/common/Toast/Toast';
import TagData from '@mytypes/TagData';

interface Props {
  tag: TagData;
  isOpen: boolean;
  close: () => void;
  createMode?: boolean;
  onComplete?: (e: TagData) => void;
}

export default function TagDetail(props: Props): React.ReactElement {
  const [is_toast_open, SetIsToastOpen] = React.useState(false);
  const [toast_body, SetToastBody] = React.useState('');
  const [edited_name, SetEditedName] = React.useState(props.tag.name);
  const [edited_desc, SetEditedDesc] = React.useState(props.tag.description);
  const disabled: boolean = !props.createMode && props.tag.id === undefined;

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
      if (req.readyState === 4) {
        const result = JSON.parse(req.responseText);
        if (req.status === 200) {
          if (props.onComplete) {
            props.onComplete({
              id: props.tag.id ?? result.insertId,
              name: edited_name,
              updated_at: '',
              description: edited_desc,
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
    req.open(props.createMode ? 'POST' : 'PUT', process.env.API_URL + '/tag');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(
      JSON.stringify({
        id: props.tag.id,
        name: edited_name,
        description: edited_desc,
      }),
    );
  }

  return (
    <>
      <Modal isOpen={props.isOpen} close={props.close}>
        <div className={css.modal}>
          <div className={css.heading}>
            <span className='fas fa-tag' />
            <span>{props.createMode ? 'タグの新規作成' : 'タグ詳細・編集'}</span>
            <hr />
          </div>

          {/* 編集 */}
          <div className={css.forms}>
            <Form
              {...{
                label: 'タグ名',
                rows: 1,
                value: edited_name,
                disabled: disabled,
                OnChange: e => SetEditedName(e.target.value),
              }}
            />
            <Form
              {...{
                label: '説明',
                rows: 4,
                value: edited_desc,
                disabled: disabled,
                OnChange: e => SetEditedDesc(e.target.value),
              }}
            />
          </div>

          {/* ボタン */}
          <ButtonContainer>
            <Button type='material' icon='fas fa-times' text='閉じる' OnClick={props.close} />
            {props.createMode ? (
              <></>
            ) : (
              <Button
                type='material'
                icon='fas fa-pen'
                text='このタグのカテゴリを解く'
                OnClick={() => Router.push(`/exam?tag=${props.tag.name}`)}
              />
            )}
            <Button type='filled' icon='fas fa-check' text='編集結果を適用' OnClick={UpdateTag} />
          </ButtonContainer>
        </div>

        <Toast
          id='tag_detail'
          isOpen={is_toast_open}
          close={() => SetIsToastOpen(false)}
          top={20}
          icon='fas fa-bell'
          text={toast_body}
        />
      </Modal>
    </>
  );
}
