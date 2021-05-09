// TAGether - Share self-made exam for classmates
// Toast.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Toast.module.scss';
import React from 'react';
import { gsap, Power4 } from 'gsap';

interface Props {
  children: React.ReactNode,
  isOpen: boolean,
  stateChange: Function
}

export default function Toast(props: Props) {
  React.useEffect(() => {
    if (!props.isOpen) return;

    const target = '#' + css.container;
    const timeline = gsap.timeline();
    timeline
      .to(target, {
        duration: 0,
        opacity: 1,
        translateX: '120%'
      })
      .to(target, {
        ease: Power4.easeOut,
        duration: 0.5,
        translateX: '0%',
      })
      .to(target, {
        duration: 1,
        opacity: 0,
      }, '+=4')
      .to(target, {
        duration: 0,
        translateX: '0%',
        onComplete: () => props.stateChange()
      });
  }, [props.isOpen]);
  return (
    <div id={css.container}>
      {props.children}
    </div>
  );
}