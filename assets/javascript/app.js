var geoLocation;
var map;
var newCity;


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

    newCity = $("#city-input").val().trim();
    console.log("City: " + newCity);

    var cityList = $("<li>");
    var cityLink = $("<a>");
    cityList.attr("class", "tab");
    cityLink.attr("id", newCity)
    cityLink.text(newCity)
    $(cityList).append(cityLink)
    $(".tabs-transparent").append(cityList);

    //Create click event for newly created buttons

    $("#" + newCity).on("click", function (event){
        console.log("Clicked: " + newCity);

    })

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

function retrieveFromDatabase() {
    database.ref().on("value", function(snapshot) {


      // Print the initial data to the console.
      console.log(snapshot.val());

    //   // Log the value of the various properties
    //   console.log(snapshot.val().name);
    //   console.log(snapshot.val().age);
    //   console.log(snapshot.val().phone);

      // Change the HTML
    //   $("#displayed-data").text(snapshot.val().name + " | " + snapshot.val().age + " | " + snapshot.val().phone);

      // If any errors are experienced, log them to console.
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });


}

retrieveFromDatabase();


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

function geoCoding(city) {
    //whatever the name is from the button that has been clicked
    var geocodingRequest = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + "&key=AIzaSyD6ro8ednBUBnAeYhcjizzp3NvEqFCScNs";
    $.ajax({
        url: geocodingRequest,
        method: 'GET',
    }).then(function (response) {
        geoLocation = response.results[0].geometry.location;
        console.log(geoLocation);
        mapSetCenter(geoLocation);
    });
}

$(document).on("click", ".tab", function () {
    geoCoding(newCity);
});

function mapSetCenter() {

    if (map !== undefined && typeof map === "object") {
        map.setCenter(geoLocation);
    } else {
        mapSetCenter();
    }

    // or we can run this  checkLoop:

    // try {
    //     map.setCenter(geoLocation);
    // } catch (error) {
    //     console.log(error);
    //     mapSetCenter();
    // }

}

function initAutocomplete() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 33.7489954, lng: -84.3879824 },
        zoom: 13,
        mapTypeId: 'roadmap'
    });
    console.log(map);
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}



