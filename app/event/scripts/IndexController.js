angular
  .module('event')
  .controller("IndexController", function ($scope, Event, supersonic) {
    $scope.events = null;
    $scope.showSpinner = true;
$scope.currentUser = Parse.User.current();
    var already=0;
   

    //upvote and downvote

    



    Event.all().whenChanged( function (events) {
        $scope.$apply( function () {
          $scope.events = events;
          $scope.showSpinner = false;

          // format date and time to human readable
          for (var i = 0; i < $scope.events.length; i++)
          {
            $scope.events[i] = EventHelper.formatEvent(events[i]);
          }

        });
    });

    $scope.up = function (id) {
  
      $scope.currentUser = Parse.User.current();
      if($scope.currentUser == null){
        supersonic.ui.dialog.alert("Please Log In First :)");
      }else if (already==1){
        supersonic.ui.dialog.alert("You already vote :)");
      }else{
        for (var i = 0; i < $scope.events.length; i++)
        {
          if($scope.events[i].id==id)
          {
            $scope.events[i].Vote =($scope.events[i].Vote)+1;
          }
        }
        var Events = Parse.Object.extend("Events");
        var query = new Parse.Query(Events);
        query.get(id.toString(), {
          success: function(event) {
          // The object was retrieved successfully.
            event.increment('Vote',1);
            event.save();

          },
          error: function(object, error) {
          // The object was not retrieved successfully.
          // error is a Parse.Error with an error code and message.
            alert('vote error');
          }
        });
        already++;
        //alreadydown=0;
        //reset=0;
      }  
    };
    $scope.down = function (id) { 
      $scope.currentUser = Parse.User.current();
    //  alert($scope.currentUser);
      if($scope.currentUser == null){
        supersonic.ui.dialog.alert("Please Log In First :)");
      }else if (already==-1){
        supersonic.ui.dialog.alert("You already vote :)");
      }else{
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

          },
          error: function(object, error) {
          // The object was not retrieved successfully.
          // error is a Parse.Error with an error code and message.
            alert('vote error');
          }
        });
        already--; 
      }  
    };

    $scope.addNewEvent = function () {
      $scope.currentUser = Parse.User.current();
      if(!$scope.currentUser)
      {
        supersonic.ui.dialog.alert("You need login to create new event");
      }
      else
      {
        var view = new supersonic.ui.View("event#new");
        supersonic.ui.layers.push(view);
      }
    };


    $scope.predicate = "EventName";

    document.addEventListener("visibilitychange", onVisibilityChange, false);

    function onVisibilityChange() {
      location.reload();
    }

  });
