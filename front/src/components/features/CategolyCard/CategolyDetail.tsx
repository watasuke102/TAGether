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
import Tag from '@/features/TagContainer/TagContainer';
import ButtonInfo from '@mytypes/ButtonInfo';
import Categoly from '@mytypes/Categoly';

interface Props {
  data: Categoly;
  close: () => void;
}

export default function CategolyDetail(props: Props): React.ReactElement {
  const [isShuffleEnabled, SetIsShuffleEnabled] = React.useState(false);

  // スマホ対策
  const UpdateContainersHeight = (): void => {
    document.documentElement.style.setProperty('--container_height', (window.innerHeight / 100) * 90 + 'px');
  };
  UpdateContainersHeight();

  React.useEffect(() => {
    window.addEventListener('resize', UpdateContainersHeight);
    return () => window.removeEventListener('resize', UpdateContainersHeight);
  }, []);

  function Push(s: string): void {
    let url: string = '';
    switch (s) {
      case 'edit':
        url = `/edit?id=${props.data.id}`;
        break;
      case 'exam':
        url = `/exam?id=${props.data.id}&shuffle=${isShuffleEnabled}`;
        break;
      default:
        url = `/examtable?id=${props.data.id}`;
        break;
    }
    Router.push(url);
  }

  // prettier-ignore
  const info: ButtonInfo[] = [
    {text: '閉じる',        icon: 'fas fa-times',      onClick: props.close,         type: 'material'},
    {text: '編集する',      icon: 'fas fa-pen',        onClick: () => Push('edit'),  type: 'material'},
    {text: '問題一覧',      icon: 'fas fa-list',       onClick: () => Push('table'), type: 'material'},
    {text: 'この問題を解く',icon: 'fas fa-arrow-right',onClick: () => Push('exam'),  type: 'filled'},
  ];

  return (
    <>
      <div className={css.container}>
        <textarea disabled={true} value={props.data.title} id={css.title} />

        <div className={css.updated_at}>
          <span className='fas fa-clock' />
          <p>{props.data.updated_at?.slice(0, -5).replace('T', ' ')}</p>
        </div>

        <Tag tag={props.data.tag} />

        <textarea disabled={true} value={props.data.description} id={css.desc} />

        {/* シャッフルするかどうかを決めるチェックボックス */}
        <CheckBox status={isShuffleEnabled} desc='問題順をシャッフル' onChange={SetIsShuffleEnabled} />

        <ButtonContainer>
          {info.map(e => (
            <Button key={`categolydetail_${e.text}`} {...e} />
          ))}
        </ButtonContainer>
      </div>
    </>
  );
}
