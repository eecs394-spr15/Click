angular
  .module('event')
  .controller("NewController", function ($scope, Event, supersonic) {
    $scope.event = {};
    $scope.currentUser = Parse.User.current();



   

    $scope.options = [
      'Social',
      'Fine Arts',
      'Athletics',
      'Lectures & Meetings',
      'Fitness & Recreation',
      'Other'
    ];

    $scope.event.EventType = $scope.options[0];

    // get current date and time

    $('#start-date').val(new Date().toDateInputValue());
    $('#end-date').val(new Date().toDateInputValue());
    $('#start-time').val(new Date().toStartTimeInputValue());
    $('#end-time').val(new Date().toEndTimeInputValue());

    var stateIndex; // index in states array

    // error messaging
    $scope.checkForm = function () {
      var numErrors = 0;
      if (!Parse.User.current())
      {
        supersonic.ui.dialog.alert("You need to be logged in to create a new event.");
        numErrors++;
      }
      var errorMsg = "Your are missing the following inputs:\n";
      $('#event-name-lbl').removeClass('error-input');
      $('#comments-lbl').removeClass('error-input');
      $('#start-time-lbl').removeClass('error-input');
      $('#end-time-lbl').removeClass('error-input');
      $('#address-lbl').removeClass('error-input');
      $('#room-lbl').removeClass('error-input');
      $('#city-lbl').removeClass('error-input');
      $('#state-lbl').removeClass('error-input');
      $('#start-date-lbl').removeClass('error-input');
      $('#end-date-lbl').removeClass('error-input');
      $('#start-time-lbl').removeClass('error-input');
      $('#end-time-lbl').removeClass('error-input');

      if ($('#event-name').val() === '' || $('#event-name').val() === undefined || $('#event-name').val() === null)
      {
        numErrors++;
        errorMsg += "Event Name\n";
        $('#event-name-lbl').addClass('error-input');
      }
      var startDateTime = $('#start-date').val() + "-" + $('#start-time').val();
      var endDateTime = $('#end-date').val() + "-" + $('#end-time').val();

      if (startDateTime >= endDateTime)
      {
        numErrors++;
        $('#start-date-lbl').addClass('error-input');
        $('#end-date-lbl').addClass('error-input');
        $('#start-time-lbl').addClass('error-input');
        $('#end-time-lbl').addClass('error-input');
      }
      if ($('#address').val() === '' || $('#address').val() === undefined || $('#address').val() === null)
      {
        numErrors++;
        errorMsg += "Address\n";
        $('#address-lbl').addClass('error-input');
      }
      if ($('#city').val() === '' || $('#city').val() === undefined || $('#city').val() === null)
      {
        numErrors++;
        errorMsg += "City\n";
        $('#city-lbl').addClass('error-input');
      }
      if ($('#state').val() === '' || $('#state').val() === undefined || $('#state').val() === null)
      {
        numErrors++;
        errorMsg += "State\n";
        $('#state-lbl').addClass('error-input');
      }
      stateIndex = states.indexOf($('#state').val().toUpperCase().trim());
      if (stateIndex == -1)
      {
        numErrors++;
        $('#state-lbl').addClass('error-input');
      }
      if (numErrors === 0)
      {
        $scope.submitForm();
      }
    };

    $('#state').focusout(function() {
      if (states.indexOf($('#state').val().toUpperCase().trim()) == -1)
      {
        $('#state-lbl').addClass('error-input');
      }
      else
      {
        $('#state-lbl').removeClass('error-input');
      }
    });

    $scope.submitForm = function () {
      $scope.showSpinner = true;

      var startDate = $('#start-date').val().split("-");
      startDate[1] = parseInt(startDate[1]) - 1;
      startDate[0] = parseInt(startDate[0]);
      startDate[2] = parseInt(startDate[2]);
      var startTime = $('#start-time').val().split(":");
      startTime[0] = parseInt(startTime[0]);
      startTime[1] = parseInt(startTime[1]);
      var endDate = $('#end-date').val().split("-");
      endDate[1] = parseInt(endDate[1]) - 1;
      endDate[0] = parseInt(endDate[0]);
      endDate[2] = parseInt(endDate[2]);
      var endTime = $('#end-time').val().split(":");
      endTime[0] = parseInt(endTime[0]);
      endTime[1] = parseInt(endTime[1]);

      $scope.event.StartDate = new Date(startDate[0], startDate[1], startDate[2], startTime[0], startTime[1]);
      $scope.event.EndDate = new Date(endDate[0], endDate[1], endDate[2], endTime[0], endTime[1]);
      //add empty string for room and comments if none
      if ($scope.event.Room === undefined)
      {
        $scope.event.Room = '';
      }  
      if ($scope.event.Comments === undefined)
      {
        $scope.event.Comments = '';
      }
      if ($scope.event.Contact === undefined)
      {
        $scope.event.Contact = '';
      }
      $scope.event.Vote = 0;
      $scope.event.planitpurpleId = '';

      // sanitize the address with format Capital Letter for first letter and lower case for the rest

      var address = $scope.event.Street;
      var city = $scope.event.City;
      var state = $scope.event.State;
      var city_components = city.split(" ");
      for (var i = 0; i < city_components.length; i++)
      {
        city_components[i] = city_components[i].substr(0, 1).toUpperCase() + city_components[i].substr(1, city_components[i].length - 1); // same as above comments
      }
      $scope.event.City = city_components.join(" ");
      if (stateIndex % 2 === 0)  // store the state full name into the DB
      {
        $scope.event.State = states[stateIndex].substr(0, 1) + states[stateIndex].substr(1, states[stateIndex].length -1).toLowerCase(); // upper case then lower case
      }
      else
        $scope.event.State = states[stateIndex + 1].substr(0, 1) + states[stateIndex - 1].substr(1, states[stateIndex - 1].length -1).toLowerCase(); 
      var address_components = address.split(" ");
      for (var i = 0; i < address_components.length; i++)
      {
        address_components[i] = address_components[i].substr(0, 1).toUpperCase() + address_components[i].substr(1, address_components[i].length - 1); // same as above comments
      }
      $scope.event.Street = address_components.join(" ");

      var currentUser = Parse.User.current();
      $scope.event.PosterName = currentUser.get("username");
      $scope.event.Contact = currentUser.get("email");


      var geocoder = new google.maps.Geocoder();
      $scope.event.Lat = undefined;
      $scope.event.Long = undefined;
      geocoder.geocode({'address': address + "," + city + "," + state}, function(results, status) {
        if (results[0].geometry.location_type == 'APPROXIMATE')
        {
          supersonic.logger.log(
            "fail");
          alert("The inputted address could not be found.");
          supersonic.ui.layers.pop();
        }
        else if (status == google.maps.GeocoderStatus.OK)
        {
          
          $scope.event.Lat = results[0].geometry.location.lat();
          $scope.event.Long = results[0].geometry.location.lng();
          newevent = new Event($scope.event);
          var TestObject = Parse.Object.extend("Events");
          var testObject = new TestObject();
          testObject.save($scope.event, {
            success: function(object) {
              supersonic.ui.layers.pop();
            },
            error: function(model, error) {
              steroids.logger.log(error);
              alert("something wrong");
            }
          });
        }
        else
        {
          alert("A problem occurred with adding this event");
          supersonic.ui.layers.pop();
        }
      });
 

      // newevent.save().then( function () {
      //   supersonic.ui.modal.hide();
      // });
    };

    $scope.cancel = function () {
      supersonic.ui.modal.hide();
    };
	  $scope.RedirectToProfile = function () {
		  var view = new supersonic.ui.View("event#login");
		  supersonic.ui.layers.push(view);
    };

    $('#all-day').change(function(){
      if($(this).is(':checked'))
      {
        $('#start-time').val("00:00");
        $('#end-time').val("23:59");
      }
    });
	

  });
