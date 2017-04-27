'use strict';

var previewModule=angular.module('previewModule');
previewModule.factory('previewFactory',['$http',function($http){
	
	return{
		previewData: function(taskDetails){
			var url='http://localhost:8000/impalaServer/previewData/';
			return $http({
				method: 'POST',
				url: url,
				params:{data:taskDetails}			
			});
		}
	}
	
}]);	
