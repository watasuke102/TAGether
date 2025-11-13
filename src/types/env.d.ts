// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {SessionOptions} from 'iron-session';

export type Env = {
  API_URL: string;
  SESSION_OPTION: SessionOptions;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  EMAIL_WHITE_LIST: RegExp[];
  WEBHOOK: {
    CATEGORY_ADD: string;
    TAG_REQUEST_ADD: string;
    UPDATE: string;
    NEW_USER: string;
  };
  DISABLE_LOGIN_FEATURE_ON_DEVELOPING: boolean;
};
