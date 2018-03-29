
$(".tab").on("click", function(event){
    event.preventDefault();

    console.log("clicked on vacation city tab");
    // add info about vacation city - mexico city

    addActivity();

});

//add vacation tab
function addVacation(){
    
}

//add activity to the vacation 
function addActivity(){

    $("#to-dos").append($("<p>").text("test"));
        
       // ("<p>Checkin into hotel</p>");
    console.log("adding activity");

};


//get map from Google API
function getMap(){
$.ajax({
    url: url,
    method: 'GET',
}).done(function (response) {

});

};


//get weather from Weather API
function getWeather(){
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function (response) {
    
    });
    
    };