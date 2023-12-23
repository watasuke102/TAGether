// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './edit.module.scss';
import React from 'react';
import Helmet from 'react-helmet';
import {useSearchParams} from 'next/navigation';
import {useCategoryData} from '@utils/api/category';
import Loading from '@/common/Loading/Loading';
import Button from '@/common/Button/Button';
import {SelectButton} from '@/common/SelectBox';
import Form from '@/common/TextForm/Form';
import {useToastOperator} from '@/common/Toast/Toast';
import ExamEditForms from '@/features/ExamEdit/ExamEditForms';
import ExamEditFormsOld from '@/features/ExamEdit/ExamEditFormsOld';
import TagListEdit from '@/features/TagListEdit/TagListEdit';
import {useTagData} from '@utils/api/tag';
import {update_category} from '@utils/api/category';
import {useConfirmBeforeLeave} from '@utils/ConfirmBeforeLeave';
import {categoly_default, exam_default} from '@utils/DefaultValue';
import UpdateExam from '@utils/UpdateExam';
import Exam from '@mytypes/Exam';
import {CategoryDataType} from '@mytypes/Categoly';
import TagData from '@mytypes/TagData';

export const ExamContext = React.createContext<Exam[]>(exam_default());

type ActionType =
  | {type: 'title' | 'desc' | 'list'; value: string}
  | {type: 'tag'; tags: TagData[]}
  | {type: 'init'; value: CategoryDataType};
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
    case 'init':
      return action.value;
  }
}

export default function Edit(): JSX.Element {
  const search_params = useSearchParams();
  const id = search_params?.get('id');
  const [fetched_category, isCategoryLoading] = useCategoryData(id ?? '');
  const [tags, isTagLoading] = useTagData();
  const [category, dispatch_category] = React.useReducer(reduce_category, categoly_default());
  const [exam, SetExam] = React.useState<Exam[]>([]);

  const is_first_rendering = React.useRef(true);
  const SetShowConfirmBeforeLeave = useConfirmBeforeLeave();

  const Toast = useToastOperator();
  const [is_json_edit, SetIsJsonEdit] = React.useState(false);
  const [is_old_form, SetIsOldForm] = React.useState(category?.version === 1);

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

  React.useEffect(() => {
    console.log(fetched_category);
    if (isCategoryLoading) {
      return;
    }
    dispatch_category({type: 'init', value: fetched_category});
    SetExam(JSON.parse(category.list));
  }, [isCategoryLoading]);

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

    // prettier-ignore
    const exam_result = is_json_edit
      ? JSON.parse(category.list)
      : exam.map(e => {
        return {
          ...e,
          question_choices: e.question_choices?.map(e => e.trim()) ?? [],
          answer: e.answer.map(e => e.trim()),
        };
      });

    // データが正しいか判定し、誤りがあればエラーを返す
    {
      let failed: boolean = false;
      const result_str: string[] = [];
      if (category.title === '') {
        failed = true;
        result_str.push('・タイトルを設定してください');
      }
      if (category.tag.length > 8) {
        failed = true;
        result_str.push('・タグは8個以下にしてください');
      }

      // 空きがある問題のインデックス
      const blank_exam = new Set<number>();
      // &が2連続以上している問題
      const irregular_symbol_exam = new Set<number>();
      exam_result.forEach((e, i) => {
        switch (e.type) {
          case undefined:
            exam_result[i].type = 'Text';
            break;
          // 選択系のタイプの場合、choicesに空欄があるかチェック
          case 'Select':
          case 'MultiSelect':
            if (e.question_choices) {
              e.question_choices?.forEach(choice => choice === '' && blank_exam.add(i + 1));
            } else {
              blank_exam.add(i + 1);
            }
            break;
        }
        // 問題文が空欄かチェック
        if (e.question === '') blank_exam.add(i + 1);

        // 答え関連のチェック
        let answer_str = '';
        // 答えが1つ以上あるか確認
        // 複数選択ですべてのチェックを外すと0個になったりする
        if (e.answer.length === 0) {
          blank_exam.add(i + 1);
        } else {
          // 答えに空欄があるかチェック
          e.answer.forEach(str => {
            // forEachのついでにjoin(' ')みたいなことをする
            // joinを呼ぶ必要がないのでほんの少しだけ速くなるかも？
            answer_str += `${str} `;
            if (str === '') blank_exam.add(i + 1);
          });
        }

        // 使用できない記号などが含まれてないか確認
        const check = `${e.question} ${e.question_choices?.join(' ') ?? ''} ${answer_str} ${e.comment ?? ''}`;
        // `"` があった場合 -1 以外の数字が来る
        if (check.search('"') !== -1) irregular_symbol_exam.add(i + 1);
        // `\`が1つ以上連続している部分文字列を切り出して、\の数が奇数だったら駄目
        check.match(/\\+/g)?.forEach(part => {
          if (part.length % 2 === 1) {
            irregular_symbol_exam.add(i + 1);
          }
        });
      });

      if (blank_exam.size !== 0) {
        failed = true;
        const list = Array.from(blank_exam).toString();
        result_str.push(`・問題文もしくは答え・チェックボックスが空の問題があります\n(ページ: ${list})`);
      }
      if (irregular_symbol_exam.size !== 0) {
        failed = true;
        const list = Array.from(irregular_symbol_exam).toString();
        result_str.push(`・使用できない記号が含まれています\n(ページ: ${list})`);
      }
      if (failed) {
        Toast.open(result_str.join('\n'));
        return;
      }
    } // exam形式の確認おわり

    const request_data = {
      title: category.title,
      description: category.description,
      tag: category.tag.map(e => String(e.id) ?? e.name).join(','),
      list: exam_result,
    };
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
      <Helmet title='編集 - TAGether' />
      <h1>カテゴリの編集</h1>
      <h2>機能について</h2>
      <ul>
        <li>記号 \ を表示したいときは 「\\」と入力してください（括弧不要）</li>
        <li>
          「答え」の欄に&amp;を入れると、複数の正解を作ることが出来ます
          <br />
          例: 「A&amp;B&amp;C」→解答欄にAもしくはBもしくはCのどれかが入力されたら正解
        </li>
      </ul>
      <h2>制約</h2>
      <ul>
        <li>タグの数は8個以下にしてください</li>
        <li>タイトル及びすべての問題文・答えに空欄を作ることはできません</li>
        <li>選択問題の場合はかならず1つ以上の問題にチェックが必要です （入力欄左のチェックボックスを確認すること）</li>
        <li>記号 &quot; は使用できません </li>
        <li>\\ 以外で記号 \ は使用できません（必ず空白無しで偶数個記述すること）</li>
        <li>&amp;を2つ以上連続して入力することは許可されません</li>
      </ul>
      {isTagLoading || isCategoryLoading || exam.length === 0 ? (
        <Loading />
      ) : (
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
            tags={tags}
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
      )}
    </>
  );
}
