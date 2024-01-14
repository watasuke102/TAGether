// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import Exam from '@mytypes/Exam';
import ExamState from '@mytypes/ExamState';
import {int, mysqlTable, timestamp, text, boolean, varchar, json} from 'drizzle-orm/mysql-core';

export const exam = mysqlTable('exam', {
  id: int('id').notNull().primaryKey().autoincrement(),
  updated_at: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  version: int('version').notNull().default(2),
  title: text('title').notNull(),
  description: text('description').notNull(),
  tag: text('tag').notNull(),
  list: text('list').notNull(),
  deleted: boolean('deleted').notNull().default(false),
});

export const tag = mysqlTable('tag', {
  id: int('id').notNull().primaryKey().autoincrement(),
  updated_at: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  name: text('name').notNull(),
  description: text('description').notNull(),
});

export const request = mysqlTable('request', {
  id: int('id').notNull().primaryKey().autoincrement(),
  updated_at: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  body: text('body').notNull(),
  answer: text('answer'),
});

export const users = mysqlTable('users', {
  uid: varchar('uid', {length: 255}).notNull().primaryKey(),
  email: text('email').notNull(),
  is_admin: boolean('is_admin').notNull().default(false),
  favorite_list: text('favorite_list').default('[]'),
});

export const history = mysqlTable('history', {
  id: varchar('id', {length: 255}).notNull().primaryKey(),
  owner: varchar('owner', {length: 255}).notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  title: text('original_title').notNull(),
  // 解き直しの回数、0なら通常の（やり直しではない）解答履歴
  redo_times: int('times').notNull().default(0),

  exam_state: json('exam_state').$type<ExamState[]>().notNull(),
  exam: json('list').$type<Exam[]>().notNull(),
});
