angular
  .module('event')
  .controller("ShowController", function ($scope, Event, supersonic) {
    $scope.event = null;
    $scope.showSpinner = true;
    $scope.dataId = null;
    $scope.attendingStr = null;
    $scope.isAttending = false;
    $scope.guestList = [];
    $scope.isLoggedIn = false;
    $scope.ownsEvent = false;
    $('#cancel-btn').hide();
    var currentUser = Parse.User.current();
    if (currentUser === null)
      $scope.isLoggedIn = false;
    else
      $scope.isLoggedIn = true;
    var GuestList = Parse.Object.extend("GuestList");
    
    var _refreshViewData = function () {
      Event.find($scope.dataId).then( function (event) {
        $scope.$apply( function () {
          //$scope.event = event;

          $scope.event = EventHelper.formatEvent(event);
          $scope.showSpinner = false;

          // get list of who is attending
          query = new Parse.Query(GuestList);
          query.equalTo("eventId", $scope.event.id);
          query.find({
            success: function(results)
            {
              $scope.$apply( function () {
                $scope.guestList = results;
              });
            },
            error: function(error) {
              supersonic.ui.dialog.alert("Error with database.");
              supersonic.ui.dialog.alert(error);
            }
          });
          if (currentUser !== null)
          {
            // check if user is attending this event
            var query = new Parse.Query(GuestList);
            query.equalTo("userId", currentUser.id);
            query.find({
              success: function(results)
              {
                for (var i = 0; i < results.length; i++)
                {
                  if (results[i].get('eventId') == $scope.event.id)
                  {
                    $('#join-btn-text').text('Attending');
                    $scope.isAttending = true;
                    $('#join-btn').attr('checked', true);
                    $('#cancel-btn').show();
                  }
                }
              },
              error: function(error) {
                supersonic.ui.dialog.alert("Error with database.");
                supersonic.ui.dialog.alert(error);
              }
            });
          }
          // check if user owns this event
          if (currentUser)
            if (currentUser.get("username") == $scope.event.PosterName)
            {
              $scope.ownsEvent = true;
            }
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

    $scope.checkEvent = function (id) {
      if ($('#join-btn').attr('checked'))
      {
        $scope.cancel(id);

      }
      else
      {
        $scope.join(id);
      }
    };


    // allow user to join an event
    $scope.join = function(id) {
      if (currentUser === null) { // check if logged in
        supersonic.ui.dialog.alert("You need to login before you can join an event!");
      }
      else
      {
        var options = {
          eventId: id,
          userId: currentUser.id,
          email: currentUser.get('email')
        };

        var newGuestObject = new GuestList();
        newGuestObject.save(options, {
          success: function(object) {
            location.reload();
          },
          error: function(model, error) {
            steroids.logger.log(error);
            alert("Could not join event, please try again.");
          }
        });    

      }
    };

    $scope.CONFIG = localStorage.getItem('CONFIG');
if (!$scope.CONFIG) {
  $scope.CONFIG = {sport: true};
}

$scope.save = function(checked) {
  $scope.CONGIF.sport = checked;
  localStorage.setItem('CONFIG', $scope.CONFIG);
}



    $scope.cancel = function(id) {
      // check if user is attending this event
      if (currentUser === null){
        supersonic.ui.dialog.alert("You need to login before you can cancel");
      }
      else
      {
        var query = new Parse.Query(GuestList);
        query.equalTo("userId", currentUser.id);
        query.first({
          success: function(myObject)
          {
            myObject.destroy({
              success: function(myObject) {
                location.reload();
              },
              error: function(myObject, error) {
                supersonic.dialog.ui.alert("error canceling event, please try again.");
              }
            });
            
          },
          error: function(error) {
            supersonic.ui.dialog.alert("Error with database.");
            supersonic.ui.dialog.alert(error);
          }
        });
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange, false);

    function onVisibilityChange() {
        location.reload();
    }

    $scope.editEvent = function () {
      var view = new supersonic.ui.View("event#edit");
      supersonic.ui.layers.push(view);
    };

    $scope.remove = function(id) {
      if (currentUser === null)
        supersonic.ui.dialog.alert("You need to login before you can cancel");
      else
      {
        var Event = Parse.Object.extend("Events");
        var query = new Parse.Query(Event);
        query.equalTo("objectId", id);
        query.first({
          success: function(myObject)
          {
            myObject.destroy({});
            supersonic.ui.dialog.alert("Event Canceled.");
            supersonic.ui.layers.popAll();
            
          },
          error: function(error) {
            supersonic.ui.dialog.alert("Error with database.");
            supersonic.ui.dialog.alert(error);
          }
        });

      }
    };

  });