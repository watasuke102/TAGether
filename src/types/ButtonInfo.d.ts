// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
interface ButtonInfo {
  variant: 'material' | 'filled';
  icon?: React.ReactNode;
  text: string;
  OnClick: () => void;
}

export default ButtonInfo;
