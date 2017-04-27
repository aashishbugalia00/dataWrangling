var filtersController=angular.module('filterModule',[]);

filtersController.controller('filtersController',
	['$scope', 'filtersService','commonServices','$rootScope','$mdDialog','filtersFactory','$sessionStorage',
	function($scope,filtersService,commonServices, $rootScope,$mdDialog,filtersFactory,$sessionStorage){ 


		if($sessionStorage && $sessionStorage.selectedChildTable)
			$rootScope.$broadcast('pageRefreshed',{ taskDetails: $sessionStorage.selectedChildTable });

		$scope.columnsList=commonServices.getColumnList();
		var conditionList=[];		
		$scope.filterList=[];
		$scope.tableListAndData=[];
		filtersFactory.getFilterList().success(function(response){
			if(response && response.data && response.data.length>0)
			{
				conditionList=response.data;
			}
			else
				commonServices.showAlert('No Data Received');
		})
		.error(function(response){
			if(response )
			{
				commonServices.showAlert('Error From Server.');
			}
		});

		$rootScope.$on('tableSelected',function(){
			$scope.columnsList=commonServices.getColumnList();
		});

		var columnsList=commonServices.getColumnList();		

		$scope.filtersList=[];
		var rowDefaultData={};
		rowDefaultData.id=0;
		rowDefaultData.errorMessage='';
		$scope.filtersList.push(rowDefaultData);

		



		$scope.querySearchedColumnName=function(serachText){
			var r=$scope.columnsList;
			if(columnsList==undefined && $scope.columnsList==undefined)
			{
				commonServices.showAlert('Select Child table and try again.');		
				return false;
			}
			else if($scope.columnsList!=undefined)
				columnsList=$scope.columnsList;

			if(serachText!='')
			{
				serachText=serachText.toLowerCase();
				var similarColumnList=[];
				for(var i=0;i<columnsList.length;i++)
				{
					var lowerCaseData=columnsList[i].toLowerCase();
					if(lowerCaseData.indexOf(serachText)>=0)
						similarColumnList.push(columnsList[i])
				}
				return similarColumnList;
			}
		};

		$scope.querySearchedCondition=function(serachText){
			if(serachText!='' && conditionList && conditionList.length>0)
			{
				serachText=serachText.toLowerCase();
				var similarColumnList=[];
				for(var i=0;i<conditionList.length;i++)
				{
					var lowerCaseData=conditionList[i].displayvalue.toLowerCase();
					if(lowerCaseData!='' && lowerCaseData.indexOf(serachText)>=0)
						similarColumnList.push(conditionList[i])
				}
				return similarColumnList;
			}
		};

		$scope.addDeleteRow=function(task,row){
			if(task=='add')
			{
				commonServices.addRow($scope.filtersList);				
			}
			else
			{
				commonServices.deleteRow(row,$scope.filtersList,'filter');
			}
		};

		$scope.clearRow=function(currRow){	
			commonServices.clearRow(currRow,$scope.filtersList,'filter');							
		};
		$scope.createFileters=function(){
			var count=0;
			for(let i=0;i<$scope.filtersList.length;i++)
			{
				if($scope.filtersList[i].column!=null && validateData($scope.filtersList[i]))
					break;
				else if($scope.filtersList[i].column!=null)
					count++;
			}
			var allFiltersCreated=false;
			if(count==$scope.filtersList.length)
			{
				allFiltersCreated=true;
				filtersService.setFiltersList($scope.filtersList);
				$sessionStorage.filtersList=$scope.filtersList;				
				$rootScope.$broadcast('filtersCreatred');
			}
			if(allFiltersCreated)
			{
				for(let i=0;i<$scope.filtersList.length;i++)
					$scope.filtersList[i].isDisabled=true;	
			}
			else
				commonServices.showAlert('Complete all blank filters or delete additional rows.');			

		};
		

		var validateData=function(currRow){
			var anyError=false;	
			currRow.errorMessage='';		
			if(currRow.condition==undefined ||currRow.condition=='')
			{
				currRow.errorMessage='Select some condition';
				anyError=true;
			}
			if(currRow.filterValue==undefined || currRow.filterValue=='')
			{
				currRow.errorMessage +=' Enter some value to be compared with.';
				anyError=true;
			}
			return anyError;
		};

	}]);

