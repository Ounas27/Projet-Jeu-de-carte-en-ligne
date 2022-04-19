<?php
    /**
     * FICHIER PERMETTANT DE SUPPRIMER UN JOUEUR SPECIFIQUE
     */
   $filename="../JSON/mainJoueurs.json";
   // on récupère le pseudo envoyé par appel ajax
   $pseudo = $_POST['pseudo'];
    $f = fopen($filename, 'r+');
    if (!flock($f, LOCK_EX))
        http_response_code(409); // conflict
    $jsonString = fread($f, filesize($filename));
    $players = json_decode($jsonString, true);
    
    if(!is_null($players)){
        foreach($players as $player => $entry){
            // Si bon pseudo et que pseudo existant dans file d'attente
            // alors le joueur est supprimé
            if($entry['username'] == $pseudo)
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