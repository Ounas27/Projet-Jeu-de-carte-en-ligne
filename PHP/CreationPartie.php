<?php
    /**
     * FICHIER PERMETTANT DE CREER UNE PARTIE POUR 4 JOUEURS
     */
    $filename="../JSON/mainJoueurs.json";
    $f = fopen($filename, 'r+');
    $players = null;
    if (!flock($f, LOCK_EX))
        http_response_code(409); // conflict
    $jsonString = fread($f, filesize($filename));
    $players = json_decode($jsonString, true);
    // on vérifie d'abord que $players n'est pas null et que son nombre est supérieur à 0
    if(!is_null($players) && count($players) > 0){
        $compteur = 0;
        foreach($players as $player => $entry){
            if($players[$player]["check"] == "true")
                $compteur = $compteur + 1;
        }
        // modifier pour que compteur doit etre egale à 4
        if($compteur > 0){
            // On prédéfinit la structure de notre fichier
            // mais tout ca c'est le fichier json
            // genre son arborescence    
            $partie = array(
                "pileManches" => 1,
                //joueur qui doit jouer
                "couleurAtout" => "",
                "cartePlusHaute" => "",
                // atout lors d'un pli
                "joueurCourant"=> "",
                // equipes de 2
                "equipes" => array(),
                //pile du tapis de jeu
                "pileTapis" => array(),
                // les joueurs et leurs cartes
                "joueurs" => array(),
                // les messages des joueurs
                "messageJeu" => array(),
                // le reste des cartes
                "deck" => array()
            );
            $joueurs = array();
            $random = 0;
            // vérification de l'existence d'un fichier json
            while(file_exists("../JSON/partie".$random.".json")){
                $random = rand(1, 100);
            }
            foreach($players as $player => $entry){
                // pour nos 4 joueurs, on crée une liste avec leur pseudo et leurs cartes
                if($players[$player]["check"] == "true"){
                    $joueur = array(
                        "pseudo" => $entry['username'],
                        "equipe" => $player % 2,  // Affectation des equipe (0 ou 1)
                        "cartes" => array() 
                    );
                    
                    if(strlen($players[$player]["connectedJSON"]) == 0){
                        //ici on modifie les champs liées à la connection de partie d'un joueur
                        $players[$player]["connectedJSON"] = "../JSON/partie".$random.".json";
                        $players[$player]["connectedPHP"] = "../PHP/partie".$random.".php";
                        array_push($joueurs, $joueur);   
                    }
                }
            }

            //MAJ du fichier mainJoueurs.json
            $newJsonString = json_encode($players, JSON_PRETTY_PRINT);
            ftruncate($f, 0);
            fseek($f,0);
            fwrite($f, $newJsonString);
            flock($f, LOCK_UN);
            fclose($f);

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
            $partie['couleurAtout'] = $cartes[0]["Couleur"]; 
            array_push($partie["pileTapis"], $cartes[0]);
            array_splice($cartes, 0, 1);

            for($i = 0; $i < count($joueurs); $i++){
                $cartesJoueur = array();
                for($j=0 ; $j<5 ; $j++){
                    // pour chaque joueur, on lui donne ses 5 cartes
                    array_push($cartesJoueur, $cartes[0]);
                    array_splice($cartes, 0, 1);
                }
                // on met à jour les cartes du joueur
                $joueurs[$i]["cartes"]=array_merge($joueurs[$i]["cartes"], $cartesJoueur);
            }
            // on met à jour la section joueurs
            $partie["joueurs"] = array_merge($partie["joueurs"], $joueurs);        
            // le reste des cartes est mis à jour dans le deck
            $partie["deck"] = array_merge($partie["deck"], $cartes);
            $randint = 0;
            //creation des equipes
            $equipes = array();
            for($i = 0; $i < 2; $i++){
                $equipe = array(
                    'numero' => $i,
                    'pointsTotal' => 0
                );
                array_push($equipes, $equipe);
            }
            $partie["equipes"] = array_merge($partie["equipes"], $equipes);
            //$randint =  rand(0, 3);
            $partie["joueurCourant"] = $randint;
            
            $fp = fopen('../JSON/partie'.$random.'.json', 'w');
            fwrite($fp, json_encode($partie, JSON_PRETTY_PRINT));
            fclose($fp);
        }
        else
            echo "ERROR NOMBRE DE JOUEURS INSSUFISANTS";
    }
?>