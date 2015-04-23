angular
  .module('event')
  .controller("LoginController", function ($scope, supersonic) {
  $scope.scenario = 'Sign up';
  $scope.currentUser = Parse.User.current();

  $scope.signUp = function(){
      var user = new Parse.User();
      user.set("username", $scope.newUser.username);
      user.set("password", $scope.newUser.password);
      user.set("email", $scope.newUser.email);
      user.signUp(null, {
      success: function(user) {
        $scope.currentUser = user;
        $scope.$apply();
        supersonic.ui.dialog.alert("success");
		supersonic.ui.layers.pop();
		supersonic.ui.tabs.select(0);
      },
      error: function(user, error) {
        supersonic.ui.dialog.alert("Error: " + error.message);
      }
    });
  };


   $scope.logIn = function(){
    Parse.User.logIn($scope.existingUser.username, $scope.existingUser.password, {
        success: function(user) {
          $scope.currentUser = user;
          $scope.$apply();
          user.save(null, {
            success: function(user) {
            supersonic.ui.dialog.alert("successfully logged in");
			//supersonic.ui.layers.pop();
			//var view = new supersonic.ui.View("event#new");
			//supersonic.ui.views.find("indexView").then( function(startedView) {
				//alert("hehe");
				//startedView.start();
				//supersonic.logger.error("myCarsView location: " + startedView.getLocation());
				//startedView.reload();
				supersonic.ui.tabs.select(0);
			//});
			//supersonic.ui.views.find("index").getLocation().reload();
            }
          });
        },
        error: function(user, error) {
            supersonic.ui.dialog.alert("Error: " + error.message);
            }
      });
  }
  
  $scope.logOut = function() {
    Parse.User.logOut();
    $scope.currentUser = null;
  };
  
  $scope.addNewEvent = function () {
		if(!Parse.User.current()){
		    supersonic.ui.dialog.alert("You need login to create new event");
		}else{
		var view = new supersonic.ui.View("event#new");
		supersonic.ui.layers.push(view);
		}
    };
});