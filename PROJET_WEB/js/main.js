$(document).ready(function(){
    playersRefresh(500);
});
var pseudo;
function playersRefresh(timeoutPeriod){
    setInterval(updatePlayers, timeoutPeriod);
    setInterval(actualisePlayerCurrentTime, timeoutPeriod);                         
}

function actualisePlayerCurrentTime(){
    let current = new Date();
    let time = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    if(pseudo != ""){
        $.ajax({
            type: 'POST',
            data:  {"nom":pseudo, "newCurrentTime": time },        //La méthode cible (POST ou GET)
            url : './PHP/actualizeTime.php' //Script Cible
         }).done(function(e){
    
         }).fail(function(e){
         });
    }
}

function updatePlayers(){
    let numberPlayers = 0;
    let disabled;
    $(document).ready(function(){
    $.ajax({
        method: 'GET',
        dataType : "json",          //La méthode cible (POST ou GET)
        url : './js/players.json' //Script Cible
     }).done(function(e){ 
        $("#listing-players").empty();
        for(let player in e){
            if(e[player]['connected'] == 1)
                numberPlayers += 1;
            $("#listing-players").append("<tr id='player-inlist'><td>"+ e[player]['username']+"</td><td>"+ e[player]['level'] + "</td></tr>");
        }
        if(numberPlayers == 4)
            disabled = "";
        else
            disabled = "disabled";
        $("#listing-players").append("<tr id='btn-start-game'><td><input type='submit' id='start-game' name='start-game' value='Commencer la partie'" + disabled + "></td></tr>")
     }).fail(function(e){

     });
    });
}
function addPlayer(){
    pseudo = $("#username-i").val();
    let niveau = $("#levels-sel").val();
    let current = new Date();
    let time =current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    if(pseudo !== ""){
        $.ajax({
            type: 'POST',
            data:  { "pseudo": pseudo, "niveau": niveau, "currentTime": time },        //La méthode cible (POST ou GET)
            url : './PHP/players.php' //Script Cible
         }).done(function(e){
            $("#listing-players").append("<tr id='player-inlist'><td>"+ pseudo +"</td><td>"+ niveau + "</td></tr>");
            console.log("sucess");
         }).fail(function(e){
         });
    }
}


function removePlayer(){
    if(pseudo !== ""){
        $.ajax({
            type: 'POST',
            data:  { "pseudo-remove": pseudo},        //La méthode cible (POST ou GET)
            url : './PHP/removePlayer.php' //Script Cible
         }).done(function(e){
             console.log("success");
         }).fail(function(e){
             console.log("fail");
         });
    }
}


