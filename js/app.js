var map;
var myPlace = {lat: 1.370239, lng: 103.852406};
var bookImage = "http://files.softicons.com/download/object-icons/book-icons-by-tobias-vogel/png/512x512/book-brown.png";

var renters = [
    {lat: 1.3695089, lng: 103.8484518},
    {lat: 1.283889, lng: 103.851792},
    {lat: 1.3499709, lng: 103.8487939},
    {lat: 1.3149421, lng: 103.7642368},
    {lat: 1.296705, lng: 103.77315},
    {lat: 1.334938, lng: 103.746872},
    {lat: 1.2931346, lng: 103.852785},
    {lat: 1.3038952, lng: 103.8319412},
    {lat: 1.349505, lng: 103.873768}
];

var mapOptions = {
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: false,

    center: myPlace,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function detectBrowser() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map");

    if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '100%';
    } else {
        mapdiv.style.width = '600px';
        mapdiv.style.height = '800px';
    }
}

function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        streetViewControl: false,
        rotateControl: false,
        zoomControl: true,
        scaleControl: true,

        center: myPlace,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var marker = new google.maps.Marker({
        position: myPlace,
        map: map,
        title: 'Hello World!'
    });


    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // [START region_getplaces]
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
    // [END region_getplaces]
}
