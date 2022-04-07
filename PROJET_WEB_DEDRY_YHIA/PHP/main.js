setInterval(majChat, 10);

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
    distributionCarte();
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
        url: "./JSON/messageChat.json",
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
    var myArray = ['./ImagesCartes/1_1.png', './ImagesCartes/1_2.png', './ImagesCartes/1_3.png', './ImagesCartes/1_4.png', 
                    './ImagesCartes/1_5.png', './ImagesCartes/1_6.png', './ImagesCartes/1_7.png', './ImagesCartes/1_8.png', 
                    './ImagesCartes/1_9.png', './ImagesCartes/1_10.png', './ImagesCartes/1_11.png', './ImagesCartes/1_12.png', 
                    './ImagesCartes/1_13.png','./ImagesCartes/2_1.png', './ImagesCartes/2_2.png', './ImagesCartes/2_3.png', 
                    './ImagesCartes/2_4.png', './ImagesCartes/2_5.png', './ImagesCartes/2_6.png', './ImagesCartes/2_7.png', 
                    './ImagesCartes/2_8.png', './ImagesCartes/2_9.png', './ImagesCartes/2_10.png', './ImagesCartes/2_11.png', 
                    './ImagesCartes/2_12.png', './ImagesCartes/2_13.png','./ImagesCartes/3_1.png', './ImagesCartes/3_2.png', 
                    './ImagesCartes/3_3.png', './ImagesCartes/3_4.png', './ImagesCartes/3_5.png', './ImagesCartes/3_6.png', 
                    './ImagesCartes/3_7.png', './ImagesCartes/3_8.png', './ImagesCartes/3_9.png', './ImagesCartes/3_10.png', 
                    './ImagesCartes/3_11.png', './ImagesCartes/3_12.png', './ImagesCartes/3_13.png','./ImagesCartes/4_1.png',
                    './ImagesCartes/4_2.png', './ImagesCartes/4_3.png', './ImagesCartes/4_4.png', './ImagesCartes/4_5.png', 
                    './ImagesCartes/4_6.png', './ImagesCartes/4_7.png', './ImagesCartes/4_8.png', './ImagesCartes/4_9.png', 
                    './ImagesCartes/4_10.png', './ImagesCartes/4_11.png', './ImagesCartes/4_12.png', './ImagesCartes/4_13.png'];
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
        url: "EnregistrerCarteJoueurs.php"
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