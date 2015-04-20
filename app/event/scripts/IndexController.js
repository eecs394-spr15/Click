angular
  .module('event')
  .controller("IndexController", function ($scope, Event, supersonic) {
    $scope.events = null;
    $scope.showSpinner = true;



    Event.all().whenChanged( function (events) {
        $scope.$apply( function () {
          $scope.events = events;
          $scope.showSpinner = false;

          for (var i = 0; i < $scope.events.length; i++)
          {
            var startDate = new Date($scope.events[i].StartDate.iso);
            var endDate = new Date($scope.events[i].EndDate.iso);
            $scope.events[i].StartDateText = startDate.toDateString();
            $scope.events[i].EndDateText = endDate.toDateString();
            var startTime = startDate.toLocaleTimeString().split(" ");
            var endTime = endDate.toLocaleTimeString().split(" ");
            $scope.events[i].StartTimeText = startTime[0].split(":")[0] + ":" + startTime[0].split(":")[1] + " " +  startTime[1];
            $scope.events[i].EndTimeText = endTime[0].split(":")[0] + ":" + endTime[0].split(":")[1] + " " +  endTime[1];
          }
        });
    });
    $scope.predicate = "EventName";
  });
