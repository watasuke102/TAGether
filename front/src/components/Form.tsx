// TAGether - Share self-made exam for classmates
// Form.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/components/Form.module.scss';
import React from 'react';
import FormInfo from '../types/FormInfo';

// なんで動くのかよくわからん
// focus()を消すと動作しなくなる
export default class Form extends React.Component<FormInfo> {
  private ref;

  constructor(props: FormInfo) {
    super(props);
    this.ref = React.createRef();
  }

  focus(): void {
    this.ref.current.focus();
  }

  render(): React.ReactElement {
    return (
      <div>
        {this.props.label &&
          <label className={css.label}>{this.props.label}</label>
        }
        <textarea className={css.form} value={this.props.value} rows={this.props.rows} ref={this.ref}
          onChange={(e) => this.props.onChange(e)} disabled={this.props.disabled}
        />
      </div>
    );
  }
}
