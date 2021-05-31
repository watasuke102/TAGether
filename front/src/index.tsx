/*!
 index.tsx

 CopyRight (c) 2021 Watasuke
 Email  : <watasuke102@gmail.com>
 Twitter: @Watasuke102
 This software is released under the MIT SUSHI-WARE License.
*/

/* eslint @typescript-eslint/ban-ts-comment: 0 */
// @ts-ignore TS6133
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import './styles/main.scss';

import Header from './components/Header';
// Components
import Create from './pages/create';
import Edit from './pages/edit';
import Exam from './pages/exam';
import ExamTable from './pages/examtable';
import List from './pages/list';
import Profile from './pages/profile';
import Top from './pages/top';

ReactDOM.render(
  <>
    <BrowserRouter>
      <Header />
      <Route exact path="/create" component={Create} />
      <Route exact path="/edit" component={Edit} />
      <Route exact path="/exam/:id" component={Exam} />
      <Route exact path="/examtable" component={ExamTable} />
      <Route exact path="/list" component={List} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/" component={Top} />
    </BrowserRouter>
  </>,
  document.getElementById('main')
);
