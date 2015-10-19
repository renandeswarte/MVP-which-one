'use strict';

angular.module('myApp.addPost', [
  'firebase'
])
.controller("addPostController", ["$scope", "$firebaseObject",  
  function($scope, $firebaseObject) {

    $scope.createPost = function() { 
      var fileOneInput = $('#post-first-file').val();
      var fileTwoInput = $('#post-second-file').val();

      var ref = new Firebase("https://renan-app.firebaseio.com/post/");
      
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
        'date': new Date(),
      }
      // console.log(post);
        
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

