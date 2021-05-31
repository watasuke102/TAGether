// TAGether - Share self-made exam for classmates
// Modal.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../styles/Modal.module.scss';
import React from 'react';
import ModalData from '../types/ModalData';

export default class Modal extends React.Component<ModalData> {
  constructor(props: ModalData) {
    super(props);
  }
  // スマホ対策
  UpdateContainersHeight(): void {
    document.documentElement.style.setProperty('--vh', (window.innerHeight / 100) + 'px');
  }

  componentDidMount(): void {
    window.addEventListener('resize', this.UpdateContainersHeight);
    this.UpdateContainersHeight();
  }
  componentWillUnmount(): void {
    window.removeEventListener('resize', this.UpdateContainersHeight);
  }

  render(): React.ReactElement {
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