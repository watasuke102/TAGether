// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './FavoriteStar.module.scss';
import React from 'react';
import {motion} from 'framer-motion';
import {UpdateFavorite, GetFavorite} from '@utils/ManageDB';
import StarIcon from '@assets/star.svg';

interface Props {
  id: number;
}

export default function FavoriteStar(props: Props): React.ReactElement {
  // 既にお気に入り登録されているものにおいて、初回レンダリング時のアニメーションを抑制する
  const [favorite_status, SetFavoriteStatus] = React.useState<'already' | true | false>(false);
  React.useEffect(() => {
    GetFavorite().then(res => SetFavoriteStatus(res.includes(props.id ?? -1) ? 'already' : false));
  }, []);

  return (
    <motion.div
      className={css.favorite_button + (favorite_status ? ` ${css.starred}` : '')}
      whileTap={{scale: 1.2}}
      onClick={e => {
        e.stopPropagation();
        UpdateFavorite(props.id ?? -1);
        SetFavoriteStatus(!favorite_status);
      }}
    >
      {favorite_status === true && <motion.div className={css.animation_circle} />}
      <StarIcon />
    </motion.div>
  );
}
