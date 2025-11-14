// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
type FormInfo = {
  label?: string;
  value: string;
  id?: string;
  layer?: number;
  disabled?: boolean;
  OnChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
} & (
  | {
      oneline?: false;
    }
  | {
      oneline: true;
      autoComplete?: HTMLInputElement['autocomplete'];
    }
);

export default FormInfo;
