angular
  .module('example')
  .controller('MapController', function($scope, supersonic) {

    $scope.navbarTitle = "Map";
    $scope.events = [];
    

    function CenterControl(controlDiv, map) {

      // Set CSS for the my location button
      var controlUI = document.createElement('div');
      controlUI.style.backgroundColor = '#fff';
      controlUI.style.border = '2px solid #fff';
      controlUI.style.borderRadius = '3px';
      controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
      controlUI.style.cursor = 'pointer';
      controlUI.style.marginBottom = '22px';
      controlUI.style.marginLeft = "5px";
      controlUI.style.textAlign = 'center';
      controlUI.title = 'Click to recenter the map';
      controlDiv.appendChild(controlUI);

      // Add location icon to button
      var controlText = document.createElement('img');
      controlText.src = "/icons/mylocation.svg";
      controlText.width = $(window).height()/25;
      controlText.height = $(window).height()/25;
      controlUI.appendChild(controlText);

      // Setup the click event listeners for the my location button
      google.maps.event.addDomListener(controlUI, 'click', function() {
        supersonic.device.geolocation.getPosition().then(function(position)
        {
          map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
          map.setZoom(18);
        });
      });
    }
    var map;
    var myMarker;
    var geocoder = new google.maps.Geocoder();

    function initialize() {
      var mapOptions = {
        // default location is NU Campus
        center: { lat: 42.055984, lng: -87.675171},
        zoom: 18,
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          index: 1,
          position: google.maps.ControlPosition.LEFT_TOP
        },
        streetViewControl: true,
        streetViewControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT
        }
      };
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

      // set center to current location
      supersonic.device.geolocation.getPosition().then(function(position)
      {
        var currentLocation = new google.maps.LatLng(position.coords.latitude,
                                                     position.coords.longitude);
        map.setCenter(currentLocation);
        var markerSize = $(window).height()/50;
        var myMarkerImg = {
          url: "/icons/mylocation-marker.svg",
          size: new google.maps.Size(markerSize, markerSize),
          scaledSize: new google.maps.Size(markerSize, markerSize)
        }

        myMarker = new google.maps.Marker({
          position: currentLocation, 
          map: map,
          title: "Me",
          icon: myMarkerImg
          });
      });

      var centerControlDiv = document.createElement('div');
      var centerControl = new CenterControl(centerControlDiv, map);

      centerControlDiv.index = 0;
      map.controls[google.maps.ControlPosition.LEFT_TOP].push(centerControlDiv);
    
    }
    google.maps.event.addDomListener(window, 'load', initialize);

    geocoder.geocode( { 'address': 'Mudd Library Evanston, Illinois 60201'}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var contentString = '<h1>EECS 394 Steroids Party</h1>';
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map, marker);
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });


    //$('#map-canvas').css("height", $(window).height());
    $('#map-canvas').css("height", 500);


    setInterval(function(){
      // set center to current location
      if (map != undefined && myMarker != undefined)
      {
        supersonic.device.geolocation.getPosition().then(function(position)
        {
          var currentLocation = new google.maps.LatLng(position.coords.latitude,
                                                     position.coords.longitude);
          myMarker.setPosition(currentLocation);
        });
      }
    }, 1000);

    var Events = supersonic.data.model('Event');
    $scope.events = null;
    $scope.showSpinner = true;

    Events.all().whenChanged( function (events) {
        $scope.$apply( function () {
          $scope.events = events;
          $scope.showSpinner = false;
        });
    });




  });
