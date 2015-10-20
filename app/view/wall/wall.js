'use strict';

angular.module('myApp.wall', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/wall', {
    templateUrl: 'view/wall/wall.html',
    controller: 'wallCtrl',
    resolve: {
      // controller will not be loaded until $waitForAuth resolves
      // Auth refers to our $firebaseAuth wrapper in the example above
      "currentAuth": ["Auth", function(Auth) {
        // $waitForAuth returns a promise so the resolve waits for it to complete
        return Auth.$requireAuth();
        // return Auth.$waitForAuth();
      }]
    }
  });
}])

.controller('wallCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {

  var ref = new Firebase("https://renan-app.firebaseio.com/posts");
  var syncObject = $firebaseObject(ref);
  syncObject.$bindTo($scope, "data");

  $scope.hasVoted = function(postId, user) {
    for (var vote in user.voters) {
      if (user.voters[vote] === postId) { 
        return true;
      }
    }
    return false;
  }

  $scope.vote = function(elm, side) {
    // Increment the votes
    elm.totalVote++;
    if (side === "one") {
      elm.voteOne++;
    } else {
      elm.voteTwo++;
    }
  }
  
  $scope.updateVote = function(postId, user) {
    // Update who voted fot this post
    var postVotersRef = new Firebase("https://renan-app.firebaseio.com/users/" + user + "/voters");
    var postVotersArray = $firebaseArray(postVotersRef);
    postVotersArray.$add(postId).then(function() {
      console.log('voter saved!');
    }).catch(function(error) {
      console.log('Error!');
    });
  }

}]);

