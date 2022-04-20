<?php
/**
 * fichier pour détruire la partie 
 */
    $url = $_POST['url'];
    if(file_exists($url)){
        unlink($url);
        echo "true";
    }
    else
        echo "false";
?>