// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './CsvExport.module.scss';
import React from 'react';
import Button from '@/common/Button/Button';
import Modal from '@/common/Modal/Modal';
import {SelectButton, SingleSelectBox} from '@/common/SelectBox';
import {Shuffle} from '@utils/ArrayUtil';
import {CategoryDataType} from '@mytypes/Categoly';
import Exam from '@mytypes/Exam';
import CloseIcon from '@assets/close.svg';
import DownloadIcon from '@assets/download.svg';

interface Props {
  data: CategoryDataType;
  is_opening: boolean;
  close: () => void;
}

const selection = [
  ['未設定', '日本語', '英語'],
  ['', 'ja-JP', 'en-US'],
];

export function CsvExport(props: Props): React.ReactElement {
  const [wordholic_mode, set_wordholic_mode] = React.useState(true);
  const [question_item_lang, set_question_item_lang] = React.useState(selection[0][0]);
  const [answer_item_lang, set_answer_item_lang] = React.useState(selection[0][0]);

  const download_csv = React.useCallback(() => {
    const list: Exam[] = JSON.parse(props.data.list);

    const content: string[] = [];
    function push_content(s: string) {
      if (s.indexOf('\n') !== -1) {
        content.push(`"${s}"`);
      } else {
        content.push(s);
      }
    }
    list.forEach(exam => {
      {
        let question = exam.question;
        if (exam.type !== 'Text' && exam.question_choices) {
          question += '\n[';
          switch (exam.type) {
            case 'Select':
              question += `1つ選択: ${exam.question_choices.join(' | ')}]`;
              break;
            case 'MultiSelect':
              question += `複数選択: ${exam.question_choices.join(' | ')}]`;
              break;
            case 'Sort':
              question += `並び替え: ${Shuffle(exam.answer).join(' | ')}]`;
              break;
          }
        }
        push_content(question);
      }
      content.push(',');

      {
        let answer_array: string[] = exam.answer;
        if (exam.type === 'Select' || exam.type === 'MultiSelect') {
          answer_array = exam.answer.map(e => (exam.question_choices ? exam.question_choices[Number(e)] : ''));
        }
        push_content(answer_array.join(' | '));
      }
      content.push(',');

      push_content(exam.comment ?? '');

      if (wordholic_mode) {
        content.push(`,${selection[1][selection[0].indexOf(question_item_lang)]}`);
        content.push(`,${selection[1][selection[0].indexOf(answer_item_lang)]}`);
      }
      content.push('\n');
    });

    const blob = new Blob(content, {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${props.data.title}.csv`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [question_item_lang, answer_item_lang, wordholic_mode]);

  return (
    <Modal isOpen={props.is_opening} close={props.close}>
      <div className={css.container}>
        <SelectButton
          type='check'
          desc='WordHolic用のCSVを作成する'
          status={wordholic_mode}
          onChange={set_wordholic_mode}
        />
        {wordholic_mode && (
          <div className={css.lang_select}>
            <span className={css.selectbox_desc}>問題の言語</span>
            <div className={css.selectbox}>
              <SingleSelectBox
                onChange={txt => set_question_item_lang(txt)}
                status={question_item_lang}
                list={selection[0]}
              />
            </div>
            <span className={css.selectbox_desc}>解答の言語</span>
            <div className={css.selectbox}>
              <SingleSelectBox
                onChange={txt => set_answer_item_lang(txt)}
                status={answer_item_lang}
                list={selection[0]}
              />
            </div>
          </div>
        )}
        <div className={css.button_container}>
          <Button text='閉じる' icon={<CloseIcon />} type='material' OnClick={props.close} />
          <Button text='ダウンロード' icon={<DownloadIcon />} type='filled' OnClick={download_csv} />
        </div>
      </div>
    </Modal>
  );
}
