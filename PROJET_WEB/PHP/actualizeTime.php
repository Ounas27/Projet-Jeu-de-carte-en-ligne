<?php
    /**
     * FICHIER PERMETTANT DE METTRE A JOUR L'HEURE DU JOUEUR
     */
    date_default_timezone_set('Europe/Paris');
    $nom = $_POST['nom'];
    $time = date('Y-m-d H:i:s');
    $filename="../JSON/mainJoueurs.json";
    $f = fopen($filename, 'r+');
    $players = null;
    if (!flock($f, LOCK_EX))
        http_response_code(409); // conflict
    $jsonString = fread($f, filesize($filename));
    $players = json_decode($jsonString, true); 
    // on vérifie que la liste des joueurs n'est pas null
    if(!is_null($players)){
        foreach($players as $player => $entry){
            if ($entry['username'] == $nom){
                // et pour le joueur correspondant, on met à jour son temps
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