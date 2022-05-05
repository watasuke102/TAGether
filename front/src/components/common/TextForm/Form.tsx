// TAGether - Share self-made exam for classmates
// Form.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './Form.module.scss';
import React from 'react';
import FormInfo from '@mytypes/FormInfo';

// なんで動くのかよくわからん
// focus()を消すと動作しなくなる
export default class Form extends React.Component<FormInfo> {
  private ref;

  constructor(props: FormInfo) {
    super(props);
    this.ref = this.props.reff ?? React.createRef();
  }

  focus(): void {
    this.ref.current.focus();
  }

  render(): React.ReactElement {
    return (
      <div>
        {this.props.label && <label className={css.label}>{this.props.label}</label>}
        <textarea
          className={css.form}
          ref={this.ref}
          value={this.props.value}
          rows={this.props.rows}
          spellCheck={false}
          onChange={e => this.props.onChange(e)}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}
