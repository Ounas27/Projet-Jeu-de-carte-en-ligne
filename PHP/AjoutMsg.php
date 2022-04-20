<?php
    /**
     * FICHIER PERMETTANT D'AJOUTER UN MESSAGE 
     */
    // ON récupère les infomations envoyées lors de l'appel ajax
    $url = $_POST['url'];
    $pseudo = $_POST['pseudo'];
    $messageAEnvoyer = $_POST["Message"];
    $estCarte = $_POST['estCarte'];
    $f = fopen($url, 'r+');
    if (!flock($f, LOCK_EX))
        http_response_code(409); // conflict
    $jsonString = fread($f, filesize($url));
    $data = json_decode($jsonString, true); 

    // On crée la liste contenant le message d'un joueur
    $varMessage = array(
        'nomJoueur' => $pseudo,
        'message' => $messageAEnvoyer,
        'estCarte' => $estCarte
    );
    
    // et on l'ajoute à la liste de tous les messages de la partie
    array_push($data["messageJeu"], $varMessage);
    
    $newJsonString = json_encode($data, JSON_PRETTY_PRINT);
    ftruncate($f, 0);
    fseek($f,0);
    fwrite($f, $newJsonString);
    flock($f, LOCK_UN);
    fclose($f);
    
?>