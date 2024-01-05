// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './TagDetail.module.scss';
import React from 'react';
import {useRouter} from 'next/navigation';
import Button from '@/common/Button/Button';
import ButtonContainer from '@/common/Button/ButtonContainer';
import Modal from '@/common/Modal/Modal';
import Form from '@/common/TextForm/Form';
import {useToastOperator} from '@/common/Toast/Toast';
import TagData from '@mytypes/TagData';
import {mutate_tag, new_tag, update_tag} from '@utils/api/tag';
import TagIcon from '@assets/tag.svg';
import CloseIcon from '@assets/close.svg';
import CheckIcon from '@assets/check.svg';
import EditIcon from '@assets/edit.svg';

interface Props {
  tag: TagData;
  isOpen: boolean;
  close: () => void;
  createMode?: boolean;
}

export default function TagDetail(props: Props): React.ReactElement {
  const Toast = useToastOperator();
  const [edited_name, SetEditedName] = React.useState(props.tag.name);
  const [edited_desc, SetEditedDesc] = React.useState(props.tag.description);
  const router = useRouter();
  const disabled: boolean = !props.createMode && props.tag.id === undefined;

  const UpdateTag = React.useCallback(() => {
    if (disabled) {
      Toast.open('編集できないタグです');
      return;
    }
    if (edited_name === '') {
      Toast.open('タグ名を入力してください');
      return;
    }

    if (props.createMode) {
      new_tag({name: edited_name, description: edited_desc}).then(() => {
        Toast.open('タグを追加しました');
        mutate_tag();
      });
    } else {
      update_tag(props.tag?.id ?? -1, {name: edited_name, description: edited_desc}).then(() => {
        Toast.open('編集結果を適用しました');
        mutate_tag();
      });
    }
  }, [edited_name, edited_desc]);

  return (
    <>
      <Modal isOpen={props.isOpen} close={props.close}>
        <div className={css.modal}>
          <div className={css.heading}>
            <div className={css.icon_wrapper}>
              <TagIcon />
            </div>
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
            <Button type='material' icon={<CloseIcon />} text='閉じる' OnClick={props.close} />
            {props.createMode ? (
              <></>
            ) : (
              <Button
                type='material'
                icon={<EditIcon />}
                text='このタグのカテゴリを解く'
                OnClick={() => router.push(`/exam?tag=${props.tag.id ?? ''}`)}
              />
            )}
            <Button type='filled' icon={<CheckIcon />} text='編集結果を適用' OnClick={UpdateTag} />
          </ButtonContainer>
        </div>
      </Modal>
    </>
  );
}
