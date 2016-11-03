angular.module('studionet')

.controller('DetailsModalCtrl', ['$scope', 'profile',  function($scope, profile){
	$scope.name = "Jane Doe";
  $scope.age = 12;
  
  $scope.data = {};


  $scope.setData = function(data){
      $scope.data = data;
      console.log(data);

      
  }
  
  //  This close function doesn't need to use jQuery or bootstrap, because
  //  the button has the 'data-dismiss' attribute.
  $scope.close = function() {
 	  
    close({
      name: $scope.user,
      age: $scope.modules
    }, 500); // close, but give 500ms for bootstrap to animate

    //$element.modal('hide');
  };

  //  This cancel function must use the bootstrap, 'modal' function because
  //  the doesn't have the 'data-dismiss' attribute.
  $scope.cancel = function() {

    //  Manually hide the modal.
    //$element.modal('hide');
    
    //  Now call close, returning control to the caller.
    close({
      name: $scope.user,
      age: $scope.modules
    }, 500); // close, but give 500ms for bootstrap to animate
  
  };



}]);