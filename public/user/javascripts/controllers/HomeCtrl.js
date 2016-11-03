angular.module('studionet')

.controller('HomeCtrl', ['$scope', 'profile', 'Upload', '$timeout', 'modelsFactory', 'ModalService',

 function($scope, profile, Upload, $timeout, modelsFactory, ModalService){
	$scope.user = profile.user;
	$scope.modules = profile.modules;
  $scope.userModels = modelsFactory.userModels;
  
	$scope.isAdmin = profile.modules.reduce(function(res, curr){
		return res || curr.role==='Admin';
	}, false); 

	$scope.uploadPic = function(avatar) {
    avatar.upload = Upload.upload({
      url: '/uploads/avatar',
      data: {username: $scope.username, avatar: avatar},
    });

    avatar.upload.then(function (response) {
      $timeout(function () {
        avatar.result = response.data;

         // force a reload for avatar
	      var random = (new Date()).toString();
	      profile.getUser().then(function(){
		      $scope.user.avatar = $scope.user.avatar + "?cb=" + random;
		    });
      });
    }, function (response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      avatar.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
   }

  $scope.uploadModel = function(model){
    model.upload = Upload.upload({
      url: '/uploads/models',
      data: {username: $scope.username, model: model},
    });

    model.upload.then(function (response) {
      $timeout(function () {
        model.result = response.data;
      });
    }, function (response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      model.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
  };
  
  $scope.showDetailsModal = function(data) {

      ModalService.showModal({
        templateUrl: "/user/templates/home.graphView.modal.html",
        controller: "DetailsModalCtrl",
        inputs: {
          title: "A More Complex Example"
        }
      }).then(function(modal) {
        modal.element.modal();

        /// set data
        modal.scope.setData(data);

/*        modal.close.then(function(result) {
          //$scope.complexResult  = "Name: " + result.name + ", age: " + result.age;
        });*/
        
      });

    };

}]);