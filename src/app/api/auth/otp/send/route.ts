// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {randomInt} from 'node:crypto';
import {NextResponse} from 'next/server';
import isEmail from 'validator/es/lib/isEmail';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import {email_login_tokens} from 'src/db/schema';
import {connect_drizzle} from 'src/db/drizzle';
import {env} from 'env';

export type OtpSendRequest = {
  email: string;
};
export type OtpSendResponse =
  | {
      id: string;
    }
  | {error_message: string};

export async function POST(res: Request): Promise<NextResponse<OtpSendResponse>> {
  const data = await res.json();
  if (typeof data.email !== 'string') {
    return NextResponse.json({error_message: '無効なリクエストが送信されました'}, {status: 400});
  }
  if (!isEmail(data.email) || env.EMAIL_WHITE_LIST.every(e => !e.test(data.email))) {
    return NextResponse.json({error_message: '許可されていないメールアドレス形式です'}, {status: 400});
  }

  const token = randomInt(0, 999999).toString().padStart(6, '0');
  try {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
    transporter.sendMail({
      from: env.SMTP_USER,
      to: data.email,
      subject: `[TAGether] ${token} はあなたの認証コードです`,
      text: `TAGetherをご利用いただき、ありがとうございます。

あなたの認証コードは ${token} です。

このコードの有効期限は15分間です。このコードを他人に教えないでください。
心当たりがない場合は、このメールを無視してください。
`,
    });

    const {db, con} = await connect_drizzle();
    const result = await db
      .insert(email_login_tokens)
      .values({
        email: data.email,
        token: await bcrypt.hash(token, 10),
        expire_at: new Date(Date.now() + 15 * 60 /* sec */ * 1000 /* ms */),
      })
      .returning();
    con.end();

    return NextResponse.json({id: result[0].id}, {status: 200});
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {error_message: 'メールの送信に失敗しました。\nしばらく待ってから再度お試しください。'},
      {status: 500},
    );
  }
}
