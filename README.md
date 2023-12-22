# TAGether - Share self-made exam for classmates

## What's this

誰かが作った問題をクラスの人と共有できるようなサービスです。

## How to use

1. `./start.sh` (本番環境は`./start.sh product`)

## docker-compose について

最新情報は compose.yaml をチェックしてね
| 名前 | ポート |
| ------------------------ | ------ |
| フロントエンド (Next.js) | 3009 |
| phpMyAdmin | 8888 |
| MySQL | 3334 |

## ディレクトリ構造

### Docker

docker-compose 用

- mysql/  
  DB 初期化の `db_init.sql`
- nginx/  
  nginx の設定ファイル (`api.conf`)

### front

React (next.js) によるフロントエンド

TODO

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

## LICENSE

Dual-licensed; MIT (`LICENSE-MIT` or [The MIT License – Open Source Initiative](https://opensource.org/license/mit/)) or MIT SUSHI-WARE LICENSE (`LICENSE-MIT_SUSHI.md`)
