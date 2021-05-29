// TAGether - Share self-made exam for classmates
// Card.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/FavoriteStar.module.scss';
import React from 'react';
import { gsap, Power4 } from 'gsap';
import { UpdateFavorite, GetFavorite } from '../ts/ManageDB';

interface Props { id: number }

export default function FavoriteStar(props: Props) {
  const [favorite_status, SetFavoriteStatus] = React.useState(false);
  React.useEffect(() => {
    GetFavorite().then(res => SetFavoriteStatus(res.includes(props.id ?? -1)));
  }, [])

  const clicked = (e) => {
    e.stopPropagation();
    // Animation
    const target = `#icon-${props.id}`;
    const timeline = gsap.timeline();
    // お気に入りを変更する前なので ! をつける
    const color = (!favorite_status) ? '#c2eb2f' : '#eee';
    timeline
      // 初期化
      .to(target, {
        duration: 0,
        color: color,
        scale: '1'
      })
      // アニメーション
      .to(target, {
        ease: Power4.easeOut,
        duration: 0.3,
        scale: '1.2',
      })
      // 終了処理
      .to(target, {
        ease: Power4.easeOut,
        duration: 0.2,
        color: color,
        scale: '1',
        onComplete: () => {
          // hover要素を動作させる
          document
            .getElementById(target.replace('#', ''))
            ?.removeAttribute('style');
          UpdateFavorite(props.id ?? -1);
          SetFavoriteStatus(!favorite_status);
        }
      });
  }

  return (
    <div
      className={css.favorite_button}
      style={{ color: favorite_status ? '#c2eb2f' : '#eee' }}
      onClick={clicked}
    >
      <span className='fas fa-star' id={`icon-${props.id}`} />
    </div>
  )
}