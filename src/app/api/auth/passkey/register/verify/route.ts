// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {type RegistrationResponseJSON, verifyRegistrationResponse} from '@simplewebauthn/server';
import {eq} from 'drizzle-orm';
import {NextResponse} from 'next/server';
import isEmail from 'validator/es/lib/isEmail';
import {connect_drizzle} from 'src/db/drizzle';
import {logs, passkeys, users} from 'src/db/schema';
import {env} from 'env';

export type PasskeyLoginVerifyRequest = {
  email: string;
  challenge: string;
  attestation_response: RegistrationResponseJSON;
};
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type PasskeyLoginVerifyResponse = {} | {error_message: string};

export async function POST(request: Request): Promise<NextResponse<PasskeyLoginVerifyResponse>> {
  const data = await request.json();
  const {db, con} = await connect_drizzle();
  if (!isEmail(data.email) || typeof data.challenge !== 'string' || !data.attestation_response) {
    await db.insert(logs).values({
      severity: 'WARN',
      path: '/api/auth/passkey/register/verify',
      message: `無効なPOSTデータ: ${JSON.stringify(data)}`,
    });
    con.end();
    return NextResponse.json({error_message: '無効なリクエストが送信されました'}, {status: 400});
  }

  try {
    const user = await db.select().from(users).where(eq(users.email, data.email));
    if (user.length === 0) {
      await db.insert(logs).values({
        severity: 'WARN',
        path: '/api/auth/passkey/register/verify',
        message: `存在しないユーザーのパスキー登録が試みられました: ${data.email}`,
      });
      con.end();
      return NextResponse.json({error_message: 'ユーザーが存在しません'}, {status: 400});
    }
    const {verified, registrationInfo} = await verifyRegistrationResponse({
      response: data.attestation_response,
      expectedChallenge: data.challenge,
      expectedOrigin: env.ORIGIN,
      expectedRPID: env.RPID,
    });
    if (!verified || !registrationInfo) {
      await db.insert(logs).values({
        severity: 'WARN',
        path: '/api/auth/passkey/register/verify',
        message: 'verifyRegistrationResponse() が false を返却',
        cause_user: user[0].uid,
      });
      con.end();
      return NextResponse.json({error_message: 'パスキーの作成に失敗しました'}, {status: 401});
    }
    await db.insert(passkeys).values({
      owner: user[0].uid,
      credential_id: registrationInfo.credential.id,
      public_key: Buffer.from(registrationInfo.credential.publicKey).toString('base64url'),
    });
    con.end();
    return NextResponse.json({}, {status: 200});
  } catch (e) {
    await db.insert(logs).values({
      severity: 'ERROR',
      path: '/api/auth/passkey/register/verify',
      message: `exception: ${e}`,
    });
    con.end();
    console.error(e);
    return NextResponse.json(
      {error_message: 'サーバーエラーが発生しました。\nしばらく待ってから再度お試しください。'},
      {status: 500},
    );
  }
}
