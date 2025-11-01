import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const config: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' }
    },
    resolveAlias: {
      '@': 'src/components',
      '@assets': 'src/assets',
      '@utils': 'src/utils',
      '@mytypes': 'src/types',
    }
  }
};

export default config;
