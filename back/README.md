# API for TAGether

## 共通

成功時は 200、失敗時は 400

GET 以外（POST/PUT）は以下のようなレスポンスが帰ってきます  
GET においては、エラー時は message のみ（status 以外）が帰ってきます

| Name    | Type   | Description                        |
| ------- | ------ | ---------------------------------- |
| status  | string | 'ok' or 'error'                    |
| message | string | エラー発生時のみ、エラーメッセージ |

GET において、URL 末尾に id を含めると、特定の id を取得できます  
例: `http://localhost:8079/categoly/5`→`SELECT * FROM exam WHERE id=5`の結果が返ります

各カテゴリのパラメータに関する最新情報に関しては、docker/mysql/db_init.sql を参照すること

## /categoly/:id

カテゴリを取得・編集します

### パラメータ

| Name       | Type   | Description                                 |
| ---------- | ------ | ------------------------------------------- |
| id         | int    | id                                          |
| version    | int    | カテゴリのバージョン情報                    |
| updated_at | string | 更新(作成)日                                |
| title      | string | 問題カテゴリのタイトル                      |
| desc       | string | 問題カテゴリの説明                          |
| tag        | string | 問題カテゴリに付けられたタグ (カンマ区切り) |
| list       | json   | 問題の中身                                  |

POST 時は id 及び updated_at 以外、PUT 時は updated_at 以外を json としてリクエストしてください

DELETE 時は id のみを json としてリクエストしてください
