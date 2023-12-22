// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import TagData from './TagData';

export interface AllCategoryDataType {
  id: number;
  updated_at: string;
  title: string;
  description: string;
  tag: TagData[];
  deleted: boolean;
}

export interface CategoryDataType extends AllCategoryDataType {
  version: number;
  list: string;
}
