// TAGether - Share self-made exam for classmates
// create.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './create.module.scss';
import {useRouter} from 'next/router';
import React from 'react';
import Helmet from 'react-helmet';
import Button from '@/common/Button/Button';
import ButtonContainer from '@/common/Button/ButtonContainer';
import Modal from '@/common/Modal/Modal';
import {SelectButton} from '@/common/SelectBox';
import Form from '@/common/TextForm/Form';
import Toast from '@/common/Toast/Toast';
import ExamEditForms from '@/features/ExamEdit/ExamEditForms';
import ExamEditFormsOld from '@/features/ExamEdit/ExamEditFormsOld';
import TagListEdit from '@/features/TagListEdit/TagListEdit';
import {useConfirmBeforeLeave} from '@/utils/ConfirmBeforeLeave';
import {exam_default, categoly_default} from '@/utils/DefaultValue';
import UpdateExam from '@/utils/UpdateExam';
import ButtonInfo from '@mytypes/ButtonInfo';
import Categoly from '@mytypes/Categoly';
import CategolyResponse from '@mytypes/CategolyResponse';
import Exam from '@mytypes/Exam';
import TagData from '@mytypes/TagData';

interface Props {
  mode: 'create' | 'edit';
  data: Categoly;
  tags: TagData[];
}

export const ExamContext = React.createContext<Exam[]>(exam_default());

export default function create(props: Props): React.ReactElement {
  const router = useRouter();
  const isFirstRendering = React.useRef(true);
  const SetShowConfirmBeforeLeave = useConfirmBeforeLeave();

  const [isToastOpen, SetIsToastOpen] = React.useState(false);
  const [isModalOpen, SetIsModalOpen] = React.useState(false);
  const [isJsonEdit, SetIsJsonEdit] = React.useState(false);
  const [isOldForm, SetIsOldForm] = React.useState(props.data.version === 1);
  const [registError, SetRegistError] = React.useState('');

  const [categoly, SetCategoly] = React.useState(isCreate() ? categoly_default() : props.data);
  const [exam, SetExam] = React.useState<Exam[]>(isCreate() ? exam_default() : JSON.parse(props.data.list));

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

  function isCreate(): boolean {
    return props.mode === 'create';
  }

  // カテゴリ登録
  function RegistExam(): void {
    // トーストを閉じる
    SetIsToastOpen(false);

    // 編集用
    const exam_tmp = exam;

    // データが正しいか判定し、誤りがあればエラーを返す
    {
      let failed: boolean = false;
      let result_str: string = '';
      if (categoly.title === '') {
        failed = true;
        result_str += '・タイトルを設定してください\n';
      }
      if (categoly.tag.length > 8) {
        failed = true;
        result_str += '・タグは8個以下にしてください\n';
      }

      // 空きがある問題の一覧
      // 重複を排除したかったのでstringではなくArray
      const blank_exam: number[] = [];
      exam.forEach((e, i) => {
        if (!e.type) exam_tmp[i].type = 'Text';
        // 問題文が空欄かチェック
        if (e.question === '') blank_exam.push(i);
        // 答えに空欄があるかチェック
        if (e.answer.length < 1) blank_exam.push(i);
        e.answer.forEach(answer => answer === '' && blank_exam.push(i));
        // 選択系のタイプの場合、choicesに空欄があるかチェック
        if (e.type === 'Select' || e.type === 'MultiSelect') {
          e.question_choices?.forEach(choice => choice === '' && blank_exam.push(i));
        }
      });
      if (blank_exam.length !== 0) {
        failed = true;
        let txt: string = '';
        // 重複を排除し、'0, 1, 2, 'みたいな形の文字列に整形する
        Array.from(new Set(blank_exam)).forEach(e => (txt += `${e + 1}, `));
        result_str += `・問題文もしくは答え・チェックボックスが空の問題があります\n(ページ: ${txt.slice(0, -2)})\n`;
      }
      if (failed) {
        SetIsToastOpen(true);
        SetRegistError(result_str);
        return;
      }
    }
    // exam形式の確認おわり

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
          // createの場合はmodalを表示、editの場合はtoastを表示する
          SetRegistError('');
          isCreate() ? SetIsModalOpen(true) : SetIsToastOpen(true);
          // 確認ダイアログを無効化
          SetShowConfirmBeforeLeave(false);
        } else {
          // エラーはcreate/edit関わらずToastで表示する
          SetRegistError(result.message);
          SetIsToastOpen(true);
        }
      }
    };
    req.open(isCreate() ? 'POST' : 'PUT', process.env.API_URL + '/categoly');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(api_body));
    console.log('BODY: ' + JSON.stringify(api_body));
  }

  // モーダルウィンドウの中身
  function RegistResult(from: 'Modal' | 'Toast'): React.ReactElement {
    let message: string;
    let button_info: ButtonInfo[] = [];
    // 成功した場合、続けて追加/編集を続ける/カテゴリ一覧へ戻るボタンを表示
    if (registError === '') {
      message = isCreate() ? 'カテゴリの追加に成功しました' : '編集結果を適用しました';
      button_info = [
        {
          type: 'material',
          icon: 'fas fa-plus',
          text: '新規カテゴリを追加',
          onClick: (): void => router.reload(),
        },
        {
          type: 'filled',
          icon: 'fas fa-check',
          text: 'カテゴリ一覧へ',
          onClick: (): Promise<boolean> => router.push('/list'),
        },
      ];
    } else {
      // 失敗した場合、閉じるボタンのみ
      message = `エラーが発生しました。\n${registError}`;
      button_info = [
        {
          type: 'filled',
          icon: 'fas fa-times',
          text: '閉じる',
          onClick: () => SetIsModalOpen(false),
        },
      ];
    }

    if (from === 'Toast') {
      return (
        <span>
          {message.split('\n').map(txt => (
            <>
              {txt}
              <br />
            </>
          ))}
        </span>
      );
    }

    const button: React.ReactElement[] = [];
    button_info.forEach(e => {
      button.push(<Button {...e} />);
    });
    return (
      <div className={css.window}>
        <p>{message}</p>
        <ButtonContainer>{button}</ButtonContainer>
      </div>
    );
  }
  return (
    <>
      <Helmet title={`${isCreate() ? '新規作成' : '編集'} - TAGether`} />

      <h1>{isCreate() ? '新規カテゴリの追加' : 'カテゴリの編集'}</h1>

      <ul>
        <li>記号 &quot; は使用できません </li>
        <li>
          記号 \ を表示したいときは \\ のように入力してください
          <br />
          \\ 以外で記号 \ を使用しないでください。問題を開けなくなります
        </li>
        <li>
          「答え」の欄に&を入れると、複数の正解を作ることが出来ます
          <br />
          例: 「A&B&C」→解答欄にAもしくはBもしくはCのどれかが入力されたら正解
        </li>
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
          <Button type={'filled'} icon={'fas fa-check'} text={'編集を適用'} onClick={() => RegistExam()} />
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
              register={RegistExam}
              updater={UpdateExam(SetExam, JSON.parse(JSON.stringify(exam)))}
            />
          ) : (
            <ExamContext.Provider value={exam}>
              <ExamEditForms updater={(e) => SetExam(e)} />
            </ExamContext.Provider>
          )}
        </>
      )}

      <Modal isOpen={isModalOpen} close={() => SetIsModalOpen(false)}>
        {RegistResult('Modal')}
      </Modal>
      <Toast id={'toast_create'} isOpen={isToastOpen} close={() => SetIsToastOpen(false)}>
        <div className={css.toast_body}>
          <span className='fas fa-bell' />
          {RegistResult('Toast')}
        </div>
      </Toast>
    </>
  );
}
