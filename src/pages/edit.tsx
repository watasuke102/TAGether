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
import EditCategolyPageState from '../types/EditCategolyPageState';

export default class edit extends Create {
  public text = {
    heading: 'カテゴリの編集',
    api_success: '編集結果を適用しました',
    buttons: [
      {
        type: 'material', icon: 'fas fa-undo', text: '編集を続ける',
        onClick: () => {
          this.RouterEventOn();
          this.setState({ isModalOpen: false, showConfirmBeforeLeave: true })
        }
      },
      {
        type: 'material', icon: 'fas fa-arrow-right', text: 'この問題を解く',
        onClick: () => Router.push('/exam?id='+this.state.categoly.id+'&shuffle=false')
      },
      {
        type: 'filled', icon: 'fas fa-check', text: 'カテゴリ一覧へ',
        onClick: () => Router.push('/list')
      },
    ]
  }
  public api_method = 'PUT';

  constructor(props: EditCategolyPageState) {
    super(props);
    this.state = {
      categoly: this.props.data[0],
      exam: JSON.parse(this.props.data[0].list),
      isModalOpen: false, res_result: '',
      showConfirmBeforeLeave: true
    }
  }
}


// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(process.env.API_URL + '?id=' + context.query.id);
  const data = await res.json();
  return {props:{data}};
}
