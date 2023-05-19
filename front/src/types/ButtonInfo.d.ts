// TAGether - Share self-made exam for classmates
// ButtonInfo.d.ts
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
//
interface ButtonInfo {
  type: 'icon_desc' | 'material' | 'filled';
  icon: string;
  text: string;
  OnClick: () => void;
}

export default ButtonInfo;
