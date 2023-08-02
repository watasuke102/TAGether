// TAGether - Share self-made exam for classmates
// CategolyResponse.d.ts
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
//

// APIレスポンスの型
interface CategolyResponse {
  id?: number;
  updated_at?: string;
  version: number;
  title: string;
  description: string;
  tag: string;
  list?: string;
  deleted: number;
}

export default CategolyResponse;
