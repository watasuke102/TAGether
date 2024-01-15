// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.

// APIレスポンスの型
interface CategoryResponse {
  id?: number;
  updated_at?: string;
  version: number;
  title: string;
  description: string;
  tag: string;
  list?: string;
  deleted: number;
}

export default CategoryResponse;
