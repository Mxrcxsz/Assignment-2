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
}

class Geo {
    constructor(lat, lng) {
      this.lat = lat;
      this.lng = lng;
    }
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
            searchedGeo.lat = place_id;
        }
    });
    console.log(searchedGeo.lat);
}

// input = "ChIJV8PyBkca2jERdGrR750ygBo";

// var params = JSON.stringify({
//     "input":input,
//     "inputtype":"textquery",
//     "key":"AIzaSyAaDnggQoyZ9Rv8U6nwIq-iQ0gNtSswlzg"
// });

// function ajax(a, b, e, d, c){ // URL, callback, method, formdata or {key:val},placeholder
//     c = new XMLHttpRequest;
//     c.open(e||'get', a);
//     c.onload = b;
//     c.send(d||null)
// }
// function callback(e){
//     console.log(this.response);
// }
// var fd = new FormData();
// fd.append('input', input);
// fd.append('inputtype', "textquery");
// fd.append('key', "AIzaSyAaDnggQoyZ9Rv8U6nwIq");

// ajax(proxyurl + 'https://maps.googleapis.com/maps/api/place/details/json', callback, 'get', {
//     "place_id":input,
//     "key":"AIzaSyAaDnggQoyZ9Rv8U6nwIq-iQ0gNtSswlzg",
//     "fields":"geometry"
// });

$('<div id="secret">hello</div>').appendTo('footer');
$('#secret').css("display", "none");

var return_first;
function callback(response) {
    return_first = response;
    //use return_first variable here
    console.log(return_first.candidates[0]);
    // document.getElementById("data").innerHTML = return_first.candidates[0].place_id;
    $("#secret").html(return_first.candidates[0].place_id);
    changeStorage();
    callOut();
}

function changeStorage(){
    localStorage.setItem( "data",JSON.stringify($("#secret").html()));
}

$.ajax({
  'type': "GET",
  'global': false,
  'url': proxyurl + 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
  'data': { 
        "input":"Bukit Panjang",
        "inputtype":"textquery",
        "key":"AIzaSyAaDnggQoyZ9Rv8U6nwIq-iQ0gNtSswlzg"
    },
  'success': function(data){
       callback(data);
  }
});

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
            console.log(data.result.geometry);
        }
    });
}
// getPlaceGeo("ChIJV8PyBkca2jERdGrR750ygBo");
function callOut(){
    alert(localStorage.getItem("data"))
}