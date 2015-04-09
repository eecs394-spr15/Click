angular
  .module('event')
  .controller("EditController", function ($scope, Event, supersonic) {
    $scope.event = null;
    $scope.showSpinner = true;

    // Fetch an object based on id from the database
    Event.find(steroids.view.params.id).then( function (event) {
      $scope.$apply(function() {
        $scope.event = event;
        $scope.showSpinner = false;
      });
    });

    $scope.submitForm = function() {
      $scope.showSpinner = true;
      $scope.event.save().then( function () {
        supersonic.ui.modal.hide();
      });
    };

    $scope.cancel = function () {
      supersonic.ui.modal.hide();
    };

  });
