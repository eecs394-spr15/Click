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



      newevent = new Event($scope.event);

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



      // newevent.save().then( function () {
      //   supersonic.ui.modal.hide();
      // });
    };

    $scope.cancel = function () {
      supersonic.ui.modal.hide();
    };

  });
