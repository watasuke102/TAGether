// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {generateRegistrationOptions} from '@simplewebauthn/server';
import {NextResponse} from 'next/server';
import {env} from 'env';

export type PasskeyRegisterOptionsRequest = {
  email: string;
};
export type PasskeyRegisterOptionsResponse = ReturnType<typeof generateRegistrationOptions> | {error_message: string};

export async function POST(request: Request) {
  const data = await request.json();
  if (typeof data.email !== 'string') {
    return NextResponse.json({error_message: '無効なリクエストが送信されました'}, {status: 400});
  }
  try {
    return Response.json(
      await generateRegistrationOptions({
        rpName: 'TAGether',
        rpID: env.RPID,
        userID: Uint8Array.from(data.email),
        userName: data.email,
      }),
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {error_message: 'メールの送信に失敗しました。\nしばらく待ってから再度お試しください。'},
      {status: 500},
    );
  }
}
