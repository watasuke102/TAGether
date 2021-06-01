// TAGether (API) - Share self-made exam for classmates
// index.js
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
const Config = require('./env.json');
const Express = require('express');
const Api = require('./api.js');

const app = Express();

app.use(Express.json());
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, PUT, GET');
  res.header('Access-Control-Allow-Origin', Config.AllowOrigin);
  next();
});

app.get('/categoly/:id?', Api.GetCategoly);
app.post('/categoly', Api.AddCategoly);
app.put('/categoly', Api.UpdateCategoly);

app.listen(Config.Port, () =>
  console.log('[Info] Listening on port %o...', `http://localhost:${Config.Port}`)
);
