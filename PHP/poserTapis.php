<?php
    /**
     * FICHIER PERMETTANT DE PASSER UNE CARTE SUR LE TAPIS
     */
    $url = $_POST['url'];
    $f = fopen($url, 'r+');
    if (!flock($f, LOCK_EX))
        http_response_code(409); // conflict
    $jsonString = fread($f, filesize($url));
    $data = json_decode($jsonString, true);
    
    // on récupère les informations envoyées par l'ajax
    $Valeur = $_POST["valeur"];
    $Couleur = $_POST["couleur"];
    $pseudo = $_POST["pseudo"];
    for($i = 0; $i < count($data["joueurs"]); $i++){
        if($data["joueurs"][$i]["pseudo"] == $pseudo){
            // On vérifie qu'on est bien sur le joueur
            for($j = 0; $j < count($data["joueurs"][$i]["cartes"]); $j++){
                if($data["joueurs"][$i]["cartes"][$j]["Valeur"]==$Valeur && $data["joueurs"][$i]["cartes"][$j]["Couleur"]==$Couleur){                    
                    // dès qu'on a la bonne carte du joueur, son champ carteTapis passe à true
                    $data["joueurs"][$i]["cartes"][$j]["carteTapis"] = true;
                    
                    $carteARecuperer = array(
                        'nomJoueur' => $data["joueurs"][$i]["pseudo"],
                        'Valeur' => $data["joueurs"][$i]["cartes"][$j]["Valeur"],
                        'Couleur' => $data["joueurs"][$i]["cartes"][$j]["Couleur"]
                    );
                    // on retire la carte déposée du jeu du joueur
                    unset($data["joueurs"][$i]["cartes"][$j]);
                    // on crée un nouveau set pour le joueur en recuperant ses cartes actuelles
                    $nvSet = array_values($data["joueurs"][$i]["cartes"]);
                    // on supprime toutes ces cartes
                    unset($data["joueurs"][$i]["cartes"]);
                    // on définit l'attribut cartes dans le fichier JSON comme array
                    $data["joueurs"][$i]["cartes"] = array();
                    // et on fusionne pour avoir notre nouveau set
                    $data["joueurs"][$i]["cartes"] = array_merge($data["joueurs"][$i]["cartes"], $nvSet);
                }
            }
        }
    }
    
    if(!is_null($carteARecuperer))
        array_push($data['pileTapis'], $carteARecuperer);

    $newJsonString = json_encode($data, JSON_PRETTY_PRINT);
    ftruncate($f, 0);
    fseek($f,0);
    fwrite($f, $newJsonString);
    flock($f, LOCK_UN);
    fclose($f);


?>