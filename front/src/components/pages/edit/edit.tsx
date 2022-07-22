// TAGether - Share self-made exam for classmates
// create.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './edit.module.scss';
import React from 'react';
import Helmet from 'react-helmet';
import Button from '@/common/Button/Button';
import {SelectButton} from '@/common/SelectBox';
import Form from '@/common/TextForm/Form';
import Toast from '@/common/Toast/Toast';
import ExamEditForms from '@/features/ExamEdit/ExamEditForms';
import ExamEditFormsOld from '@/features/ExamEdit/ExamEditFormsOld';
import TagListEdit from '@/features/TagListEdit/TagListEdit';
import {useConfirmBeforeLeave} from '@/utils/ConfirmBeforeLeave';
import {exam_default, categoly_default} from '@/utils/DefaultValue';
import UpdateExam from '@/utils/UpdateExam';
import Categoly from '@mytypes/Categoly';
import CategolyResponse from '@mytypes/CategolyResponse';
import Exam from '@mytypes/Exam';
import TagData from '@mytypes/TagData';

interface Props {
  data: Categoly;
  tags: TagData[];
}

export const ExamContext = React.createContext<Exam[]>(exam_default());

export default function Edit(props: Props): React.ReactElement {
  const isFirstRendering = React.useRef(true);
  const SetShowConfirmBeforeLeave = useConfirmBeforeLeave();

  const [isToastOpen, SetIsToastOpen] = React.useState(false);
  const [isJsonEdit, SetIsJsonEdit] = React.useState(false);
  const [isOldForm, SetIsOldForm] = React.useState(props.data.version === 1);
  const [registError, SetRegistError] = React.useState('');

  const [categoly, SetCategoly] = React.useState(props.data);
  const categoly_ref = React.useRef<Categoly>(categoly_default());
  categoly_ref.current = categoly;
  const [exam, SetExam] = React.useState<Exam[]>(JSON.parse(props.data.list));
  const exam_ref = React.useRef<Exam[]>(exam_default());
  exam_ref.current = exam;

  // 初回レンダリング時に実行されないようにしている
  React.useEffect(() => {
    isFirstRendering.current = true;
  }, []);
  React.useEffect(() => {
    if (isFirstRendering.current) {
      isFirstRendering.current = false;
    } else {
      SetShowConfirmBeforeLeave(true);
    }
  }, [exam, categoly]);

  // ショートカットキー
  const Shortcut = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'KeyS' && !e.repeat && !e.shiftKey) {
        e.preventDefault();
        RegistCategoly();
      }
    },
    [exam, categoly],
  );

  React.useEffect(() => {
    window.addEventListener('keydown', e => Shortcut(e));
    return () => window.removeEventListener('keydown', e => Shortcut(e));
  }, []);

  function UpdateCategoly(type: 'title' | 'desc' | 'list', v: string) {
    // 普通に代入すると浅いコピーになってしまった
    const stat = JSON.parse(JSON.stringify(categoly));
    // prettier-ignore
    switch (type) {
      case 'title': stat.title       = v; break;
      case 'desc':  stat.description = v; break;
      case 'list':  stat.list        = v; break;
    }
    SetCategoly(stat);
  }

  // カテゴリ登録
  function RegistCategoly(): void {
    // トーストを閉じる
    SetIsToastOpen(false);

    // 編集用
    const exam_tmp = exam_ref.current;
    const categoly = categoly_ref.current;

    // データが正しいか判定し、誤りがあればエラーを返す
    {
      let failed: boolean = false;
      const result_str: string[] = [];
      if (categoly.title === '') {
        failed = true;
        result_str.push('・タイトルを設定してください');
      }
      if (categoly.tag.length > 8) {
        failed = true;
        result_str.push('・タグは8個以下にしてください');
      }

      // 空きがある問題のインデックス
      const blank_exam = new Set<number>();
      // &が2連続以上している問題
      const irregular_symbol_exam = new Set<number>();
      exam_tmp.forEach((e, i) => {
        switch (e.type) {
          case undefined:
            exam_tmp[i].type = 'Text';
            break;
          // 選択系のタイプの場合、choicesに空欄があるかチェック
          case 'Select':
          case 'MultiSelect':
            e.question_choices?.forEach(choice => choice === '' && blank_exam.add(i));
            break;
        }
        // 問題文が空欄かチェック
        if (e.question === '') blank_exam.add(i + 1);
        // 答えに空欄があるかチェック
        let answer_str = '';
        e.answer.forEach(str => {
          // forEachのついでにjoin(' ')みたいなことをする
          // joinを呼ぶ必要がないのでほんの少しだけ速くなるかも？
          answer_str += `${str} `;
          if (str === '') blank_exam.add(i + 1);
        });
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
        SetIsToastOpen(true);
        SetRegistError(result_str.join('\n'));
        return;
      }
    } // exam形式の確認おわり

    // 登録の準備
    const tag: string[] = categoly.tag.map(e => String(e.id) ?? e.name);
    const api_body: CategolyResponse = {
      ...categoly,
      version: isOldForm ? 1 : 2,
      tag: tag.toString(),
      // インデントを削除
      list: isJsonEdit ? JSON.stringify(JSON.parse(categoly.list)) : JSON.stringify(exam_tmp),
    };

    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        const result = JSON.parse(req.responseText);
        if (req.status === 200) {
          SetRegistError('');
          SetIsToastOpen(true);
          // 確認ダイアログを無効化
          SetShowConfirmBeforeLeave(false);
        } else {
          // エラーはcreate/edit関わらずToastで表示する
          SetRegistError(result.message);
          SetIsToastOpen(true);
        }
      }
    };
    req.open('PUT', process.env.API_URL + '/categoly');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(api_body));
    console.log('BODY: ' + JSON.stringify(api_body));
  }

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

      <div className={css.edit_area}>
        <Form
          {...{
            label: 'タイトル',
            value: categoly.title,
            rows: 1,
            onChange: e => UpdateCategoly('title', e.target.value),
          }}
        />
        <Form
          {...{
            label: '説明',
            value: categoly.description,
            rows: 3,
            onChange: e => UpdateCategoly('desc', e.target.value),
          }}
        />
      </div>

      <h2>タグ</h2>
      <TagListEdit
        tags={props.tags}
        current_tag={categoly.tag}
        SetTag={(e: TagData[]) => {
          const tmp = categoly;
          tmp.tag = e;
          SetCategoly(tmp);
        }}
      />
      <h2>問題</h2>

      <div className={css.buttons}>
        <SelectButton type='single' status={isJsonEdit} desc='高度な編集（JSON）' onChange={SetIsJsonEdit} />
        {props.data.version !== 1 && (
          <SelectButton type='single' status={isOldForm} desc='古い編集画面を使う' onChange={SetIsOldForm} />
        )}
        <div className={css.pushbutton_wrapper}>
          <Button type={'filled'} icon={'fas fa-check'} text={'編集を適用'} onClick={() => RegistCategoly()} />
        </div>
      </div>

      <hr />

      {isJsonEdit ? (
        <>
          <p>注意：編集内容はリッチエディタと同期されません</p>
          <Form label='JSON' value={categoly.list} rows={30} onChange={e => UpdateCategoly('list', e.target.value)} />
        </>
      ) : (
        <>
          {isOldForm ? (
            <ExamEditFormsOld
              exam={exam}
              register={RegistCategoly}
              updater={UpdateExam(SetExam, JSON.parse(JSON.stringify(exam)))}
            />
          ) : (
            <ExamContext.Provider value={exam}>
              <ExamEditForms updater={e => SetExam(e)} />
            </ExamContext.Provider>
          )}
        </>
      )}

      <Toast id={'toast_create'} isOpen={isToastOpen} close={() => SetIsToastOpen(false)}>
        <div className={css.toast_body}>
          <span className='fas fa-bell' />
          {registError === '' ? '編集結果を適用しました' : `エラーが発生しました。\n${registError}`}
        </div>
      </Toast>
    </>
  );
}
