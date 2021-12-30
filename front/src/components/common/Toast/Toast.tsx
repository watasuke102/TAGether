// TAGether - Share self-made exam for classmates
// Toast.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './Toast.module.scss';
import React from 'react';
import {gsap, Power4} from 'gsap';

interface Props {
  children: React.ReactElement | React.ReactElement[];
  isOpen: boolean;
  close: Function;
  top?: number;
  id: string;
}

export default function Toast(props: Props): React.ReactElement {
  React.useEffect(() => {
    const target = '#' + props.id;
    if (!props.isOpen) {
      gsap.to(target, {
        duration: 0,
        translateX: '0%',
        opacity: 0,
      });
      return;
    }

    const timeline = gsap.timeline();
    timeline
      .to(target, {
        duration: 0,
        opacity: 1,
        translateX: '120%',
      })
      .to(target, {
        ease: Power4.easeOut,
        duration: 0.5,
        translateX: '0%',
      })
      .to(
        target,
        {
          duration: 1,
          opacity: 0,
        },
        '+=4',
      )
      .to(target, {
        duration: 0,
        translateX: '0%',
        onComplete: () => props.close(),
      });
  }, [props.isOpen]);
  return (
    <div id={props.id} className={css.container} style={{top: props.top ?? 65}}>
      {props.children}
    </div>
  );
}
