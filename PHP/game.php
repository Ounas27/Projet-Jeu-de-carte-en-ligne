<?php
    $filename="../JSON/mainJoueurs.json";
    $f = fopen($filename, 'r+');
    $players = null;
    if (!flock($f, LOCK_EX))
        http_response_code(409); // conflict
    $jsonString = fread($f, filesize($filename));
    $players = json_decode($jsonString, true);
    if(!is_null($players) && count($players) > 0){
        $partie = array(
            "joueurs" => array(),
            "messageJeu" => array(),
            "deck" => array()
        );
        $joueurs = array();
        $random = 0;
        while(file_exists("../JSON/partie".$random.".json")){
            $random = rand(1, 100);
        }
        foreach($players as $player => $entry){
            $joueur = array(
                "pseudo" => $entry['username'],
                "cartes" => array() 
            );
            $players[$player]["connected"] = "../JSON/partie".$random.".json";
            array_push($joueurs, $joueur);
        }
        $newJsonString = json_encode($players, JSON_PRETTY_PRINT);
        ftruncate($f, 0);
        fseek($f,0);
        fwrite($f, $newJsonString);
        flock($f, LOCK_UN);
        fclose($f);
        $carte = array();
        $cartes = array();
        for($i=1; $i<5; $i++){
            for($j=1; $j<14; $j++){
                $carte = array(
                    'Valeur' => $j,
                    'Couleur' => $i,
                    'carteTapis' => false,
                    'carteChat' => false 
                );
                array_push($cartes, $carte);
            }
        }
        shuffle($cartes);
        for($i = 0; $i < count($joueurs); $i++){
            $cartesJoueur = array();
            for($j=0 ; $j<5 ; $j++){
                array_push($cartesJoueur, $cartes[0]);
                array_splice($cartes, 0, 1);
            }
            $joueurs[$i]["cartes"]=array_merge($joueurs[$i]["cartes"], $cartesJoueur);
        }
        $partie["joueurs"] = array_merge($partie["joueurs"], $joueurs);
        $partie["deck"]=array_merge($partie["deck"], $cartes);

        $fp = fopen('../JSON/partie'.$random.'.json', 'w');
        fwrite($fp, json_encode($partie, JSON_PRETTY_PRINT));
        fclose($fp);
    }
?>