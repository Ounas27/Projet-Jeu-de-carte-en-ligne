<?php
    /**
     * Fichier pour vérifier l'etat de la partie
     */
    $url = $_POST['url'];
    $f = fopen($url, 'r+');
    if (!flock($f, LOCK_EX))
        http_response_code(409); // conflict
    $jsonString = fread($f, filesize($url));
    $data = json_decode($jsonString, true);
    if(!is_null($data)){
        $val = count($data["pileTapis"]);
        // vérificaton sur le tapis qui doit avoir toutes les cartes
        if($val == 32){
            echo "true";
        }
        else 
            echo "false";
    flock($f, LOCK_UN);
    fclose($f);
    }
    


?>