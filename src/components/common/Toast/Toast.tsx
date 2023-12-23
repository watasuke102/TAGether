// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './Toast.module.scss';
import {gsap, Power4} from 'gsap';
import React, {Dispatch} from 'react';
import BreakWithCR from '../BreakWithCR/BreakWithCR';

type State = {
  is_open: boolean;
  icon?: string;
  text: string;
};
type Action = {type: 'open'; icon?: string; text: string} | {type: 'close'};

const component_id = 'common_toast';

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

export function useToastOperator() {
  const {dispatch} = React.useContext(ToastContext);
  return {
    open: (text: string, icon?: string) => dispatch({type: 'open', text, icon}),
    close: () => dispatch({type: 'close'}),
  };
}

export function Toast(): React.ReactElement {
  const {state, dispatch} = React.useContext(ToastContext);
  if (!state || !dispatch) {
    return <></>;
  }

  React.useEffect(() => {
    const target = `#${component_id}`;
    if (!state.is_open) {
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
        onComplete: () => dispatch({type: 'close'}),
      });
  }, [state.is_open]);

  return (
    <div id={component_id} className={css.container} onClick={() => dispatch({type: 'close'})}>
      <span className={state.icon ?? 'fas fa-bell'} />
      <BreakWithCR str={state.text} />
    </div>
  );
}
