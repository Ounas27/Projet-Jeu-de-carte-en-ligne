<?php
    /**
     * Fichier appelé pour vérifier les règles du jeu
     */
    // on est proche du but
    $pseudo = $_POST['pseudo'];
    $url = $_POST['url'];
    $couleur = $_POST['couleur'];
    $valeur = $_POST['valeur']; 
    $f = fopen($url, 'r+');
    if (!flock($f, LOCK_EX))
        http_response_code(409); // conflict
    $jsonString = fread($f, filesize($url));
    $data = json_decode($jsonString, true);

    // inialisation a 0 par defaut
    $pointObtenu = 0;
    $atout = $data['couleurAtout'];
    // ordre : 1- carreau 2- coeur 3- pique 4- trefle
    if($atout == $couleur){
        if($valeur == 1) $pointObtenu = 11;
        if($valeur == 7) $pointObtenu = 0;
        if($valeur == 8) $pointObtenu = 0;
        if($valeur == 9) $pointObtenu = 14;
        if($valeur == 10) $pointObtenu = 10;
        if($valeur == 11) $pointObtenu = 20;
        if($valeur == 12) $pointObtenu = 3;
        if($valeur == 13) $pointObtenu = 4; 
    }
    else {  
        if($valeur == 1) $pointObtenu = 11;
        if($valeur == 7) $pointObtenu = 0;
        if($valeur == 8) $pointObtenu = 0;
        if($valeur == 9) $pointObtenu = 0;
        if($valeur == 10) $pointObtenu = 10;
        if($valeur == 11) $pointObtenu = 2;
        if($valeur == 12) $pointObtenu = 3;
        if($valeur == 13) $pointObtenu = 4; 
    }

    for($i = 0; $i < count($data["joueurs"]); $i++){
        if($data['joueurs'][$i]['pseudo'] == $pseudo){
            $num = $data["joueurs"][$i]["equipe"];
            $data["equipes"][$num]["pointsTotal"] = $data["equipes"][$num]["pointsTotal"] + $pointObtenu;
        }
    }
    
    $newJsonString = json_encode($data, JSON_PRETTY_PRINT);
    ftruncate($f, 0);
    fseek($f,0);
    fwrite($f, $newJsonString);
    flock($f, LOCK_UN);
    fclose($f);
?>