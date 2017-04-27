'use strict';
var createTaskModule=angular.module('createTaskModule',[]);
createTaskModule.controller('createTaskController',
	['$scope','commonServices','$mdDialog','$rootScope','$location','$sessionStorage','createTaskFactory',
	function($scope,commonServices,$mdDialog,$rootScope,$location,$sessionStorage,createTaskFactory){
		
		var tableListAndData=[];

		createTaskFactory.getChildTaleList()
		.success(function(response)
		{
			if(response && response.responseData && response.responseData.length>0)
			{
				tableListAndData=  response.responseData;
				commonServices.setChilTablesList(tableListAndData);
			} 
		})
		.error(function(error){
			if(error)
			{
				commonServices.showAlert('Error While getting Child Tables ');  
			} 
		});

		
		$scope.setTaskDetails={};

		$mdDialog.show({
			templateUrl:'./partials/createtask/createTaskDialog.html',      
			scope:$scope.$new(),
			controller: DialogController,
			locals:{
				$sessionStorage:$sessionStorage
			}
		});



		function DialogController($scope,$sessionStorage) {
			

			$scope.querySearchedTableName =function(serachText){
				if(serachText && serachText!='')
				{
					serachText=serachText.toLowerCase();
					var similarColumnList=[];
					for(var i=0;i<tableListAndData.length;i++)
					{
						var lowerCaseData=tableListAndData[i].name.toLowerCase();
						if(lowerCaseData.indexOf(serachText)>=0)
							similarColumnList.push(tableListAndData[i].name);
					}
					return similarColumnList;
				}
			};

			$scope.createTask=function() {	
				$location.url('/taskOperations');
				for(var i=0;i<tableListAndData.length;i++) 
				{
					var lowerCaseData=tableListAndData[i].name;
					if(tableListAndData[i].name==$scope.setTaskDetails.selectedTable)
					{
						if($sessionStorage)
							$sessionStorage.childTable=tableListAndData[i].name;
						$scope.setTaskDetails.selectedTableData=tableListAndData[i];					
					}
				}
				$rootScope.$broadcast('taskCreatedORSelected',{ taskDetails: $scope.setTaskDetails });
				$mdDialog.destroy();
			};
		};

		$scope.closeDialog=function() {
			$mdDialog.destroy();			
			$location.url('/');
		};
	}]);