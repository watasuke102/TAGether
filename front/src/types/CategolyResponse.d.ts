// TAGether - Share self-made exam for classmates
// CategolyResponse.d.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//

// APIレスポンスの型
interface CategolyResponse {
  id?: number
  updated_at?: string
  version: number
  title: string
  description: string
  tag: string
  list: string
}

export default CategolyResponse;