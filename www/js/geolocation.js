//tested on javascriptlint.com on 09 Jul 2014

var helpdesk_gmap, timers_gmap;
var directionsDisplay, directionsDisplayTimers;
var directionsService, directionsServiceTimers;
var markersArray = [];
var ulm;

function initialize_gmap() {

    ulm = new google.maps.LatLng(48.368681,9.953039);

    google.maps.visualRefresh = true;

    directionsDisplay = new google.maps.DirectionsRenderer({
        suppressInfoWindows: true,
        suppressMarkers: true,
        polylineOptions: {
            strokeWeight: 10,
            strokeColor: '#ff0000',
            strokeOpacity: 0.3
        }
    });

    directionsDisplayTimers = new google.maps.DirectionsRenderer({
        suppressInfoWindows: true,
        suppressMarkers: true,
        polylineOptions: {
            strokeWeight: 10,
            strokeColor: '#ff0000',
            strokeOpacity: 0.3
        }
    });

    directionsService = new google.maps.DirectionsService();
    directionsServiceTimers = new google.maps.DirectionsService();

    var mapOptions = {
        center: ulm,
        zoom: 8
    };

    helpdesk_gmap = new google.maps.Map(document.getElementById('helpdesk_gmap'), mapOptions);
    
    timers_gmap = new google.maps.Map(document.getElementById('timers_gmap'), mapOptions);
}

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';

    script.src = 'https://maps.googleapis.com/maps/api/js?&sensor=true&' +
      'callback=initialize_gmap';

    document.body.appendChild(script);
}
window.onload = loadScript;

function onSuccess(position) {

    window.localStorage.setItem("device_lat", position.coords.latitude);
    window.localStorage.setItem("device_lon", position.coords.longitude);
}

function onError(error) {
	console.log('Geolocation '+'code: ' + error.code + ' message: ' + error.message);
}

var show_customer_loc = function(e) {
    console.log('Requesting Directions');

    var device_lat = window.localStorage.getItem("device_lat");
    var device_lon = window.localStorage.getItem("device_lon");

    var ticket_details = $('#helpdesk_page .ticket_details.active_ticket_detail');
    var CustomerName  = ticket_details.find('.customer-name').html();
    var CustomerStreet = ticket_details.find('.CustomerStreet').html();
    var CustomerZip = ticket_details.find('.CustomerZip').html();
    var CustomerCity = ticket_details.find('.CustomerCity').html();

    console.log('Device: ' + device_lat + ' ' + device_lon);
    console.log('Customer: ' + CustomerStreet + ', ' + CustomerCity);

    var munich = new google.maps.LatLng(48.135127, 11.581985);
    var device_loc = new google.maps.LatLng(device_lat, device_lon);

    $('#helpdesk_gmap, .gmap_outer_container').show().css({
        'z-index': 2000,
        'position': 'fixed'
    });

    google.maps.event.trigger(helpdesk_gmap, 'resize');

    var start = device_loc;
    var end = CustomerStreet + ', ' + CustomerCity;
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsDisplay.setMap(helpdesk_gmap);

    directionsService.route(request, function (response, status) {
        if (markersArray) {
            for (i = 0; i < markersArray.length; i++) {

                if (markersArray[i].directions) {
                    markersArray[i].directions.setMap(null);
                }
                markersArray[i].setMap(null);
            }
            markersArray.length = 0;
        }


        if (status == google.maps.DirectionsStatus.OK) {

            directionsDisplay.setDirections(response);

            //Customer's location
            console.log('Latitude: ' + response.routes[0].legs[0].end_location.lat());
            console.log('Longitude: ' + response.routes[0].legs[0].end_location.lng());

            console.log('Calculating End point...');
            end = new google.maps.LatLng(response.routes[0].legs[0].end_location.lat(), response.routes[0].legs[0].end_location.lng());
            console.log('End point: ' + end.lat() + '&nbsp;' + end.lng());
            var location = [start, end];

            function attachSecretMessage(marker, number) {
                var message = ['<h1>You are here</h1>', '<h1>'+CustomerName+'</h1>'];
                var infowindow = new google.maps.InfoWindow({
                    content: message[number]
                });
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(helpdesk_gmap, marker);
                });
            }

            for (var i = 0; i < location.length; i++) {
                var marker = new google.maps.Marker({
                    position: location[i],
                    map: helpdesk_gmap
                });
                console.log('Adding markers...');
                attachSecretMessage(marker, i);
                markersArray.push(marker);
            }
        } else {
            directionsDisplay.setMap(null);
            $( "#helpdesk_page .centron-alert-info" ).find('p').html('Directions Service: ' + status).end().popup('open');
        }
    });
};

var show_customer_loc_timers = function(e) {
    console.log('Requesting Directions');

    var device_lat = window.localStorage.getItem("device_lat");
    var device_lon = window.localStorage.getItem("device_lon");

    var ticket_details = $('#helpdesk_page .ticket_details.active_ticket_detail');
    var CustomerName  = ticket_details.find('.customer-name').html();
    var CustomerStreet = ticket_details.find('.CustomerStreet').html();
    var CustomerZip = ticket_details.find('.CustomerZip').html();
    var CustomerCity = ticket_details.find('.CustomerCity').html();

    console.log('Device: ' + device_lat + ' ' + device_lon);
    console.log('Customer: ' + CustomerStreet + ', ' + CustomerCity);

    var munich = new google.maps.LatLng(48.135127, 11.581985);
    var device_loc = new google.maps.LatLng(device_lat, device_lon);

    $('#helpdesk_timers_page .gmap_outer_container').show().css({
        'z-index': 2000,
        'position': 'fixed'
    });

    google.maps.event.trigger(timers_gmap, 'resize');

    var start = device_loc;
    var end = CustomerStreet + ', ' + CustomerCity;
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsDisplayTimers.setMap(timers_gmap);

    directionsServiceTimers.route(request, function (response, status) {
        if (markersArray) {
            for (i = 0; i < markersArray.length; i++) {

                if (markersArray[i].directions) {
                    markersArray[i].directions.setMap(null);
                }
                markersArray[i].setMap(null);
            }
            markersArray.length = 0;
        }

        if (status == google.maps.DirectionsStatus.OK) {

            directionsDisplayTimers.setDirections(response);

            //Customer's location
            console.log('Latitude: ' + response.routes[0].legs[0].end_location.lat());
            console.log('Longitude: ' + response.routes[0].legs[0].end_location.lng());

            console.log('Calculating End point...');
            end = new google.maps.LatLng(response.routes[0].legs[0].end_location.lat(), response.routes[0].legs[0].end_location.lng());
            console.log('End point: ' + end.lat() + '&nbsp;' + end.lng());
            var location = [start, end];

            function attachSecretMessage(marker, number) {
                var message = ['<h1>You are here</h1>', '<h1>'+CustomerName+'</h1>'];
                var infowindow = new google.maps.InfoWindow({
                    content: message[number]
                });
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.open(timers_gmap, marker);
                });
            }

            for (var i = 0; i < location.length; i++) {
                var marker = new google.maps.Marker({
                    position: location[i],
                    map: timers_gmap
                });
                console.log('Adding markers...');
                attachSecretMessage(marker, i);
                markersArray.push(marker);
            }
            
        } else {
            directionsDisplayTimers.setMap(null);

            $( "#helpdesk_timers_page .centron-alert-info" ).find('p').html('Directions Service: ' + status).end().popup('open');
        }
    });
};
