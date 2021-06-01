// TAGether - Share self-made exam for classmates
// edit.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import Create from './create';
import { GetCategoly } from '../ts/Api';
import EditCategolyPageState from '../types/EditCategolyPageState';

export default class edit extends Create {
  public text = {
    document_title: '編集',
    heading: 'カテゴリの編集',
    api_success: '編集結果を適用しました',
    buttons: [
      {
        type: 'material', icon: 'fas fa-undo', text: '編集を続ける',
        onClick: (): void => {
          this.RouterEventOn();
          this.setState({ isModalOpen: false, showConfirmBeforeLeave: true });
        }
      },
      {
        type: 'material', icon: 'fas fa-arrow-right', text: 'この問題を解く',
        onClick: (): Promise<boolean> => Router.push('/exam?id=' + this.state.categoly.id + '&shuffle=false')
      },
      {
        type: 'filled', icon: 'fas fa-check', text: 'カテゴリ一覧へ',
        onClick: (): Promise<boolean> => Router.push('/list')
      },
    ]
  }
  public api_method = 'PUT';

  constructor(props: EditCategolyPageState) {
    super(props);
    this.state = {
      isToastOpen: false,
      categoly: this.props.data[0],
      exam: JSON.parse(this.props.data[0].list),
      isModalOpen: false, res_result: '',
      showConfirmBeforeLeave: true
    };
  }

  FinishedRegist(str: string): void {
    this.setState({ isToastOpen: true, res_result: str });
  }
}


// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await GetCategoly(context.query.id);
  return { props: { data } };
};
