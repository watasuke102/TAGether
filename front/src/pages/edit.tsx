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
import GetFromApi from '../ts/Api';
import TagData from '../types/TagData';
import Categoly from '../types/Categoly';
import ButtonInfo from '../types/ButtonInfo';
import ApiResponse from '../types/ApiResponse';
import CreatePageConfig from "../types/CreatePageConfig";

interface Props {
  tags: TagData[]
  data: Categoly[]
}

export default class edit extends Create {
  public config: CreatePageConfig = {
    document_title: '編集',
    heading: 'カテゴリの編集',
    api_method: 'PUT',
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

  constructor(props: Props) {
    super(props);
    const categoly = this.props.data[0];
    categoly.list = JSON.stringify(JSON.parse(categoly.list), undefined, '  ');
    this.state = {
      isToastOpen: false, isModalOpen: false, jsonEdit: false,
      is_using_old_form: false, categoly: categoly,
      exam: JSON.parse(this.props.data[0].list),
      res_result: { isSuccess: false, result: '' },
      showConfirmBeforeLeave: true
    };
  }

  FinishedRegist(result: ApiResponse): void {
    this.setState({ isToastOpen: true, res_result: result });
  }
}

// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  const tags = await GetFromApi<TagData>('tag', undefined);
  const data = await GetFromApi<Categoly>('categoly', context.query.id);
  return { props: { tags: tags, data: data } };
};
