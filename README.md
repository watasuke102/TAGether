# TAGether - Share self-made exam for classmates

## What's this
誰かが作った問題をクラスの人と共有できるようなサービスです。  

## How to use
1. /back/srcの `sample-env.json` を `env.json` にリネーム
1. /frontの `sample-next.config.js` を `next.config.js` にリネーム
1. `./start.sh` (本番環境は`./start.sh product`)

## docker-composeについて
最新情報はdocker-compose.ymlをチェックしてね
| 名前                     | ポート |
| ------------------------ | ------ |
| フロントエンド (Next.js) |  3009  |
| バックエンド (Node.js)   |  8079  |
| phpMyAdmin               |  8888  |
| MySQL                    |  3334  |

## ディレクトリ構造
ディレクトリは主にdocker, back, frontの3つ
<details>
<summary>ディレクトリ構造の詳細</summary>

### Docker
docker-compose用
- mysql/  
  DB初期化の `db_init.sql`
- nginx/  
  nginxの設定ファイル (`api.conf`)

### back
Express (Node.js) によるバックエンド (API)
- index.js  
  Expressの初期化など
- api.js  
  各リクエストに対するレスポンス
- sample-env.json  
  envファイルのテンプレート

### front
React (next.js) によるフロントエンド
- public/  
  favicon用
- src/
  - components
  - pages
  - style  
    scssモジュール
  - ts  
    コンポーネントではないTypeScript置き場
  - types  
    型定義ファイル
  - sample-next.config.js  
    next.config.jsファイルのテンプレート

</details>


## LICENSE
MIT SUSHI-WARE LICENSE
