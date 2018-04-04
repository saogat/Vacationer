var geoLocation;
var map;
var newCity;
var dbUserRef;

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

//Domain objects
//Vacationer constructor
function Vacationer(name, email, vacations = [], selectedVacation) {
    this.vacations = vacations;
    this.name = name;
    this.email = email;
    this.selectedVacation = selectedVacation;
    this.addVacation = function (vacation) {
        this.vacations.push(vacation);
    };
    this.deleteVacation = function (locationToDelete) {
        var vacationToDelete = this.vacations.find(function (each) {
            return each.location == locationToDelete
        });
        var index = this.vacations.indexOf(vacationToDelete);
        this.vacations.splice(index, 1);
        if (vacationToDelete == user.selectionVacation) {
            this.selectedVacation = null
        };
    }
    this.databaseObject = function () {
        var tempUser = {};
        tempUser.name = this.name;
        tempUser.email = this.email;
        tempUser.vacations = $.map(this.vacations, function (vacation) {
            return vacation.databaseObject();
        });
        return tempUser;
    }
}

//Vacation contructor
function Vacation(name, location, weatherData) {
    this.name = name,
        this.location = location,
        this.activities = [],
        this.weatherData = weatherData,
        this.addActivity = function (activity) {
            this.activities.push(activity);
        },
        this.deleteActivity = function (index) {
            this.activities.splice(index, 1);
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

//Activity constructor
function Activity(location, date, time, description, completed = false) {
    this.location = location,
        this.date = date,
        this.time = time,
        this.description = description,
        this.completed = completed,
        this.databaseObject = function () {
            tempActivity = {};
            tempActivity.location = this.location;
            tempActivity.date = this.date;
            tempActivity.time = this.time;
            tempActivity.description = this.description;
            tempActivity.completed = this.completed;
            return tempActivity;
        }
}

//Vacationers constructor
function Vacationers(users = []) {
    this.users = users;
    this.addUser = function (user) {
        this.users.push(user);
    }
    this.databaseObject = function () {
        var tempVacationers = {};
        tempVacationers.users = $.map(this.users, function (user) {
            return user.databaseObject();
        });
        return tempVacationers;
    }
}

//new Vacationer with name guest
var user = new Vacationer("guest", "guest@test.com");
var vacationers = new Vacationers();
vacationers.addUser(user);
var users = vacationers.databaseObject().users;

//Google signon
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var userDiv = $(".user");
    var userImage = $("<img>").attr("src", profile.getImageUrl());
    var userName = $("<p>").attr("id", "signon-id").text(profile.getName());
    userDiv.empty();
    userDiv.append(userImage);
    userDiv.append(userName);

    //set name on Vacationer
    user.name = profile.getName();
    user.email = profile.getEmail();
    retrieveFromDatabase();
}

//Function to clear entry fields upon clicking submit
function clearAdd() {
    $("#date").val("");
    $("#time").val("");
    $("#activity").val("");
}

function displayCityButtons() {
    //Click handler for physical button (Can delete when enter key works)
    //   $("#vacation-adder").on("click", function (event) {
    //     event.preventDefault();
    var tabsDiv = $(".tabs");
    tabsDiv.empty();
    user.vacations.forEach(function (vacation) {
        var newCity = vacation.location;
        var cityList = $("<li>");
        cityList.attr("class", "tab");
        var cityDiv = $("<div>");
        cityDiv.attr("class", "city-div");

        var cityLink = $("<button>");
        cityLink.attr("class", "a-tag");
        cityLink.attr("id", newCity);

        //Delete button
        var deleteButton = $("<button>");
        cityDiv.append(deleteButton);
        deleteButton.text("✗");
        deleteButton.addClass("close");

        //Set the text on the city button
        cityLink.text(newCity);

        cityDiv.append(cityLink);
        cityList.append(cityDiv);
        tabsDiv.append(cityList);
    })
}

//Delete Vacation City
$(document).on("click", ".close", function (event) {
    user.deleteVacation();
    saveToDatabase();
    displayCityButtons();
});

//show activity list for the selected vacation 
function showActivities(activities) {
    var dateButtons = $("#date-buttons");
    var toDoDiv = $("#to-do-list");
    var timeButtons = $("#time-buttons");
    dateButtons.empty();
    timeButtons.empty();
    toDoDiv.empty();

    var i = 0;
    activities.forEach(function (activity) {

        //show activity date and time
        var dateDiv = $("<div>");
        dateDiv.append($("<p>").text(activity.date));
        dateButtons.append(dateDiv);

        //show activity time
        var timeDiv = $("<div>");
        timeDiv.append($("<p>").text(activity.time));
        timeButtons.append(timeDiv);

        //show activity description
        var activityDiv = $("<div>");
        activityDiv.attr("id", "item-" + i);
        activityP = $("<p>").text(" " + activity.description);
        activityDiv.append(activityP);
        toDoDiv.append(activityDiv);

        //add delete button
        var deleteButton = $("<button>");
        deleteButton.attr("data-to-do", i);
        deleteButton.addClass("checkbox");
        deleteButton.append("✓");
        activityP.prepend(deleteButton);

    });
};

function deleteActivity(activityNumber) {
    user.selectedVacation.deleteActivity(activityNumber);
    saveToDatabase();
}

function Weather(location, temperature, min, max, humidity, description, image) {
    this.location = location;
    this.temperature = temperature;
    this.min = min;
    this.max = max;
    this.humidity = humidity;
    this.description = description;
    this.image = image;
}

//Weather Data Display
function getImageToDisplay(data) {
    if (data.hasOwnProperty('weather')) {
        var result = "clear.png"; //default
        data.weather.forEach(function (weather) {
            if (weather.main.includes('clouds') || weather.main.includes('cloud') || weather.description.includes('clouds') || weather.description.includes('cloud')) {
                result = "cloudy.png";
            }
            if (weather.main.includes("rain") || weather.description.includes('rain')) {
                result = "rainy.png";
            }
            if (weather.main.includes("sun") || weather.description.includes('sun')) {
                result = "sunny.png";
            }
            if (weather.main.includes("snow") || weather.description.includes('snow')) {
                result = "snow.png";
            }
        });
        return result;
    } else {
        return "undefined.png";
    }
}

//get weather from Weather API
var getWeather = function (vacation) {
    if (typeof vacation == "object") {
        var url = "https://api.openweathermap.org/data/2.5/forecast?";
        url += "APPID=e059918f7e48a37962d40029f4db4443";
        url += "&q=";
        url += vacation.location;
        url += "&units=imperial";
        $.ajax({
            url: url,
            method: 'GET',
        }).done(function (response) {
            var weatherData = [];
            for (var i = 0; i < 5; i++) {
                var eachWeatherData = response.list[i + 3];
                var weather = new Weather(
                    vacation.location,
                    eachWeatherData.main.temp,
                    eachWeatherData.main.temp_min,
                    eachWeatherData.main.temp_max,
                    eachWeatherData.main.humidity,
                    eachWeatherData.weather[0].description,
                    getImageToDisplay(eachWeatherData)
                );
                // console.log(weather);
                weatherData.push(weather);
            };
            // console.log(weather);
            vacation.weatherData = weatherData;
            renderWeatherData(user.selectedVacation);
        });
    }
}

function renderWeatherData(vacation) {
    try {
        $('.currentWeather').attr('src', './assets/images/weather/' + vacation.weatherData[0].image);
        $('.temp').text(vacation.weatherData[0].temperature + "°F");
        $('.description').text(vacation.weatherData[0].description);
        $('.humidity').text(vacation.weatherData[0].humidity + "%");
        $('.MaxAndMin').text("H" + vacation.weatherData[0].max + '° / L' + vacation.weatherData[0].min + "°");
        $('.city').text(vacation.weatherData[0].location);
    } catch (e) {
        console.log('Could not display data:' + e);
    }
}

function updateDisplay() {
    if (user.selectedVacation) {
        showActivities(user.selectedVacation.activities);
        getWeather(user.selectedVacation);
        pixabayAPI(user.selectedVacation.location);
        geoCoding(user.selectedVacation.location);
    }
}

//Create click event function for city input bar
// Execute a function when the user releases a key on the keyboard
$("#city-input").on("keyup", function (event) {
    // Cancel the default action, if needed
    event.preventDefault();

    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Trigger the button element with a click
        $("#vacation-adder").click();

        //Get the vacation city
        var cityInput = $("#city-input");
        newCity = cityInput.val().trim();

        //Create new Vacation instance based on newCity
        var vacation = new Vacation(newCity, newCity, []);
        user.addVacation(vacation);
        user.selectedVacation = vacation;

        displayCityButtons();
        updateDisplay();

        //clear city-input
        $("#city-input").val("");

    }
});

function saveToDatabase() {
    if (dbUserRef) {
        removeDbUser();
    };
    dbUserRef = firebase.database().ref('users').push(JSON.parse(JSON.stringify(user)));
  }

function retrieveFromDatabase() {
    var ref = firebase.database().ref("users");

    ref.once("value", function (snapshot) {
        var dbUsers = [];
        snapshot.forEach(function (childSnapshot) {
            dbUsers.push(childSnapshot);
        });
        // console.log(dbUsers);
        if (dbUsers) {
            var dbUserS = dbUsers.find(function (each) {
                return each.val().email == user.email;
            });

            if (dbUserS) {
                var dbUser = dbUserS.val();
                // console.log(dbUser);
                if (dbUser.vacations) {
                    dbUser.vacations.forEach(function (dbVacation) {
                        var vacation = new Vacation(dbVacation.location, dbVacation.location, []);
                        if (dbVacation.activities) {
                            dbVacation.activities.forEach(function (dbActivity) {
                                var activity = new Activity(dbActivity.location, dbActivity.date, dbActivity.time, dbActivity.description, dbActivity.completed);
                                vacation.addActivity(activity);
                            });
                        };
                        user.addVacation(vacation);
                    });
                    user.selectedVacation = user.vacations[0];
                    displayCityButtons();
                    updateDisplay();
                    console.log(user);
                }
                dbUserRef = dbUserS.ref;
            }
        }
    })

}

function removeDbUser() {
    dbUserRef.remove()
        .then(function () {
            return true;
        })
        .catch(function (error) {
            return false;
        });
}

//Create click event function for activity entry form
$("#add-button").on("click", function (event) {
    event.preventDefault();
    var dateEntry = $("#date").val().trim();
    var timeEntry = $("#time").val().trim();
    var activityEntry = $("#activity").val().trim();
    if ((dateEntry != "") && (activityEntry != "" && (timeEntry != "")) && (user.selectedVacation)) {

        var activity = new Activity(user.selectedVacation.location, dateEntry, timeEntry, activityEntry, false);
        user.selectedVacation.addActivity(activity);

        showActivities(user.selectedVacation.activities);
        clearAdd();
        saveToDatabase();
    }
})

//delete activity
$("#to-do-list").on("click", ".checkbox", function (event) {
    event.preventDefault();
    var toDoNumber = $(this).attr("data-to-do");
    deleteActivity(user, toDoNumber);
    $("#item-" + toDoNumber).remove();
    showActivities(user.selectedVacation.activities);
    saveToDatabase();
})

//get map from Google API
function geoCoding(city) {
    //whatever the name is from the button that has been clicked
    var geocodingRequest = "https://maps.googleapis.com/maps/api/geocode/json?address=";
    geocodingRequest += city;
    geocodingRequest += "&key=AIzaSyD6ro8ednBUBnAeYhcjizzp3NvEqFCScNs";
    $.ajax({
        url: geocodingRequest,
        method: 'GET',
    }).then(function (response) {
        geoLocation = response.results[0].geometry.location;
        mapSetCenter(geoLocation);
    });
}

//select a vacation city
$(".tabs").on("click", "button", function (event) {
    event.preventDefault();
    var city = $(this).text();
    user.selectedVacation = user.vacations.find(function (each) {
        return each.location == city;
    });
    updateDisplay();
});

//set the center of the city in Google Map
function mapSetCenter() {
    if (map !== undefined && typeof map === "object") {
        map.setCenter(geoLocation);
    } else {
        mapSetCenter();
    }
}