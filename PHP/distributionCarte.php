<?php
    $jsonString = file_get_contents('../JSON/brouillon.json');
    $data = json_decode($jsonString, true);
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
    //print_r(array_key_first($cartes[0]));

    
    for($i=0 ; $i<4 ; $i++){
        $cartesJoueurs = array();
        for($j=0 ; $j<5 ; $j++){
            array_push($cartesJoueurs, $cartes[0]);
            array_splice($cartes, 0, 1);
        }
        print_r($cartesJoueurs);
        $data["joueurs"][$i]["cartes"]=array_merge($data["joueurs"][$i]["cartes"], $cartesJoueurs);
    }
    
    $data["deck"]=array_merge($data["deck"], $cartes);
    $newJsonString = json_encode($data, JSON_PRETTY_PRINT);
    file_put_contents('../JSON/brouillon.json', $newJsonString);
?>
