angular.module('studionetAdmin')

.factory('modules', ['$resource', function($resource){
	// trying out $resource instead of $http
	return $resource('/api/modules/:id', {}, {
		update: {
			method: 'PUT'
		}
	});
}])

.factory('users', ['$http', function($http){
	/*
	return $resource('/api/users/:id', {}, {
		update: {
			method: 'PUT'
		}
	});
	*/

	var o = {
		users: []
	};

	o.getAll = function(){
		return $http.get('/api/users').success(function(data){
			angular.copy(data, o.users);
		});
	};

	o.createModNew = function(moderator){
		return $http.post('/api/moderators/new', moderator).success(function(data){
			o.users.push(data);
		});
	};

	o.createModExisting = function(moderator){
		return $http.post('/api/moderators/existing', moderator).success(function(data){
			o.users.push(data);
		});
	};

	o.createNewUser = function(user){
		return $http.post('/api/users', user).success(function(data){
			o.users.push(data);
		});
	}

	return o;
}]);
