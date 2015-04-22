angular
  .module('event')
  .controller("ShowController", function ($scope, Event, supersonic) {
	$scope.currentUser = Parse.User.current();
    $scope.event = null;
    $scope.showSpinner = true;
    $scope.dataId = undefined;
    $scope.attendingStr = null;
    $scope.isAttending = false;
    $('#cancel-btn').hide();

    var currentUser = Parse.User.current();
    var GuestList = Parse.Object.extend("GuestList");
    
    var _refreshViewData = function () {
      Event.find($scope.dataId).then( function (event) {
        $scope.$apply( function () {
          $scope.event = event;
          $scope.showSpinner = false;

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
                  $('#join-btn').attr('disabled', true);
                  $('#cancel-btn').show();
                }
              }
            },
            error: function(error) {
              supersonic.ui.dialog.alert("Error with database.");
              supersonic.ui.dialog.alert(error);
            }
          });
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
    // allow user to join an event
    $scope.join = function(id) {
      if (currentUser === null) // check if logged in
        supersonic.ui.dialog.alert("You need to login before you can join an event!");
      else
      {
        var options = {
          eventId: id,
          userId: currentUser.id
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

    $scope.cancel = function(id) {
      // check if user is attending this event
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
    };
  });