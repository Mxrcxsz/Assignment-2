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
// var typingTimer;                //timer identifier
// var doneTypingInterval = 5000;  //time in ms, 5 second for example
// var $input = $('#search-loc');

// //on keyup, start the countdown
// $input.on('keyup', function () {
//   clearTimeout(typingTimer);
//   typingTimer = setTimeout(doneTyping, doneTypingInterval);
// });

// //on keydown, clear the countdown 
// $input.on('keydown', function () {
//   clearTimeout(typingTimer);
// });

//user is "finished typing," do something
function get_carpark_details(){
    $.ajax({
        url: 'https://api.jsonbin.io/b/5ff45d9709f7c73f1b6df03d',
        type: "GET", //send it through GET method
        headers: {
            "content-type":"application/json",
            "secret-key":"$2b$10$U32F5.Qe7ErRiSaybhPmd.XQ8oikTg4jGxtm0x3zN23lMpohizeva"
        },
        success: function(data) {
            console.log(data[0]);
        }
    });
}
// get_carpark_details();

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

document.getElementById("search-loc-btn").addEventListener("click", function(){
    // console.log(search_place($("#search-loc").val()).candidates[0]);
    fetch(proxyurl + "https://api.mapbox.com/geocoding/v5/mapbox.places/"+ $("#search-loc").val() +".json?types=postcode&access_token=sk.eyJ1IjoibXhyY3hzeiIsImEiOiJja2pwdWk0cTgwY2FlMnVqeDBsZzhueHNwIn0.UvwW_-2_MB4G6SwJgLxKqQ")
    .then(response => response.json()) 
    .then(function(data){
        console.log(data)

        for (var i = 0; i < (data.features).length; i++){
            if ((data.features[i].place_name).includes("Singapore")){
                latLng = new google.maps.LatLng(data.features[i].center[1], data.features[i].center[0])
                let lat = data.features[i].center[1]
                let lng = data.features[i].center[0]
                
                console.log(data.features[i].center[1], data.features[i].center[0])

                var marker= new google.maps.Marker({
                    position: latLng
                });               
                marker.setMap(map);
                map.panTo({ lat, lng });
                break
            }
            else{
                continue
            }
        }
    })
});

