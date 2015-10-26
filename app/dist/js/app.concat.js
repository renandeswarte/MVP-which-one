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
      var getMessages = new Firebase("https://which-one.firebaseio.com/comments/");

      getMessages.orderByChild("postId").equalTo($scope.authData.post).on("child_added", function(snapshot) {
        array.push(snapshot.val());
        $scope.$apply();
      });
      $scope.messagesArray = array;
    }

    $scope.addComments = function() { 
      var commentsRef = new Firebase("https://which-one.firebaseio.com/comments/");
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

;'use strict';

angular.module('myApp.addPost', [
  'firebase'
])
.controller("addPostController", ["$scope", "$firebaseObject",  
  function($scope, $firebaseObject) {

    $scope.createPost = function() { 
      var fileOneInput = $('#post-first-file').val();
      var fileTwoInput = $('#post-second-file').val();

      var ref = new Firebase("https://which-one.firebaseio.com/posts/");
      var myDate = +new Date() //Give back millisecond
      
      var post = {
        'title': $scope.postTitle,
        'description': $scope.postDescription,
        'firstTitle': $scope.firstTitle,
        'fileOne': fileOneInput,
        'secondTitle': $scope.secondTitle,
        'fileTwo': fileTwoInput,
        'userId': $scope.authData.uid,
        'totalVote': 0,
        'voteOne': 0,
        'voteTwo':0,
        'date': myDate,
        'firstname': $scope.authData.firstname
      }
        
      // $save does not create a unique id, instead of push()
      ref.push(post, function(error) { 
        if (error) {
          // throw error;
          console.log(error) ;
        } else {
          console.log("post saved!");
        }
      });

      // Closing modal
      $('#postModal').modal('toggle');
    };
  }])

;

;'use strict';

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

;'use strict';

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
}]);;'use strict';

angular.module('myApp.login-logout', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'view/login-logout/login-logout.html',
  });
}]);;'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view/view2/view2.html',
    controller: 'View2Ctrl',
    resolve: {
      "currentAuth": ["Auth", function(Auth) {
        return Auth.$requireAuth();
      }]
    }
  });
}])

.controller('View2Ctrl', [function() {

}]);;'use strict';

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
;'use strict';

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

  var ref = new Firebase("https://which-one.firebaseio.com/posts");
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
    var postVotersRef = new Firebase("https://which-one.firebaseio.com/users/" + user + "/voters");
    var postVotersArray = $firebaseArray(postVotersRef);
    postVotersArray.$add(postId).then(function() {
      console.log('voter saved!');
    }).catch(function(error) {
      console.log('Error!');
    });
  }
}])

;

