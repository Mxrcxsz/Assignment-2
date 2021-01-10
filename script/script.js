var path = window.location.pathname;
var page = path.split("/").pop();
var min = 0;
var right_section = document.getElementById("right-sec")

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

document.getElementById("close-btn").addEventListener('click', function(){
    right_section.style.left = "-500px";
    right_section.style.opacity = "0";
    right_section.style.transition = "0.3s";
});

// All Map html
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
        for (var i = 0; i < (data.features).length; i++){
            if ((data.features[i].place_name).includes("Singapore")){
                clearOverlays()
                var lat = data.features[i].center[1]
                var lng = data.features[i].center[0]
                latLng = new google.maps.LatLng(lat, lng)
                                
                var marker= new google.maps.Marker({
                    position: latLng
                });
                markersArray.push(marker);
                marker.setMap(map);
                map.panTo({ lat, lng });
                smoothZoom(map, 17, map.getZoom());
                $.ajax({
                    url: proxyurl + 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
                    type: "GET", //send it through GET method
                    headers: {
                        "Access-Control-Allow-Origin": '*'
                    },
                    data: {
                        "location":lat + "," + lng,
                        "radius":1000,
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
    
                            $.ajax({
                                url: proxyurl + 'https://maps.googleapis.com/maps/api/place/details/json',
                                type: "GET", //send it through GET method
                                headers: {
                                    "Access-Control-Allow-Origin": '*'
                                },
                                data: {
                                    "place_id": position.place_id,
                                    "key":"AIzaSyAaDnggQoyZ9Rv8U6nwIq-iQ0gNtSswlzg"
                                },
                                success: function(data_details) {
                                    parkingMarker.Name = position.name;
                                    parkingMarker.Address = data_details.result.formatted_address;
                                    parkingMarker.Rating = position.rating;
                                    markersArray.push(parkingMarker);
                                    parkingMarker.setMap(map);
                                    parkingMarker.addListener("click", () => {
                                        click = true;
                                        document.getElementById("#title").innerHTML = parkingMarker.Name;
                                        document.getElementById("#address").innerHTML = "Address: " + parkingMarker.Address;
                                        document.getElementById("#rating").innerHTML = "User Rating: " + parkingMarker.Rating;
                                        // document.getElementById('#get-direction').getAttribute("href") = "https://www.google.com/maps?daddr=" + lat + "," + lng;
                                        $("#get-direction").attr("href", "https://www.google.com/maps?daddr=" + lat + "," + lng)
                                        right_section.style.left = "0px";
                                        right_section.style.opacity = "1";
                                        right_section.style.transition = "0.3s";
                                    });
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
