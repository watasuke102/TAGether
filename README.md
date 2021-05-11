# TAGether - Share self-made exam for classmates

## What's this
誰かが作った問題をクラスの人と共有できるようなサービスです。  

## How to use
1. /backのsample.envを.envにリネーム
1. /frontのsample-next.config.jsをnext.config.jsにリネーム
1. `docker-compose up -d --build`

## docker-composeについて
| 名前                     | ポート |
| ------------------------ | ------ |
| フロントエンド (Next.js) |  3000  |
| バックエンド (PHP)       |  8080  |
| phpMyAdmin               |  8888  |
| MySQL                    |  3334  |

## LICENSE
MIT SUSHI-WARE LICENSE
