var map;
var myPlace = {lat: 1.370239, lng: 103.852406};
var bookImage = "images/book.jpg";

var renters = [
    ['id1', 1.3695089, 103.8484518, 1],
    ['id2', 1.283889, 103.851792, 2],
    ['id3', 1.3499709, 103.8487939, 3],
    ['id4', 1.3149421, 103.7642368, 4],
    ['id5', 1.296705, 103.77315, 5],
    ['id6', 1.334938, 103.746872, 6],
    ['id7', 1.2931346, 103.852785, 7],
    ['id8', 1.3038952, 103.8319412, 8],
    ['id9', 1.349505, 103.873768, 9]
];

var bookInfo = {

};

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
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP]
        } // here´s the array of controls
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    new google.maps.Marker({
        position: myPlace,
        map: map,
        title: ''
    });

    // Adds markers to the map.
    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.

    // Origins, anchor positions and coordinates of the marker increase in the X
    // direction to the right and in the Y direction down.
    var image = {
        url: bookImage,
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(34, 24),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(0, 32)
    };
    // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.
    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };
    for (var i = 0; i < renters.length; i++) {
        var renter = renters[i];
        var m = new google.maps.Marker({
            position: {lat: renter[1], lng: renter[2]},
            map: map,
            icon: image,
            shape: shape,
            zIndex: renter[3]
        });
        attachBookInfo(m, 'abc');
    }

    function attachBookInfo(marker, secretMessage) {
        var infowindow = new google.maps.InfoWindow({
            content:
                '<table>'+
                    '<tr>'+
                        '<td>'+
                            "<img src='./../images/quiet.jpg' style='width:34px;height:40px;'>"+
                        '</td>'+
                        '<td>'+
                            '<div><b> Quiet </b></div>'+
                            '<div><i> Susan Cain </i></div>'+
                            '<div> Self-Help, Introversion</div>'+
                        '</td>'+
                    '</tr>'+
                '</table>'+

                '<table>'+
                    '<tr>'+
                        '<td>'+
                            "<img src='./../images/quiet.jpg' style='width:34px;height:40px;'>"+
                        '</td>'+
                        '<td>'+
                            '<div><b> 7 Habits of Highly Efficient People </b></div>'+
                            '<div><i> Stephen R.Covey </i></div>'+
                            '<div> Productivity</div>'+
                        '</td>'+
                    '</tr>'+
                '</table>'
        });

        marker.addListener('click', function() {
            infowindow.open(marker.get('map'), marker);
        });
    }

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
