// TAGether - Share self-made exam for classmates
// CategolyDetail.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/CategolyDetail.module.css'
import React from 'react';
import Router from 'next/router';
import Tag from './Tag'
import Button from './Button';
import Categoly from '../types/Categoly';

interface Props {
  data: Categoly,
  close: Function
}
interface state {
  isShuffleEnabled: string
}

export default class CategolyDetail extends React.Component<Props, state> {
  private data: Categoly;

  constructor(props: Props) {
    super(props);
    this.UpdateContainersHeight();
    this.data = this.props.data;
    this.state = { isShuffleEnabled: 'false' };
  }
  
  // スマホ対策
  UpdateContainersHeight() {
    document.documentElement.style.setProperty('--container_height', (window.innerHeight / 100 * 85) + 'px');
  }

  componentDidMount() {
    window.addEventListener('resize', this.UpdateContainersHeight);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.UpdateContainersHeight);
  }

  Push(s: string) {
    let url: string = ''
    if (s == 'edit') {
      url = '/edit?id=' + this.data.id;
    } else if(s == 'exam') {
      url = '/exam?id=' + this.data.id;
      url += '&shuffle=' + this.state.isShuffleEnabled;
    } else {
      url = '/examtable?id=' + this.data.id;
    }
    Router.push(url);
  };

  render() {
    return (
      <>
        <div className={css.container}>
          <textarea disabled={true} value={this.data.title} id={css.title}/>
  
          <div className={css.updated_at}>
            <div className='fas fa-clock'></div>
            <p>{this.data.updated_at}</p>
          </div>
          <Tag tag={this.data.tag} />
          <textarea disabled={true} value={this.data.desc} id={css.desc} />
  
  
          {/* シャッフルするかどうかを決めるチェックボックスなど */}
          <div className={css.shuffle_checkbox}>
            <input type='checkbox' value={this.state.isShuffleEnabled}
              onChange={e => this.setState({isShuffleEnabled: e.target.checked? 'true':'false'})}/>
            <p>問題順をシャッフル</p>
          </div>
  
          <div className={css.buttons}>
            <Button {...{
              text: '閉じる', icon: 'fas fa-times',
              onClick: () => this.props.close(), type: 'material'
            }} />
            <Button {...{
              text: '編集する', icon: 'fas fa-pen',
              onClick: () => this.Push('edit'), type: 'material'
            }} />
            <Button {...{
              text: '問題一覧', icon: 'fas fa-list',
              onClick: () => this.Push('table'), type: 'material'
            }} />
            <Button {...{
              text: 'この問題を解く', icon: 'fas fa-arrow-right',
              onClick: () => this.Push('exam'), type: 'filled'
            }} />
          </div>
  
        </div>
      </>
    );
  }
}
