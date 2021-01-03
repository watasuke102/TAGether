// TAGether - Share self-made exam for classmates
// LoadListFromDB.ts
//
// CopyRight (c) 2020 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import * as mysql from 'mysql';

interface Categoly {
  id:         number;
  updated_at: string;
  title:      string;
  desc:       string;
  tag:        string;
}

export default () => {
  let exam: Categoly[] = [];
  const connection = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    database: 'exam',
    timezone: 'jst'
  });
  connection.connect();
    connection.query('SELECT * FROM exam;', function (err, rows, fields) {
      if (err) { console.log('Error: ' + err); return; }
      rows.forEach(element => {
        exam.push({
          id:         element.id,
          updated_at: element.updated_at,
          title:      element.title,
          desc:       element.description,
          tag:        element.tag
        });
        console.log(element);
      });
    });
    connection.end();
  exam.push({
    id:         100,
    updated_at: "text",
    title:      "text",
    desc:       "text",
    tag:        "text"
  });
  console.log("!!! list=");
  console.log(exam);
  return exam;
}
