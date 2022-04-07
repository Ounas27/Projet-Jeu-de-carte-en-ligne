

<?php
    session_start();
    echo $_REQUEST['gameState']. "<br>";
    echo "pseudo du joueur " . $_SESSION['Patrice'];
    echo "Bienvenue sur la partie";
?>