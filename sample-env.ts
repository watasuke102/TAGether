// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {Env} from '@mytypes/env';

export const env: Env = {
  API_URL: 'http://localhost:3009',
  RPID: 'tagether.example.com',
  ORIGIN: 'http://localhost:3009',
  SMTP_HOST: '',
  SMTP_PORT: 587,
  SMTP_USER: '',
  SMTP_PASS: '',
  SESSION_OPTION: {
    cookieName: 'TAGether-Session',
    password: '',
  },
  EMAIL_WHITE_LIST: [/.*/],
  WEBHOOK: {
    CATEGORY_ADD: '',
    TAG_REQUEST_ADD: '',
    UPDATE: '',
    NEW_USER: '',
  },
};
