<?php
    session_start();
    $pseudo = $_POST['pseudo'];
    //$_SESSION[$pseudo] = $pseudo;
    $niveau = $_POST['niveau'];
    //$time = $_POST['currentTime'];
    $time = date('H:i:s');
    $filename="../js/players.json";
    $f = fopen($filename, 'r+');
    if (!flock($f, LOCK_EX))
        http_response_code(409); // conflict
    $jsonString = fread($f, filesize($filename));
    $players = json_decode($jsonString, true); 
    // ICI ON MODIFIE LE CONTENU COMME UN TABLEAU ASSOCIATIF
    if(!is_null($players)){
        $player = array(
            'username' => $pseudo,
            'level' => $niveau,
            'connected' => "1",
            'time' => $time
        );
        $_SESSION[$pseudo] = $pseudo;
        array_push($players, $player);
        $newJsonString = json_encode($players, JSON_PRETTY_PRINT);
        ftruncate($f, 0);
        fseek($f,0);
        fwrite($f, $newJsonString);
        flock($f, LOCK_UN);
        fclose($f);
    }
?>