// TAGether - Share self-made exam for classmates
// TagEdit.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Toast.module.scss';
import React from 'react';
import TagData from '../types/TagData';

interface Props {
  tags: TagData[]
  current_tag: TagData[]
}

export default function Toast(props: Props): React.ReactElement {
  const [is_picker_open, SetIsPickerOpen] = React.useState(false);
  return (
    <div>
      タグ編集欄です
    </div>
  );
}