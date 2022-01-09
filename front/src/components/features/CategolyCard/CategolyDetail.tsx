// TAGether - Share self-made exam for classmates
// CategolyDetail.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './CategolyDetail.module.scss';
import Router from 'next/router';
import React from 'react';
import Button from '@/common/Button/Button';
import ButtonContainer from '@/common/Button/ButtonContainer';
import CheckBox from '@/common/CheckBox/CheckBox';
import Categoly from '@mytypes/Categoly';
import Tag from '../TagContainer/TagContainer';

interface Props {
  data: Categoly;
  close: () => void;
}
interface state {
  isShuffleEnabled: boolean;
}

export default class CategolyDetail extends React.Component<Props, state> {
  private data: Categoly;

  constructor(props: Props) {
    super(props);
    this.UpdateContainersHeight();
    this.data = this.props.data;
    this.state = {isShuffleEnabled: false};
  }

  // スマホ対策
  UpdateContainersHeight(): void {
    document.documentElement.style.setProperty('--container_height', (window.innerHeight / 100) * 90 + 'px');
  }

  componentDidMount(): void {
    window.addEventListener('resize', this.UpdateContainersHeight);
  }
  componentWillUnmount(): void {
    window.removeEventListener('resize', this.UpdateContainersHeight);
  }

  Push(s: string): void {
    let url: string = '';
    switch (s) {
      case 'edit':
        url = `/edit?id=${this.data.id}`;
        break;
      case 'exam':
        url = `/exam?id=${this.data.id}&shuffle=${this.state.isShuffleEnabled}`;
        break;
      default:
        url = `/examtable?id=${this.data.id}`;
        break;
    }
    Router.push(url);
  }

  render(): React.ReactElement {
    return (
      <>
        <div className={css.container}>
          <textarea disabled={true} value={this.data.title} id={css.title} />

          <div className={css.updated_at}>
            <span className='fas fa-clock' />
            <p>{this.data.updated_at?.slice(0, -5).replace('T', ' ')}</p>
          </div>

          <Tag tag={this.data.tag} />

          <textarea disabled={true} value={this.data.description} id={css.desc} />

          {/* シャッフルするかどうかを決めるチェックボックス */}
          <CheckBox
            status={this.state.isShuffleEnabled}
            desc='問題順をシャッフル'
            onChange={e => this.setState({isShuffleEnabled: e})}
          />

          <ButtonContainer>
            <Button
              {...{
                text: '閉じる',
                icon: 'fas fa-times',
                onClick: () => this.props.close(),
                type: 'material',
              }}
            />
            <Button
              {...{
                text: '編集する',
                icon: 'fas fa-pen',
                onClick: () => this.Push('edit'),
                type: 'material',
              }}
            />
            <Button
              {...{
                text: '問題一覧',
                icon: 'fas fa-list',
                onClick: () => this.Push('table'),
                type: 'material',
              }}
            />
            <Button
              {...{
                text: 'この問題を解く',
                icon: 'fas fa-arrow-right',
                onClick: () => this.Push('exam'),
                type: 'filled',
              }}
            />
          </ButtonContainer>
        </div>
      </>
    );
  }
}
