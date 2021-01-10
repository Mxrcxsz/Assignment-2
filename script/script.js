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

Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}

function haversineDistance(coords1, coords2) {
    function toRad(x) {
      return x * Math.PI / 180;
    }

    var lon1 = coords1[0];
    var lat1 = coords1[1];

    var lon2 = coords2[0];
    var lat2 = coords2[1];
  
    var R = 6371; // km
  
    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
}

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
                var lat = data.features[i].center[1]
                var lng = data.features[i].center[0]
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
                            // console.log(position.geometry);
                            lat = position.geometry.location.lat;
                            lng = position.geometry.location.lng;
                            // console.log(position.geometry.location);
                            latLng = new google.maps.LatLng(lat, lng)
                            var parkingMarker= new google.maps.Marker({
                                position: latLng,
                                icon: "image/parking.png"
                            });
                            parkingMarker.setMap(map);
                            
                            $.ajax({
                                url: 'https://api.jsonbin.io/b/5ff45d9709f7c73f1b6df03d',
                                type: "GET", //send it through GET method
                                headers: {
                                    "content-type":"application/json",
                                    "secret-key":"$2b$10$U32F5.Qe7ErRiSaybhPmd.XQ8oikTg4jGxtm0x3zN23lMpohizeva"
                                },
                                success: function(geocodeInfo) {
                                    for (var j = 0; j < 10; j++){
                                        $.ajax({
                                            url: proxyurl + 'https://developers.onemap.sg/privateapi/commonsvc/revgeocodexy',
                                            type: "GET", //send it through GET method
                                            data: {
                                                "location":geocodeInfo[j].x_coord + ","+ geocodeInfo[j].y_coord,
                                                "token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjY5NTIsInVzZXJfaWQiOjY5NTIsImVtYWlsIjoiczEwMjA4NDk1QGNvbm5lY3QubnAuZWR1LnNnIiwiZm9yZXZlciI6ZmFsc2UsImlzcyI6Imh0dHA6XC9cL29tMi5kZmUub25lbWFwLnNnXC9hcGlcL3YyXC91c2VyXC9zZXNzaW9uIiwiaWF0IjoxNjEwMjcyNzQ1LCJleHAiOjE2MTA3MDQ3NDUsIm5iZiI6MTYxMDI3Mjc0NSwianRpIjoiMDllOTM0N2UzMzI3MDZjZGNiOTA5OTVlMDliMmVkNGIifQ.2TD19vUp5ZpgP7cShVjUBw4fmM5FBIsJIv5nDzPEHaA"
                                            },
                                            success: function(geocodeInfo2) {
                                                console.log(geocodeInfo2);
                                                // console.log(geocodeInfo2[0].LONGITUDE);
                                            }
                                        });
                                    }
                                }
                            });
                        });
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