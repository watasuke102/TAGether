const Config = require('./env.json');
const MySql = require('mysql');

function Query(query, req, resp) {
  if (Config.AllowOrigin != '*') {
    const allow = Config.AllowOrigin
      .replace(`${req.protocol}:`, '') // http(s)?: を削除
      .replace(/\//g, ''); // '/'をすべて削除する
    if (req.headers.host != allow) {
      resp.status(444).end();
      return;
    }
  }

  const connection = MySql.createConnection(Config.MySql);
  let isFailed = false;
  connection.connect(err => {
    if (err) {
      console.error(err);
      isFailed = true;
    }
  });
  if (isFailed) {
    resp.json({});
  }
  connection.query(query, (err, res) => {
    if (err) resp.json(err);
    else resp.json(res);
  });
}

// カテゴリ
exports.GetCategoly = (req, res) => {
  let query = 'SELECT * FROM exam';
  if (req.params.id)
    query += ' WHERE id = ' + MySql.escape(req.params.id);
  Query(query, req, res);
};