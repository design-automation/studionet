angular.module('studionetAdmin')

.controller('ModulesCtrl', ['$scope', 'modules', 'users', 'modulesPromise', function($scope, modules, users, modulesPromise){
	// $scope.modules = modules.query();
	// get modules data before page loads
	$scope.modules = modulesPromise;
	$scope.usersList = users.users;
	$scope.showForm = false;

	$scope.moderators = [{modtype: 'existing'}];

	$scope.toggleForm = function(){
		$scope.showForm = !$scope.showForm;
	}

	$scope.addNewModField = function(){
		$scope.moderators.push({modtype: 'existing'});
	};

	$scope.removeModField = function(moderator){
		$scope.moderators.splice($scope.moderators.indexOf(moderator), 1);
	};

	$scope.modIsExisting = function(moderator){
		return moderator.modtype === 'existing';
	};

	$scope.deleteModule = function(module){
		if(confirm('Really delete module ' + module.code + ': ' + module.name))
			modules.delete(module, function(){
				// success callback
				$scope.modules.splice($scope.modules.indexOf(module), 1);
			});
	};

	$scope.addModule = function(){
		if (!$scope.moduleCode || $scope.moduleCode === '' || !$scope.moduleName || $scope.moduleName === '' || !$scope.contributionTypes || $scope.contributionTypes === [])
			return;

		modules.save({
			name: $scope.moduleName,
			code: $scope.moduleCode,
			// convert array into string array, ngTagsInput gives an object array for some reason
			contributionTypes: $scope.contributionTypes.map((o) => o.text) 
		}, function(module){
			// update the modules doing a resource query
			// can consider doing a local push instead..
			// $scope.modules = modules.query();

			$scope.modules.push(module);

			$scope.moderators.forEach(function(moderator){
				// check if existing or new user
				if (moderator.modtype === 'existing'){
					// user already exists in db
					users.createModExisting({
						nusOpenId: moderator.nusOpenIdExisting,
						moduleId: module.id
					});

				}
				else {
					// need to create a new user
					users.createModNew({
						name: moderator.name,
						nusOpenId: moderator.nusOpenId,
						canEdit: moderator.canEdit,
						year: moderator.year,
						moduleId: module.id
					});
				}

			});

			$scope.moderators = [{modtype: 'existing'}]

		});

		$scope.moduleName = '';
		$scope.moduleCode = '';
		$scope.contributionTypes = [];
	}
	
}]);