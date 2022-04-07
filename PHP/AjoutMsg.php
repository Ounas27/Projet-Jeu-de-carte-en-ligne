<?php

    echo"<style>
        font-size: 45px;
    </style>";
    $jsonString = file_get_contents('../JSON/messageChat.json');
    $data = json_decode($jsonString, true);

    $messageAEnvoyer = $_POST["Message"];
    $VAR1 = array(
        'Joueur' => "J3",
        'Message' => $messageAEnvoyer
    );
    
    array_push($data, $VAR1);
    
    $newJsonString = json_encode($data, JSON_PRETTY_PRINT);
    file_put_contents('../JSON/messageChat.json', $newJsonString);
    
?>