angular
  .module('event')
  .controller("ShowMapController", function ($scope, supersonic) {

    $scope.navbarTitle = "Map";

    $scope.map = undefined;
    $scope.myMarker = undefined;
    $scope.geocoder = undefined;

    $scope.eventId = undefined;
    $scope.eventName = undefined;
    $scope.eventLocation = undefined;
    $scope.eventContactPerson = undefined;
    $scope.eventContactNumber = undefined;
    $scope.eventMarker = undefined;
    $scope.infowindow = undefined;


    supersonic.ui.views.current.params.onValue( function (values) {
      $scope.eventId = values.id;
      $scope.eventName = values.name;
      $scope.eventLocation = values.location;
      $scope.eventContactPerson = values.contact;
      $scope.eventContactNumber = values.number;
    });

    var infoString = '<p><strong>' + $scope.eventName + '</strong><br>' +
                    $scope.eventLocation + '</p>' +
                    $scope.eventContactPerson + '<br>' +
                    $scope.eventContactNumber;

    $scope.infowindow = new google.maps.InfoWindow({
        content: infoString
    });
    
    



    $('#map-canvas').css("height", $(window).height());
    //document.getElementById('map-canvas').style.height = 300;

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
      $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

      // set center to current location
      supersonic.device.geolocation.getPosition().then(function(position)
      {
        var currentLocation = new google.maps.LatLng(position.coords.latitude,
                                                     position.coords.longitude);
        $scope.map.setCenter(currentLocation);
        var markerSize = $(window).height()/50;
        var myMarkerImg = {
          url: "/icons/mylocation-marker.svg",
          size: new google.maps.Size(markerSize, markerSize),
          scaledSize: new google.maps.Size(markerSize, markerSize)
        }

        $scope.myMarker = new google.maps.Marker({
          position: currentLocation, 
          map: $scope.map,
          title: "Me",
          icon: myMarkerImg
          });

        locateEvent();
      });

      var centerControlDiv = document.createElement('div');
      var centerControl = new CenterControl(centerControlDiv, $scope.map);

      centerControlDiv.index = 0;
      $scope.map.controls[google.maps.ControlPosition.LEFT_TOP].push(centerControlDiv);
    }
    google.maps.event.addDomListener(window, 'load', initialize);


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
          $scope.map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
          $scope.map.setZoom(18);
        });
      });
    }

    function locateEvent(){
      $scope.geocoder = new google.maps.Geocoder();
      $scope.geocoder.geocode( { 'address': $scope.eventLocation}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          $scope.map.setCenter(results[0].geometry.location);
          $scope.eventMarker = new google.maps.Marker({
              map: $scope.map,
              position: results[0].geometry.location,
              title: $scope.eventName
          });

          google.maps.event.addListener($scope.eventMarker, 'click', function() {
            $scope.infowindow.open($scope.map,$scope.eventMarker);
          });

          google.maps.event.addListener($scope.map, 'click', function(){
            $scope.infowindow.close();
          });

        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
      //var latitude = 42.055984, longitude = -87.675171;
      //$scope.eventLocation = new google.maps.LatLng(latitude, longitude);
    }


    // updates user location
    setInterval(function(){
      // set center to current location
      if ($scope.map != undefined && $scope.myMarker != undefined)
      {
        supersonic.device.geolocation.getPosition().then(function(position)
        {
          var currentLocation = new google.maps.LatLng(position.coords.latitude,
                                                     position.coords.longitude);
          $scope.myMarker.setPosition(currentLocation);
        });
      }
    }, 1000);





    

  });