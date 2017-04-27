'use strict'
var previewModule=angular.module('previewModule',[]);

previewModule.controller('previewController',['$scope','$rootScope','$sessionStorage','previewFactory','commonServices',
	function($scope,$rootScope,$sessionStorage,previewFactory,commonServices){  

		if($sessionStorage && $sessionStorage.selectedChildTable)
			$rootScope.$broadcast('pageRefreshed',{ taskDetails: $sessionStorage.selectedChildTable });

		if($sessionStorage && $sessionStorage.taskName!='')
		{
			var taskDetails=commonServices.getTaskDetailsForDBOprtns();
			if(taskDetails)
			{
				previewFactory.previewData(taskDetails)
				.success(function(response){
					if(response)
					{

					}

				})
				.error(function(error){					
					commonServices.showAlert('Error While Preview ');					
				});
			}
			else if($sessionStorage && $sessionStorage.taskName=='')
				commonServices.showAlert('No Task Details Exist to be Previewed.');
		}
		else if($sessionStorage && $sessionStorage.taskName=='')
			commonServices.showAlert('Create Some Task and Try Again');




	}]);

