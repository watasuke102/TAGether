// TAGether - Share self-made exam for classmates
// Categoly.d.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.

import TagData from './TagData';

interface Categoly {
  id?:         number
  updated_at?: string
  version?:    number
  title:       string
  description: string
  tag:         TagData[]
  list:        string
}

export default Categoly;
