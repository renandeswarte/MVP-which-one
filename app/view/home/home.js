'use strict';

angular.module('myApp.homepage', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'view/home/home.html',
    controller: 'homepage',
  });
}])

.controller('homepage', ['$scope', '$firebaseObject', function($scope, $firebaseObject) {
  var ref = new Firebase("https://which-one.firebaseio.com/results");
  var syncObject = $firebaseObject(ref);

  syncObject.$bindTo($scope, "data");
}]);