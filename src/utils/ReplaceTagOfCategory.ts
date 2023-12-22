// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import TagData from '@mytypes/TagData';

// '1,2,3' のように、タグのIDをカンマ区切りで格納しているCategoryに対して、
// IDと対応するタグのデータに置き換える
export function replace_tag_of_category<T extends {tag: string}>(
  categories: T[],
  tags: TagData[],
): (Omit<T, 'tag'> & {tag: TagData[]})[] {
  const tag_map = new Map(tags.map(e => [e.id, e]));
  return categories.map(category => {
    const tag =
      // prettier-ignore
      category.tag === ''? [] : category.tag.split(',').map(tag_item => {
        const tag = tag_map.get(Number(tag_item));
        if (tag) {
          return tag;
        }
        return {
          name: tag_item,
          description: '',
          updated_at: '',
        };
      });
    return {...category, tag: tag};
  });
}
