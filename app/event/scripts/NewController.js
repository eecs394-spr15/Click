angular
  .module('event')
  .controller("NewController", function ($scope, Event, supersonic) {
    $scope.event = {};

    //set the date input as current day, set starttime as right now, set endtime as hour from now
    Date.prototype.toDateInputValue = (function() {
      var local = new Date(this);
      local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
      return local.toJSON().slice(0,10);
    });

    Date.prototype.toStartTimeInputValue = (function() {
      var local = new Date(this);
      local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
      return local.toJSON().slice(11,19);
    });

    Date.prototype.toEndTimeInputValue = (function() {
      var local = new Date(this);
      local.setMinutes(this.getMinutes() - this.getTimezoneOffset() + 60);
      return local.toJSON().slice(11,19);
    });
    $('#date').val(new Date().toDateInputValue());
    $('#starttime').val(new Date().toStartTimeInputValue());
    $('#endtime').val(new Date().toEndTimeInputValue());

    $scope.submitForm = function () {
      $scope.showSpinner = true;

      // parse form input, ng-model breaks the input type=date for some reason
      $scope.event.StartTime = $('#starttime').val();
      $scope.event.EndTime = $('#endtime').val();
      var date = $('#date').val().split("-");
      $scope.event.Month = date[1];
      $scope.event.Day = date[2];
      $scope.event.Year = date[0];

      var address = $scope.event.Street;
      var city = $scope.event.City;
      var state = $scope.event.State;
      var geocoder = new google.maps.Geocoder();

      alert(geocoder);
      geocoder.geocode({'address': address + "," + city + "," + state + " 60208"}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK)
        {
          $scope.event.Lat = results[0].geometry.location.lat;
          $scope.event.Long = results[0].geometry.location.lng;
          supersonic.logger.log($scope.event.Lat);
          supersonic.logger.log($some.event.Long);
          newevent = new Event($scope.event);
          alert("geocoding");
          var TestObject = Parse.Object.extend("Events");
          var testObject = new TestObject();
          testObject.save($scope.event, {
            success: function(object) {
              supersonic.ui.modal.hide();
            },
            error: function(model, error) {
              steroids.logger.log(error);
            }
          });

        }
        else
        {
          supersonic.logger.log(
            "fail");
          alert("query failed");
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
