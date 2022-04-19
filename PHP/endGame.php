<?php
    $url = $_POST['url'];
    if(file_exists($url)){
        unlink($url);
        echo "true";
    }
    else
        echo "false";
?>