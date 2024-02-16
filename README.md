<div align="center">

# TAGether - Share your self-made exam with classmates

![tagether-logo](/public/static/logo.png)

</div>

## What's this

テスト対策問題のような問題を作成し、クラスの人と共有できるようなサービスです。

## How to use

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials/oauthclient) でOAuthクライアントを作成
   あるいは後述のenv.tsにおいて、`DISABLE_LOGIN_FEATURE_ON_DEVELOPING`をtrueに設定する
1. `cp sample-env.ts env.ts`
1. env.tsを編集し、OAuthのclient idなどを適切に設定する
1. `./start.sh` (本番環境は`./start.sh product`)

## docker-compose について

最新情報は compose.yaml をチェックしてね

| 名前                     | ポート |
| ------------------------ | ------ |
| フロントエンド (Next.js) | 3009   |
| phpMyAdmin               | 8888   |
| MySQL                    | 3334   |

## ディレクトリ構造

### /public

favicon など

### /src

React (Next.js) によるフロントエンド

- app/
  Next.js App router
- assets/
  アイコンのsvg（基本的に[Google Fonts](https://fonts.google.com/icons)から取ってきたもの）
- db/
  drizzleのschemaとMySQLへ接続する関数
- components/
  - common/ → 共通して使うコンポーネント
  - features/ → 機能ごとに分ける
- tests/
  Vitestによるテスト
- types/
  型定義
- utils/
  JSXを返却しない関数群

### /docker

docker compose 用

- mysql/  
  DB 初期化の `db_init.sql`

## LICENSE

Dual-licensed; MIT (`LICENSE-MIT` or [The MIT License – Open Source Initiative](https://opensource.org/license/mit/)) or MIT SUSHI-WARE LICENSE (`LICENSE-MIT_SUSHI.md`)
