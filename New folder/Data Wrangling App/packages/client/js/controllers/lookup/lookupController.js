var lookupModule=angular.module('lookupModule',[]);

lookupModule.controller('lookupController',['$scope', 'lookupService','commonServices','$rootScope','$mdDialog',
	'lookupFactory','$location','$sessionStorage',
	function($scope,lookupService,commonServices, $rootScope,$mdDialog,lookupFactory,$location,$sessionStorage){ 
		

		if($sessionStorage && $sessionStorage.selectedChildTable)
			$rootScope.$broadcast('pageRefreshed',{ taskDetails: $sessionStorage.selectedChildTable });

		$scope.columnsList=commonServices.getColumnList();
		var parentColumnList=[];		
		$scope.lookupList=[];
		$scope.conditionsList=[];
		$scope.tableListAndData=[];
		lookupFactory.getChildTaleList().success(function(response){

			 if(response && response.responseData && response.responseData.length>0)
            {
                $scope.tableListAndData=  response.responseData;
                commonServices.setChilTablesList( $scope.tableListAndData);
                $mdDialog.show({
					escapeToClose:false,
					templateUrl:'./partials/lookup/parentSelectDialog.html',      
					scope:$scope.$new(),    
					locals: {
						dialogData:$scope.tableListAndData
					},
					controller: DialogController
				});
            } 
            else
				commonServices.showAlert('No LookUp TablesAvailable');			
		})
		.error(function(response){
			if(response )
			{
				commonServices.showAlert('Error From Server.');
			}
		});

		lookupFactory.getLoopUpConditionsList().success(function(response){
			if(response && response.conditionList && response.conditionList.length>0)
			{
				$scope.conditionsList=response.conditionList;	
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

		function DialogController($scope,  dialogData) {
			$scope.dialogData = dialogData;  

			$scope.querySearchedTableName =function(searchText){
				if(searchText && searchText!='' && $scope.dialogData && $scope.dialogData.length>0)
				{
					searchText=searchText.toLowerCase();
					var similarTableName=[];

					for(var i=0;i<$scope.dialogData.length;i++)
					{
						var lowerCaseData=$scope.dialogData[i].name.toLowerCase();


						if(lowerCaseData.indexOf(searchText)>=0)
							similarTableName.push($scope.dialogData[i].name)
					}
					return similarTableName;
				}
			};

		};

		$scope.closeDialog=function () {
			$mdDialog.destroy();
			if($scope.lookupTableSelected==undefined)
				$location.url('/taskOperations');
			
		}



		$scope.parentTableSelected=function(selectedTable){			

			if(selectedTable !='' && selectedTable.length>0){
				$scope.lookupTableSelected=selectedTable;
				for(var i=0;i<$scope.tableListAndData.length;i++){

					var lowerCaseTableName=$scope.tableListAndData[i].name.toLowerCase();
					var selectedTable=selectedTable.toLowerCase();
					if( lowerCaseTableName==selectedTable){
						parentColumnList.push($scope.tableListAndData[i].columns)  				

					}
				}
			}
		}


		$rootScope.$on('tableSelected',function(){
			$scope.columnsList=commonServices.getColumnList();
		});

		var columnsList=commonServices.getColumnList();	
		

		$scope.month=[];
		var rowDefaultData={};		
		rowDefaultData.columnsList=columnsList;
		rowDefaultData.id=0;
		rowDefaultData.errorMessage='';
		$scope.lookupList.push(rowDefaultData);


		$scope.querySearch=function (currRow,searchFrom) {
			if(currRow)
			{
				var parentList=[];
				var searchedText='';
				var childList=[];
				switch(searchFrom)
				{
					case 'childTable':
					if($scope.columnsList==undefined || $scope.columnsList.length<=0)
					{
						commonServices.showAlert('Select some Child Table and try again.');		
						return false;
					}	
					else 
						parentList=$scope.columnsList;
					searchedText=currRow.searchColumnNameFromChild ? currRow.searchColumnNameFromChild.toLowerCase() : '';
					break;

					case 'conditionTable':
					if(	$scope.conditionsList==undefined || $scope.conditionsList.length<=0)
					{
						commonServices.showAlert('No Conditions Found.');		
						return false;
					}	
					else 
						parentList=	$scope.conditionsList;
					searchedText=currRow.searchCondition ? currRow.searchCondition.toLowerCase() : '';								
					break;

					case 'parentTable':
					if(parentColumnList==undefined || parentColumnList.length<=0)
					{
						commonServices.showAlert('Select some table and try again.');		
						return false;
					}
					else 
						parentList=parentColumnList[0];
					searchedText=currRow.searchParentColumnName ? currRow.searchParentColumnName.toLowerCase() : '';
					break;

				}
				for(var i=0;i<parentList.length;i++)
				{
					var lowerCaseData=''
					if(searchFrom!='conditionTable')
						lowerCaseData=parentList[i].toLowerCase();
					else
						lowerCaseData=parentList[i].name.toLowerCase();
					if(lowerCaseData!='' && lowerCaseData.indexOf(searchedText)>=0)
						childList.push(parentList[i])
				}
				return childList;

			}	
		};


		$scope.addDeleteRow=function(task,row){
			if(task=='add')
			{
				commonServices.addRow($scope.lookupList);				
			}
			else
			{
				commonServices.deleteRow(row,$scope.lookupList,'lookup');
			}
		};

		$scope.clearRow=function(currRow){		
			commonServices.clearRow(currRow,$scope.lookupList,'lookup');								
		};

		$scope.createLookups=function(){
			var count=0;
			for(let i=0;i<$scope.lookupList.length;i++)
			{
				if($scope.lookupList[i].childColumn!=null && validateData($scope.lookupList[i]))
					break;
				else if($scope.lookupList[i].childColumn!=null)
				{
					count++;
					if($scope.lookupTableSelected)
						$scope.lookupList[i].parentTable=$scope.lookupTableSelected;
				}

			}
			var allFiltersCreated=false;
			if(count==$scope.lookupList.length)
			{				
				allFiltersCreated=true;
				lookupService.setLookupsList($scope.lookupList);
				$sessionStorage.lookupList=$scope.lookupList;
				$rootScope.$broadcast('lookupsCreated');
			}
			if(allFiltersCreated)
			{
				for(let i=0;i<$scope.lookupList.length;i++)
					$scope.lookupList[i].isDisabled=true;	
			}
			else
				commonServices.showAlert('Complete all blank filters or delete additional rows.');			

		};
		var validateData=function(currRow){
			var anyError=false;	
			currRow.errorMessage='';		
			if(currRow.selectedCondition==undefined ||currRow.selectedCondition.name=='')
			{
				currRow.errorMessage='Select some condition';
				anyError=true;
			}
			else
				currRow.lookupCond=currRow.selectedCondition.name;
			
			if(currRow.parentColumn==undefined || currRow.parentColumn=='')
			{
				currRow.errorMessage +=' Enter some value to be compared with.';
				anyError=true;
			}
			return anyError;
		};

		



	}]);

