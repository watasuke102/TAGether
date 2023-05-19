// TAGether - Share self-made exam for classmates
// _app.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
//
import {AppProps} from 'next/app';
import Head from 'next/head';
import NProgress from 'nprogress';
import React from 'react';
import '../components/common/main.scss';
import '../components/common/nprogress.css';
import Header from '../components/features/Header/Header';

export default function MyApp({Component, pageProps, router}: AppProps): React.ReactElement {
  if (router.events) {
    router.events.on('routeChangeStart', () => NProgress.start());
    router.events.on('routeChangeComplete', () => NProgress.done());
    router.events.on('routeChangeError', () => NProgress.done());
  }
  return (
    <main>
      <Head>
        <title>TAGether</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <Header />
      <Component {...pageProps} key={router.route} />
    </main>
  );
}
