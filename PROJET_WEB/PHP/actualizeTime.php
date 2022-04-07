<?php
    $nom = $_POST['nom'];
    $time = date('H:i:s');
    $filename="../js/players.json";
    $f = fopen($filename, 'r+');
    $players = null;
    if (!flock($f, LOCK_EX))
        http_response_code(409); // conflict
    $jsonString = fread($f, filesize($filename));
    $players = json_decode($jsonString, true); 
    if(!is_null($players)){
        foreach($players as $player => $entry){
            if ($entry['username'] == $nom){
                $players[$player]['time'] = $time;
            }
        }
        $newJsonString = json_encode($players, JSON_PRETTY_PRINT);
        ftruncate($f, 0);
        fseek($f,0);
        fwrite($f, $newJsonString);
        flock($f, LOCK_UN);
        fclose($f);
    }
?>