angular
  .module('event')
  .controller("IndexController", function ($scope, Event, supersonic) {
    $scope.events = null;
    $scope.showSpinner = true;
    $scope.currentUser = Parse.User.current();
    var already=0;
    //$scope.test;
    $scope.key;
   
  
   

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
      // check if the user already voted or not

     if($scope.currentUser == null){
        supersonic.ui.dialog.alert("Please Log In First :)");
     }else{
      var Vote = Parse.Object.extend("Vote");
      query = new Parse.Query(Vote);
      query.equalTo("userId", $scope.currentUser.id);
      query.equalTo("eventId",id);
      query.first({
        success: function(results)
        {  //check if the user already voted or already upvote  
          if(typeof results=='undefined' || results.get('alreadyVote')  <1){
            for (var i = 0; i < $scope.events.length; i++)
            {
              if($scope.events[i].id==id)
              {
                $scope.$apply( function () {
                  $scope.events[i].Vote =($scope.events[i].Vote)+1;
                });
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
       
          ////////user haven't voted, store alreadyvote =1
           if(typeof results=='undefined'){
            var record = {
              eventId: id,
              userId: $scope.currentUser.id,
              email: $scope.currentUser.get('email'),
              alreadyVote: 1
            };
            var addVote = Parse.Object.extend("Vote");
            var addVote = new addVote();
            addVote.save(record, {
              success: function(object) {
           
           // location.reload();
              },
              error: function(model, error) {
                steroids.logger.log(error);
                alert("Could not join event, please try again.");
              }
            });
           }else{ //user already vote, maybe is down vote, so vote++
            var kk=results.get("alreadyVote");
            kk++;
            results.set("alreadyVote",kk);
            results.save();
        
            }
        

          }else{
            supersonic.ui.dialog.alert("You Already Upvote :)");
          }
        },
        error: function(error) {
          supersonic.ui.dialog.alert("Error with database.");
          supersonic.ui.dialog.alert(error);
        }
      });
    }


    };
    $scope.down = function (id) { 
      $scope.currentUser = Parse.User.current();
      // check if the user already voted or not

     if($scope.currentUser == null){
        supersonic.ui.dialog.alert("Please Log In First :)");
     }else{
      var Vote = Parse.Object.extend("Vote");
      query = new Parse.Query(Vote);
      query.equalTo("userId", $scope.currentUser.id);
      query.equalTo("eventId",id);
      query.first({
        success: function(results)
        {      
          
          if(typeof results=='undefined' || results.get('alreadyVote')>-1){
            for (var i = 0; i < $scope.events.length; i++)
            {
              if($scope.events[i].id==id)
              {
                $scope.$apply( function () {
                  $scope.events[i].Vote =($scope.events[i].Vote)-1;
                });
              }
            } 
           // alert("hehe");
            
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
          ////////store alreadyvote =1
            if(typeof results=='undefined'){
            var record = {
              eventId: id,
              userId: $scope.currentUser.id,
              email: $scope.currentUser.get('email'),
              alreadyVote: -1
            };
            var addVote = Parse.Object.extend("Vote");
            var addVote = new addVote();
            addVote.save(record, {
              success: function(object) {
           
           // location.reload();
              },
              error: function(model, error) {
                steroids.logger.log(error);
                alert("Could not join event, please try again.");
              }
            });
           }else{
              var kk=results.get("alreadyVote");
            kk--;
            results.set("alreadyVote",kk);
            results.save();

           }
         
          }else{
            supersonic.ui.dialog.alert("You Already Downvote :)");
          }
        },
        error: function(error) {
          supersonic.ui.dialog.alert("Error with database.");
          supersonic.ui.dialog.alert(error);
        }
      });
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
