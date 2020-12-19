import React from 'react';
import Head  from 'next/head';
import App, { Container } from 'next/app';
import { PageTransition } from 'next-page-transitions';

export default class MyApp extends App {
  render() {
    const { Component, pageProps, router } = this.props
    return (
      <>
      <Head>
        <title>Next app</title>
      </Head>
      <Container>
        <PageTransition timeout={500} classNames="page-transition">
          <Component {...pageProps} key={router.route} />
        </PageTransition>
        <style jsx global>{`
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