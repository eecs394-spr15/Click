angular
  .module('example')
  .controller('MapController', function($scope, supersonic) {

    $scope.navbarTitle = "Map";
    $scope.events = null;
    $scope.showSpinner = true;

    var addedMarkers = false;


    var Events = supersonic.data.model('Event');
    Events.all().whenChanged( function (events) {
        $scope.$apply( function () {
          $scope.events = events;
          $scope.showSpinner = false;
          /*
          if (addedMarkers === false)
          {
            initialize();
            oms = new OverlappingMarkerSpiderfier(map);
            for (var i = 0; i < $scope.events.length; i++)
            {
              var comments = $scope.events[i].Comments;
              var eventName = $scope.events[i].EventName;
              var posterName = $scope.events[i].PosterName;
              var city = $scope.events[i].City;
              var contact = $scope.events[i].Contact;
              var endTime = $scope.events[i].EndTime;
              var startTime = $scope.events[i].StartTime;
              var month = $scope.events[i].Month;
              var room = $scope.events[i].Room;
              var street = $scope.events[i].Street;
              var state = $scope.events[i].State;
              var year = $scope.events[i].Year;
              var day = $scope.events[i].Day;
              contentString[i] = '<h4>' + eventName + '</h4>\n' +
                                        '<p>When: ' + month + " " + day + " " + year + ' ' + startTime + ' - ' + endTime +
                                        '<br>Where: ' + street + ' ' + room + ' ' + city + ', ' + state +
                                        '<br>Contact: ' + contact +
                                        '<br>Comments: ' + comments +
                                        '</p>';
            }

            for (i = 0; i < $scope.events.length; i++)
            {
              (function(i) {
                geocoder.geocode( { 'address': $scope.events[i].Street + "," + $scope.events[i].City + "," + $scope.events[i].State + " 60208"}, function(results, status) {
                  if (status == google.maps.GeocoderStatus.OK)
                  {
                    places[i] = results[0].geometry.location;

                    var marker = new google.maps.Marker({
                      position: places[i],
                      map: map
                    });
                    marker.desc = contentString[i];
                    markers.push(marker);

                    oms.addMarker(marker);



                  }
                  else {
                    alert("Geocode was not successful for the following reason: " + status);
                  }
                });

              })(i);  //jshint ignore:line
            }

            var iw = new google.maps.InfoWindow();
            oms.addListener('click', function(marker, event) {
              iw.setContent(marker.desc);
              iw.open(map, marker);
            });
            addedMarkers = true;
          }
          */
        });
    });


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
    var contentString = []; //array of infowindow descriptions
    var infowindow;
    var geocoder = new google.maps.Geocoder();
    var markers = [];     //array of markers
    var places = [];      //array of lat/long
    var oms;  //display multiple markers at same location



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
        };

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

//    google.maps.event.addDomListener(window, 'load', initialize);


    $(window).resize(function() {
      $('#map-canvas').css("height", $(window).height());
    });

    $('#map-canvas').css("height", $(window).height());


    setInterval(function(){
      // set center to current location
      if (map !== undefined && myMarker !== undefined)
      {
        supersonic.device.geolocation.getPosition().then(function(position)
        {
          var currentLocation = new google.maps.LatLng(position.coords.latitude,
                                                     position.coords.longitude);
          myMarker.setPosition(currentLocation);
        });
      }
    }, 1000);






  });
