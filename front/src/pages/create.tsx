// TAGether - Share self-made exam for classmates
// create.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/pages/create.module.scss';
import React from 'react';
import Helmet from 'react-helmet';
import Router from 'next/router';
import { GetServerSideProps } from 'next';
import Form from '../components/Form';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import Button from '../components/Button';
import TagEdit from '../components/TagEdit';
import ExamEditForms from '../components/ExamEditForms';
import ExamEditFormsOld from '../components/ExamEditFormsOld';
import GetFromApi from '../ts/Api';
import Exam from '../types/Exam';
import TagData from '../types/TagData';
import Categoly from '../types/Categoly';
import ButtonInfo from '../types/ButtonInfo';
import ApiResponse from '../types/ApiResponse';
import CreatePageConfig from '../types/CreatePageConfig';
import EditCategolyPageState from '../types/EditCategolyPageState';
import CategolyResponse from '../types/CategolyResponse';
import CheckBox from '../components/CheckBox';
import ButtonContainer from '../components/ButtonContainer';

// デフォルト値
function exam_default(): Exam[] {
  const tmp: Exam[] = [];
  tmp.push({ question: '', answer: Array<string>(1).fill(''), comment: '' });
  return tmp;
}
function categoly_default(): Categoly {
  return {
    id: 0, updated_at: '', version: 2, title: '',
    description: '', tag: [],
    list: JSON.stringify(exam_default(), undefined, '  ')
  };
}

interface Props {
  tags: TagData[]
  data: Categoly[]
}

export default class create extends React.Component<Props, EditCategolyPageState> {

  public config: CreatePageConfig = {
    document_title: '新規作成',
    heading: '新規カテゴリの追加',
    api_method: 'POST',
    api_success: 'カテゴリの追加に成功しました',
    buttons: [
      {
        type: 'material', icon: 'fas fa-plus', text: '新規カテゴリを追加',
        onClick: (): void => Router.reload()
      },
      {
        type: 'filled', icon: 'fas fa-check', text: 'カテゴリ一覧へ',
        onClick: (): Promise<boolean> => Router.push('/list')
      }
    ]
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      isToastOpen: false, isModalOpen: false,
      jsonEdit: false, is_using_old_form: false,
      categoly: categoly_default(), exam: exam_default(),
      res_result: { isSuccess: false, result: '' },
      showConfirmBeforeLeave: true
    };
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
  }

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
    this.setState({ isToastOpen: false });
    if (this.state.categoly.tag.length > 8) {
      this.setState({
        isToastOpen: true, res_result: {
          'isSuccess': false, 'result': 'タグは合計8個以下にしてください'
        }
      });
      return;
    }
    if (this.state.categoly.title == '') {
      this.setState({
        isToastOpen: true, res_result: {
          'isSuccess': false, 'result': 'タイトルを設定してください'
        }
      });
      return;
    }
    let failed: boolean = false;
    this.state.exam.forEach(e => {
      if (e.question == '') {
        failed = true;
        this.setState({
          isToastOpen: true, res_result: {
            'isSuccess': false, 'result': '問題文が入力されていない欄があります'
          }
        });
        return;
      }
      e.answer.forEach(answer => {
        if (answer == '') {
          failed = true;
          this.setState({
            isToastOpen: true, res_result: {
              'isSuccess': false, 'result': '答えが入力されていない欄があります'
            }
          });
          return;
        }
      });
    });
    if (failed) return;
    const exam = (this.state.jsonEdit) ?
      // インデントを削除
      JSON.stringify(JSON.parse(this.state.categoly.list))
      :
      JSON.stringify(this.state.exam);
    const tmp: Categoly = this.state.categoly;
    let tag: string = '';
    tmp.tag.forEach(e => tag += `${e.id ?? e.name},`);
    const categoly: CategolyResponse = {
      id: tmp.id, title: tmp.title, description: tmp.description, tag: tag.slice(0, -1), list: exam
    };

    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        const result = JSON.parse(req.responseText);
        this.FinishedRegist(result);
        // エラーだったらページ移動確認ダイアログを無効化しない
        if (!result.isSuccess) {
          this.RouterEventOff();
          this.setState({ showConfirmBeforeLeave: false });
        }
      }
    };
    const url = process.env.EDIT_URL + '/categoly';
    if (url == undefined) {
      this.setState({ isToastOpen: true, res_result: { 'isSuccess': false, 'result': '失敗しました: URL is undefined' } });
      return;
    }
    req.open(this.config.api_method, url);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(categoly));
    console.log('BODY: ' + JSON.stringify(categoly));
  }
  FinishedRegist(result: ApiResponse): void {
    this.setState({ isModalOpen: true, res_result: result });
  }

  // state更新
  UpdateCategoly(type: 'title' | 'desc' | 'list', str: string): void {
    const tmp = this.state.categoly;
    switch (type) {
      case 'title': tmp.title = str; break;
      case 'desc': tmp.description = str; break;
      case 'list': tmp.list = str; break;
    }
    this.setState({ categoly: tmp });
  }

  // モーダルウィンドウの中身
  RegistResult(string_only?: boolean): React.ReactElement {
    let result;
    if (this.state.res_result.result != '') {
      result = this.state.res_result;
    } else {
      // 何も中身がなければエラー時の値を代入する
      result = { isSuccess: 'error', result: '失敗しました' };
    }
    let message;
    let button_info: ButtonInfo[] = [];
    // 成功した場合、続けて追加/編集を続ける/カテゴリ一覧へ戻るボタンを表示
    if (result.isSuccess) {
      message = this.config.api_success;
      button_info = this.config.buttons;
    } else {
      // 失敗した場合、閉じるボタンのみ
      message = 'エラー: ' + result.result;
      button_info.push({
        type: 'filled', icon: 'fas fa-times', text: '閉じる',
        onClick: () => this.setState({ isModalOpen: false })
      });
    }
    if (string_only) {
      return message;
    }

    const button: React.ReactElement[] = [];
    button_info.forEach(e => { button.push(<Button {...e} />); });
    return (
      <div className={css.window}>
        <p>{message}</p>
        <ButtonContainer>
          {button}
        </ButtonContainer>
      </div>
    );
  }

  render(): React.ReactElement {
    return (
      <>
        <Helmet title={`${this.config.document_title} - TAGether`} />

        <h1>{this.config.heading}</h1>

        <ul>
          <li>記号 &quot; は使用できません </li>
          <li>
            記号 \ を表示したいときは \\ のように入力してください<br />
            \\ 以外で記号 \ を使用しないでください。問題を開けなくなります
          </li>
          <li>
            「答え」の欄に&を入れると、複数の正解を作ることが出来ます<br />
            例: 「A&B&C」→解答欄にAもしくはBもしくはCのどれかが入力されたら正解
          </li>
        </ul>

        <div className={css.edit_area}>
          <Form {...{
            label: 'タイトル', value: this.state.categoly.title, rows: 1,
            onChange: (e) => this.UpdateCategoly('title', e.target.value)
          }} />
          <Form {...{
            label: '説明', value: this.state.categoly.description, rows: 3,
            onChange: (e) => this.UpdateCategoly('desc', e.target.value)
          }} />
        </div>

        <h2>タグ</h2>
        <TagEdit tags={this.props.tags} current_tag={this.state.categoly.tag}
          SetTag={(e: TagData[]) => {
            const tmp = this.state.categoly;
            tmp.tag = e;
            this.setState({ categoly: tmp });
          }} />
        <h2>問題</h2>

        <div className={css.buttons}>
          <CheckBox status={this.state.jsonEdit} desc='高度な編集（JSON）'
            onChange={e => this.setState({ jsonEdit: e })} />
          <CheckBox status={this.state.is_using_old_form} desc='古い編集画面を使う'
            onChange={e => this.setState({ is_using_old_form: e })} />
          <div className={css.pushbutton_wrapper}>
            <Button type={'filled'} icon={'fas fa-check'} text={'編集を適用'}
              onClick={() => this.RegistExam()} />
          </div>
        </div>

        <hr />

        {this.state.jsonEdit ?
          <>
            <p>注意：編集内容はリッチエディタと同期されません</p>
            <Form label='JSON' value={this.state.categoly.list} rows={30}
              onChange={(e) => this.UpdateCategoly('list', e.target.value)} />
          </>
          :
          <>
            {
              this.state.is_using_old_form ?
                <ExamEditFormsOld exam={this.state.exam} register={() => this.RegistExam()}
                  updater={(e) => this.setState({ exam: e })} />
                :
                <ExamEditForms exam={this.state.exam} register={() => this.RegistExam()}
                  updater={(e) => this.setState({ exam: e })} />
            }
          </>
        }

        <Modal isOpen={this.state.isModalOpen} close={() => this.setState({ isModalOpen: false })}>
          {this.RegistResult()}
        </Modal>
        <Toast
          id={'toast_create'}
          isOpen={this.state.isToastOpen}
          close={() => this.setState({ isToastOpen: false })}
        >
          <div className={css.toast_body}>
            <span className='fas fa-bell' />
            {this.RegistResult(true)}
          </div>
        </Toast>
      </>
    );
  }
}

// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  const tags = await GetFromApi<TagData>('tag', context.query.id);
  const data = await GetFromApi<Categoly>('categoly', context.query.id);
  return { props: { tags: tags, data: data } };
};
