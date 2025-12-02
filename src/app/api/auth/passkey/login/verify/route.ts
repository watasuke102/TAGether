// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {type AuthenticationResponseJSON, verifyAuthenticationResponse} from '@simplewebauthn/server';
import {eq} from 'drizzle-orm';
import {NextResponse} from 'next/server';
import {connect_drizzle} from 'src/db/drizzle';
import {logs, passkeys, users} from 'src/db/schema';
import {env} from 'env';
import {ensure_user_exist_and_new_session} from '../../../new_session';

export type PasskeyLoginVerifyRequest = {
  challenge: string;
  auth_response: AuthenticationResponseJSON;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type PasskeyLoginVerifyResponse = {} | {error_message: string};

export async function POST(request: Request): Promise<NextResponse<PasskeyLoginVerifyResponse>> {
  const data = await request.json();
  const {db, con} = await connect_drizzle();
  if (typeof data.challenge !== 'string' || !data.auth_response) {
    await db.insert(logs).values({
      severity: 'WARN',
      path: '/api/auth/passkey/login/verify',
      message: `無効なPOSTデータ: ${JSON.stringify(data)}`,
    });
    con.end();
    return NextResponse.json({error_message: '無効なリクエストが送信されました'}, {status: 400});
  }
  const auth_response: AuthenticationResponseJSON = data.auth_response;

  try {
    const passkey = await db
      .select()
      .from(passkeys)
      .where(eq(passkeys.credential_id, auth_response.id))
      .innerJoin(users, eq(passkeys.owner, users.uid));
    if (passkey.length === 0) {
      await db.insert(logs).values({
        severity: 'WARN',
        path: '/api/auth/passkey/login/verify',
        message: `存在しないパスキーの認証が試みられました: ${auth_response.id}`,
      });
      con.end();
      return NextResponse.json({error_message: 'パスキーの認証に失敗しました'}, {status: 401});
    }

    const {verified, authenticationInfo} = await verifyAuthenticationResponse({
      response: auth_response,
      credential: {
        id: passkey[0].passkeys.credential_id,
        publicKey: Buffer.from(passkey[0].passkeys.public_key, 'base64url'),
        counter: data.counter,
      },
      expectedChallenge: data.challenge,
      expectedOrigin: env.ORIGIN,
      expectedRPID: env.RPID,
      requireUserVerification: false,
    });
    if (!verified) {
      await db.insert(logs).values({
        severity: 'WARN',
        path: '/api/auth/passkey/login/verify',
        message: `verifyAuthenticationResponse() が false を返却 (passkey id: ${passkey[0].passkeys.id})`,
      });
      con.end();
      return NextResponse.json({error_message: 'パスキーの認証に失敗しました'}, {status: 401});
    }
    await db
      .update(passkeys)
      .set({counter: authenticationInfo.newCounter})
      .where(eq(passkeys.id, passkey[0].passkeys.id));
    await ensure_user_exist_and_new_session(passkey[0].users.email, db, '/api/auth/passkey/login/verify');
    con.end();
    return NextResponse.json({}, {status: 200});
  } catch (e) {
    await db.insert(logs).values({
      severity: 'ERROR',
      path: '/api/auth/passkey/login/verify',
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
