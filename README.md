# TAGether - Share self-made exam for classmates

## What's this
誰かが作った問題をクラスの人と共有できるようなサービスです。  

## How to use
1. /backの `sample.env` を `.env` にリネーム
1. /frontの `sample-next.config.js` を `next.config.js` にリネーム
1. `./start.sh` (本番環境は`./start.sh product`)

## docker-composeについて
最新情報はdocker-compose.ymlをチェックしてね
| 名前                     | ポート |
| ------------------------ | ------ |
| フロントエンド (Next.js) |  3009  |
| バックエンド (PHP)       |  8079  |
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
PHPによるバックエンド（API）
- index.php  
  問題DBに対してGET/POSTなどができる
- request.php  
  機能要望を登録する (POST限定)
- show_request.php  
  受け取ったリクエストを一覧表示
- sample.env  
  .envファイルのテンプレート

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
