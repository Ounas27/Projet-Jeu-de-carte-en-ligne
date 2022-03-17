<?php

    $jsonString = file_get_contents('./js/players.json');
    $players = json_decode($jsonString, true);


    foreach($players as $player){
        $timeplayer = strtotime($players[$player]['time']);
        $currentTime = time();
        $diff = $currentTime - $timeplayer;
        var_dump($diff);
        if ($diff < 60)
            unset($player);
    }

    $newJsonString = json_encode($players, JSON_PRETTY_PRINT);
    file_put_contents('./js/players.json', $newJsonString);
?>