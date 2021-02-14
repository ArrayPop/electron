<?php
try{
$db = new SQLite3('C:/WebServers/home/test2/comments.db');
}catch(Exception $e){
	exit('Ошибка');
}
//$db->exec('DROP TABLE comments');
$db->exec('CREATE TABLE IF NOT EXISTS comments (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name text NOT NULL,
   comment text NOT NULL,
   created_at text NOT NULL
)');
$result = [];
$comments = $db->query('SELECT * FROM comments');


while($res = $comments->fetchArray(SQLITE3_ASSOC)){
	
	array_push($result,$res);
}

if(isset($_GET['comments']) && is_array($result)){
	$html = '';

	foreach($result as $key){
		$html .= sprintf('<div class="comment block">
              <div  class="comment-info">
                <div class="row g-0">
                  <div class="col-md-1 col-sm-2 col-3 comment-img"><img src="img/deadpool.png" alt=""></div>
                  <div class="col-md-11 col-sm-10 col-9 comment-data">
                    <div>
                      <div  class="comment-author color-blue">%s</div>
                      <div  class="comment-date">%s</div>
                    </div>
                    <img src="img/delete.png" alt="" onclick="Comments.delete(%d)"  class="comment-delete" role="button">
                  </div>
                </div>
              </div>
              <div class="comment-text">

                <p>%s</p>
              </div>
            </div>', $key['name'],new_time($key['created_at']),$key['id'], $key['comment']);
	}
	echo $html;
	exit;
}

if(isset($_GET['comment']) && !empty($_GET['comment'])){
	echo "string";
	try{
		$db->exec('DELETE FROM comments WHERE id = '.(int)$_GET['comment']);
		echo "success";
	}catch(Exception $e){
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	}
	exit;
}

if(isset($_POST['ajax'])){
	if($_POST['name'] <> '' && $_POST['text'] <> ''){
		try{
			$db->exec("INSERT INTO comments (name, comment,created_at) VALUES ('".trim(strip_tags($_POST['name']))."', '".trim(strip_tags($db->escapeString($_POST['text'])))."',datetime('now','localtime'))");
			echo "success";

		}catch(Exception $e){
			header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
		}
		
	}else{
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	}
	exit;
}

function new_time($date) { 
 //date_default_timezone_set('Europe/Moscow');
 $date_str = new DateTime($date);
$date = $date_str->format('d.m.Y');
$date_month = $date_str->format('d.m');
$date_year = $date_str->format('Y');

$date_time = $date_str->format('H:i');

 $ndate = date('d.m.Y');
 $ndate_time = date('H:i');
 $ndate_time_m = date('i');
 $ndate_exp = explode('.', $date);
 $nmonth = array(
1 => 'янв',
  2 => 'фев',
  3 => 'мар',
  4 => 'апр',
  5 => 'мая',
  6 => 'июн',
  7 => 'июл',
  8 => 'авг',
  9 => 'сен',
  10 => 'окт',
  11 => 'ноя',
  12 => 'дек'
 );

foreach ($nmonth as $key => $value) {
  if($key == intval($ndate_exp[1])) $nmonth_name = $value;
 }

if ($date == date('d.m.Y')){
$datetime = 'Cегодня в ' .$date_time;
}

else if ($date == date('d.m.Y', strtotime('-1 day'))){
$datetime = 'Вчера в ' .$date_time;
}

else if ($date != date('d.m.Y') && $date_year != date('Y')){
$datetime = $ndate_exp[0].' '.$nmonth_name.' '.$ndate_exp[2]. ' в '.$date_time;
}

else {
$datetime = $ndate_exp[0].' '.$nmonth_name.' в '.$date_time;
}
return $datetime;
}