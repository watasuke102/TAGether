// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import Exam from '@mytypes/Exam';
import ExamState from '@mytypes/ExamState';
import {serial, uuid, pgTable, timestamp, text, boolean, json, integer} from 'drizzle-orm/pg-core';

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
  uid: text().notNull().primaryKey(),
  email: text().notNull(),
  is_admin: boolean().notNull().default(false),
  favorite_list: text().default('[]'),
});

export const history = pgTable('history', {
  id: uuid().notNull().primaryKey().defaultRandom(),
  owner: text()
    .notNull()
    .references(() => users.uid),
  created_at: timestamp().notNull().defaultNow(),
  title: text('original_title').notNull(),
  // 解き直しの回数、0なら通常の（やり直しではない）解答履歴
  redo_times: integer().notNull().default(0),

  exam_state: json().$type<ExamState[]>().notNull(),
  exam: json().$type<Exam[]>().notNull(),
});
