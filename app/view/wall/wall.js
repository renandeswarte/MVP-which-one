'use strict';

angular.module('myApp.wall', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/wall', {
    templateUrl: 'view/wall/wall.html',
    controller: 'wallCtrl',
    resolve: {
      "currentAuth": ["Auth", function(Auth) {
        return Auth.$requireAuth();
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
}])

;

