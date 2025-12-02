<div align="center">

# TAGether - Share your self-made exam with classmates

![tagether-logo](/public/static/logo.png)

</div>

## What's this

テスト対策問題のような問題を作成し、クラスの人と共有できるようなサービスです。

## How to use

1. `cp sample-env.ts env.ts`
1. env.tsを編集し、SMTPサーバー等の設定を行う
    1. `SESSION_OPTION.password` は `console.log(require('crypto').randomBytes(64).toString('hex'))` とかで生成してください
1. `./start.sh` (本番環境は`./start.sh product`)

以下のポートで Docker Compose が立ち上がります：

| 名前                     | ポート |
| ------------------------ | ------ |
| フロントエンド (Next.js) | 3009   |
| PostgreSQL               | 5432   |

## ディレクトリ構造

/src 下

- app/
  Next.js App router
- assets/
  アイコンのsvg（基本的に[Google Fonts](https://fonts.google.com/icons)から取ってきたもの）
- db/
  drizzleのschemaとPostgreSQLへ接続する関数
- components/
  - common/ → 共通して使うコンポーネント
  - features/ → 機能ごとに分ける
- tests/
  Vitestによるテスト
- types/
  型定義
- utils/
  JSXを返却しない関数群

## LICENSE

Dual-licensed; MIT (`LICENSE-MIT` or [The MIT License – Open Source Initiative](https://opensource.org/license/mit/)) or MIT SUSHI-WARE LICENSE (`LICENSE-MIT_SUSHI.md`)
