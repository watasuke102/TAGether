# TAGether - Share self-made exam for classmates

## What's this

誰かが作った問題をクラスの人と共有できるようなサービスです。

## How to use

1. /back/src 及び/front の `sample-env.json` を `env.json` にリネーム
1. `./start.sh` (本番環境は`./start.sh product`)

## docker-compose について

最新情報は docker-compose.yml をチェックしてね
| 名前 | ポート |
| ------------------------ | ------ |
| フロントエンド (Next.js) | 3009 |
| バックエンド (Node.js) | 8079 |
| phpMyAdmin | 8888 |
| MySQL | 3334 |

## ディレクトリ構造

ディレクトリは主に docker, back, front の 3 つ

<details>
<summary>ディレクトリ構造の詳細</summary>

### Docker

docker-compose 用

- mysql/  
  DB 初期化の `db_init.sql`
- nginx/  
  nginx の設定ファイル (`api.conf`)

### back

Express (Node.js) によるバックエンド (API)

- index.js  
  Express の初期化など
- api.js  
  各リクエストに対するレスポンス
- sample-env.json  
  env ファイルのテンプレート

### front

React (next.js) によるフロントエンド

- public/  
  favicon 用
- src/
  - components
  - pages
  - style  
    scss モジュール
  - ts  
    コンポーネントではない TypeScript 置き場
  - types  
    型定義ファイル
  - sample-next.config.js  
    next.config.js ファイルのテンプレート

</details>

## LICENSE

MIT SUSHI-WARE LICENSE
