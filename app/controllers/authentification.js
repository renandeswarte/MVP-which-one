'use strict';

angular.module('myApp.authentification', [
  'firebase'
])

.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://which-one.firebaseio.com");
    return $firebaseAuth(ref);
  }
])

.controller("authTest", ["$scope", "Auth", "$firebaseObject", "$location",
  function($scope, Auth, $firebaseObject, $location) {
    $scope.auth = Auth;

    // any time auth status updates, add the user data to scope
    Auth.$onAuth(function(authData) {
      if (authData) {
        var ref = new Firebase("https://which-one.firebaseio.com/");
        var userInfo = $firebaseObject(ref.child('users').child(authData.uid));
        $scope.authData = userInfo;
      }
    });

    $scope.logout = function() { 
        Auth.$unauth();
        $scope.authData = false;
    };
  }
])

// and use it in our controller
.controller("authController", ["$scope", "Auth", '$location', '$firebaseObject',
  function($scope, Auth, $location, $firebaseObject) {
    $scope.createUser = function() {
      $scope.message = null;
      $scope.error = null;

      Auth.$createUser({
        email: $scope.email,
        password: $scope.password
      }).then(function(userData) {
        $scope.message = "User created with uid: " + userData.uid;

        var ref = new Firebase("https://which-one.firebaseio.com/users/" + userData.uid);
        var user = $firebaseObject(ref);
        
        user.firstname = $scope.firstname;
        user.lastname = $scope.lastname;
        user.email = $scope.email;
        user.uid = userData.uid;
        // $save does not create a unique id, instead of push()
        user.$save().then(function() {
            console.log('user saved!');
          }).catch(function(error) {
            console.log('Error!');
        });

        // Auto login after signup
        Auth.$authWithPassword({
          email: $scope.email,
          password: $scope.password
        }).then(function(authData) {
          // console.log("Logged in as:", authData.uid);
          // Redirect to main page after login
          $location.path("/wall");
        }).catch(function(error) {
          console.error("Authentication failed:", error);
          $scope.error = error;
        });

      }).catch(function(error) {
        $scope.error = error;
      });
    };

    $scope.removeUser = function() {
      $scope.message = null;
      $scope.error = null;

      Auth.$removeUser({
        email: $scope.email,
        password: $scope.password
      }).then(function() {
        $scope.message = "User removed";
      }).catch(function(error) {
        $scope.error = error;
      });
    };
  }
])

.controller("login", ["$scope", "Auth", '$location', 
  function($scope, Auth, $location) {

    $scope.login = function() {
      $scope.authData = null;
      $scope.error = null;

      Auth.$authWithPassword({
        email: $scope.email,
        password: $scope.password
      }).then(function(authData) {
        // Redirect to main page after login
        $location.path("/wall");
      }).catch(function(error) {
        console.error("Authentication failed:", error);
        $scope.error = error;
      });
    };
  }
])

;

