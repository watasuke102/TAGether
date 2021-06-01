const Config = require('./env.json');
const MySql = require('mysql');

function Query(query, resp) {
  const connection = MySql.createConnection(Config.MySql);
  let isFailed = false;
  connection.connect(err => {
    if (err) {
      console.error(err);
      isFailed = true;
    }
  });
  if (isFailed) {
    resp({});
  }
  connection.query(query, (err, res) => {
    if (err) resp(err);
    else resp(res);
  });
}

// カテゴリに関して
exports.GetCategoly = (req, res) => {
  //console.log(req.headers.host);
  Query('SELECT * FROM exam', (result) => res.json(result));
};