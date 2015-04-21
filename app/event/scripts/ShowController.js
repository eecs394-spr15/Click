angular
  .module('event')
  .controller("ShowController", function ($scope, Event, supersonic) {
    $scope.event = null;
    $scope.showSpinner = true;
    $scope.dataId = undefined;


    var _refreshViewData = function () {
      Event.find($scope.dataId).then( function (event) {
        $scope.$apply( function () {
          $scope.event = event;
          $scope.showSpinner = false;
        });
      });
    };

    supersonic.ui.views.current.whenVisible( function () {
      if ( $scope.dataId ) {
        _refreshViewData();
      }
    });

    supersonic.ui.views.current.params.onValue( function (values) {
      $scope.dataId = values.id;
      _refreshViewData();
    });

    $scope.remove = function (id) {
      $scope.showSpinner = true;
      $scope.event.delete().then( function () {
        supersonic.ui.layers.pop();
      });
    };
  });
