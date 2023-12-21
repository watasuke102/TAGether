const path = require('path');
const env = require('./env.json');

const withPWA = require('next-pwa')({
  dest: 'public',
});

module.exports = withPWA({
  env: env,
  webpack(conf, _opt) {
    conf.resolve.alias['@'] = path.join(__dirname, 'src/components');
    conf.resolve.alias['@utils'] = path.join(__dirname, 'src/utils');
    conf.resolve.alias['@mytypes'] = path.join(__dirname, 'src/types');
    return conf;
  },
});
