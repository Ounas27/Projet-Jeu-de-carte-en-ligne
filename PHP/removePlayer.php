<?php
    // Bug à cause du timezone-set les heures définis sont de 2 heures en
    date_default_timezone_set('Europe/Paris');

   $filename="../JSON/mainJoueurs.json";
    $f = fopen($filename, 'r+');
    if (!flock($f, LOCK_EX))
        http_response_code(409); // conflict
    $jsonString = fread($f, filesize($filename));
    $players = json_decode($jsonString, true);
    
    if(!is_null($players)){
        foreach($players as $player => $entry){
            $timeplayer = $entry['time'];
            $currentTime = date('Y-m-d H:i:s');
            $diff = abs(strtotime($currentTime) - strtotime($timeplayer));
            if($diff > 60)
                unset($players[$player]);
        }
        $newJsonString = json_encode($players, JSON_PRETTY_PRINT);
        ftruncate($f, 0);
        fseek($f,0);
        fwrite($f, $newJsonString);
        flock($f, LOCK_UN);
        fclose($f);
    }
?>