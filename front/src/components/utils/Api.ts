// TAGether - Share self-made exam for classmates
// Api.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import ApiResponse from '../../types/ApiResponse';
import TagData from '../../types/TagData';
import Categoly from '../../types/Categoly';
import CategolyResponse from '../../types/CategolyResponse';

type Query = string | string[] | undefined;

export default async function GetFromApi<T>(target: string, query: Query): Promise<T[]> {
  // 渡されたURLクエリ (context.query.id) からidを取得
  let id: string;
  if (Array.isArray(query)) {
    id = query[0];
  } else {
    id = query ?? '';
  }
  // APIでカテゴリを取得する
  let data: ApiResponse = {
    isSuccess: false,
    result: [],
  };
  try {
    const res = await fetch(`${process.env.GET_URL ?? ''}/${target}/${id ?? ''}`);
    data = await res.json();
  } catch {
    data.result = [];
  }
  // カテゴリであれば文字列からタグリストを生成する
  if (target === 'categoly') data.result = await ReplaceTagData(data.result);
  // 取得したデータを返す
  if (data.isSuccess && Array.isArray(data.result)) return data.result;
  else return [];
}

async function ReplaceTagData(list: CategolyResponse[]): Promise<Categoly[]> {
  const tags: TagData[] = await GetFromApi<TagData>('tag', '');
  const result: Categoly[] = [];
  list.forEach(list_item => {
    const result_tag: TagData[] = [];
    // タグが存在するときのみ置き換え処理を実行する
    if (list_item.tag !== '') {
      // タグをTagDataに置き換える処理
      list_item.tag.split(',').forEach(list_tag => {
        const index = tags.findIndex(tag => tag.id === Number(list_tag));
        // そのタグが存在するならそのTagDataを追加
        if (index !== -1) {
          result_tag.push(tags[index]);
        } else {
          result_tag.push({
            name: list_tag,
            description: '',
            updated_at: '',
          });
        }
      });
    }
    // 結果を格納する
    result.push({
      title: list_item.title,
      id: list_item.id ?? -1,
      updated_at: list_item.updated_at,
      version: list_item.version,
      description: list_item.description,
      list: list_item.list,
      tag: result_tag,
    });
  });
  return result;
}
