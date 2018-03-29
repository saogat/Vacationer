var map = {

};

var weather = {

};

function weather(city){

};
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

