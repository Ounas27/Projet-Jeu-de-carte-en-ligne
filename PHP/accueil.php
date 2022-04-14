<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <link href="../CSS/style.css" rel="stylesheet">
    <script src="../js/main.js"> </script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <title>Projet Site 2022</title>
    
</head>
    <body>
        <?php
            echo"<div id=setJeux1>
                    <div><img id=carte1 draggable='true' ondragstart = 'drag(event)' src=''></div>
                    <div><img id=carte2 draggable='true' ondragstart = 'drag(event)'  src=''></div>
                    <div><img id=carte3 draggable='true' ondragstart = 'drag(event)'  src=''></div>
                    <div><img id=carte4 draggable='true' ondragstart = 'drag(event)' src=''></div>
                    <div><img id=carte5 draggable='true' ondragstart = 'drag(event)' src=''></div>
                </div>

                <div id=setJeux2>
                    <div id=carte1><img src='../ImagesCartes/0_3.png'></div>
                    <div id=carte2><img src='../ImagesCartes/0_3.png'></div>
                    <div id=carte3><img src='../ImagesCartes/0_3.png'></div>
                    <div id=carte4><img src='../ImagesCartes/0_3.png'></div>
                    <div id=carte5><img src='../ImagesCartes/0_3.png'></div>
                </div>

                <div id=setJeux3>
                    <div id=carte1><img src='../ImagesCartes/0_3.png'></div>
                    <div id=carte2><img src='../ImagesCartes/0_3.png'></div>
                    <div id=carte3><img src='../ImagesCartes/0_3.png'></div>
                    <div id=carte4><img src='../ImagesCartes/0_3.png'></div>
                    <div id=carte5><img src='../ImagesCartes/0_3.png'></div>
                </div>

                <div id=setJeux4>
                    <div id=carte1><img src='../ImagesCartes/0_3.png'></div>
                    <div id=carte2><img src='../ImagesCartes/0_3.png'></div>
                    <div id=carte3><img src='../ImagesCartes/0_3.png'></div>
                    <div id=carte4><img src='../ImagesCartes/0_3.png'></div>
                    <div id=carte5><img src='../ImagesCartes/0_3.png'></div>
                </div>";


            echo"<div id=tapisJeux ondrop='drop(event)' ondragover='allow_drop(event)'>
                </div>";

            echo"<div id=chat>
                    <input type='text' id='messageAEnvoyer' required>
                    <button onclick='envoyerMessage()'>Envoyer</button>
                    <div id=messageCourant>
                    </div>
                </div>";
            require('distributionCarte.php');
        ?>    
    </body>

</html>