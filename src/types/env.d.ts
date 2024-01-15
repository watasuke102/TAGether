// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {SessionOptions} from 'iron-session';

export type Env = {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  SESSION_OPTION: SessionOptions;
  EMAIL_WHITE_LIST: RegExp[];
  WEBHOOK: {
    CATEGORY_ADD: string;
    TAG_REQUEST_ADD: string;
    UPDATE: string;
  };
};
