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
    AddNewCategoly: () => Router.push('/create')
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
