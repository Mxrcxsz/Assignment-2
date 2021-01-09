var path = window.location.pathname;
var page = path.split("/").pop();

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('#right-nav')

menu.addEventListener('click', function(){
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
    if(menuLinks.className == "active"){
        $('header').css("box-shadow","none");
    }
    else{
        $('header').css("box-shadow","2px 1px 9px rgb(10, 16, 26)");
        $('header').css("transition","all 0.5s ease");
    }
})

// All Map API
// Class for hdb carpark details
class Geo {
    constructor(lat, lng) {
      this.lat = lat;
      this.lng = lng;
    }
}

function get_carpark_details(){
    $.ajax({
        url: 'https://api.jsonbin.io/b/5ff45d9709f7c73f1b6df03d',
        type: "GET", //send it through GET method
        headers: {
            "content-type":"application/json",
            "secret-key":"$2b$10$U32F5.Qe7ErRiSaybhPmd.XQ8oikTg4jGxtm0x3zN23lMpohizeva"
        },
        success: function(data) {
            console.log(data);
        }
    });
}
const proxyurl = "https://stark-chamber-98383.herokuapp.com/";

function get_carpark_nearby(lat, long, radius){
    $.ajax({
        url: proxyurl + 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
        type: "GET", //send it through GET method
        headers: {
            "Access-Control-Allow-Origin": '*'
        },
        data: {
            "location":lat + "," + long,
            "radius":radius,
            "types":"parking",
            "key":"AIzaSyAaDnggQoyZ9Rv8U6nwIq-iQ0gNtSswlzg"
        },
        success: function(data) {
            console.log(data);
        }
    });
    var response = JSON.parse(localStorage.getItem("temp-data"));
    localStorage.clear();
    return response;
}

function search_place(input){
    $.ajax({
        url: proxyurl + 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
        type: "GET", //send it through GET method
        async: false,
        headers: {
            "Access-Control-Allow-Origin": '*'
        },
        data: {
            "input":input,
            "inputtype":"textquery",
            "key":"AIzaSyAaDnggQoyZ9Rv8U6nwIq-iQ0gNtSswlzg"
        },
        success: function(place_id) {
            localStorage.setItem("temp-data", JSON.stringify(place_id));
        }
    });
    var response = JSON.parse(localStorage.getItem("temp-data"));
    localStorage.clear();
    return response;
}

// console.log(search_place("Bukit Batok"))

function getPlaceGeo(placeId){
    $.ajax({
        url: proxyurl + 'https://maps.googleapis.com/maps/api/place/details/json',
        type: "GET", //send it through GET method
        headers: {
            "Access-Control-Allow-Origin": '*'
        },
        data: {
            "place_id":placeId,
            "fields":"geometry",
            "key":"AIzaSyAaDnggQoyZ9Rv8U6nwIq-iQ0gNtSswlzg"
        },
        success: function(data) {
            localStorage.setItem("temp-data", JSON.stringify(place_id));
        },
        error: function(xhr, status, error){
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage);
        }
    });
    var response = JSON.parse(localStorage.getItem("temp-data"));
    localStorage.clear();
    return response;
}

document.getElementById("search-loc-btn").addEventListener("click", function(){
    // console.log(search_place($("#search-loc").val()).candidates[0]);
    $.ajax({
        url: proxyurl + 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
        type: "GET", //send it through GET method
        async: false,
        headers: {
            "Access-Control-Allow-Origin": '*'
        },
        data: {
            "input":$("#search-loc").val(),
            "inputtype":"textquery",
            "key":"AIzaSyAaDnggQoyZ9Rv8U6nwIq-iQ0gNtSswlzg"
        },
        success: function(place_id) {
            $.ajax({
                url: proxyurl + 'https://maps.googleapis.com/maps/api/place/details/json',
                type: "GET", //send it through GET method
                headers: {
                    "Access-Control-Allow-Origin": '*'
                },
                data: {
                    "place_id":place_id.candidates[0].place_id,
                    "fields":"geometry",
                    "key":"AIzaSyAaDnggQoyZ9Rv8U6nwIq-iQ0gNtSswlzg"
                },
                success: function(data) {
                    // const lat = data.result.geometry.location.lat;
                    // const lng = data.result.geometry.location.lng;
                    console.log(data.result.geometry.location);
                    latLng = new google.maps.LatLng(1.3591, 103.8198)
                    new google.maps.Marker({
                        position: latLng,
                        map: map
                    });
                },
                error: function(xhr, status, error){
                    var errorMessage = xhr.status + ': ' + xhr.statusText
                    alert('Error - ' + errorMessage);
                }
            });
        }
    });
});