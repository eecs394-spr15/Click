angular
  .module('event')
  .controller("IndexController", function ($scope, Event, supersonic) {
    $scope.events = null;
    $scope.showSpinner = true;


    Event.all().whenChanged( function (events) {
        $scope.$apply( function () {
          $scope.events = events;
          $scope.showSpinner = false;
        });
    });

    $scope.predicate = "DateTime";
    
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

  });
