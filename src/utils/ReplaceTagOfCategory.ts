// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import TagData from '@mytypes/TagData';

// '1,2,3' のように、タグのIDをカンマ区切りで格納しているCategoryに対して、
// IDと対応するタグのデータに置き換える
export function replace_tag_of_category(tag_str: string, tags: TagData[]): TagData[] {
  const tag_map = new Map(tags.map(e => [e.id, e]));
  // prettier-ignore
  return tag_str === '' ? [] :
    tag_str.split(',').map(tag_item => {
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
}
