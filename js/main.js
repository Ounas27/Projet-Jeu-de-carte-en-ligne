setInterval(majChat, 10);
playersRefresh(500);
var pseudo = "";
let players = Array();

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
    let t = $("#tapisJeux");
    let  maDiv = $("<div></div>");
    maDiv.append(d);
    t.append(maDiv);
}

function envoyerMessage(){
    //distributionCarte(); appeler cette fonction a un autre endroit
    let msg =$("#messageAEnvoyer").val();
    $.ajax({
        method: "POST",
        data : {"Message" : msg },
        url: "AjoutMsg.php"
        }).done(function(e) {
        }).fail(function(e) {
            console.log(e);
        });    
}

function majChat(){
    $.ajax({
        method: "GET",
        url: "../JSON/messageChat.json",
        }).done(function(e) {
        $("#messageCourant").empty();
        for(var donneeChat in e){
            let nomJoueur = e[donneeChat]["Joueur"];
            let msgJoueur = e[donneeChat]["Message"];
            $("#messageCourant").append(nomJoueur+" : "+msgJoueur+"<br>");
        }
        }).fail(function(e) {
            console.log('fail');
    });
}

function distributionCarte(){
    var myArray = ['../ImagesCartes/1_1.png', '../ImagesCartes/1_2.png', '../ImagesCartes/1_3.png', '../ImagesCartes/1_4.png', 
                    '../ImagesCartes/1_5.png', '../ImagesCartes/1_6.png', '../ImagesCartes/1_7.png', '../ImagesCartes/1_8.png', 
                    '../ImagesCartes/1_9.png', '../ImagesCartes/1_10.png', '../ImagesCartes/1_11.png', '../ImagesCartes/1_12.png', 
                    '../ImagesCartes/1_13.png','../ImagesCartes/2_1.png', '../ImagesCartes/2_2.png', '../ImagesCartes/2_3.png', 
                    '../ImagesCartes/2_4.png', '../ImagesCartes/2_5.png', '../ImagesCartes/2_6..png', '../ImagesCartes/2_7.png', 
                    '../ImagesCartes/2_8.png', '../ImagesCartes/2_9.png', '../ImagesCartes/2_10.png', '../ImagesCartes/2_11.png', 
                    '../ImagesCartes/2_12.png', '../ImagesCartes/2_13.png','../ImagesCartes/3_1.png', '../ImagesCartes/3_2.png', 
                    '../ImagesCartes/3_3.png', '../ImagesCartes/3_4.png', '../ImagesCartes/3_5.png', '../ImagesCartes/3_6.png', 
                    '../ImagesCartes/3_7.png', '../ImagesCartes/3_8.png', '../ImagesCartes/3_9.png', '../ImagesCartes/3_10.png', 
                    '../ImagesCartes/3_11.png', '../ImagesCartes/3_12.png', '../ImagesCartes/3_13.png','../ImagesCartes/4_1.png',
                    '../ImagesCartes/4_2.png', '../ImagesCartes/4_3.png', '../ImagesCartes/4_4.png', '../ImagesCartes/4_5.png', 
                    '../ImagesCartes/4_6.png', '../ImagesCartes/4_7.png', '../ImagesCartes/4_8.png', '../ImagesCartes/4_9.png', 
                    '../ImagesCartes/4_10.png', '../ImagesCartes/4_11.png', '../ImagesCartes/4_12.png', '../ImagesCartes/4_13.png'];
    var carteJ1=[];
    var carteJ2=[];
    var carteJ3=[];
    var carteJ4=[];
    var numJoueur="";
    
    for(var j = 0; j < 4; j++){
        if(j==0)
            numJoueur = "carteJ1";
        else if(j==1)
            numJoueur = "carteJ2";
        else if(j==2)
            numJoueur = "carteJ3";
        else
            numJoueur = "carteJ4";
        
        for(var i = 0; i < 5; i++){            
            var indexCarte = Math.floor(Math.random() * ((myArray.length)-1));
            eval(numJoueur).push(myArray[indexCarte]);
            myArray.splice(indexCarte,1);
        }
    }
    
    $.ajax({
        method: "POST",
        data : {"carteJ1" : carteJ1,
                "carteJ2" : carteJ2,
                "carteJ3" : carteJ3, 
                "carteJ4" : carteJ4},
        url: "../PHP/EnregistrerCarteJoueurs.php"
        }).done(function(e) {
        }).fail(function(e) {
            console.log(e);
        });
        document.getElementById("carte1").setAttribute("src", carteJ1[0]);
        document.getElementById("carte2").setAttribute("src", carteJ1[1]);
        document.getElementById("carte3").setAttribute("src", carteJ1[2]);
        document.getElementById("carte4").setAttribute("src", carteJ1[3]);
        document.getElementById("carte5").setAttribute("src", carteJ1[4]);
}

function playersRefresh(timeoutPeriod){
    setInterval(updatePlayers, timeoutPeriod);
    setInterval(actualisePlayerCurrentTime, timeoutPeriod); 
    setInterval(removePlayers, timeoutPeriod);                      
}

function actualisePlayerCurrentTime(){
    if(pseudo != ""){
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
    $(document).ready(function(){
    $.ajax({
        method: 'POST',
        dataType : "json",          //
        url : '../JSON/mainJoueurs.json' //Script Cible
     }).done(function(e){
        if(e != null){
            for(let index_player in e){
                let ligne = $("#listing-players #tr" + index_player);                
                if(ligne.length == 0){
                    players[index_player] = e[index_player];
                    $("#listing-players").append("<tr id='tr"+index_player+"'><td class='1'>"+ players[index_player]['username']+"</td><td class='2'>"+ players[index_player]['level'] + "</td><td class='3'><input id='checkbox"+ index_player +"'type='checkbox' value='"+ players[index_player]['username'] +"'</td></tr>");
                }
                else{
                    /*
                    if(document.getElementById("checkbox"+ index_player).checked){
                        if(e[index_player]['checkbox']==="false"){
                            $.ajax({
                                type: 'POST',
                                data:  { "box_checked": 'true', "pseudo" : e[index_player]['username']},        //La méthode cible (POST ou GET)
                                url : '../PHP/playerSelected.php' //Script Cible
                             }).done(function(e){
                                console.log(e);
                             }).fail(function(e){
                             });
                        }
                    }
                    else {
                        if(e[index_player]['checkbox']==="true"){
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
                    */
                    // if(document.getElementById("checkbox"+ index_player).checked && e[index_player]['checkbox']==="false"){
                    //     $.ajax({
                    //         type: 'POST',
                    //         data:  { "box_checked": 'true', "pseudo" : e[index_player]['username']},        //La méthode cible (POST ou GET)
                    //         url : '../PHP/playerSelected.php' //Script Cible
                    //      }).done(function(e){
                    //         console.log(e);
                    //      }).fail(function(e){
                    //      });   
                    // }
                    // else if(!(document.getElementById("checkbox"+ index_player).checked) && e[index_player]['checkbox']==="true"){
                    //     $.ajax({
                    //         type: 'POST',
                    //         data:  { "box_checked": 'false', "pseudo" : e[index_player]['username']},        //La méthode cible (POST ou GET)
                    //         url : '../PHP/playerSelected.php' //Script Cible
                    //      }).done(function(e){
                    //         console.log(e);
                    //      }).fail(function(e){
                    //      });   
                    // }
                }
            } 
            if($("#listing-players #btn-start-game").length == 0)
                $("#listing-players").append("<tr id='btn-start-game'><td><input type='submit' id='start-game' name='start-game' value='Commencer la partie' onclick='launchGame()'" + disabled +"></td></tr>");
            else{
                $("listing-players #btn-start-game").empty();
                $("listing-players #btn-start-game").append("<td><input type='submit' id='start-game' name='start-game' value='Commencer la partie' onclick='launchGame()'" + disabled +"></td>");
            }
        }
     }).fail(function(e){
        console.log(e);
     });
    });
}
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

function usernameExisted(name){
    for(let i = 0; i < players.length; i++){
        if(name === players[i]['username'])
            return true;
    }
    return false;
}

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
         console.log("ERROR");
     });
}

function launchGame(){
    $.ajax({
        type: 'POST',
        datatype: "json",
        url: '../PHP/game.php'
    }).done(function(e){
        $("#waiting-room").css('display', 'none');
        $("#game-frame").css('display', 'block');
    }).fail(function(e){
        console.log('fail');
    });
}