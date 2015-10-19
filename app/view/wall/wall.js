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


.controller('wallCtrl', ['$scope', '$firebaseObject', function($scope, $firebaseObject) {

  var ref = new Firebase("https://renan-app.firebaseio.com/posts");
  var syncObject = $firebaseObject(ref);
  syncObject.$bindTo($scope, "data");

}]);