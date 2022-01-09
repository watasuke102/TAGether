// TAGether - Share self-made exam for classmates
// create.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './create.module.scss';
import Router from 'next/router';
import React from 'react';
import Helmet from 'react-helmet';
import Button from '@/common/Button/Button';
import ButtonContainer from '@/common/Button/ButtonContainer';
import CheckBox from '@/common/CheckBox/CheckBox';
import Modal from '@/common/Modal/Modal';
import Form from '@/common/TextForm/Form';
import Toast from '@/common/Toast/Toast';
import ExamEditForms from '@/features/ExamEdit/ExamEditForms';
import ExamEditFormsOld from '@/features/ExamEdit/ExamEditFormsOld';
import TagListEdit from '@/features/TagListEdit/TagListEdit';
import {exam_default, categoly_default} from '@/utils/DefaultValue';
import UpdateExam from '@/utils/UpdateExam';
import ApiResponse from '@mytypes/ApiResponse';
import ButtonInfo from '@mytypes/ButtonInfo';
import Categoly from '@mytypes/Categoly';
import CategolyResponse from '@mytypes/CategolyResponse';
import EditCategolyPageState from '@mytypes/EditCategolyPageState';
import TagData from '@mytypes/TagData';

interface Props {
  mode: 'create' | 'edit';
  tags: TagData[];
  data: Categoly[];
}

export default class create extends React.Component<Props, EditCategolyPageState> {
  constructor(props: Props) {
    super(props);
    this.props.data[0].version = 2;
    this.state = {
      isToastOpen: false,
      isModalOpen: false,
      jsonEdit: false,
      is_using_old_form: this.props.data[0].version === 1,
      categoly: this.isCreate() ? categoly_default() : this.props.data[0],
      exam: this.isCreate() ? exam_default() : JSON.parse(this.props.data[0].list),
      res_result: {isSuccess: false, result: ''},
      showConfirmBeforeLeave: true,
    };
  }

  isCreate(): boolean {
    return this.props.mode === 'create';
  }

  // ページ移動時に警告
  ShowAlertBeforeLeave(): void {
    if (!window.confirm('変更は破棄されます。ページを移動してもよろしいですか？')) {
      throw new Error('canceled');
    }
  }
  BeforeUnLoad = (e: BeforeUnloadEvent): void => {
    if (!this.state.showConfirmBeforeLeave) return;
    e.preventDefault();
    e.returnValue = '変更は破棄されます。ページを移動してもよろしいですか？';
  };

  RouterEventOn(): void {
    Router.events.on('routeChangeStart', this.ShowAlertBeforeLeave);
  }
  RouterEventOff(): void {
    Router.events.off('routeChangeStart', this.ShowAlertBeforeLeave);
  }
  componentDidMount(): void {
    window.addEventListener('beforeunload', this.BeforeUnLoad);
    this.RouterEventOn();
  }
  componentWillUnmount(): void {
    window.removeEventListener('beforeunload', this.BeforeUnLoad);
    this.RouterEventOff();
  }

  // カテゴリ登録
  RegistExam(): void {
    // トーストを閉じる
    this.setState({isToastOpen: false});

    // 編集用
    const exam_tmp = this.state.exam;

    // データが正しいか判定し、誤りがあればエラーを返す
    {
      let failed: boolean = false;
      let result_str: string = '';
      if (this.state.categoly.title === '') {
        failed = true;
        result_str += '・タイトルを設定してください\n';
      }
      if (this.state.categoly.tag.length > 8) {
        failed = true;
        result_str += '・タグは8個以下にしてください\n';
      }

      // 空きがある問題の一覧
      // 重複を排除したかったのでstringではなくArray
      const blank_exam: number[] = [];
      this.state.exam.forEach((e, i) => {
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
        this.setState({
          isToastOpen: true,
          res_result: {
            isSuccess: false,
            result: result_str,
          },
        });
        return;
      }
    }

    // 登録の準備
    // インデントを削除
    const exam = this.state.jsonEdit ? JSON.stringify(JSON.parse(this.state.categoly.list)) : JSON.stringify(exam_tmp);
    const tmp: Categoly = this.state.categoly;
    const tag: string[] = [];
    tmp.tag.forEach(e => tag.push(String(e.id) ?? e.name));
    const categoly: CategolyResponse = {
      id: tmp.id,
      version: this.state.is_using_old_form ? 1 : 2,
      title: tmp.title,
      description: tmp.description,
      tag: tag.toString(),
      list: exam,
    };

    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        const result = JSON.parse(req.responseText);
        this.FinishedRegist(result);
        // エラーだったらページ移動確認ダイアログを無効化しない
        if (!result.isSuccess) {
          this.RouterEventOff();
          this.setState({showConfirmBeforeLeave: false});
        }
      }
    };
    const url = process.env.EDIT_URL + '/categoly';
    if (url === undefined) {
      this.setState({isToastOpen: true, res_result: {isSuccess: false, result: '失敗しました: URL is undefined'}});
      return;
    }
    req.open(this.isCreate() ? 'POST' : 'PUT', url);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(categoly));
    console.log('BODY: ' + JSON.stringify(categoly));
  }
  FinishedRegist(result: ApiResponse): void {
    // createの場合はmodalを表示、editの場合はtoastを表示するから
    this.setState({isModalOpen: this.isCreate(), isToastOpen: !this.isCreate(), res_result: result});
  }

  // state更新
  UpdateCategoly(type: 'title' | 'desc' | 'list', str: string): void {
    const tmp = this.state.categoly;
    switch (type) {
      case 'title':
        tmp.title = str;
        break;
      case 'desc':
        tmp.description = str;
        break;
      case 'list':
        tmp.list = str;
        break;
    }
    this.setState({categoly: tmp});
  }

  // モーダルウィンドウの中身
  RegistResult(from: 'Modal' | 'Toast'): React.ReactElement {
    let result;
    if (this.state.res_result.result !== '') {
      result = this.state.res_result;
    } else {
      // 何も中身がなければエラー時の値を代入する
      result = {isSuccess: 'error', result: '失敗しました'};
    }
    let message: string;
    let button_info: ButtonInfo[] = [];
    // 成功した場合、続けて追加/編集を続ける/カテゴリ一覧へ戻るボタンを表示
    if (result.isSuccess) {
      message = this.isCreate() ? 'カテゴリの追加に成功しました' : '編集結果を適用しました';
      button_info = [
        {
          type: 'material',
          icon: 'fas fa-plus',
          text: '新規カテゴリを追加',
          onClick: (): void => Router.reload(),
        },
        {
          type: 'filled',
          icon: 'fas fa-check',
          text: 'カテゴリ一覧へ',
          onClick: (): Promise<boolean> => Router.push('/list'),
        },
      ];
    } else {
      // 失敗した場合、閉じるボタンのみ
      message = 'エラーが発生しました。\n' + result.result;
      button_info = [
        {
          type: 'filled',
          icon: 'fas fa-times',
          text: '閉じる',
          onClick: () => this.setState({isModalOpen: false}),
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

  render(): React.ReactElement {
    return (
      <>
        <Helmet title={`${this.isCreate() ? '新規作成' : '編集'} - TAGether`} />

        <h1>{this.isCreate() ? '新規カテゴリの追加' : 'カテゴリの編集'}</h1>

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
              value: this.state.categoly.title,
              rows: 1,
              onChange: e => this.UpdateCategoly('title', e.target.value),
            }}
          />
          <Form
            {...{
              label: '説明',
              value: this.state.categoly.description,
              rows: 3,
              onChange: e => this.UpdateCategoly('desc', e.target.value),
            }}
          />
        </div>

        <h2>タグ</h2>
        <TagListEdit
          tags={this.props.tags}
          current_tag={this.state.categoly.tag}
          SetTag={(e: TagData[]) => {
            const tmp = this.state.categoly;
            tmp.tag = e;
            this.setState({categoly: tmp});
          }}
        />
        <h2>問題</h2>

        <div className={css.buttons}>
          <CheckBox
            status={this.state.jsonEdit}
            desc='高度な編集（JSON）'
            onChange={e => this.setState({jsonEdit: e})}
          />
          {this.props.data[0].version !== 1 && (
            <CheckBox
              status={this.state.is_using_old_form}
              desc='古い編集画面を使う'
              onChange={e => this.setState({is_using_old_form: e})}
            />
          )}
          <div className={css.pushbutton_wrapper}>
            <Button type={'filled'} icon={'fas fa-check'} text={'編集を適用'} onClick={() => this.RegistExam()} />
          </div>
        </div>

        <hr />

        {this.state.jsonEdit ? (
          <>
            <p>注意：編集内容はリッチエディタと同期されません</p>
            <Form
              label='JSON'
              value={this.state.categoly.list}
              rows={30}
              onChange={e => this.UpdateCategoly('list', e.target.value)}
            />
          </>
        ) : (
          <>
            {this.state.is_using_old_form ? (
              <ExamEditFormsOld
                exam={this.state.exam}
                register={() => this.RegistExam()}
                updater={UpdateExam(e => this.setState({exam: e}), this.state.exam)}
              />
            ) : (
              <ExamEditForms
                exam={this.state.exam}
                register={() => this.RegistExam()}
                updater={UpdateExam(e => this.setState({exam: e}), this.state.exam)}
              />
            )}
          </>
        )}

        <Modal isOpen={this.state.isModalOpen} close={() => this.setState({isModalOpen: false})}>
          {this.RegistResult('Modal')}
        </Modal>
        <Toast id={'toast_create'} isOpen={this.state.isToastOpen} close={() => this.setState({isToastOpen: false})}>
          <div className={css.toast_body}>
            <span className='fas fa-bell' />
            {this.RegistResult('Toast')}
          </div>
        </Toast>
      </>
    );
  }
}
