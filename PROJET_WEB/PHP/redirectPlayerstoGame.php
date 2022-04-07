<?php
    if(isset($_REQUEST['gameState'])){
        $gamelaunched = $_REQUEST['gameState'];
        if($gamelaunched)
            echo "true";//return true;
    }
    else echo "false";//return false;
?>