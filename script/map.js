const zoom = 11;
var map;
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
    
    map = createMap({lat: 1.3521, lng: 103.8198});
    styledMapType = new google.maps.StyledMapType(stylez, {name: "Edited"});
    const $info = document.getElementById('info');

    map.mapTypes.set("Edited", styledMapType);
    map.setMapTypeId('Edited');

    trackLocation({
        onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
            const marker = createMarker({ 
                map,
                animation: google.maps.Animation.DROP,
                position: { lat, lng }
            });
            map.panTo({ lat, lng });
            smoothZoom(map, 16, map.getZoom());
        },
        onError: err =>
        {
            $info.textContent = `Error: ${getPositionErrorMessage(err.code) || err.message}`;
            // Add error class name.
            $info.classList.add('error');
        }
    });
}