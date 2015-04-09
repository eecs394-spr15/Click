angular
  .module('event')
  .controller("NewController", function ($scope, Event, supersonic) {
    $scope.event = {};

    $scope.submitForm = function () {
      $scope.showSpinner = true;
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
