// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './EditPage.module.scss';
import React from 'react';
import ExamEditForms from '../Forms/ExamEditForms';
import {PutCategory} from '../../../api/category/[id]/route';
import Button from '@/common/Button/Button';
import {SelectButton} from '@/common/SelectBox';
import TextForm from '@/common/TextForm/TextForm';
import {useToastOperator} from '@/common/Toast/Toast';
import TagListEdit from '@/features/TagListEdit/TagListEdit';
import {useConfirmBeforeLeave} from '@utils/ConfirmBeforeLeave';
import {mutate_category, update_category} from '@utils/api/category';
import Exam from '@mytypes/Exam';
import {CategoryDataType} from '@mytypes/Category';
import TagData from '@mytypes/TagData';
import {validate_category} from '@utils/ValidateCategory';
import {useImmerReducer} from 'use-immer';
import {edit_reducer, EditReducerContext} from '../EditReducer';
import {useShortcut} from '@utils/useShortcut';
import CheckIcon from '@assets/check.svg';

export type EditPageProps = {
  category: CategoryDataType;
  tags: TagData[];
};

export function EditPage(props: EditPageProps): JSX.Element {
  const [is_json_edit, SetIsJsonEdit] = React.useState(false);
  const [edit_states, dispatch] = useImmerReducer(edit_reducer, {
    title: props.category.title,
    current_editing: 0,
    desc: props.category.description,
    list: props.category.list,
    exam: JSON.parse(props.category.list) as Exam[],
    tags: props.category.tag,
  });

  const is_first_rendering = React.useRef(true);
  const SetShowConfirmBeforeLeave = useConfirmBeforeLeave();
  const Toast = useToastOperator();

  // 初回レンダリング時に実行されないようにしている
  React.useEffect(() => {
    is_first_rendering.current = true;
  }, []);
  React.useEffect(() => {
    if (is_first_rendering.current) {
      is_first_rendering.current = false;
    } else {
      SetShowConfirmBeforeLeave(true);
    }
  }, [edit_states]);

  // カテゴリ登録
  const RegistCategory = React.useCallback(() => {
    Toast.close();
    const request_data: PutCategory = {
      title: edit_states.title,
      description: edit_states.desc,
      tag: edit_states.tags.map(e => String(e.id) ?? e.name).join(','),
      list: JSON.stringify(
        // prettier-ignore
        is_json_edit
          ? JSON.parse(edit_states.list)
          : edit_states.exam.map(e => {
            return {
              ...e,
              question_choices: e.question_choices?.map(e => e.trim()) ?? [],
              answer: e.answer.map(e => e.trim()),
            };
          }),
      ),
    };
    // データが正しいか判定し、誤りがあればエラーを返す
    const validation_error = validate_category(request_data);
    if (validation_error.length !== 0) {
      Toast.open(validation_error.join('\n'));
      return;
    }
    update_category(props.category.id, request_data)
      .then(() => {
        Toast.open('編集結果を適用しました');
        mutate_category();
        // 確認ダイアログを無効化
        SetShowConfirmBeforeLeave(false);
      })
      .catch(err => {
        Toast.open(`エラーが発生しました。\n${err.toString()}`);
      });
    console.groupCollapsed('Category update request');
    console.info(request_data);
    console.groupEnd();
  }, [edit_states]);
  useShortcut([{keycode: 'KeyS', handler: RegistCategory}], {ctrl: true});

  return (
    <>
      <div className={css.edit_area}>
        <TextForm
          {...{
            label: 'タイトル',
            value: edit_states.title,
            rows: 1,
            oneline: true,
            OnChange: e => dispatch({type: 'title/set', data: e.target.value}),
          }}
        />
        <TextForm
          {...{
            label: '説明',
            value: edit_states.desc,
            rows: 3,
            OnChange: e => dispatch({type: 'desc/set', data: e.target.value}),
          }}
        />
      </div>
      <h2>タグ</h2>
      <TagListEdit
        tags={props.tags}
        current_tag={edit_states.tags}
        SetTag={(e: TagData[]) => dispatch({type: 'tags/set', data: e})}
      />
      <h2>問題</h2>
      <div className={css.buttons}>
        <SelectButton type='check' status={is_json_edit} desc='高度な編集（JSON）' onChange={SetIsJsonEdit} />
        <div className={css.pushbutton_wrapper}>
          <Button variant={'filled'} icon={<CheckIcon />} text={'編集を適用'} OnClick={() => RegistCategory()} />
        </div>
      </div>
      <hr />
      {is_json_edit ? (
        <>
          <p>注意：編集内容はリッチエディタと同期されません</p>
          <TextForm
            label='JSON'
            value={edit_states.list}
            OnChange={e => dispatch({type: 'list/set', data: e.target.value})}
          />
        </>
      ) : (
        <EditReducerContext.Provider value={[edit_states, dispatch]}>
          <ExamEditForms />
        </EditReducerContext.Provider>
      )}
    </>
  );
}
