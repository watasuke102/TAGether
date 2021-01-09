// TAGether - Share self-made exam for classmates
// categoly-detail.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/CategolyDetail.module.css'
import React from 'react';
import Tag from './Tag'
import Button from './Button';
import Categoly from '../types/Categoly'


export default function categoly_detail(props) {
  let exam_list: object[] = [];
  const data: Categoly = props.data;
  const exam = JSON.parse(data.list);
  exam.forEach(element => {
    exam_list.push(
      <ul>
        <li>{element.question}</li>
        <li>{element.answer}</li>
      </ul>);
  });

  return (
    <div className={css.container}>
      <h1>{data.title}</h1>
      <h2>{data.desc}</h2>

      <div className={css.updated_at}>
        <div className='fas fa-clock'></div>
        <p>{data.updated_at}</p>
      </div>

      <Tag tag={data.tag} />

      {exam_list}

      <div className={css.buttons}>
        <Button info={{text:'閉じる', onClick: () => props.close() , type: 'material'}} />
        <Button info={{
          text: 'この問題を解く', icon: 'fas fa-arrow-right',
          onClick: () => props.close(), type: 'material'
        }} />
      </div>
    </div>
  );
}
