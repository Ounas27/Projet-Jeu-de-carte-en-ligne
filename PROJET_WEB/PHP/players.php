<?php
    $pseudo = $_POST['pseudo'];
    $niveau = $_POST['niveau'];
    $time = $_POST['currentTime'];

    $_REQUEST['nom'] = $pseudo;

    $jsonString = file_get_contents('./js/players.json');
    $players = json_decode($jsonString, true);
    $player = array(
        'username' => $pseudo,
        'level' => $niveau,
        'connected' => "1",
        'time' => $time
    );
    array_push($players, $player);
    $newJsonString = json_encode($players, JSON_PRETTY_PRINT);
    file_put_contents('./js/players.json', $newJsonString);
?>