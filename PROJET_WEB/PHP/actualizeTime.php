<?php
    $nom = $_POST['nom'];
    $time = $_POST['newCurrentTime'];
    $jsonString = file_get_contents('./js/players.json');
    $players = json_decode($jsonString, true);
    foreach($players as $player => $entry){
        if ($entry['username'] == $nom){
            $players[$player]['time'] = $time;
        }
    }
    $newJsonString = json_encode($players, JSON_PRETTY_PRINT);
    file_put_contents('./js/players.json', $newJsonString);
?>