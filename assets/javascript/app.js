var map = {

};

var weather = {

};

function weather(city){

};

function Vacation (name, location) {
    this.name = name;
    this.location=location;
    this.activities=[];
    this.addActivity = function (activity){
        this.activities.push(activity);
    }
};

function Activity (location, date, description, completed) {
    this.location = location;
    this.date = date;
    this.description = description;
    this.completed = completed
}

var vacation = new Vacation("Paris", "Paris");

console.log(vacation);

$("#add-button").click()

