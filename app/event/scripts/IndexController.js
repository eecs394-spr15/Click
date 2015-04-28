angular
  .module('event')
  .controller("IndexController", function ($scope, Event, supersonic) {
    $scope.events = null;
    $scope.showSpinner = true;
    $scope.currentUser = Parse.User.current();
    $scope.localvote=0;
    //$scope.test;
    $scope.key;
    
   
  
   

    //upvote and downvote

    Event.all().whenChanged( function (events) {
        $scope.$apply( function () {
          $scope.events = events;
          $scope.showSpinner = false;

          // format date and time to human readable
          for (var i = 0; i < $scope.events.length; i++)
          {
            $scope.events[i] = EventHelper.formatEvent(events[i]);
            $scope.events[i].StartTimeComparison = $scope.events[i].StartDate.iso;
          }

        });
    });
 
    $scope.up = function (id) {
     
      $scope.currentUser = Parse.User.current();
      // check if the user already voted or not
      // var localvote=0;
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
          if((typeof results=='undefined' || results.get('alreadyVote')  <1) && $scope.localvote!=1){
            $scope.localvote++;
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
                $scope.$apply( function () {
                 $scope.localvote--;
                });

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
       //   alert(localvote);
          if((typeof results=='undefined' || results.get('alreadyVote')>-1) && $scope.localvote != -1){
            $scope.localvote--;
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
                $scope.$apply( function () {
                 $scope.localvote++;
                });

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


    $scope.predicate = "StartTimeComparison";
    $scope.reverse = false;
    $scope.timeReverse = false;
    $scope.voteReverse = false;
    $scope.nameReverse = false;

    $scope.$watch('timeReverse', function() {
      if ($scope.predicate == 'StartTimeComparison')
      {
        $('#name-btn').removeClass('button-positive');
        $('#vote-btn').removeClass('button-positive');

        if ($scope.timeReverse === true)
        {
          $('#time-btn').removeClass('icon-right super-chevron-up');
          $('#time-btn').addClass('icon-right super-chevron-down button-positive');
        }
        else
        {
          $('#time-btn').removeClass('icon-right super-chevron-down');
          $('#time-btn').addClass('icon-right super-chevron-up button-positive');
        }
      }
    });
    steroids.logger.log();

    $scope.$watch('nameReverse', function() {
      if ($scope.predicate == 'EventName')
      {

        $('#vote-btn').removeClass('button-positive');
        $('#time-btn').removeClass('button-positive');
        if ($scope.nameReverse === true)
        {
          $('#name-btn').removeClass('icon-right super-chevron-up');
          $('#name-btn').addClass('icon-right super-chevron-down button-positive');
        }
        else
        {
          $('#name-btn').removeClass('icon-right super-chevron-down');
          $('#name-btn').addClass('icon-right super-chevron-up button-positive');
        }
      }
    });
    $scope.$watch('voteReverse', function() {
      if ($scope.predicate == '-Vote')
      {
        $('#name-btn').removeClass('button-positive');
        $('#time-btn').removeClass('button-positive');
        if ($scope.voteReverse === true)
        {
          $('#vote-btn').removeClass('icon-right super-chevron-up');
          $('#vote-btn').addClass('icon-right super-chevron-down button-positive');
        }
        else
        {
          $('#vote-btn').removeClass('icon-right super-chevron-down');
          $('#vote-btn').addClass('icon-right super-chevron-up button-positive');
        }
      }
    });

    document.addEventListener("visibilitychange", onVisibilityChange, false);

    function onVisibilityChange() {
      location.reload();
    }

  });
