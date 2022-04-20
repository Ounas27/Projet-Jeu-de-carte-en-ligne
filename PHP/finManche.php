<?php
    /**
     * Fichier appelé pour vérifier les règles du jeu
     */
    $url = $_POST['url'];
    $f = fopen($url, 'r+');
    if (!flock($f, LOCK_EX))
        http_response_code(409); // conflict
    $jsonString = fread($f, filesize($url));
    $data = json_decode($jsonString, true);

    if(!is_null($data)){
        // mettre à 32 pour le vrai jeu
        $val = count($data["pileTapis"]);
        if($val >= 4 /*val == 32*/){
            $data["pileManches"] = $data["pileManches"] + 1;
            // tapis / deck / cartes joueur vider puis initialiser à vide
            unset($data["pileTapis"]);
            $data["pileTapis"] = array();
            unset($data["deck"]);
            $data["deck"] = array();
            for($i = 0; $i < count($data["joueurs"]); $i++){
                unset($data["joueurs"][$i]["cartes"]);
                $data["joueurs"][$i]["cartes"] = array();
            }

            // création du deck et des cartes joueurs
            $carte = array();
            $cartes = array();
            // Définition des 4 figures
            for($i=1; $i<5; $i++){
                // Définition des 13 cartes possible par figure
                for($j=7; $j<14; $j++){
                    //Pour chaque carte, on crée ses champs
                    $carte = array(
                        'Valeur' => $j,
                        'Couleur' => $i,
                        'carteTapis' => false
                    );
                    array_push($cartes, $carte);
                }
            }
            // on mélange notre liste de cartes
            shuffle($cartes);

            // On ajoute la premiere carte du deck au tapis
            $data['couleurAtout'] = $cartes[0]["Couleur"]; 
            array_push($data["pileTapis"], $cartes[0]);
            array_splice($cartes, 0, 1);

            for($i = 0; $i < count($data["joueurs"]); $i++){
                $cartesJoueur = array();
                for($j=0 ; $j<5 ; $j++){
                    // pour chaque joueur, on lui donne ses 5 cartes
                    array_push($cartesJoueur, $cartes[0]);
                    array_splice($cartes, 0, 1);
                }
                // on met à jour les cartes du joueur
                $data['joueurs'][$i]["cartes"] = array_merge($data['joueurs'][$i]["cartes"], $cartesJoueur);
            }

            $data["deck"] = array_merge($data["deck"], $cartes);

            echo "true";
        }
        else 
            echo "false";
        $newJsonString = json_encode($data, JSON_PRETTY_PRINT);
        ftruncate($f, 0);
        fseek($f,0);
        fwrite($f, $newJsonString);
        flock($f, LOCK_UN);
        fclose($f);
    }
    else {
        echo "false";
        flock($f, LOCK_UN);
        fclose($f);
    }
?>