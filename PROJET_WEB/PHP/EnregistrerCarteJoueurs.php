<?php
    $jsonString = file_get_contents('../JSON/mainJoueurs.json');
    $data = json_decode($jsonString, true);

    $carteJ1 = $_POST["carteJ1"];
    $carteJ2 = $_POST["carteJ2"];
    $carteJ3 = $_POST["carteJ3"];
    $carteJ4 = $_POST["carteJ4"];

    foreach($data as $i => $etu){
        switch($etu['username']){
            case "J1":
                $data[$i]['carte1'] = $carteJ1[0];
                $data[$i]['carte2'] = $carteJ1[1];
                $data[$i]['carte3'] = $carteJ1[2];
                $data[$i]['carte4'] = $carteJ1[3];
                $data[$i]['carte5'] = $carteJ1[4];
                break;
            case "J2":
                $data[$i]['carte1'] = $carteJ2[0];
                $data[$i]['carte2'] = $carteJ2[1];
                $data[$i]['carte3'] = $carteJ2[2];
                $data[$i]['carte4'] = $carteJ2[3];
                $data[$i]['carte5'] = $carteJ2[4];
                break;
            case "J3":
                $data[$i]['carte1'] = $carteJ3[0];
                $data[$i]['carte2'] = $carteJ3[1];
                $data[$i]['carte3'] = $carteJ3[2];
                $data[$i]['carte4'] = $carteJ3[3];
                $data[$i]['carte5'] = $carteJ3[4];
                break;
            case "J4":
                $data[$i]['carte1'] = $carteJ4[0];
                $data[$i]['carte2'] = $carteJ4[1];
                $data[$i]['carte3'] = $carteJ4[2];
                $data[$i]['carte4'] = $carteJ4[3];
                $data[$i]['carte5'] = $carteJ4[4];
                break;    
        }

        $newJsonString = json_encode($data, JSON_PRETTY_PRINT);
        file_put_contents('../JSON/mainJoueurs.json', $newJsonString);
    }
?>