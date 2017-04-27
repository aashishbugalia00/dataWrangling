'use strict';

var headerModule=angular.module('headerModule');
headerModule.factory('headerFactory',['$http',function($http){
	
	return{
		saveDataMongo: function(taskDetails){			
			var url='http://localhost:8000/mongoServer/saveData/';
			return $http({
				method: 'POST',
				url: url,
				params:{data:taskDetails}			
			});
		},
		saveDataImpala: function(taskDetails){
			var url='http://localhost:8000/impalaServer/saveData/';
			return $http({
				method: 'POST',
				url: url,
				params:{data:taskDetails}			
			});
		}
		/*previewData: function(taskDetails){
			var url='http://localhost:8000/impalaServer/saveData/';
			return $http({
				method: 'POST',
				url: url,
				params:{data:taskDetails}			
			});
		}*/
	}
	
}]);	
