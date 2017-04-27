'use strict'
var headerModule=angular.module('headerModule',[]);

headerModule.controller('headerController',['$scope','$rootScope','$sessionStorage','headerFactory','commonServices',
	function($scope,$rootScope,$sessionStorage,headerFactory,commonServices){  				

		$scope.tiles = [
		{
			name:'add',
			displayValue:'Create Task',
			state:'createTask'
		},
		{
			name:'list',
			displayValue:'List Task',
			state:'listTask'
		}
		];	
	

		$scope.saveData=function(){

			if($sessionStorage && $sessionStorage.taskName!='')
			{
				var taskDetails=commonServices.getTaskDetailsForDBOprtns();

				if(taskDetails)
				{
					/*headerFactory.saveDataMongo(taskDetails)
					.success(function(response){
						if(response)
						{
							commonServices.showAlert('Task Saved successfully  on  mongo.');
						}

					})
					.error(function(error){					
						commonServices.showAlert('Error While Saving Task on  mongo ');					
					});*/

					headerFactory.saveDataImpala(taskDetails)
					.success(function(response){
						if(response)
						{
							commonServices.showAlert('Task Saved successfully  on Impala.');
						}

					})
					.error(function(error){					
						commonServices.showAlert('Error While Saving Task on Impala.');					
					});
				}
				else if($sessionStorage && $sessionStorage.taskName=='')
					commonServices.showAlert('No Task Details Exist to be saved.');

			}
			else if($sessionStorage && $sessionStorage.taskName=='')
				commonServices.showAlert('Create Some Task and Try Again');
		};

	}]);

