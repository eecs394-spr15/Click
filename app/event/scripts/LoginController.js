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
        alert("success");
      },
      error: function(user, error) {
        alert("Error: " + error.message);
      }
    });
  }


  $scope.logIn = function(){
    Parse.User.logIn($scope.existingUser.username, $scope.existingUser.password, {
        success: function(user) {
          $scope.currentUser = user;
          $scope.$apply();
          user.save(null, {
            success: function(user) {
            alert("successfully logged in");
            }
          });
        },
        error: function(user, error) {
            alert("Error: " + error.message);
            }
      });
  }
  
  $scope.logOut = function() {
    Parse.User.logOut();
    $scope.currentUser = null;
  };
});