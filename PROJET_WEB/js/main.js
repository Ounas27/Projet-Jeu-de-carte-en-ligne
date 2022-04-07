var pseudo = "";
let players = new Array();

$(document).ready(function(){
    playersRefresh(500);
});

function playersRefresh(timeoutPeriod){
    setInterval(updatePlayers, timeoutPeriod);
    //setInterval(actualisePlayerCurrentTime, timeoutPeriod);
    setInterval(launchGame, timeoutPeriod * 2);   
    //setInterval(removePlayers, timeoutPeriod);                      
}

function actualisePlayerCurrentTime(){
    if(pseudo != ""){
        $.ajax({
            type: 'POST',
            data:  {"nom":pseudo },        //La méthode cible (POST ou GET)
            url : './PHP/actualizeTime.php' //Script Cible
         }).done(function(e){
    
         }).fail(function(e){
         });
    }
}

function updatePlayers(){
    let disabled = "";
    numberPlayers = 0;
    $(document).ready(function(){
    $.ajax({
        method: 'POST',
        dataType : "json",          //La méthode cible (POST ou GET)
        url : './js/players.json' //Script Cible
     }).done(function(e){ 
        $("#listing-players").empty();
        for(let player in e){
            if(!usernameExisted(e[player]['username']))
                players[player] = e[player];
        }
        for(let player in players){
            if(players[player]['connected'] === "1")   
                numberPlayers += 1   ;
            $("#listing-players").append("<tr id='player-inlist'><td>"+ players[player]['username']+"</td><td>"+ players[player]['level'] + "</td></tr>");
        }
        if(numberPlayers < 4){
            disabled = "disabled";
            $("#username-i").prop("disabled", false);
            $("#levels-sel").prop("disabled", false);
            $("#start-game").prop("disabled", false);
        }
        else if(numberPlayers == 4){
            $("#username-i").prop("disabled", true);
            $("#levels-sel").prop("disabled", true);
            $("#start-game").prop("disabled", true);
        }
        $("#listing-players").append("<tr id='btn-start-game'><td><form action='./PHP/game.php/?gameState=true' method='post'><input type='submit' id='start-game' name='start-game' value='Commencer la partie'" + disabled +"></form></td></tr>");
     }).fail(function(e){

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
                url : './PHP/players.php' //Script Cible
             }).done(function(e){
             }).fail(function(e){
             });
             $("#username-i").val('');
             $("#levels-sel").val('');
            time = null;
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
        url : './PHP/removePlayer.php' //Script Cible
     }).done(function(e){
         console.log(e);
     }).fail(function(e){
     });
}

function launchGame(){
    $.ajax({
        type: 'POST',
        datatype: "json",
        url: './PHP/redirectPlayerstoGame.php'
    }).done(function(e){
        if(e === "true")
            window.location = "./PHP/game.php";
    }).fail(function(e){
    });
}

