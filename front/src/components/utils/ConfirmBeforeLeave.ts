// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {useRouter} from 'next/router';
import NProgress from 'nprogress';
import React from 'react';

export function useConfirmBeforeLeave(): (enable: boolean) => void {
  const enable = React.useRef(false);
  const router = useRouter();

  // ページ移動時に警告
  const ShowAlertBeforeLeave = React.useCallback(() => {
    if (!enable.current) return;
    if (!window.confirm('変更は破棄されます。ページを移動してもよろしいですか？')) {
      // ページを移動していないにも関わらずnprogressが動作してしまうので止める
      NProgress.done();
      throw 'canceled';
    }
  }, []);

  // リロード時に警告（ChromeではreturnValueの中身はユーザーに見えないらしい）
  const BeforeUnLoad = React.useCallback((e: BeforeUnloadEvent): void => {
    if (!enable.current) return;
    e.preventDefault();
    e.returnValue = '変更は破棄されます。ページを移動してもよろしいですか？';
  }, []);

  React.useEffect(() => {
    window.addEventListener('beforeunload', BeforeUnLoad);
    router.events.on('routeChangeStart', ShowAlertBeforeLeave);
    return () => {
      window.removeEventListener('beforeunload', BeforeUnLoad);
      router.events.off('routeChangeStart', ShowAlertBeforeLeave);
    };
  }, []);

  return (e: boolean) => (enable.current = e);
}
