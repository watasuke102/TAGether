// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './Toast.module.scss';
import {AnimatePresence, motion} from 'framer-motion';
import React, {Dispatch} from 'react';
import NotificationsIcon from '@assets/notifications.svg';

type State = {
  is_open: boolean;
  icon?: React.ReactNode;
  text: string;
};
type Action = {type: 'open'; icon?: string; text: string} | {type: 'close'};

function reduce(current: State, action: Action): State {
  if (action.type === 'close') {
    return {...current, is_open: false};
  }
  return {is_open: true, icon: action.icon, text: action.text};
}

type ContextType = {
  state: State;
  dispatch: Dispatch<Action>;
};
const ToastContext = React.createContext<ContextType>({
  state: {is_open: false, text: ''},
  dispatch: () => {},
});

export function ToastProvider({children}: {children: React.ReactNode}): JSX.Element {
  const [state, dispatch] = React.useReducer(reduce, {
    is_open: false,
    icon: '',
    text: '',
  });
  return <ToastContext.Provider value={{state, dispatch}}>{children}</ToastContext.Provider>;
}

const timeout_ids: NodeJS.Timeout[] = [];
export function useToastOperator() {
  const {dispatch} = React.useContext(ToastContext);
  return {
    open: (text: string, icon?: string) => {
      dispatch({type: 'open', text, icon});
      timeout_ids.push(setTimeout(() => dispatch({type: 'close'}), 5000));
    },
    close: () => {
      dispatch({type: 'close'});
      while (timeout_ids.length > 0) {
        clearTimeout(timeout_ids.pop());
      }
    },
  };
}

export function Toast(): React.ReactElement {
  const {state, dispatch} = React.useContext(ToastContext);
  if (!state || !dispatch) {
    return <></>;
  }

  return (
    <AnimatePresence>
      {state.is_open && (
        <motion.div
          variants={{
            init: {transform: 'translateX(128%)', opacity: 1},
            main: {transform: 'translateX(0)', opacity: 1},
            out: {transform: 'translateX(0)', opacity: 0},
          }}
          transition={{duration: 0.4, ease: [0.22, 1, 0.36, 1]}}
          initial='init'
          animate='main'
          exit='out'
          className={css.container}
          onClick={() => dispatch({type: 'close'})}
        >
          {state.icon ?? <NotificationsIcon />}
          <span className={css.text}>{state.text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
