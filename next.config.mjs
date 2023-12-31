import withPWA from 'next-pwa';

const config = withPWA({dest: 'public'})({
  webpack(conf, _opt) {
    conf.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: '@svgr/webpack',
        },
      ],
    });
    conf.resolve.alias['@'] = 'src/components';
    conf.resolve.alias['@assets'] = 'src/assets';
    conf.resolve.alias['@utils'] = 'src/utils';
    conf.resolve.alias['@mytypes'] = 'src/types';
    return conf;
  },
});

export default config;
