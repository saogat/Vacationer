

//Create vacations array to push new vacations

//Push activities to vacation

//Create object contructor for vacation
function Vacation (name, location) {
    this.name = name,
    this.location = location,
    this.activities = [],
    this.addActivity = function (activity){
        this.activities.push(activity);
    }
};

//Create object constructor for activity
function Activity (location, date, description, completed) {
    this.location = location;
    this.date = date;
    this.description = description;
    this.completed = completed
}

//Placeholder for new vacation name and location
var vacation = new Vacation("Paris", "Paris");

//Console log vacation
console.log(vacation);

//Create function that will clear entry fields upon clicking submit
// function clear() {
//     $("#date").empty();
//     $("#activity").empty();
//     $("#conf-number").empty();
//   }

// //Create click event function for entry form
// $("#add-button").on("click", function(event){

// var dateEntry = $("#date").val().trim();
// var activityEntry = $("#activity").val().trim();




// });

var weatherData = [];

$(".tab").on("click", function (event) {
    event.preventDefault();

    console.log("clicked on vacation city tab");
    // add info about vacation city - mexico city

    addActivity();

});

//add vacation tab
function addVacation() {

}

//add activity to the vacation 
function addActivity() {

    $("#to-dos").append($("<p>").text("test"));

    // ("<p>Checkin into hotel</p>");
    console.log("adding activity");

};


function Weather(location, temperature, min, max, humidity, description) {
    this.location = location;
    this.temperature = temperature;
    this.min = min;
    this.max = max;
    this.humidity = humidity;
    this.description = description;
}

 //get weather from Weather API
var getWeather = function (location) {
    var url = "http://api.openweathermap.org/data/2.5/forecast?";
    url += "APPID=e059918f7e48a37962d40029f4db4443";
    url += "&q=";
    url += location;
    url += "&units=imperial";
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function (response) {
        
        for(var i=0; i<5; i++){
            var eachWeatherData = response.list[i+3];
            var weather = new Weather(
                location, 
                eachWeatherData.main.temp, 
                eachWeatherData.main.temp_min,
                eachWeatherData.main.temp_max,
                eachWeatherData.main.humidity,
                eachWeatherData.weather[0].description);
                weatherData.push(weather);
        }

        // response.list.forEach(function(eachWeatherData){
        //     var weather = new Weather(
        //         location, 
        //         eachWeatherData.main.temp, 
        //         eachWeatherData.main.temp_min,
        //         eachWeatherData.main.temp_max,
        //         eachWeatherData.main.humidity,
        //         eachWeatherData.weather[0].description);
        //         weatherData.push(weather);
        // });
    });
};

getWeather("London,UK");
console.log(weatherData);

//get map from Google API
function getMap() {
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function (response) {

    });

};

