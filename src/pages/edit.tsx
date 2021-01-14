// TAGether - Share self-made exam for classmates
// edit.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import { GetServerSideProps } from 'next';
import Create from './create';
import EditCategolyPageState from '../types/EditCategolyPageState';

export default class edit extends Create {
  public text = {
    heading: 'カテゴリの編集',
    apply_button: '編集内容の適用'
  }
  constructor(props: EditCategolyPageState) {
    super(props);
    this.state = {
      categoly: this.props.data[0],
      exam: JSON.parse(this.props.data[0].list),
      isModalOpen: false, res_result: ''
    }
  }
}


// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch('https://api.watasuke.tk?id=' + context.query.id);
  const data = await res.json();
  return {props:{data}};
}
