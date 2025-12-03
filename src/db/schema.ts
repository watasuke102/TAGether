// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {serial, uuid, pgTable, timestamp, text, boolean, json, integer, pgEnum} from 'drizzle-orm/pg-core';
import Exam from '@mytypes/Exam';
import ExamState from '@mytypes/ExamState';

export const exam = pgTable('exam', {
  id: serial().notNull().primaryKey(),
  updated_at: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  version: integer().notNull().default(2),
  title: text().notNull(),
  description: text().notNull(),
  tag: text().notNull(),
  list: text().notNull(),
  deleted: boolean().notNull().default(false),
});

export const tag = pgTable('tag', {
  id: serial().notNull().primaryKey(),
  updated_at: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text().notNull(),
  description: text().notNull(),
});

export const request = pgTable('request', {
  id: serial().notNull().primaryKey(),
  updated_at: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: text().notNull(),
  answer: text(),
});

export const users = pgTable('users', {
  uid: uuid().notNull().primaryKey().defaultRandom(),
  email: text().notNull(),
  is_admin: boolean().notNull().default(false),
  favorite_list: text().default('[]'),
});

export const history = pgTable('history', {
  id: uuid().notNull().primaryKey().defaultRandom(),
  owner: uuid()
    .notNull()
    .references(() => users.uid),
  created_at: timestamp().notNull().defaultNow(),
  title: text('original_title').notNull(),
  // 解き直しの回数、0なら通常の（やり直しではない）解答履歴
  redo_times: integer().notNull().default(0),

  exam_state: json().$type<ExamState[]>().notNull(),
  exam: json().$type<Exam[]>().notNull(),
});

export const email_login_tokens = pgTable('email_login_tokens', {
  id: uuid().notNull().primaryKey().defaultRandom(),
  email: text().notNull(),
  token: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  expire_at: timestamp().notNull(),
  is_used: boolean().notNull().default(false),
});

export const otp_attempts = pgTable('otp_attempts', {
  id: serial().notNull().primaryKey(),
  email: text().notNull(),
  attempted_at: timestamp().notNull().defaultNow(),
});

export const passkeys = pgTable('passkeys', {
  id: uuid().notNull().primaryKey().defaultRandom(),
  owner: uuid()
    .notNull()
    .references(() => users.uid),
  credential_id: text().notNull(),
  public_key: text().notNull(), // base64url
  counter: integer().notNull().default(0),
});

// WARNはバリデーションで弾いたときなど予測していたもの、ERRORは例外のcatchなど予測していなかったもの
export const LogSeverity = pgEnum('severity', ['DEBUG', 'INFO', 'WARN', 'ERROR']);
export const logs = pgTable('logs', {
  id: serial().notNull().primaryKey(),
  created_at: timestamp().notNull().defaultNow(),
  cause_user: uuid().references(() => users.uid),
  severity: LogSeverity().notNull(),
  path: text().notNull(), // route.ts に対応するパス (`/api/category/[id]` など)
  message: text().notNull(),
});

// カテゴリのログはJSONを含めたくて、かつ頻繁に生成されることを考えるとテーブルを分けたほうが良さそうだと思った
export const category_update_log = pgTable('category_update_log', {
  id: serial().notNull().primaryKey(),
  created_at: timestamp().notNull().defaultNow(),
  cause_user: uuid()
    .notNull()
    .references(() => users.uid),
  category_id: integer()
    .notNull()
    .references(() => exam.id),
  old_list: text().notNull(),
  new_list: text().notNull(),
});
