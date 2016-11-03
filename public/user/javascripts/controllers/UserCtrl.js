angular.module('studionet')

.controller('UserCtrl', ['$scope', 'profile', function($scope, profile){
	$scope.user = profile.user;
	$scope.modules = profile.modules;
}])


/*
 *	Controller for Groups
 * 
 */
.controller('GroupsCtrl', ['$scope', 'profile', '$http', function($scope, profile, $http){


	$scope.user = profile.user;
	$scope.modules = profile.modules;

	$scope.groups = [

				{
					name: 'None', 
					id: -1
				}

	]

	$scope.users = undefined;

	$http.get('/api/groups/').success(function(data){
		$scope.groups = $scope.groups.concat(data);
		console.log($scope.groups);
	});




	/*
	 * New Group Variables
	 */
	$scope.groupName = "";
	$scope.groupDesc = "";
	$scope.groupParent = -1;
	$scope.groupMembers = [];
	$scope.groupRestricted = false;


	$scope.createGroup = function(){

		alert("Creating Group");

		// how to I add users?
		var dummyData = {
			'name' : $scope.groupName,
			'description' : $scope.groupDescription,
			'restricted': $scope.groupRestricted,
			'groupParentId': $scope.groupParent.id, 
		}

		$http({
		  method  : 'POST',
		  url     : '/api/groups/',
		  data    : dummyData,  // pass in data as strings
		  headers : { 'Content-Type': 'application/json' }  // set the headers so angular passing info as form data (not request payload)
		 })
		.success(function(data) {
		    
		    console.log(data);

		    if (!data.success) {
		      // if not successful, bind errors to error variables
		      $scope.errorName = data.errors.name;
		      $scope.errorSuperhero = data.errors.superheroAlias;
		    } else {
		      // if successful, bind success message to message
		      $scope.message = data.message;
		    }


			    $scope.groupName = "";
			    $scope.groupDescription = "";
			    $scope.groupRestricted = false;
			    $scope.groupParentId = -1;

		  });



	}



}]);