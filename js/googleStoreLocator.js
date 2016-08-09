var map;
var mapLoadPosition;
var deviceLocation;
var shopInfo;

var request;
var service;

function initialize() 
{   
    mapLoadPosition = new google.maps.LatLng(53.3498,-6.2603); 
    //London City 51.508742,-0.120850, Dublin City 53.3498,-6.2603
    
    var mapProperties = 
    {
        center: mapLoadPosition,
        zoom:13,//zoom distance
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("googleMap"), mapProperties);

    if (navigator.geolocation) // get device current location
    {
        navigator.geolocation.getCurrentPosition(function (position) 
        {
            deviceLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(deviceLocation); // Update centre point with current location

            var currentLocationMarker = new google.maps.Marker(
            {
                map: map,
                position: deviceLocation,
            });
        });
    }
    else
    {
       alert("Geolocation API not supported.");
    }

    var mapCenter = map.getCenter();

    request = 
    {
        location: mapCenter, 
        radius: 20000, // 10 Mile radius to the set location (approx)
        types: ['grocery_or_supermarket'], // types of places
        keyword: ['Tesco'] // specific keyword to look for 
    };

    shopInfo = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, callback);
}

function callback(results, status)
{
    if(status == google.maps.places.PlacesServiceStatus.OK)
    {
        for(var i=0; i < results.length; i++)
        {
            createMarker(results[i]);
        }
    }
}

function createMarker(place)
{
    var placeLoc = place.geometry.location;
    var shopsMarker = new google.maps.Marker({
        map: map,
        position: place.geometry.location, 
        icon:'img/tescoIcon1.png' // tesco icon image
    });

    google.maps.event.addListener(shopsMarker, 'click', function()
    {
        shopInfo.setContent(place.name + "<br />" + place.vicinity);// to add detail to the marker, name and address
        shopInfo.open(map, this);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
