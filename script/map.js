const zoom = 11.5;
var map;
var first = true;
var id;
var markersArray = [];

const createMap = ({ lat, lng }) => {
    return new google.maps.Map(document.getElementById('map'), {
        center: { lat, lng },
        zoom,
        minZoom: zoom,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, "Edited"] 
        },
        mapTypeControl: false
    });
};

const createMarker = ({ map, position, animation }) => {
    return new google.maps.Marker({ map, position, animation });
};

const getPositionErrorMessage = code => {
    switch (code) {
        case 1:
        return 'Permission denied.';
        case 2:
        return 'Position unavailable.';
        case 3:
        return 'Timeout reached.';
        default:
        return null;
    }
}

const trackLocation = ({ onSuccess, onError = () => { } }) => {
    if ('geolocation' in navigator === false) {
        return onError(new Error('Geolocation is not supported by your browser.'));
    }
    // Use watchPosition instead.
    return navigator.geolocation.watchPosition(onSuccess, onError,{
        // enableHighAccuracy: false,
        // timeout: 5000,
        // maximumAge: 0
    });
};

const getCurrentPosition = ({ onSuccess, onError = () => { } }) => {
    if ('geolocation' in navigator === false) {
      return onError(new Error('Geolocation is not supported by your browser.'));
    }
  
    return navigator.geolocation.getCurrentPosition(onSuccess, onError);
  };

//Smooth zoom effect to location
function smoothZoom(map, level, cnt){
    if (cnt >= level) {
        return;
    }
    else {
        var z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, level, cnt + 1, true);
        });
        setTimeout(function(){map.setZoom(cnt)}, 80);
    }
}

//Clear all the markers on screen
function clearOverlays() {
    for (var i = 0; i < markersArray.length; i++ ) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
}

var temp = true;

//Display the map
function initMap() {
    var stylez = [
        {
          featureType: "all",
          stylers: [
            { hue: "#0000ff" },
            { saturation: -60 }
          ]
        },
        {
          featureType: "poi",
          stylers: [
            { visibility: "off" }
          ]
        }
    ];
    
    var marker;
    map = createMap({lat: 1.3521, lng: 103.8198});
    styledMapType = new google.maps.StyledMapType(stylez, {name: "Edited"});
    const $info = $('#info');

    map.mapTypes.set("Edited", styledMapType);
    map.setMapTypeId('Edited');
    if(temp)
    {
        temp = false;
    id = getCurrentPosition({
        onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
            if($info.hasClass('error')){
                $info.removeClass('error');
                $('#map').css('height', `${$('#map'). height() + 48 }`)
            }
            if (marker && marker.setMap) {
                clearOverlays();
            }
            if (first){
                marker = createMarker({ 
                    map,
                    animation: google.maps.Animation.DROP,
                    position: { lat, lng }
                });
                first = false;
            }
            else{
                marker = createMarker({
                    map,
                    position: { lat, lng }
                });
            }
            markersArray.push(marker);
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
                                    document.getElementById("#title").innerHTML = parkingMarker.Name;
                                    document.getElementById("#address").innerHTML = "Address: " + parkingMarker.Address;
                                    document.getElementById("#rating").innerHTML = "User Rating: " + parkingMarker.Rating;
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
        },
        onError: err =>
        {
            $info.text(`Error: ${getPositionErrorMessage(err.code) || err.message}`);
            $('#map').css('height', `${$('#map'). height() - 48 }`)
            // Add error class name.
            $info.addClass('error');
        }
    });
    }
}
