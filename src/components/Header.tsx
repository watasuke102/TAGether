import React from 'react';
import Button from './Button';

export default class Header extends React.Component {
  render() {
    return (
      <header className="header">
        <h1>Tagether</h1>
        <nav className="buttons">
          <Button url="/"        icon="fas fa-home" desc="Home" />
          <Button url="/list"    icon="fas fa-book" desc="List" />
          <Button url="/edit"    icon="fas fa-pen"  desc="Add/Edit" />
          <Button url="/profile" icon="fas fa-user" desc="Profile" />
        </nav>
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600&display=swap');
          .header {
            padding: 10px 20px;
            margin: -15px -15px 5px;
            width: 100% + 15px;
            font-size: 24px;
            background-color: #8891a580;
            color: #b9ccbe;
            box-sizing: border-box;
          }
          .header>h1 {
            font-family: 'Montserrat', sans-serif;
            text-align: center;
            margin: 0 auto 15px;
          }
          #first {
            margin-right: auto;
          }

          .buttons {
            display: flex;
            justify-content: space-around;
            margin: 0px auto 5px;
          }

          /* 縦幅が狭かったらロゴとボタンを同じ行に */
          @media screen and (max-height: 600px) {
            .header {
              display: flex;
              justify-content: flex-end;
            }
            .header>h1 {
              margin: auto auto auto 0;
            }
            .buttons {
              margin: 0;
            }
          }        
        `}</style>
      </header>
    )
  }
}