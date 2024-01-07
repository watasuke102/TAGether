// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import Exam from '@mytypes/Exam';
import ExamState from '@mytypes/ExamState';

type CheckResult = {
  result: boolean[];
  total_question: number;
  correct_count: number;
};

export function check_answer(exam: Exam, user_answer: string[]): ExamState {
  let check_result: CheckResult;
  switch (exam.type) {
    case undefined:
    case 'Text':
      check_result = check_text(exam.answer, user_answer);
      break;
    case 'Select':
      check_result = check_select(exam.answer, user_answer);
      break;
    case 'MultiSelect':
      check_result = check_multiselect(exam.question_choices ?? [], exam.answer, user_answer);
      break;
    case 'Sort':
      check_result = check_sort(exam.answer, user_answer);
      break;
    case 'ListSelect':
      check_result = check_list_select(exam.answer, user_answer);
      break;
    default:
      throw Error('invalid Exam type');
  }
  return {
    checked: true,
    user_answer,
    ...check_result,
  };
}

function check_text(answer: string[], user_answer: string[]): CheckResult {
  const result = answer.map((e, i) => e.split('&').indexOf(user_answer[i]) !== -1);
  return {
    result,
    total_question: answer.length,
    correct_count: result.filter(e => e).length,
  };
}

function check_select(answer: string[], user_answer: string[]): CheckResult {
  const result = [answer[0] === user_answer[0]];
  return {
    result,
    total_question: 1,
    correct_count: result.filter(e => e).length,
  };
}

function check_multiselect(choices: string[], answer: string[], user_answer: string[]): CheckResult {
  const result = choices.map((e, i) => {
    const is_selected = user_answer.indexOf(String(i)) !== -1;
    // choiceのindexがanswerに含まれていたら、そのchoiceは答えのひとつ
    const is_answer = answer.indexOf(String(i)) !== -1;
    // choiceが答えの1つだったら、このchoicesはuser_answerに含まれてなければいけない
    return is_answer === is_selected;
  });
  return {
    result,
    total_question: 1,
    correct_count: result.includes(false) ? 0 : 1,
  };
}

function check_sort(answer: string[], user_answer: string[]): CheckResult {
  const result = answer.map((e, i) => e === user_answer[i]);
  return {
    result,
    total_question: 1,
    correct_count: result.includes(false) ? 0 : 1,
  };
}

function check_list_select(answer: string[], user_answer: string[]): CheckResult {
  const result = answer.map((e, i) => e === user_answer[i]);
  return {
    result,
    total_question: answer.length,
    correct_count: result.filter(e => e).length,
  };
}
