// TAGether - Share self-made data for classmates
// Api.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import {useRouter} from 'next/router';
import React from 'react';
import {categoly_default, request_default, tagdata_default, exam_default} from '@/utils/DefaultValue';
import Categoly from '@mytypes/Categoly';
import CategolyResponse from '@mytypes/CategolyResponse';
import FeatureRequest from '@mytypes/FeatureRequest';
import TagData from '@mytypes/TagData';

function useApiData<T>(target: string, init: T, onComplete?: (e: T[]) => void): [T[], boolean] {
  const [isLoading, SetIsLoading] = React.useState(true);
  const [data, SetData] = React.useState([init]);
  const router = useRouter();
  const {id, shuffle} = router.query;

  const id_str = Array.isArray(id) ? id[0] : id ?? '';
  const is_shuffle = shuffle === 'true' && router.pathname.slice(1, 5) !== 'exam';

  React.useEffect(() => {
    (async () =>
      GetFromApi<T>(target, id_str, is_shuffle).then(res => {
        console.log(`[GetFromApi -> ${target}] `, res);
        if (onComplete) onComplete(res);
        SetData(res);
        SetIsLoading(false);
      }))();
  }, []);

  return [data, isLoading];
}

export const useRequestData = (onComplete?: (e: FeatureRequest[]) => void): [FeatureRequest[], boolean] =>
  useApiData<FeatureRequest>('request', request_default(), onComplete);
export const useTagData = (onComplete?: (e: TagData[]) => void): [TagData[], boolean] =>
  useApiData<TagData>('tag', tagdata_default(), onComplete);

export const useCategolyData = (onComplete?: (e: Categoly[]) => void): [Categoly[], boolean] => {
  const [data, SetData] = React.useState([categoly_default()]);
  const [isLoading, SetIsLoading] = React.useState(true);

  const [categoly, isCategolyLoading] = useApiData<CategolyResponse>('categoly', {
    id: 0,
    updated_at: '',
    version: 2,
    title: '',
    description: '',
    tag: '',
    list: JSON.stringify(exam_default(), undefined, '  '),
  });
  const [tags, isTagLoading] = useTagData();

  React.useEffect(() => {
    console.log(`[in useCategolyData(tag, cate) => ${isTagLoading}, ${isCategolyLoading}] `, data);
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
        list: list_item.list,
        tag: data_tag,
      });
    });
    if (onComplete) onComplete(res);
    SetData(res);
    console.log('[REGISTED] ', res, ' | ', categoly, tags);
    SetIsLoading(false);
  }, [isCategolyLoading, isTagLoading]);

  return [data, isLoading];
};

export async function GetFromApi<T>(target: string, id?: string, shuffle?: boolean): Promise<T[]> {
  // 渡されたURLクエリ (context.query.id) からidを取得
  // APIでカテゴリを取得する
  let data: T[] = [];
  try {
    data = await (await fetch(`${process.env.EDIT_URL ?? ''}/${target}/${id ?? ''}`)).json();
  } catch {
    data = [];
  }
  // 取得したデータを返す
  if (Array.isArray(data)) {
    if (shuffle) {
      for (let i = data.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        const tmp = data[i];
        data[i] = data[r];
        data[r] = tmp;
      }
    }
    return data;
  } else return [];
}
