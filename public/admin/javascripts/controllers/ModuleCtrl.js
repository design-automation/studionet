angular.module('studionetAdmin')

.controller('ModuleCtrl', ['$scope', '$stateParams', 'modules', 'modulePromise', function($scope, $stateParams, modules, modulePromise){
	// consider placing this in resolve during route?
	/*
	$scope.module = modules.get({id: $stateParams.id}, function(){
		// success callback
		$scope.moduleCode = $scope.module.code;
		$scope.moduleName = $scope.module.name;
		$scope.contributionTypes = $scope.module.contributionTypes;
	});
	*/

	// doing it in resolve, get data first then load page
	$scope.module = modulePromise;
	$scope.moduleCode = $scope.module.code;
	$scope.moduleName = $scope.module.name;
	$scope.contributionTypes = $scope.module.contributionTypes;


	$scope.updateModule = function(){
		if (!$scope.moduleCode || $scope.moduleCode === '' || !$scope.moduleName || $scope.moduleName === '' || !$scope.contributionTypes || $scope.contributionTypes === [])
			return;

		modules.update({id: $stateParams.id},{
			name: $scope.moduleName,
			code: $scope.moduleCode,
			// convert array into string array, ngTagsInput gives an object array for some reason
			contributionTypes: $scope.contributionTypes.map((o) => o.text) 
		}, function(module){
			// update the modules doing a resource query
			// can consider doing a local push instead..
			// $scope.modules = modules.query();

			$scope.module = modules.get({id: $stateParams.id}, function(){
				// success callback
				$scope.moduleCode = $scope.module.code;
				$scope.moduleName = $scope.module.name;
				$scope.contributionTypes = $scope.module.contributionTypes;
			})

		});
	}

}]);