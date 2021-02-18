// TAGether - Share self-made exam for classmates
// Modal.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Modal.module.css';
import React from 'react';
import ModalData from '../types/ModalData';

export default class Modal extends React.Component<ModalData> {
  constructor(props: ModalData) {
    super(props);
  }
  // スマホ対策
  UpdateContainersHeight() {
    document.documentElement.style.setProperty('--vh', (window.innerHeight/100) + 'px');
  }

  componentDidMount() {
    window.addEventListener('resize', this.UpdateContainersHeight);
    this.UpdateContainersHeight();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.UpdateContainersHeight);
  }

  render() {
    //開かれていない場合は空要素を渡す
    if (!this.props.isOpen) {
      return (<></>);
    }
    return (
        <div className={css.background} onClick={() => this.props.close()}>
          <div className={css.window} onClick={(e) => e.stopPropagation()}>
            {this.props.body}
          </div>
      </div>
    );
  }
}