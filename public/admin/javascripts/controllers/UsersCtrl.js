angular.module('studionetAdmin')

.controller('UsersCtrl', ['$scope', 'users', function($scope, users){
	$scope.test = 'Hello';
	$scope.users = users.users;
	$scope.option = 'nusOpenId';
	$scope.showForm = false;

	$scope.toggleForm = function(){
		$scope.showForm = !$scope.showForm;
	}

	$scope.clearSearch = function(){
		$scope.search = {};
	};

	$scope.addNewUser = function(){
		if (!$scope.userName || $scope.userName === '' || !$scope.userNusOpenId || $scope.userNusOpenId === '' || !$scope.userYear || $scope.userYear === '')
			return;

		users.createNewUser({
			name: $scope.userName,
			nusOpenId: $scope.userNusOpenId,
			year: $scope.userYear,
			canEdit: $scope.userCanEdit
		});

		$scope.userName = '';
		$scope.userNusOpenId = '';
		$scope.userYear = '';
		$scope.userCanEdit = '';
	}

}])