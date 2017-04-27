'use strict';

var filterModule=angular.module('filterModule');
filterModule.factory('filtersFactory',['$http','serverURL',function($http,serverURL){
	
	return{
		getFilterList: function(){
			var url='http://localhost:8000/mongoServer/getFilterList/';
			return $http.get(url);
		}
	}
	
}]);	
