'use strict';

var lookupModule=angular.module('lookupModule');
lookupModule.factory('lookupFactory',['$http',function($http){
	return{
		getLookupTables	: function(){
			var url='http://localhost:8000/mongoServer/getLookupTableList/';
			return $http.get(url);
		},
		getLoopUpConditionsList	: function(){
			var url='http://localhost:8000/mongoServer/getLoopUpConditionsList/';
			return $http.get(url);
		},
		getChildTaleList: function(){
            var url='http://localhost:8000/impalaServer/getChildTableList/';
            return $http.get(url);
        }
	}
	
}]);	
