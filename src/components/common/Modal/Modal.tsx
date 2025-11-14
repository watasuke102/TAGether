// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './Modal.module.scss';
import {AnimatePresence, motion} from 'framer-motion';
import React from 'react';

interface Props {
  children: React.ReactElement | React.ReactElement[];
  isOpen: boolean;
  close: () => void;
}

export default function Modal(props: Props): React.ReactElement {
  const transition = {duration: 0.4};
  return (
    <AnimatePresence>
      {props.isOpen && (
        // 背景（開いているときに暗くする）
        <motion.div
          className={css.background}
          onClick={e => {
            e.stopPropagation();
            props.close();
          }}
          onHoverStart={e => e.stopPropagation()}
          variants={{
            init: {opacity: 0},
            main: {opacity: 1},
          }}
          transition={transition}
          initial='init'
          animate='main'
          exit='init'
        >
          {/* ウィンドウ本体 */}
          <motion.div
            className={css.modal}
            onClick={e => e.stopPropagation()}
            variants={{
              init: {x: '-50%', y: '-10%', opacity: 0},
              main: {x: '-50%', y: '-50%', opacity: 1},
            }}
            transition={transition}
            initial='init'
            animate='main'
            exit='init'
          >
            {/* 中身 */}
            {props.children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
