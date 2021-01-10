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

function clearOverlays() {
    for (var i = 0; i < markersArray.length; i++ ) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
}

var temp = true;

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
            smoothZoom(map, 16, map.getZoom());
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
