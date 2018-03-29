
var geoLocation;
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

//Create function that will clear entry fields upon clicking submit
function clear() {
    $("#date").empty();
    $("#activity").empty();
    $("#conf-number").empty();
  }

//Create click event function for entry form
$("#add-button").on("click", function(event){

var dateEntry = $("#date").val().trim();
var activityEntry = $("#activity").val().trim();


})

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
function DisplayMap (city) {
    this.geocoding = function(){
        //whatever the name is from the button that has been clicked
       var geocodingRequest =  "https://maps.googleapis.com/maps/api/geocode/json?address=" + city +"&key=AIzaSyD6ro8ednBUBnAeYhcjizzp3NvEqFCScNs";
        $.ajax({
            url: geocodingRequest,
            method: 'GET',
        }).then(function (response) {
        console.log(response)
           geoLocation = response.results[0].geometry.location;
           console.log(geoLocation)
        });
    }
  
    // this.mapDisplay = function(){
    //     function initMap() {
    //         var map = new google.maps.Map(document.getElementById('map'), {
    //           mapTypeControl: false,
    //           center: geoLocation,
    //           zoom: 13
    //         });
    
    //         new AutocompleteDirectionsHandler(map);
    //       }
    
         
    //       function AutocompleteDirectionsHandler(map) {
    //         this.map = map;
    //         this.originPlaceId = null;
    //         this.destinationPlaceId = null;
    //         this.travelMode = 'WALKING';
    //         var originInput = document.getElementById('origin-input');
    //         var destinationInput = document.getElementById('destination-input');
    //         var modeSelector = document.getElementById('mode-selector');
    //         this.directionsService = new google.maps.DirectionsService;
    //         this.directionsDisplay = new google.maps.DirectionsRenderer;
    //         this.directionsDisplay.setMap(map);
    
    //         var originAutocomplete = new google.maps.places.Autocomplete(
    //             originInput, {placeIdOnly: true});
    //         var destinationAutocomplete = new google.maps.places.Autocomplete(
    //             destinationInput, {placeIdOnly: true});
    
    //         this.setupClickListener('changemode-walking', 'WALKING');
    //         this.setupClickListener('changemode-transit', 'TRANSIT');
    //         this.setupClickListener('changemode-driving', 'DRIVING');
    
    //         this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    //         this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
    
    //         this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
    //         this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
    //         this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    //       }
    
    //       // Sets a listener on a radio button to change the filter type on Places
    //       // Autocomplete.
    //       AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
    //         var radioButton = document.getElementById(id);
    //         var me = this;
    //         radioButton.addEventListener('click', function() {
    //           me.travelMode = mode;
    //           me.route();
    //         });
    //       };
    
    //       AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
    //         var me = this;
    //         autocomplete.bindTo('bounds', this.map);
    //         autocomplete.addListener('place_changed', function() {
    //           var place = autocomplete.getPlace();
    //           if (!place.place_id) {
    //             window.alert("Please select an option from the dropdown list.");
    //             return;
    //           }
    //           if (mode === 'ORIG') {
    //             me.originPlaceId = place.place_id;
    //           } else {
    //             me.destinationPlaceId = place.place_id;
    //           }
    //           me.route();
    //         });
    
    //       }
    //     }
    
    //       AutocompleteDirectionsHandler.prototype.route = function() {
    //         if (!this.originPlaceId || !this.destinationPlaceId) {
    //           return;
    //         }
    //         var me = this;
    
    //         this.directionsService.route({
    //           origin: {'placeId': this.originPlaceId},
    //           destination: {'placeId': this.destinationPlaceId},
    //           travelMode: this.travelMode
    //         }, function(response, status) {
    //           if (status === 'OK') {
    //             me.directionsDisplay.setDirections(response);
    //           } else {
    //             window.alert('Directions request failed due to ' + status);
    //           }
    //         });
    //       };
    
    // }

}

var London = new DisplayMap("London").geocoding();

