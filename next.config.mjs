import withPWA from 'next-pwa';

const config = withPWA({dest: 'public'})({
  webpack(conf, _opt) {
    conf.resolve.alias['@'] = 'src/components';
    conf.resolve.alias['@utils'] = 'src/utils';
    conf.resolve.alias['@mytypes'] = 'src/types';
    return conf;
  },
});

export default config;
