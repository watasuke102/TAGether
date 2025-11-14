// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {generateAuthenticationOptions} from '@simplewebauthn/server';
import {env} from 'env';

// 何も受け取らないのでGETっぽいが、 /api/auth/passkey/register/options との整合性を保つために
// POSTにしている
export async function POST() {
  return Response.json(
    await generateAuthenticationOptions({
      rpID: env.RPID,
      allowCredentials: [],
    }),
  );
}
