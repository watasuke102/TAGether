// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
interface FormInfo {
  label?: string;
  value: string;
  rows: number;
  id?: string;
  layer?: number;
  disabled?: boolean;
  OnChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default FormInfo;