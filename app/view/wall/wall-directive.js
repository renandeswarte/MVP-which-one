'use strict';

angular.module('myApp.wallDirective', [])

.directive('postElement', function() {
  return {
      restrict: 'AE',
      replace: 'true',
      templateUrl: 'view/wall/post.html'
      // link: function(scope, element, attributes) {
      //   console.log(attributes);
      // }
  };
});
