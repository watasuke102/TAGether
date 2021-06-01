const Config = require('./env.json');
const Express = require('express');
const Api = require('./api.js');

const app = Express();

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, PUT, GET');
  res.header('Access-Control-Allow-Origin', Config.AllowOrigin);
  next();
});

app.get('/', Api.GetCategoly);
app.get('/categoly/:id?', Api.GetCategoly);
//app.get('request/:id', Api.GetRequest);

app.listen(Config.Port, () =>
  console.log('[Info] Listening on port %o...', `http://localhost:${Config.Port}`)
);
