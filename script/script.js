var path = window.location.pathname;
var page = path.split("/").pop();

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('#right-nav');
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
var path = window.location.pathname;
var page = path.split("/").pop();
if (page == "map.html"){
    $('#map').css("height",`${$(window). height()-90}`);
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

document.getElementById("search-loc-btn").addEventListener("click", function(){
    navigator.geolocation.clearWatch(id);
    var re = /[0-9A-Fa-f]{6}/g;
    if(!re.test($("#search-loc").val())){
        console.log("Invalid");
        return
    }
    fetch(proxyurl + "https://api.mapbox.com/geocoding/v5/mapbox.places/"+ $("#search-loc").val() +".json?types=postcode&access_token=sk.eyJ1IjoibXhyY3hzeiIsImEiOiJja2pwdWk0cTgwY2FlMnVqeDBsZzhueHNwIn0.UvwW_-2_MB4G6SwJgLxKqQ")
    .then(response => response.json()) 
    .then(function(data){
        console.log(data)
        for (var i = 0; i < (data.features).length; i++){
            if ((data.features[i].place_name).includes("Singapore")){
                clearOverlays()
                let lat = data.features[i].center[1]
                let lng = data.features[i].center[0]
                latLng = new google.maps.LatLng(lat, lng)
                
                console.log(data.features[i].center[1], data.features[i].center[0])
                
                var marker= new google.maps.Marker({
                    position: latLng
                });
                markersArray.push(marker);
                marker.setMap(map);
                map.panTo({ lat, lng });
                smoothZoom(map, 16, map.getZoom());

                $.ajax({
                    url: proxyurl + 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
                    type: "GET", //send it through GET method
                    headers: {
                        "Access-Control-Allow-Origin": '*'
                    },
                    data: {
                        "location":lat + "," + lng,
                        "radius":800,
                        "types":"parking",
                        "key":"AIzaSyAaDnggQoyZ9Rv8U6nwIq-iQ0gNtSswlzg"
                    },
                    success: function(data) {
                        data.results.forEach(position => {
                            console.log(position.geometry);
                        });
                        console.log(data.results[0].geometry.location);
                        var parkingMarker= new google.maps.Marker({
                            position: latLng
                        });
                        parkingMarker.setMap(map);
                    }
                });

                break
            }
            else{
                continue
            }
        }
    })
});