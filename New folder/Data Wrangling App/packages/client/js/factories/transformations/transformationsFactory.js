'use strict';

var transformationModule=angular.module('transformationModule');

transformationModule.factory('transformationsFactory',['$http','serverURL',function($http,serverURL){
	
	return{
		getImpalaBuiltInLibrary	: function(){
			var url='http://localhost:8000/mongoServer/getImpalaBuiltInLibrary/';
			return $http.get(url);
		}
	}
	
}]);	