// TAGether - Share self-made exam for classmates
// ButtonInfo.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
interface ButtonInfo {
  type:    'icon_desc' | 'material' | 'filled'
  icon:    string
  text:    string
  onClick: Function
}

export default ButtonInfo;
