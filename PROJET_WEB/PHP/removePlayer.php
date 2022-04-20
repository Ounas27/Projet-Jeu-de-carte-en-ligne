<?php
    /**
     * FICHIER PERMETTANT DE SUPPRIMER LES JOUEURS INACTIFS
     */
    // définition du fuseau horaire
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
            // différence entre l'heure actuelle et l'heure du joueur
            $diff = abs(strtotime($currentTime) - strtotime($timeplayer));
            // si différence > 60sec alors il est supprimé de la liste d'attente
            if($diff > 60){
                echo $players[$player]['username'];
                unset($players[$player]);
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