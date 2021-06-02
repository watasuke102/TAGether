// TAGether - Share self-made exam for classmates
// Modal.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Modal.module.scss';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  children: React.ReactElement | React.ReactElement[]
  isOpen: boolean
  close: Function
}


export default function Modal(props: Props) {
  const [vh, SetVh] = React.useState(0);
  // スマホ対策
  function UpdateContainersHeight(): void {
    if (!process.browser) return;
    const vh = window.innerHeight / 100;
    SetVh(vh);
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  React.useEffect(() => {
    window.addEventListener('resize', UpdateContainersHeight);
    return () =>
      window.removeEventListener('resize', UpdateContainersHeight);
  });

  //開かれていない場合は空要素を渡す
  //if (!props.isOpen) {
  //  return (<></>);
  //}
  const transition = { duration: 0.3 };
  return (
    <AnimatePresence>
      {props.isOpen &&
        // 背景（開いているときに暗くする）
        <motion.div
          className={css.background}
          onClick={() => props.close()}
          variants={{
            init: { opacity: 0 },
            main: { opacity: 1 }
          }}
          transition={transition}
          initial='init' animate='main' exit='init'
        >
          {/* ウィンドウ本体 */}
          <motion.div
            className={css.window}
            onClick={(e) => e.stopPropagation()}
            variants={{
              init: { x: '-50%', y: '10%', opacity: 0 },
              main: { x: '-50%', y: '-50%', opacity: 1 }
            }}
            transition={transition}
            initial='init' animate='main' exit='init'
          >
            {/* 中身 */}
            {props.children}
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>
  );
}