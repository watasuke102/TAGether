// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './Toast.module.scss';
import {gsap, Power4} from 'gsap';
import React from 'react';
import BreakWithCR from '../BreakWithCR/BreakWithCR';

interface Props {
  isOpen: boolean;
  close: () => void;
  top?: number;
  id: string;
  icon: string;
  text: string;
}

export default function Toast(props: Props): React.ReactElement {
  React.useEffect(() => {
    const target = '#' + props.id;
    if (!props.isOpen) {
      gsap.to(target, {
        duration: 0,
        translateX: '120%',
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
        translateX: '120%',
        onComplete: () => props.close(),
      });
  }, [props.isOpen]);
  return (
    <div id={props.id} className={css.container} style={{top: props.top ?? 65}} onClick={props.close}>
      <span className={props.icon} />
      <BreakWithCR str={props.text} />
    </div>
  );
}
