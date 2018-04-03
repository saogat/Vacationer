//Pixabay Photo API
function pixabayAPI(city) {

    var pixURL = "https://pixabay.com/api/?q=" + city + "&image_type=photo&category=places&orientation=horizontal&safesearch=true&order=popular&key=8561959-695370e3d9d8574348bbe6f72"

    $.ajax({
        url: pixURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        // for(i = 0; i < response.hits.length; i++){
        var imageURL = response.hits[0].webformatURL;
        console.log("ImageURL " + imageURL);
        newImage = $("<img>");
        $(newImage).attr("src", imageURL);
        $(newImage).attr("width", 500)
        $(newImage).attr("id", "city-pic")
        $("#photo-feed").html(newImage);
    });
}