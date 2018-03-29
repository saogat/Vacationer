
//Global variable object
function Vacationer (name, password, vacations) {
    this.vacations = vacations;
    this.name = name;
    this.password = password;
    this.addVacation = function (vacation){
        this.vacations.push(vacation);
    }
}

//Push activities to vacation

//Create object contructor for vacation
function Vacation (name, location, weatherData) {
    this.name = name,
    this.location = location,
    this.activities = [],
    this.weatherData = weatherData,
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

//Create click event function for activity entry form
$("#add-button").on("click", function(event){
    event.preventDefault();

    var dateEntry = $("#date").val().trim();
    var activityEntry = $("#activity").val().trim();
    
    console.log("Date: " + dateEntry);
    console.log("Activity: " + activityEntry);

});

// WEATHER API

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
var getWeather = function (vacation) {
    var url = "http://api.openweathermap.org/data/2.5/forecast?";
    url += "APPID=e059918f7e48a37962d40029f4db4443";
    url += "&q=";
    url += vacation.location;
    url += "&units=imperial";
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function (response) {
        
        for(var i=0; i<5; i++){
            var eachWeatherData = response.list[i+3];
            var weather = new Weather(
                vacation.location, 
                eachWeatherData.main.temp, 
                eachWeatherData.main.temp_min,
                eachWeatherData.main.temp_max,
                eachWeatherData.main.humidity,
                eachWeatherData.weather[0].description);
                vacation.weatherData.push(weather);
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

var shannon = new Vacationer("Shannon", "", []);
var parisVacation = new Vacation("Paris", "Paris, France", []);
shannon.addVacation(parisVacation);


getWeather(shannon.vacations[0]);
console.log(shannon.vacations);

//get map from Google API
function getMap() {
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function (response) {

    });

};

