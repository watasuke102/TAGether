// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
interface ButtonInfo {
  type: 'icon_desc' | 'material' | 'filled';
  icon: string;
  text: string;
  OnClick: () => void;
}

export default ButtonInfo;
