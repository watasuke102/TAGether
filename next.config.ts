// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import type {NextConfig} from 'next';

const config: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {loaders: ['@svgr/webpack'], as: '*.js'},
    },
    resolveAlias: {
      '@': 'src/components',
      '@assets': 'src/assets',
      '@utils': 'src/utils',
      '@mytypes': 'src/types',
    },
  },
};

export default config;
