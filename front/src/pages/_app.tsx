// TAGether - Share self-made exam for classmates
// _app.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import '../components/common/main.scss';
import Head from 'next/head';
import React from 'react';
import NProgress from 'nprogress';
import {AppProps} from 'next/app';
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
      </Head>
      <Header />
      <Component {...pageProps} key={router.route} />
    </main>
  );
}
