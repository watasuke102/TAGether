// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {Env} from '@mytypes/env';

export const env: Env = {
  GOOGLE_CLIENT_ID: '',
  GOOGLE_CLIENT_SECRET: '',
  SESSION_OPTION: {
    cookieName: 'TAGether-Session',
    password: '',
  },
  EMAIL_WHITE_LIST: [/.*/],
  WEBHOOK: {
    CATEGORY_ADD: '',
    TAG_REQUEST_ADD: '',
    UPDATE: '',
  },
};
