// TAGether - Share self-made exam for classmates
// FormInfo.ts
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import {RefObject, MutableRefObject} from 'react';

interface FormInfo {
  label?: string;
  value: string;
  rows: number;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  reff?: RefObject<HTMLTextAreaElement> | MutableRefObject<HTMLTextAreaElement | undefined> | null;
}

export default FormInfo;
