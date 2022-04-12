<?php
    $partie = array();
    $filename="../JSON/mainJoueurs.json";
    $f = fopen($filename, 'r+');
    $players = null;
    if (!flock($f, LOCK_EX))
        http_response_code(409); // conflict
    $jsonString = fread($f, filesize($filename));
    $players = json_decode($jsonString, true); 

    if(!is_null($players)){
        foreach($players as $i => $entry){
            if($players[$i]['checkbox'] == "true")
                $players[$i]['connected'] = "../JSON/partie.json";
        }
        $partie["joueurs"] = $players;
        $partie["cartes"] = null;
    }
    file_put_contents("../JSON/partie.json", json_encode($partie, JSON_PRETTY_PRINT));
    echo "GAAAAAAAAME";
?>