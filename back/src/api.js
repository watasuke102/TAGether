// TAGether (API) - Share self-made exam for classmates
// api.js
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
const Config = require('./env.json');
const MySql = require('mysql');

function Success(resp, data) {
  resp.json({ isSuccess: true, result: data });
  resp.status(200);
}
function Error(resp, mes) {
  resp.json({ isSuccess: false, result: mes });
  resp.status(400);
}

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
      Error(err, err.sqlMessage);
      isFailed = true;
    }
  });
  if (isFailed) return;
  console.log(query);
  connection.query(query, (err, res) => {
    if (err) Error(resp, err.sqlMessage);
    else Success(resp, res);
  });
}

// カテゴリ
exports.GetCategoly = (req, res) => {
  let query = 'SELECT * FROM exam';
  if (req.params.id)
    query += ' WHERE id = ' + MySql.escape(req.params.id);
  Query(query, req, res);
};

exports.AddCategoly = (req, res) => {
  let query = 'INSERT INTO exam (title, description, tag, list) values ';
  query += `(${MySql.escape(req.body.title)},`;
  query += ` ${MySql.escape(req.body.desc)},`;
  query += ` ${MySql.escape(req.body.tag)},`;
  query += ` ${MySql.escape(req.body.list)})`;
  Query(query, req, res);
};

exports.UpdateCategoly = (req, res) => {
  let query = 'UPDATE exam SET ';
  query += `title=${MySql.escape(req.body.title)},`;
  query += `description=${MySql.escape(req.body.desc)},`;
  query += `tag=${MySql.escape(req.body.tag)},`;
  query += `list=${MySql.escape(req.body.list)} `;
  query += `WHERE id=${MySql.escape(req.body.id)}`;
  Query(query, req, res);
};
