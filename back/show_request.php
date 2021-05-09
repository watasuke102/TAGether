<!DOCTYPE HTML>
<html>
<head>
<style>
body {
  background-color: #151528;
  color: #dddddd;
}
th {
  border-bottom: 1px solid #d6d5a1;
}
td {
  padding: 5px 15px;
}
a {
  color: #67a4ff;
}
</style>
<title>要望一覧</title>
</head>
<body>
  <h2>説明</h2>
  <p>
    TAGetherから送られてきた要望一覧を回答付きで表示します<br>
    荒らしや迷惑な内容は削除します<br>
    開発状況（ToDo）は<a href="https://0e0.pw/lusM">こちら</a>
  </p>

  <h2>要望一覧</h2>
  <table>
  <tr>
    <th>id</th>
    <th>最終更新</th>
    <th>要望</th>
    <th>解答</th>
  </tr>
<?php
require_once __DIR__.'/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$mysqli = new mysqli('localhost', $_ENV['SQL_USER'], $_ENV['SQL_PASS'], $_ENV['SQL_DATABASE']);
if (mysqli_connect_error()) {
  print 'error: ' . $mysqli->connect_error;
}

$query = 'SELECT * FROM request ORDER BY id DESC';

$result = $mysqli->query($query);
if ($result) {
  $rows = $result->fetch_array();
  while ($row = $result->fetch_assoc()) {
    print '<tr>';
    print '<td>' . $row['id']         . '</td>';
    print '<td>' . $row['updated_at'] . '</td>';
    print '<td>' . $row['body']   . '</td>';
    print '<td>' . $row['answer'] . '</td>';
    print '</tr>';
  }
} else {
  print 'error';
}
?>
</table>
</body>
</html>