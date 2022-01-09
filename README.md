# TAGether - Share self-made exam for classmates

## What's this

誰かが作った問題をクラスの人と共有できるようなサービスです。

## How to use

1. /back/src 及び/front の `sample-env.json` を `env.json` にリネーム、必要に応じて編集
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
  - components/
    - common/ → 共通して使うコンポーネント
    - features/ → 機能ごとに分ける
    - pages/ → src/pages の実態みたいな
    - utils/ → React に関係しないスクリプト
  - pages
    Next.js のルーティング用
  - types  
    型定義ファイル
  - sample-env.json  
    env.json ファイルのテンプレート

</details>

## Tips

起動すると生成される /public/sw.js の先頭あたりに`self.__WB_DISABLE_DEV_LOGS = true;`を記述すると、やかましい workbox のログが出なくなる

## LICENSE

MIT SUSHI-WARE LICENSE
