<?php 
    $url = $_POST['url'];
    $f = fopen($url, 'r+');
    if (!flock($f, LOCK_EX))
        http_response_code(409); // conflict
    $jsonString = fread($f, filesize($url));
    $data = json_decode($jsonString, true);
    
    $indexJoueur = $data["joueurCourant"];
    if($indexJoueur == 3)
        $data["joueurCourant"] = 0;
    else 
        $data["joueurCourant"] = $indexJoueur + 1;
    
    
    $newJsonString = json_encode($data, JSON_PRETTY_PRINT);
    ftruncate($f, 0);
    fseek($f,0);
    fwrite($f, $newJsonString);
    flock($f, LOCK_UN);
    fclose($f);
?>