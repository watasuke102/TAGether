// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './EditPage.module.scss';
import React from 'react';
import Helmet from 'react-helmet';
import ExamEditForms from '../Forms/ExamEditForms';
import ExamEditFormsOld from '../OldForms/ExamEditFormsOld';
import {PutCategory} from '../../../api/category/[id]/route';
import Loading from '@/common/Loading/Loading';
import Button from '@/common/Button/Button';
import {SelectButton} from '@/common/SelectBox';
import Form from '@/common/TextForm/Form';
import {useToastOperator} from '@/common/Toast/Toast';
import TagListEdit from '@/features/TagListEdit/TagListEdit';
import UpdateExam from '@utils/UpdateExam';
import {useConfirmBeforeLeave} from '@utils/ConfirmBeforeLeave';
import {exam_default} from '@utils/DefaultValue';
import {update_category} from '@utils/api/category';
import Exam from '@mytypes/Exam';
import {CategoryDataType} from '@mytypes/Categoly';
import TagData from '@mytypes/TagData';
import {validate_category} from '@utils/ValidateCategory';

export const ExamContext = React.createContext<Exam[]>(exam_default());

type ActionType = {type: 'title' | 'desc' | 'list'; value: string} | {type: 'tag'; tags: TagData[]};
function reduce_category(current: CategoryDataType, action: ActionType): CategoryDataType {
  switch (action.type) {
    case 'title':
      return {...current, title: action.value};
    case 'desc':
      return {...current, description: action.value};
    case 'list':
      return {...current, list: action.value};
    case 'tag':
      return {...current, tag: action.tags};
  }
}

type Props = {
  category: CategoryDataType;
  tags: TagData[];
};

export function EditPage(props: Props): JSX.Element {
  const [category, dispatch_category] = React.useReducer(reduce_category, props.category);
  const [exam, SetExam] = React.useState<Exam[]>(JSON.parse(props.category.list));
  const [is_json_edit, SetIsJsonEdit] = React.useState(false);
  const [is_old_form, SetIsOldForm] = React.useState(props.category.version === 1);

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
  }, [exam, category]);

  // ショートカットキー
  const Shortcut = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'KeyS' && !e.repeat && !e.shiftKey) {
        e.preventDefault();
        RegistCategoly();
      }
    },
    [exam, category],
  );

  React.useEffect(() => {
    window.addEventListener('keydown', e => Shortcut(e));
    return () => window.removeEventListener('keydown', e => Shortcut(e));
  }, []);

  // カテゴリ登録
  const RegistCategoly = React.useCallback(() => {
    Toast.close();
    const request_data: PutCategory = {
      title: category.title,
      description: category.description,
      tag: category.tag.map(e => String(e.id) ?? e.name).join(','),
      list: JSON.stringify(
        // prettier-ignore
        is_json_edit
          ? JSON.parse(category.list)
          : exam.map(e => {
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
    update_category(category.id, request_data)
      .then(() => {
        Toast.open('編集結果を適用しました');
        // 確認ダイアログを無効化
        SetShowConfirmBeforeLeave(false);
      })
      .catch(err => {
        Toast.open(`エラーが発生しました。\n${err.toString()}`);
      });
    console.groupCollapsed('Category update request');
    console.log(request_data);
    console.groupEnd();
  }, [category, exam]);

  return (
    <>
      <div className={css.edit_area}>
        <Form
          {...{
            label: 'タイトル',
            value: category.title,
            rows: 1,
            OnChange: e => dispatch_category({type: 'title', value: e.target.value}),
          }}
        />
        <Form
          {...{
            label: '説明',
            value: category.description,
            rows: 3,
            OnChange: e => dispatch_category({type: 'desc', value: e.target.value}),
          }}
        />
      </div>
      <h2>タグ</h2>
      <TagListEdit
        tags={props.tags}
        current_tag={category.tag}
        SetTag={(e: TagData[]) => dispatch_category({type: 'tag', tags: e})}
      />
      <h2>問題</h2>
      <div className={css.buttons}>
        <SelectButton type='check' status={is_json_edit} desc='高度な編集（JSON）' onChange={SetIsJsonEdit} />
        {category.version !== 1 && (
          <SelectButton type='check' status={is_old_form} desc='古い編集画面を使う' onChange={SetIsOldForm} />
        )}
        <div className={css.pushbutton_wrapper}>
          <Button type={'filled'} icon={'fas fa-check'} text={'編集を適用'} OnClick={() => RegistCategoly()} />
        </div>
      </div>
      <hr />
      {is_json_edit ? (
        <>
          <p>注意：編集内容はリッチエディタと同期されません</p>
          <Form
            label='JSON'
            value={category.list}
            rows={30}
            OnChange={e => dispatch_category({type: 'list', value: e.target.value})}
          />
        </>
      ) : (
        <>
          {is_old_form ? (
            <ExamEditFormsOld
              exam={exam}
              register={RegistCategoly}
              updater={UpdateExam(SetExam, JSON.parse(JSON.stringify(exam)))}
            />
          ) : (
            <ExamContext.Provider value={exam}>
              <ExamEditForms updater={e => SetExam(e.concat())} />
            </ExamContext.Provider>
          )}
        </>
      )}
    </>
  );
}
