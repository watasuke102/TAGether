// TAGether - Share self-made data for classmates
// Api.ts
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
//
import {useRouter} from 'next/router';
import React from 'react';
import {categoly_default, request_default, tagdata_default, exam_default} from '@/utils/DefaultValue';
import Categoly from '@mytypes/Categoly';
import CategolyResponse from '@mytypes/CategolyResponse';
import FeatureRequest from '@mytypes/FeatureRequest';
import TagData from '@mytypes/TagData';

function useApiData<T>(target: string, init: T, onComplete?: (e: T[]) => void, without_list?: boolean): [T[], boolean] {
  const [is_loading, SetIsLoading] = React.useState(true);
  const [data, SetData] = React.useState([init]);
  const router = useRouter();
  const {id} = router.query;
  let id_str = '';
  let parameter = '';
  if (target === 'categoly') {
    id_str = Array.isArray(id) ? id[0] : id ?? '';
    if (without_list === true) {
      parameter = '?without_list=true';
    }
  }

  React.useEffect(() => {
    if (!router.isReady) return;
    (async () =>
      GetFromApi<T>(target, id_str, parameter).then(res => {
        if (onComplete) onComplete(res);
        SetData(res);
        SetIsLoading(false);
      }))();
  }, [router.isReady]);

  return [data, is_loading];
}

export const useRequestData = (onComplete?: (e: FeatureRequest[]) => void): [FeatureRequest[], boolean] =>
  useApiData<FeatureRequest>('request', request_default(), onComplete);
export const useTagData = (onComplete?: (e: TagData[]) => void): [TagData[], boolean] =>
  useApiData<TagData>('tag', tagdata_default(), onComplete);

export const useCategolyData = (without_list: boolean, onComplete?: (e: Categoly[]) => void): [Categoly[], boolean] => {
  const [data, SetData] = React.useState([categoly_default()]);
  const [is_loading, SetIsLoading] = React.useState(true);

  const [categoly, isCategolyLoading] = useApiData<CategolyResponse>('categoly', {
    id: 0,
    updated_at: '',
    version: 2,
    title: '',
    description: '',
    tag: '',
    list: JSON.stringify(exam_default(), undefined, '  '),
    deleted: 0,
  });
  const [tags, isTagLoading] = useTagData();

  React.useEffect(() => {
    if (isTagLoading || isCategolyLoading) return;

    // APIレスポンスではtagがstring ("tag1,tag2,tag3..."のような)になっている
    // これをTagDataに置き換える
    const res: Categoly[] = [];
    categoly.forEach(list_item => {
      const data_tag: TagData[] = [];
      // タグが存在するときのみ置き換え処理を実行する
      if (list_item.tag !== '') {
        list_item.tag.split(',').forEach(list_tag => {
          const index = tags.findIndex(tag => tag.id === Number(list_tag));
          // そのタグが存在するならそのTagDataを追加
          if (index !== -1) {
            data_tag.push(tags[index]);
          } else {
            data_tag.push({
              name: list_tag,
              description: '',
              updated_at: '',
            });
          }
        });
      }
      // 結果を格納する
      res.push({
        title: list_item.title,
        id: list_item.id ?? -1,
        updated_at: list_item.updated_at,
        version: list_item.version,
        description: list_item.description,
        list: list_item.list ?? '',
        tag: data_tag,
        deleted: list_item.deleted,
      });
    });
    if (onComplete) onComplete(res);
    SetData(res);
    SetIsLoading(false);
  }, [isCategolyLoading, isTagLoading]);

  return [data, is_loading];
};

export async function GetFromApi<T>(target: string, id?: string, parameter?: string): Promise<T[]> {
  // 渡されたURLクエリ (context.query.id) からidを取得
  // APIでカテゴリを取得する
  let data: T[] = [];
  try {
    data = await (await fetch(`${process.env.API_URL ?? ''}/${target}/${id ?? ''}${parameter ?? ''}`)).json();
  } catch {
    data = [];
  }
  // 取得したデータを返す
  return Array.isArray(data) && data.length > 0 ? data : [];
}
