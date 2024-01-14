// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './FavoriteStar.module.scss';
import React from 'react';
import {motion} from 'framer-motion';
import StarIcon from '@assets/star.svg';
import {toggle_favorite, useUser} from '@utils/api/user';

interface Props {
  id: number;
}

export default function FavoriteStar(props: Props): React.ReactElement {
  const [user, is_user_loading] = useUser();
  // このstateはuserから算出可能だからアンチパターンではあるけれど、アニメーションの見栄えのほうが大事
  // 既にお気に入り登録されているものにおいて、初回レンダリング時のアニメーションを抑制するために'already'を用いる
  const [favorite_status, SetFavoriteStatus] = React.useState<'already' | true | false>(false);

  React.useEffect(() => {
    if (is_user_loading) {
      return;
    }
    if (user.favorite_list.includes(props.id)) {
      SetFavoriteStatus('already');
    }
  }, [is_user_loading]);

  return (
    <motion.div
      className={css.favorite_button + (favorite_status ? ` ${css.starred}` : '')}
      whileTap={{scale: 1.2}}
      onClick={e => {
        e.stopPropagation();
        toggle_favorite(user, props.id ?? -1);
        // !'already' === false
        SetFavoriteStatus(e => !e);
      }}
    >
      {favorite_status === true && <motion.div className={css.animation_circle} />}
      <StarIcon />
    </motion.div>
  );
}
