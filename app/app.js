'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'firebase',
  'myApp.authentification',
  'myApp.homepage',
  'myApp.wall',
  'myApp.view2',
  'myApp.version',
  'myApp.login-logout',
  'myApp.addPost',
  'myApp.wallDirective'
])

// .config(['$routeProvider', function($routeProvider) {
//   $routeProvider.otherwise({redirectTo: '/'});
// }])

.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireAuth promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/login");
    }
  });
}])

.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})

.controller("addMessageController", ["$scope", "$firebaseObject",  
  function($scope, $firebaseObject) {



    $scope.showMessages = function() {
      var array = [];
      var getMessages = new Firebase("https://renan-app.firebaseio.com/comments/");

      getMessages.orderByChild("postId").equalTo($scope.authData.post).on("child_added", function(snapshot) {
        array.push(snapshot.val());
        $scope.$apply();
      });
      $scope.messagesArray = array;
    }

    $scope.addComments = function() { 
      var commentsRef = new Firebase("https://renan-app.firebaseio.com/comments/");
      var myDate = +new Date() //Give back millisecond
      
      var comment = {
        'message': $scope.authData.userMessage,
        'postId': $scope.authData.post,
        'userId': $scope.authData.uid,
        'firstname': $scope.authData.firstname,
        'date': myDate
      }
      console.log(comment);
        
      //$save does not create a unique id, instead of push()
      commentsRef.push(comment, function(error) { 
        if (error) {
          // throw error;
          console.log(error) ;
        } else {
          console.log("comment saved!");
        }
      });
      $('#message').val('');
    };

  }])


;

