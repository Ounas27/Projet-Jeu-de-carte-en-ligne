<?php
  if(!session_id()) session_start();
?>

<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Main</title>
  <link rel="stylesheet" href="./CSS/style.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="./js/main.js"></script>
</head>
  <body>
    <section class="left-area">
      <div id="formulaires">
        <div id="form-inscrip">
        <h3>Formulaire d'inscription</h3>
        <div class="username-div">
          <label for="username">Pseudo:</label>
          <input type="text" id="username-i" name="username">
        </div>
        <div class="select-div">
          <label for="">Niveau de jeu:</label>
          <select id="levels-sel" name="levels-select">
            <option value="1">Débutant</option>
            <option value="2">Intermédiare</option>
            <option value="3">Expert</option>
            <option value="4">Légende vivante</option>
          </select>
        </div>
          <input id="submit" type="submit" onclick="addPlayer()" name="submit" value="S'inscrire">
</div>
    </section>
    <section class="right-area">
      <h3>Liste des joueurs</h3>
      <table id="tab-players">
        <thead>
          <tr>
            <th>Pseudo</th>
            <th>Niveau</th>
          </tr>
        </thead>  
        <tbody id="listing-players">
        </tbody>
        </div>
      </table>
    </section>
  </body>
</html>