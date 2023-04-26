// TAGether (API) - Share self-made exam for classmates
// api.js
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
const Config = require('./env.json');
const MySql = require('mysql');

function Log(mes) {
  const DateFormat = require('date-fns');
  const date = new Date();
  date.setHours(date.getHours() + 9);
  console.info(DateFormat.format(date, '[yyyy-MM-dd HH:mm:ss]'), mes);
}

function Success(resp, data) {
  resp.json(data);
  resp.status(200);
}
function Error(resp, mes) {
  resp.json({message: mes});
  resp.status(400);
}

function WebHook(title, field) {
  if (Config.Webhook === '') return;
  const Request = require('request');
  Request.post({
    url: Config.Webhook,
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
      avatar_url: 'https://data.watasuke.net/icon.png',
      embeds: [{title: title, fields: field}],
    }),
  });
}

function Query(query, req, resp) {
  if (Config.AllowOrigin != '*' && req.headers.origin != Config.AllowOrigin) {
    Log(`BLOCKED from ${req.headers.origin} (IP => ${req.connection.remoteAddress})`);
    resp.status(444).end();
    return;
  }

  const connection = MySql.createConnection({
    stringifyObjects: true,
    ...Config.MySql,
  });
  let isFailed = false;
  connection.connect(err => {
    if (err) {
      console.error(err);
      Error(err, err.sqlMessage);
      isFailed = true;
    }
  });
  if (isFailed) return;

  Log(`(Host: ${req.headers.host}) ${query}`);
  connection.query(query, (err, res) => {
    if (err) Error(resp, err.sqlMessage);
    else Success(resp, res);
  });

  connection.end();
}

// カテゴリ
exports.GetCategoly = (req, res) => {
  let query = 'SELECT * FROM exam';
  if (req.params.id) query += ' WHERE id = ' + MySql.escape(req.params.id);
  Query(query, req, res);
};

exports.AddCategoly = (req, res) => {
  let query = 'INSERT INTO exam (title, version, description, tag, list) values ';
  query += `(${MySql.escape(req.body.title)},`;
  query += ` ${MySql.escape(req.body.version)},`;
  query += ` ${MySql.escape(req.body.description)},`;
  query += ` ${MySql.escape(req.body.tag)},`;
  query += ` ${MySql.escape(req.body.list)})`;
  Query(query, req, res);

  WebHook('新規カテゴリ追加', [
    {name: '名前', value: req.body.title},
    {name: '説明', value: req.body.description},
  ]);
};

exports.UpdateCategoly = (req, res) => {
  let query = 'UPDATE exam SET ';
  query += `title=${MySql.escape(req.body.title)},`;
  query += `description=${MySql.escape(req.body.description)},`;
  query += `tag=${MySql.escape(req.body.tag)},`;
  query += `list=${MySql.escape(req.body.list)} `;
  query += `WHERE id=${MySql.escape(req.body.id)}`;
  Query(query, req, res);
};

exports.DeleteCategoly = (req, res) => {
  let query = 'UPDATE exam SET deleted = if (deleted = 0, 1, 0) ';
  query += `WHERE id=${MySql.escape(req.body.id)}`;
  Query(query, req, res);
};

// 機能要望
exports.GetRequest = (req, res) => {
  let query = 'SELECT * FROM request';
  if (req.params.id) query += ' WHERE id = ' + MySql.escape(req.params.id);
  Query(query, req, res);
};

exports.AddRequest = (req, res) => {
  let query = 'INSERT INTO request (body) values ';
  query += `(${MySql.escape(req.body.body)})`;
  Query(query, req, res);

  WebHook('新規要望が投稿されました', [{name: '内容', value: req.body.body}]);
};

// タグ
exports.GetTag = (req, res) => {
  let query = 'SELECT * FROM tag';
  if (req.params.id) query += ' WHERE id = ' + MySql.escape(req.params.id);
  Query(query, req, res);
};

exports.AddTag = (req, res) => {
  let query = 'INSERT INTO tag (name, description) values ';
  query += `(${MySql.escape(req.body.name)},`;
  query += ` ${MySql.escape(req.body.description)})`;
  Query(query, req, res);

  WebHook('新規タグ追加', [
    {name: '名前', value: req.body.name},
    {name: '説明', value: req.body.description},
  ]);
};

exports.UpdateTag = (req, res) => {
  let query = 'UPDATE tag SET ';
  query += `name=${MySql.escape(req.body.name)},`;
  query += `description=${MySql.escape(req.body.description)} `;
  query += `WHERE id=${MySql.escape(req.body.id)}`;
  Query(query, req, res);
};
