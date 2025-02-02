// Déclarations des variables locales au fichier 
var pseudo = "";
var url_partie = "";
var ingame = false;
var testInterval;
let players = Array();
playersRefresh(500);


// Fonction nous permettant de répéter constamment les fonctions nécessaires
function playersRefresh(timeoutPeriod){
    setInterval(updatePlayers, timeoutPeriod);
    setInterval(actualisePlayerCurrentTime, timeoutPeriod); 
    setInterval(removePlayers, timeoutPeriod);
    testInterval = setInterval(gameLaunchedForPlayer,timeoutPeriod);
    setInterval(majTapis, timeoutPeriod);
    setInterval(majChat, timeoutPeriod);
    setInterval(allowedtoDrop, timeoutPeriod);
    setInterval(gameFinished, timeoutPeriod);
    
}

/**
 * PARTIE CONCERNANT LE DRAG AND DROP DES CARTES SUR LE TAPIS
 */
function drag(ev){
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function allow_drop(ev) {
    ev.preventDefault();
   }

function drop(ev){
    ev.preventDefault();    
    var data = ev.dataTransfer.getData("text/plain");

    let d = $("#"+data);
    let t = $("#"+ev.target.id);
    let  maDiv = $("<div></div>");
    maDiv.append(d);
    t.append(maDiv);
    //conversion de l'id de l'img en nombre
    let carteTapis = data.split("_").map(Number);
    // appel ajax pour changer l'etat de la carte deposee sur le tapis
    if(ev.target.id == "tapisJeux"){
        //console.log(" LA CARTE TIREE A POUR COULEUR " + carteTapis[0] + " ET POUR VALEUR :" carteTapis[1]);
        $.ajax({
                method: 'POST',
                data : {"url" : url_partie,"pseudo" : pseudo , "couleur" : carteTapis[0], "valeur" : carteTapis[1]},
                url : '../PHP/gestionRegles.php',
            }).done(function(data){
                console.log(data);
                $.ajax({
                    method: 'POST',
                    data: {"url" : url_partie, "pseudo" : pseudo ,"couleur" : carteTapis[0], "valeur" : carteTapis[1]},
                    url : "../PHP/poserTapis.php",
                }).done(function(data){  
                    console.log(data);           
                    $.ajax({
                        method: 'POST',
                        data : {"url" : url_partie},
                        url : '../PHP/dernierDepot.php',
                    }).done(function(data){
                        affichageCarte();
                        console.log(data);
                    }).fail(function(data){
                        console.log(data);
                    });
                }).fail(function(data){
                    console.log(data); 
                });
                // fin appel ajax gestionRegles
            }).fail(function(data){
        });
    }
}


// fonction permettant au joueur de poser une carte si c'est son tour
function allowedtoDrop(){
    $.ajax({
        method : 'GET',
        dataType : 'json',
        url : url_partie
    }).done(function(e){
        var indexJoueur = e["joueurCourant"];
        if(e["joueurs"][indexJoueur]["pseudo"] === pseudo){
            $("#tapisJeux").attr('ondragover','allow_drop(event)');
        }
        
        else{
            $("#tapisJeux").attr('ondragover','');
        }
    }).fail(function(e){
        console.log('fail');
    });
}


// fonction pour mettre à jour le tapis de cartes
function majTapis(){
    $.ajax({
        method: "GET",
        dataType : "json",
        url: url_partie,
        }).done(function(e) {
        $("#tapisJeux").empty();
        if(e != null){
            // on recupere la taille de la pile sur le tapis
            var longueurTapisCarte = e['pileTapis'].length;
            if(longueurTapisCarte > 4){
                // si plus grand que 4, on veut juste afficher les 4 dernieres cartes
                for(let i = longueurTapisCarte-4; i < longueurTapisCarte + 1; i++){
                    console.log("rentré dans la boucle");
                    var couleurCarte = e["pileTapis"][i]["Couleur"];
                    var valeurCarte = e["pileTapis"][i]["Valeur"];
                    var maDiv = document.createElement("div");
                    var monimg = document.createElement("img");
                    monimg.setAttribute("id",couleurCarte+"_"+valeurCarte);
                    monimg.setAttribute("draggable", true);
                    monimg.setAttribute("ondragstart",'drag(event)');
                    monimg.setAttribute("src","../ImagesCartes/"+couleurCarte+"_"+valeurCarte+".png");
                    maDiv.appendChild(monimg);
                    document.getElementById("tapisJeux").appendChild(maDiv);
                    console.log(monimg);
                }
            }
            else{
                // sinon on affiche toutes les cartes donc longueurTapis < 4
                for(var carteTapis in e['pileTapis']){ 
                    var couleurCarte = e["pileTapis"][carteTapis]["Couleur"];
                    var valeurCarte = e["pileTapis"][carteTapis]["Valeur"];
                    var maDiv = document.createElement("div");
                    var monimg = document.createElement("img");
                    monimg.setAttribute("id",couleurCarte+"_"+valeurCarte);
                    monimg.setAttribute("draggable", true);
                    monimg.setAttribute("ondragstart",'drag(event)');
                    monimg.setAttribute("src","../ImagesCartes/"+couleurCarte+"_"+valeurCarte+".png");
                    maDiv.appendChild(monimg);
                    document.getElementById("tapisJeux").appendChild(maDiv);
                }
            }
            // appel ajax pour mettre à jour le setJeux du joueur
            $.ajax({
                method : 'GET',
                url : url_partie
            }).done(function(e){
                if(e["joueurs"][e["joueurCourant"]]["pseudo"] === pseudo){
                    let nb_cartes = e["joueurs"][e["joueurCourant"]]["cartes"].length;
                    if(nb_cartes != 5)
                        affichageCarte();
                }
            }).fail(function(e){
            });
        }
        }).fail(function(e) {
    });
}

/**
 * PARTIE CONCERNANT LES MESSAGES ENTRE JOUEURS
 */
function envoyerMessage(){
    let msg =$("#messageAEnvoyer").val();
    let ligne = $("#zoneDepotCartes");
    if(!(ligne.length == 0)){   
        $("#zoneDepotCartes").children('div').each(function () {
            // "this" est l'élement courant de la boucle
            var lienImage = $(this).children('img').attr('src');
            $.ajax({
                method: "POST",
                data : {"Message" : lienImage, "url" : url_partie, "pseudo" : pseudo, "estCarte" : true},
                url: "../PHP/AjoutMsg.php"
                }).done(function(e) {
                    $('#zoneDepotCartes').children('div').each(function () {
                        affichageCarte();
                        this.remove();
                    });
                }).fail(function(e) {
                    console.log("error");
                });  
        });

        //ici
        
    } 

    //appel ajax pour envoyer le message du joueur
    if(msg !== ""){
       $.ajax({
        method: "POST",
        data : {"Message" : msg, "url" : url_partie, "pseudo" : pseudo, "estCarte" : false},
        url: "../PHP/AjoutMsg.php"
        }).done(function(e) {
            $("#messageAEnvoyer").val('');
        }).fail(function(e) {
            console.log("error");
        });    
    }
}

function majChat(){
    //appel ajax pour mettre a jour le chat
    $.ajax({
        method: "GET",
        dataType : "json",
        url: url_partie,
        }).done(function(e) {
        $("#messageCourant").empty();
        // maintenant on le met dans l'id
        for(var donneeChat in e["messageJeu"]){
            if(e["messageJeu"][donneeChat]["estCarte"] === "true"){
                let idImg = e["messageJeu"][donneeChat]["message"].substr(16, 3);
                var maDiv = document.createElement("div");
                var monimg = document.createElement("img");
                monimg.setAttribute("src",e["messageJeu"][donneeChat]["message"]);
                monimg.setAttribute("id", idImg);
                maDiv.appendChild(monimg);
                $("#messageCourant").append(maDiv);
            }
            else {
                let nomJoueur = e["messageJeu"][donneeChat]["nomJoueur"];
                let msgJoueur = e["messageJeu"][donneeChat]["message"];
                $("#messageCourant").append(nomJoueur+" : "+msgJoueur+"<br>");
            }
        }
        }).fail(function(e) {
    });
}

/**
 * PARTIE CONCERNANT LES JOUEURS
 */

function actualisePlayerCurrentTime(){
    if(pseudo != ""){
        //appel ajax pour mettre à jour l'heure du joueur pour savoir s'il est connecte
        $.ajax({
            type: 'POST',
            data:  {"nom":pseudo },        //La méthode cible (POST ou GET)
            url : '../PHP/actualizeTime.php' //Script Cible
         }).done(function(e){
         }).fail(function(e){
         });
    }
}

function updatePlayers(){
    let disabled = "";
    let compteurJoueurs = 0;
    $(document).ready(function(){
    //appel ajax pour mettre à jour le tableau contenant les joueurs inscrits
    $.ajax({
        method: 'POST',
        dataType : "json",          //
        url : '../JSON/mainJoueurs.json' //Script Cible
     }).done(function(e){
        if(e != null){
            for(let index_player in e){
                // on incrémente le compteur pour les joueurs selectionnes
                if(e[index_player]["check"] === "true")
                    compteurJoueurs += 1;
                if(e[index_player]["connectedJSON"] === ""){
                    // s'ils sont pas dans une partie on affiche au tableau
                    let ligne = $("#listing-players #tr" + index_player);                
                    if(ligne.length == 0){
                        players[index_player] = e[index_player];
                        $("#listing-players").append("<tr id='tr"+index_player+"'><td class='1'>"+ players[index_player]['username']+"</td><td class='2'>"+ players[index_player]['level'] + "</td><td class='3'><input id='checkbox"+ index_player +"'type='checkbox' value='"+ players[index_player]['username'] +"'</td></tr>");
                    }
                    else{
                        // sinon le premier de la liste est celui qui selectionne les joueurs pour la partie
                        if(pseudo === e[0]["username"]){
                            document.getElementById("checkbox"+index_player).disabled = false;
                            // une fois 4 joueurs, impossible d'en selectionner dautres
                            if(compteurJoueurs == 4){
                                if(e[index_player]["check"] === "false")
                                    document.getElementById("checkbox"+index_player).disabled = true;
                            }
                            else 
                                document.getElementById("checkbox"+index_player).disabled = false;
                            // on regarde la valeur du checkbox et on met à jour dans le fichier JSON
                            if(document.getElementById("checkbox"+index_player).checked){
                                $.ajax({
                                    type: 'POST',
                                    data:  { "box_checked": 'true', "pseudo" : e[index_player]['username']},        //La méthode cible (POST ou GET)
                                    url : '../PHP/playerSelected.php' //Script Cible
                                }).done(function(e){
                                        console.log(e);
                                }).fail(function(e){
                                }); 
                            }   
                            else {
                                $.ajax({
                                    type: 'POST',
                                    data:  { "box_checked": 'false', "pseudo" : e[index_player]['username']},        //La méthode cible (POST ou GET)
                                    url : '../PHP/playerSelected.php' //Script Cible
                                }).done(function(e){
                                        console.log(e);
                                }).fail(function(e){
                                }); 
                            }
                        }
                        else {
                            // on met à jour l'affichage des checkbox
                            document.getElementById("checkbox"+index_player).disabled = true;
                            if(e[index_player]['check'] === "true")
                                document.getElementById("checkbox"+index_player).checked = true;
                            else
                                document.getElementById("checkbox"+index_player).checked = false;
                        }
                    }
                }
                else{
                    $("#listing-players #tr" + index_player).empty();
                }

            } 
        }
        // on rend le bouton de lancer la partie visible
        if(players.length >= 4){
            if(compteurJoueurs == 4)
                disabled = "";
        }
        else {
            disabled = "disabled";
        }
        // on affiche le bouton si seulement sa ligne pas créée
        if($("#tab-players #zone-btn").length == 0)
            $("#tab-players").append("<div id='zone-btn'><tr id='btn-start-game'><td><input type='submit' id='start-game' name='start-game' value='Commencer la partie' onclick='launchGame()'" + disabled +"></td></tr></div>");
        else{
            $("#tab-players #zone-btn").empty();
            $("#tab-players #zone-btn").append("<tr id='btn-start-game'><td><input type='submit' id='start-game' name='start-game' value='Commencer la partie' onclick='launchGame()'" + disabled +"></td></tr>");
        }
     }).fail(function(e){
        console.log(e);
     });
    });
}

// fonction oermettant d'ajouter un joueur à la liste des joueurs en attente
function addPlayer(){
    pseudo = $("#username-i").val();
    let niveau = $("#levels-sel").val();
    if(pseudo !== ""){
        if(usernameExisted(pseudo))    
            alert("Vous ne pouvez pas utiliser ce pseudo. Veuillez changer s'il vous plaît");
        else{
            $.ajax({
                type: 'POST',
                data:  { "pseudo": pseudo, "niveau": niveau},        //La méthode cible (POST ou GET)
                url : '../PHP/addPlayer.php' //Script Cible
             }).done(function(e){
             }).fail(function(e){
             });
             $("#username-i").val('');
             $("#levels-sel").val('');
        }
    }
}

// fonction vérifiant que le pseudo du joueur souhaitant s'inscrire n'est pas deja utilise
function usernameExisted(name){
    for(let i = 0; i < players.length; i++){
        if(name === players[i]['username'])
            return true;
    }
    return false;
}

// fonction permettant de supprimer les joueurs deconnectes
function removePlayers(){
    $.ajax({
        type: 'POST',        //La méthode cible (POST ou GET)
        url : '../PHP/removePlayer.php' //Script Cible
     }).done(function(e){
         for(let i in players){
             if(players[i]['username'] == e){
                 const index = players.indexOf(i);
                 if (index > -1){
                     players.splice(index, 1);
                }
            }
         }
     }).fail(function(e){
     });
}

/**
 * PARTIE CONCERNANT LE LANCEMENT DE PARTIE
 */
function launchGame(){
    // en cas de clic sur le bouton la partie est démarrée
    let compteur = 0;
    $.ajax({
        method : 'GET',
        url : '../JSON/mainJoueurs.json' 
    }).done(function(e){
        for(let index in e){
            if(e[index]['check'] === "true")
                compteur += 1;
        }
        // seulement si les 4 joueurs sont selectionnes
        if(compteur == 4){
            $.ajax({
                type: 'POST',
                datatype: "json",
                url: '../PHP/CreationPartie.php'
            }).done(function(e){
                console.log(e);
                $("#waiting-room").css('display', 'none');
                $("#game-frame").css('display', 'block');
                affichageCarte();
            }).fail(function(e){
            });
        }
        else alert("Vous n'avez pas sélectionné 4 joueurs pour la partie");
    });
}


function gameLaunchedForPlayer(){
    // appel ajax pour vérifier qu'une partie a bien été créée et lancée pour changer l'affichage des joueurs
    $.ajax({
        method: 'POST',
        dataType : "json",          //
        url : '../JSON/mainJoueurs.json' //Script Cible
     }).done(function(e){
        for(let index in e){
            if(e[index]['username'] === pseudo && e[index]['connectedJSON'] !== ""){
                $("#waiting-room").css('display', 'none');
                $("#game-frame").css('display', 'block');
                ingame = true;
                url_partie = e[index]['connectedJSON'];
                affichageCarte();
                // Supprimer joueur de la waiting room
                $.ajax({
                    method : 'POST',
                    data : {"pseudo" : pseudo},
                    url : '../PHP/removePlayerofWaitingRoom.php'
                }).done(function(data){
                    console.log('done');
                }).fail(function(data){
                    console.log('fail');
                });
                clearInterval(testInterval);
            }
        }
     }).fail(function(e){
     });
}//

// fonction permettant d'afficher les cartes générées pour le joueur
function affichageCarte(){
    $.ajax({
        method: "GET",
        dataType : "json",
        url: url_partie,
        }).done(function(e) {
            $("#setJeux1").empty();
            for(let i = 0; i < 4; i ++){
                if(pseudo === e["joueurs"][i]['pseudo']){
                    $("#numero-equipe").empty();
                    $("#numero-equipe").append("Equipe "+e["joueurs"][i]['equipe']);
                    for(let pas = 0; pas < 5; pas++){
                        if(!(e['joueurs'][i]['cartes'][pas]['carteTapis'])){
                            var couleurCarte = e['joueurs'][i]['cartes'][pas]['Couleur'];
                            var valeurCarte = e['joueurs'][i]['cartes'][pas]['Valeur'];
                            var maDiv = document.createElement("div");
                            var monimg = document.createElement("img");
                            monimg.setAttribute("id",couleurCarte+"_"+valeurCarte);
                            monimg.setAttribute("draggable", true);
                            monimg.setAttribute("ondragstart",'drag(event)')
                            monimg.setAttribute("src","../ImagesCartes/"+couleurCarte+"_"+valeurCarte+".png");
                            maDiv.appendChild(monimg);
                            document.getElementById("setJeux1").appendChild(maDiv);  
                        } 
                    }
                }
            }
            
        }).fail(function(e) {
    });
}

// fonction si quelqu'un clique sur le bouton de fin de partie, celle-ci est arrêté
function endGame(){
    $.ajax({
        method: "POST",
        data : {"url" : url_partie},
        url: "../PHP/endGame.php",
    }).done(function(e){
        location.reload();
    }).fail(function(e){
    });
}

// fonction qui détermine si la partie est terminée
function gameFinished(){
    if(ingame){
        $.ajax({
            method : "POST",
            data : {"url" : url_partie},
            url: '../PHP/gameState.php',
        }).fail(function(e){
        }).done(function(data){
            // on vérfie que toutes les cartes ont été posées dans la tapis
            if(data === "true"){
                //appel ajax sur le json de la partie
                $.ajax({
                    method : "GET",
                    url: url_partie,
                }).fail(function(e){
                }).done(function(data){
                    var resultat = "";
                    // on recupere les points par team
                    var ptsEquipe1 = data['equipes'][0]['pointsTotal'];
                    var ptsEquipe2 = data['equipes'][1]['pointsTotal'];

                    if(ptsEquipe1 > ptsEquipe2){
                        resultat = "L'équipe 1 a gagné avec " + ptsEquipe1 + " points.";
                    }

                    else{
                        resultat = "L'équipe 2 a gagné avec " + ptsEquipe2 + " points.";
                    }
                    // et on affiche les gagnants
                    alert(resultat);
                    endGame();
                    location.reload();
                    url_partie = "";
                });
            }
        });
   }
}