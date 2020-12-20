import React from 'react';
import Router from 'next/router'
import { UrlObject } from 'url';

interface ButtonInfo {
  url:  UrlObject,
  icon: string,
  desc: string
}

export default class Button extends React.Component<ButtonInfo> {
  render() {
    return (
      <div className="button" onClick={() => Router.push(this.props.url)}>
        <div className="button_icon">
          <span className={this.props.icon}></span>
        </div>
        <span className="button_desc">{this.props.desc}</span>
        <style jsx>{`
          .button {
            padding: 5px 15px;
            border-radius: 25px;
            margin: 0px auto 5px;
            background-color: #ffffff00;
            transition: 0.3s;
          }
          .button>span {
            transition: 0.3s;
          }

          .button_icon {
            text-align: center;
          }
          .button_icon>span {
            font-size: 25px;
            color: #ffffff;
            width:  auto;
            margin: 0px auto;
            transition: 0.3s;
          }

          .button_desc {
            text-align: center;
            margin: -10px auto;
            font-size: 20px;
          }

          .button:hover{
            cursor: default;
            background-color: #ffffff55;
            transition: 0.3s;
          }
          .button:hover span{
            color: #eeff52;
            transition: 0.3s;
          }

          /* 横幅が狭かったら説明テキストを非表示に */
          @media screen and (max-width: 700px) {
            .button_desc {
              display: none;
            }
          }
          /* 横幅が広かったらアイコンと説明を横に並べる */
          @media screen and (min-width: 900px) {
            .button {
              display: flex;
            }
            .button_desc {
              margin: auto 10px;
            }
          }

          /* 縦幅が狭かったらロゴとボタンを同じ行に、説明テキストを非表示に */
          @media screen and (max-height: 600px) {
            .button {
              margin: auto;
            }
            .button_icon {
              margin: 0 10px;
            }
            .button_desc {
              display: none;
            }
          }
        `}</style>
      </div>
    )
  }
}