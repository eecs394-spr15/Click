angular
  .module('event')
  .controller("IndexController", function ($scope, Event, supersonic) {
    $scope.events = null;
    $scope.showSpinner = true;


    //upvote and downvote

    



    Event.all().whenChanged( function (events) {
        $scope.$apply( function () {
          $scope.events = events;
          $scope.showSpinner = false;

          for (var i = 0; i < $scope.events.length; i++)
          {
            var startDate = new Date($scope.events[i].StartDate.iso);
            var endDate = new Date($scope.events[i].EndDate.iso);
            if (startDate.toDateString() == endDate.toDateString()){
              $scope.events[i].StartDateText = startDate.toDateString();
              $scope.events[i].EndDateText = "hi";
            }
            else{
              $scope.events[i].StartDateText = startDate.toDateString();
              $scope.events[i].EndDateText = "- " + endDate.toDateString();
            }
            var startTime = startDate.toLocaleTimeString();
            var endTime = endDate.toLocaleTimeString();
            var newStart = startTime.split(":");
            var newEnd = endTime.split(":");
            var a = newStart[2].split(" ");
            var b = a[1];
            var c = newEnd[2].split(" ");
            var d = c[1];
            $scope.events[i].StartTimeText = newStart[0] + ":" + newStart[1] + b;
            $scope.events[i].EndTimeText = newEnd[0] + ":" + newEnd[1];

            //$scope.events[i].StartTimeText = startTime[0].split(":")[0] + ":" + startTime[0].split(":")[1] + " " +  startTime[1];
            //$scope.events[i].EndTimeText = endTime[0].split(":")[0] + ":" + endTime[0].split(":")[1] + " " +  endTime[1];
          }

        });
    });

    $scope.up = function (id) {

      
  
      var Events = Parse.Object.extend("Events");
      var query = new Parse.Query(Events);
      query.get(id.toString(), {
        success: function(event) {
          // The object was retrieved successfully.
          event.increment('Vote');
          event.save();
          alert(event.get('Vote'));
          location.reload();


        },
        error: function(object, error) {
          // The object was not retrieved successfully.
          // error is a Parse.Error with an error code and message.
          alert('vote error');
        }
      });  
    };
    $scope.down = function (id) {  
      var Events = Parse.Object.extend("Events");
      var query = new Parse.Query(Events);
      query.get(id.toString(), {
        success: function(event) {
          // The object was retrieved successfully.
          event.increment('Vote',-1);
          event.save();
          alert(event.get('Vote'));
          location.reload();

        },
        error: function(object, error) {
          // The object was not retrieved successfully.
          // error is a Parse.Error with an error code and message.
          alert('vote error');
        }
      });  

  
     
  
    };
    $scope.predicate = "EventName";

  });
