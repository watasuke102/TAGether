// TAGether - Share self-made exam for classmates
// _app.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import '../style/main.css'
import React from 'react';
import Head  from 'next/head';
import App, { Container } from 'next/app';
import { PageTransition } from 'next-page-transitions';

import Header from '../components/Header';

export default class MyApp extends App {
  render() {
    const { Component, pageProps, router } = this.props
    return (
      <>
      <Head>
        <title>TAGether</title>
      </Head>
      <Header />
      <Container>
        <PageTransition timeout={500} classNames="page-transition">
          <Component {...pageProps} key={router.route} />
        </PageTransition>
      </Container>
      </>
    )
  }
}