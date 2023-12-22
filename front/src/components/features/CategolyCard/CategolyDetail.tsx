// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './CategolyDetail.module.scss';
import {useRouter} from 'next/navigation';
import React from 'react';
import Button from '@/common/Button/Button';
import ButtonContainer from '@/common/Button/ButtonContainer';
import Modal from '@/common/Modal/Modal';
import {SelectButton} from '@/common/SelectBox';
import Toast from '@/common/Toast/Toast';
import Tag from '@/features/TagContainer/TagContainer';
import ButtonInfo from '@mytypes/ButtonInfo';
import Categoly from '@mytypes/Categoly';
import Exam from '@mytypes/Exam';
import ExamHistory from '@mytypes/ExamHistory';
import {CsvExport} from './CsvExport/CsvExport';
import {mutate_category, toggle_delete_category} from '@utils/api/category';

interface Props {
  data: Categoly;
  history?: ExamHistory;
  close: () => void;
}

export default function CategolyDetail(props: Props): React.ReactElement {
  const [is_toast_open, SetIsToastOpen] = React.useState(false);
  const [is_modal_open, SetIsModalOpen] = React.useState(false);
  const [is_csv_export_open, set_is_csv_export_open] = React.useState(false);
  const [is_delete_modal_open, SetIsDeleteModalOpen] = React.useState(false);
  const [is_exam_shuffle_enabled, SetIsExamShuffleEnabled] = React.useState(false);
  const [is_choice_shuffle_enabled, SetIsChoiceShuffleEnabled] = React.useState(false);
  const [begin_question, SetBeginQuestion] = React.useState(0);
  const [end_question, SetEndQuestion] = React.useState(0);
  const router = useRouter();

  const list: Exam[] = JSON.parse(props.data.list);

  // スマホ対策
  const UpdateContainersHeight = (): void => {
    document.documentElement.style.setProperty('--container_height', (window.innerHeight / 100) * 90 + 'px');
  };
  UpdateContainersHeight();

  React.useEffect(() => {
    window.addEventListener('resize', UpdateContainersHeight);
    return () => window.removeEventListener('resize', UpdateContainersHeight);
  }, []);

  function Push(s: string): void {
    let url: string = '';
    const id_query = props.history ? `?history_id=${props.history.history_key ?? ''}` : `?id=${props.data.id}`;
    switch (s) {
      case 'edit':
        url = `/edit${id_query}`;
        break;
      case 'exam':
        url = `/exam${id_query}`;
        if (is_exam_shuffle_enabled) {
          url += '&shuffle=true';
        }
        if (is_choice_shuffle_enabled) {
          url += '&choiceShuffle=true';
        }
        const begin = begin_question - 1;
        const end = end_question - 1;
        if (begin > 0 && end > 0) {
          // 範囲が正当かどうかのチェック
          // 同じ数字だった場合も1問だけにするので間違いにはならない
          if (begin <= end) {
            url += `&begin=${begin}&end=${end}`;
          } else {
            SetIsToastOpen(true);
          }
        } else {
          if (begin > 0) {
            url += `&begin=${begin}`;
          }
          if (end > 0) {
            url += `&end=${end}`;
          }
        }
        break;
      default:
        url = `/examtable${id_query}`;
        break;
    }
    router.push(url);
  }

  const Counter = (props: {text: string; value: number; setValue: (e: number) => void}) => (
    <>
      <span className={css.counter_name}> {props.text} </span>
      <div className={css.counter}>
        <Button text='10' icon='fas fa-minus' OnClick={() => props.setValue(props.value - 10)} type='material' />
        <Button text='1' icon='fas fa-minus' OnClick={() => props.setValue(props.value - 1)} type='material' />
        <span className={css.value}> {props.value === 0 ? '-' : props.value} </span>
        <Button text='1' icon='fas fa-plus' OnClick={() => props.setValue(props.value + 1)} type='material' />
        <Button text='10' icon='fas fa-plus' OnClick={() => props.setValue(props.value + 10)} type='material' />
      </div>
    </>
  );

  // prettier-ignore
  const info: ButtonInfo[] = props.history ?
    [
      {text: '間違えた問題一覧',   icon: 'fas fa-list',        OnClick: () => Push('table'),        type: 'material'},
      {text: '解答時の設定',       icon: 'fas fa-cog',         OnClick: () => SetIsModalOpen(true), type: 'material'},
      props.history.correct_count !== props.history.total_question ?
        { text: '間違えた問題を解く', icon: 'fas fa-arrow-right', OnClick: () => Push('exam'), type: 'filled' }
        :
        { text: '全問正解', icon: 'fas fa-check', OnClick: () => undefined, type: 'material' },
    ] : [
      {text: '編集する',      icon: 'fas fa-pen',         OnClick: () => Push('edit'),         type: 'material'},
      {text: '問題一覧',      icon: 'fas fa-list',        OnClick: () => Push('table'),        type: 'material'},
      {text: '解答時の設定',  icon: 'fas fa-cog',         OnClick: () => SetIsModalOpen(true), type: 'material'},
      {text: 'この問題を解く',icon: 'fas fa-arrow-right', OnClick: () => Push('exam'),         type: 'filled'},
    ];

  return (
    <>
      <div className={css.container}>
        <div className={css.button_container}>
          <Button text='' icon='fas fa-times' OnClick={props.close} type='material' />
          <Button
            text='csvとしてダウンロード'
            icon='fas fa-download'
            OnClick={() => set_is_csv_export_open(true)}
            type='material'
          />
          <Button
            text={props.data.deleted ? 'ゴミ箱に移動' : 'ゴミ箱から取り出す'}
            icon='fas fa-trash-alt'
            OnClick={() => SetIsDeleteModalOpen(true)}
            type='material'
          />
        </div>
        <textarea disabled={true} value={props.data.title} id={css.title} />

        <div className={css.updated_at}>
          <span className='fas fa-clock' />
          <p>
            {props.data.updated_at?.includes('T')
              ? props.data.updated_at.slice(0, -5).replace('T', ' ')
              : props.data.updated_at ?? ''}
          </p>
        </div>

        <Tag tag={props.data.tag} />

        <textarea disabled={true} value={props.data.description} id={css.desc} />

        <ButtonContainer>
          {info.map(e => (
            <Button key={`categolydetail_${e.text}`} {...e} />
          ))}
        </ButtonContainer>
      </div>

      <CsvExport data={props.data} is_opening={is_csv_export_open} close={() => set_is_csv_export_open(false)} />

      <Modal isOpen={is_delete_modal_open} close={() => SetIsDeleteModalOpen(false)}>
        <div className={css.delete_confirm_modal}>
          {props.data.deleted ? (
            <p>このカテゴリをゴミ箱から取り出しますか？</p>
          ) : (
            <p>このカテゴリをゴミ箱に移動しますか？</p>
          )}
          <div className={css.button_container}>
            <Button
              text='閉じる'
              icon='fas fa-times'
              type='material'
              OnClick={() => {
                SetIsDeleteModalOpen(false);
              }}
            />
            <Button
              text='確定'
              icon='fas fa-check'
              type='filled'
              OnClick={() => {
                if (!props.data.id) {
                  return;
                }
                toggle_delete_category(props.data.id).then(() => mutate_category());
              }}
            />
          </div>
        </div>
      </Modal>

      <Modal isOpen={is_modal_open} close={() => SetIsModalOpen(false)}>
        <div className={css.modal}>
          <p>これらの設定はカテゴリ詳細を閉じるまで保持されます。</p>

          <span className={css.head}>問題範囲の制限</span>
          <Counter
            text='最初の問題番号'
            value={begin_question}
            setValue={e => SetBeginQuestion(Math.max(0, Math.min(list.length, e)))}
          />
          <span className={css.question_preview}>
            問題：{begin_question !== 0 && list[begin_question - 1].question}
          </span>

          <hr />

          <Counter
            text='最後の問題番号'
            value={end_question}
            setValue={e => SetEndQuestion(Math.max(0, Math.min(list.length, e)))}
          />
          <span className={css.question_preview}>問題：{end_question !== 0 && list[end_question - 1].question}</span>

          <span className={css.head}>シャッフル</span>
          <p>
            問題範囲を制限してからシャッフルが行われます。
            <br />
            （シャッフルされた問題から範囲制限を行うわけではありません）
          </p>
          <SelectButton
            type='radio'
            status={is_exam_shuffle_enabled}
            desc='問題順をシャッフル'
            onChange={SetIsExamShuffleEnabled}
          />
          <SelectButton
            type='radio'
            status={is_choice_shuffle_enabled}
            desc='選択問題の選択肢をシャッフル'
            onChange={SetIsChoiceShuffleEnabled}
          />

          <ButtonContainer>
            <Button text='閉じる' icon='fas fa-times' OnClick={() => SetIsModalOpen(false)} type='material'></Button>
            <Button text='この問題を解く' icon='fas fa-arrow-right' OnClick={() => Push('exam')} type='filled' />
          </ButtonContainer>
        </div>
      </Modal>
      <Toast
        id='range_invalid_notice'
        isOpen={is_toast_open}
        close={() => SetIsToastOpen(false)}
        icon='fas fa-bell'
        text='範囲指定が不正です。最初の問題番号<=最後の問題番号になるように設定してください。'
      />
    </>
  );
}
