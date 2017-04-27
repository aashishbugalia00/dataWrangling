'use strict';

var createTaskModule=angular.module('createTaskModule');
createTaskModule.factory('createTaskFactory',['$http','serverURL',function($http,serverURL){

    return{
        getChildTaleList: function(){
            var url='http://localhost:8000/impalaServer/getChildTableList/';
            return $http.get(url);
        }
    }

}]); 