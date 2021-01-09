// TAGether - Share self-made exam for classmates
// Card.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Card.module.css';
import React from 'react';
import Modal from 'react-modal';
import Router from 'next/router';
import Tag from './Tag';
import Detail from './CategolyDetail'
import Categoly from '../types/Categoly';

export default function ExamCard(props) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const data:Categoly = props.data;
    return (
      <div
        className={css.card}
        onClick={() => Router.push('categoly-detail?id='+data.id)}
      >
        <p className={css.title}>{data.title}</p>
        <p className={css.desc}> {data.desc} </p>
        <Tag tag={data.tag} />
      </div>
    )
  }