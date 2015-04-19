angular
  .module('event')
  .controller("NewController", function ($scope, Event, supersonic) {
    $scope.event = {};

    $scope.options = [
      'Party',
      'Code'
    ];

    //set the date input as current day, set starttime as right now, set endtime as hour from now
    Date.prototype.toDateInputValue = (function() {
      var local = new Date(this);
      local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
      return local.toJSON().slice(0,10);
    });

    Date.prototype.toStartTimeInputValue = (function() {
      var local = new Date(this);
      local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
      return local.toJSON().slice(11,13) + ":00:00";
    });

    Date.prototype.toEndTimeInputValue = (function() {
      var local = new Date(this);
      local.setMinutes(this.getMinutes() - this.getTimezoneOffset() + 60);
      return local.toJSON().slice(11,13) + ":00:00";
    });
    $('#date').val(new Date().toDateInputValue());
    $('#start-time').val(new Date().toStartTimeInputValue());
    $('#end-time').val(new Date().toEndTimeInputValue());

    var stateIndex; // index in states array

    // error messaging
    $scope.checkForm = function () {
      var numErrors = 0;
      var errorMsg = "Your are missing the following inputs:\n";
      $('#event-name-lbl').removeClass('error-input');
      $('#comments-lbl').removeClass('error-input');
      $('#poster-name-lbl').removeClass('error-input');
      $('#contact-lbl').removeClass('error-input');
      $('#date-lbl').removeClass('error-input');
      $('#start-time-lbl').removeClass('error-input');
      $('#end-time-lbl').removeClass('error-input');
      $('#address-lbl').removeClass('error-input');
      $('#room-lbl').removeClass('error-input');
      $('#city-lbl').removeClass('error-input');
      $('#state-lbl').removeClass('error-input');

      if ($('#event-name').val() === '' || $('#event-name').val() === undefined || $('#event-name').val() === null)
      {
        numErrors++;
        errorMsg += "Event Name\n";
        $('#event-name-lbl').addClass('error-input');
      }
      if ($('#poster-name').val() === '' || $('#poster-name').val() === undefined || $('#poster-name').val() === null)
      {
        numErrors++;
        errorMsg += "Poster Name\n";
        $('#poster-name-lbl').addClass('error-input');
      }
      if ($('#contact').val() === '' || $('#contact').val() === undefined || $('#contact').val() === null)
      {
        numErrors++;
        errorMsg += "Contact Info\n";
        $('#contact-lbl').addClass('error-input');
      }
      if ($('#date').val() === '' || $('#date').val() === undefined || $('#date').val() === null)
      {
        numErrors++;
        errorMsg += "Date\n";
        $('#date-lbl').addClass('error-input');
      }
      if ($('#start-time').val() === '' || $('#start-time').val() === undefined || $('#start-time').val() === null)
      {
        numErrors++;
        errorMsg += "Start Time\n";
        $('#start-time-lbl').addClass('error-input');
      }
      if ($('#end-time').val() === '' || $('#end-time').val() === undefined || $('#end-time').val() === null)
      {
        numErrors++;
        errorMsg += "End Time\n";
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
      stateIndex = states.indexOf($('#state').val().toUpperCase());
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
      if (states.indexOf($('#state').val().toUpperCase()) == -1)
      {
        $('#state-lbl').addClass('error-input');
      }
    });

    $scope.submitForm = function () {
      $scope.showSpinner = true;

      // parse form input, ng-model breaks the input type=date for some reason
      $scope.event.StartTime = $('#start-time').val();
      $scope.event.EndTime = $('#end-time').val();
      var date = $('#date').val().split("-");
      $scope.event.Month = date[1];
      $scope.event.Day = date[2];
      $scope.event.Year = date[0];
      $scope.event.DateTime = $('#date').val() + "-" + $scope.event.StartTime;

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

      // sanitize the address with format Capital Letter for first letter and lower case for the rest

      var address = $scope.event.Street;
      var city = $scope.event.City;
      var state = $scope.event.State;
      $scope.event.City = city.substr(0, 1).toUpperCase() + city.substr(1, city.length - 1).toLowerCase();  // change all but first letter to lower case
      if (stateIndex % 2 == 0)  // store the state full name into the DB
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

  });
