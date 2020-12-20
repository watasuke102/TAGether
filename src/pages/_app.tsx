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
          <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@300&display=swap');
          body {
            margin: 15px;
            font-family: 'M PLUS 1p', sans-serif;
            background-color: #282c34;
            color: #e1e2dc;
          }
          a {
            color: #8181ff;
          }
          .page-transition-enter {
            opacity: 0;
          }
          .page-transition-exit {
            opacity: 1;
          }
          .page-transition-enter-active {
            opacity: 1;
            transition: opacity 500ms;
          }
          .page-transition-exit-active {
            opacity: 0;
            transition: opacity 500ms;
          }
        `}</style>
        </Container>
        </>
    )
  }
}