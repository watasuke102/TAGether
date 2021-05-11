<?php
# API for TAGether
# request.php
#
# CopyRight (c) 2020 Watasuke
# Email  : <watasuke102@gmail.com>
# Twitter: @Watasuke102
# This software is released under the MIT SUSHI-WARE License.
ini_set('display_errors', "On");
ini_set('error_reporting', E_ALL);
require_once __DIR__.'/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

# headers
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Origin, Content-Type');
header('Access-Control-Allow-Origin: ' . $_ENV['ALLOW_ORIGIN']);

# Function
function error($mes) {
  http_response_code(400);
  $array['status']  = 'error';
  $array['message'] = $mes;
  print json_encode($array);
  exit(1);
}

$mysqli = new mysqli($_ENV['SQL_HOST'], $_ENV['SQL_USER'], $_ENV['SQL_PASS'], $_ENV['SQL_DATABASE']);
if (mysqli_connect_error()) {
  error($mysqli->connect_error);
}

# POST
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
  error('not POST');
}
$query  = 'INSERT INTO request (body) values ("' . $_GET['body'] . '")';
error_log("[".date('Y-m-d H:i:s')."] " . "POST REQUEST: " . $query . "\n", 3, $_ENV['LOG_PATH']);
$result = $mysqli->query($query);
http_response_code(200);
$array['status'] = 'ok';
print json_encode($array);

// idを取得
$id = $mysqli->query('select max(id) from request')->fetch_assoc()["max(id)"];
# Webhookに送信
$ch = curl_init($_ENV['WEBHOOK_URL']);
curl_setopt($ch, CURLOPT_POST, TRUE);
curl_setopt(
  $ch, CURLOPT_POSTFIELDS, 
  '{"avatar_url":"https://watasuke.tk/pic/tagether.png",' .
  '"embeds":[{"title":"新規要望が投稿されました", "fields":[' .
  '{"name": "ID",   "value": "' . $id           . '"},' .
  '{"name": "内容", "value": "' . $_GET['body'] . '"}' .
  ']}]}'
);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
$html = curl_exec($ch);
curl_close($ch);
$mysqli->close();
return;
