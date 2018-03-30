var geoLocation;


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCoa07mzxgyQ4VxmxNoMv4Q-MEhE3xBcW4",
    authDomain: "vacationer-d8bc1.firebaseapp.com",
    databaseURL: "https://vacationer-d8bc1.firebaseio.com",
    projectId: "vacationer-d8bc1",
    storageBucket: "vacationer-d8bc1.appspot.com",
    messagingSenderId: "202337803549"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

//Global variable object
function Vacationer(name, password, vacations, selectedVacation) {
    this.vacations = vacations;
    this.name = name;
    this.password = password;
    this.addVacation = function (vacation) {
        this.vacations.push(vacation);
    };
    this.selectedVacation = selectedVacation;
    this.databaseObject = function () {
        var tempUser = {};
        tempUser.name = this.name;
        tempUser.password = this.password;
        tempUser.vacations = $.map(this.vacations, function (vacation) {
            return vacation.databaseObject();
        });
        return tempUser;
    }
}

//Create object contructor for vacation
function Vacation(name, location, weatherData) {
    this.name = name,
        this.location = location,
        this.activities = [],
        this.weatherData = weatherData,
        this.addActivity = function (activity) {
            this.activities.push(activity),
                this.deleteActivity = function (activity, index) {
                    this.activities.splice(index, 1);
                }
        },
        this.databaseObject = function () {
            var tempVacation = {};
            tempVacation.location = this.location;
            tempVacation.activities = $.map(this.activities, function (activity) {
                return activity.databaseObject();
            });
            return tempVacation;
        }
};

//Create object constructor for activity
function Activity(location, date, description, completed) {
    this.location = location,
        this.date = date,
        this.description = description,
        this.completed = completed,
        this.databaseObject = function () {
            tempActivity = {};
            tempActivity.location = this.location;
            tempActivity.date = this.date;
            tempActivity.description = this.description;
            tempActivity.completed = this.completed;
            return tempActivity;
        }
}

//Create function that will clear entry fields upon clicking submit
function clearAdd() {
    $("#date").val("");
    $("#activity").val("");
}

//Create click event function for city input bar
$("#vacation-adder").on("click", function (event) {
    event.preventDefault();

    var newCity = $("#city-input").val().trim();
    console.log("City: " + newCity);

    var cityButton = $("<li>");
    cityButton.attr("class", "tab");
    cityButton.text(newCity)
    $(".tabs-transparent").append(cityButton);

});

//show activity list for the selected vacation 
function showActivities(activities) {
    var dateButtons = $("#date-buttons");
    var toDoDiv = $("#to-do-list");
    dateButtons.empty();
    toDoDiv.empty();

    var i = 0;
    activities.forEach(function (activity) {

        //show activity date
        var dateDiv = $("<div>");

        dateDiv.append($("<p>").text(activity.date));
        dateButtons.append(dateDiv);
        console.log(activity.date);

        //show activity description
        var activityDiv = $("<div>");
        activityDiv.attr("id", "item-" + i);
        activityP = $("<p>").text(" " + activity.description);
        activityDiv.append(activityP);
        toDoDiv.append(activityDiv);
        console.log(activity.description);

        //add delete button
        var deleteButton = $("<button>");
        deleteButton.attr("data-to-do", i);
        deleteButton.addClass("checkbox");
        deleteButton.append("✓");
        activityP.prepend(deleteButton);

    });
};

function deleteActivity(user, activityNumber) {
    user.selectedVacation.deleteActivity(activityNumber);
}

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

        for (var i = 0; i < 5; i++) {
            var eachWeatherData = response.list[i + 3];
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

var user = new Vacationer("John Doe", "", []);
var parisVacation = new Vacation("Paris", "Paris, France", []);
user.addVacation(parisVacation);
user.selectedVacation = parisVacation;
getWeather(user.vacations[0]);

function saveToDatabase() {
    database.ref().set(
        user.databaseObject()
    );
}

console.log(user.databaseObject());
console.log(user);


//Create click event function for entry form
$("#add-button").on("click", function (event) {
    event.preventDefault();
    var dateEntry = $("#date").val().trim();
    var activityEntry = $("#activity").val().trim();
    if ((dateEntry != "") && (activityEntry != "")) {
        var activity = new Activity(user.selectedVacation.location, dateEntry, activityEntry, false);
        user.selectedVacation.addActivity(activity);
        showActivities(user.selectedVacation.activities);
        clearAdd();
        saveToDatabase();
    }

})

$("#to-do-list").on("click", ".checkbox", function () {
    var toDoNumber = $(this).attr("data-to-do");
    deleteActivity(user, toDoNumber);
    $("#item-" + toDoNumber).remove();
    showActivities(user.selectedVacation.activities);
    console.log(user.selectedVacation.activities);
    console.log(user);
    saveToDatabase();
})


//get map from Google API
function DisplayMap(city) {
    this.geocoding = function () {
        //whatever the name is from the button that has been clicked
        var geocodingRequest = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyD6ro8ednBUBnAeYhcjizzp3NvEqFCScNs";
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