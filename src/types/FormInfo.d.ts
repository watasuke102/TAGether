// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
interface FormInfo {
  label?: string;
  value: string;
  id?: string;
  layer?: number;
  disabled?: boolean;
  oneline?: boolean;
  OnChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

export default FormInfo;
