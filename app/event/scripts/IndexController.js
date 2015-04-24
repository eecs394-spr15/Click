angular
  .module('event')
  .controller("IndexController", function ($scope, Event, supersonic) {
    $scope.events = null;
    $scope.showSpinner = true;
	$scope.currentUser = Parse.User.current();



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
              $scope.events[i].EndDateText = null;
            }
            else{
              $scope.events[i].StartDateText = startDate.toDateString();
              $scope.events[i].EndDateText = "- " + endDate.toDateString();
            }
            var startTime = startDate.toLocaleTimeString();
            var endTime = endDate.toLocaleTimeString();
            var newStart = startTime.split(":");
            var newEnd = endTime.split(":");
            var sTime = newStart[2].split(" ");
            var addSTime = sTime[1];
            var eTime = newEnd[2].split(" ");
            var addETime = eTime[1];
            $scope.events[i].StartTimeText = newStart[0] + ":" + newStart[1] + addSTime;
            $scope.events[i].EndTimeText = newEnd[0] + ":" + newEnd[1] + addETime;
          }

        });
    });

    $scope.up = function (id) {
      $scope.currentUser = Parse.User.current();
    //  alert($scope.currentUser.password);
      //if($scope.currentUser== null){alert("hey");}
      for (var i = 0; i < $scope.events.length; i++)
      {
        if($scope.events[i].id==id)
        {
          $scope.events[i].Vote =($scope.events[i].Vote)+1;
        }
      }
//alert($scope.events[0].id)
      var Events = Parse.Object.extend("Events");
      var query = new Parse.Query(Events);
      query.get(id.toString(), {
        success: function(event) {
          // The object was retrieved successfully.
          event.increment('Vote',1);
          event.save();
         // alert(id);
          //alert(event.get('Vote'));
          //alert($scope.events[2].Vote);
          //($scope.events[2].Vote=;
          //alert($scope.events[2].Vote);
         
         // location.reload();
  //       $scope.events[2].Vote=event.get('Vote');
         //supersonic.data.model('Event').find(id).then( function(task) {
           
       //     alert(task.Vote);
           // $scope.events[2].Vote=task.Vote;
          //});
          //alert($scope.events[0].Vote);

        },
        error: function(object, error) {
          // The object was not retrieved successfully.
          // error is a Parse.Error with an error code and message.
          alert('vote error');
        }
      });  
    };
    $scope.down = function (id) { 
      for (var i = 0; i < $scope.events.length; i++)
      {
        if($scope.events[i].id==id)
        {
          $scope.events[i].Vote =($scope.events[i].Vote)-1;
        }
      } 
      
      var Events = Parse.Object.extend("Events");
      var query = new Parse.Query(Events);
      query.get(id.toString(), {
        success: function(event) {
          // The object was retrieved successfully.
          event.increment('Vote',-1);
          event.save();
         // alert(event.get('Vote'));
          //location.reload();

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
