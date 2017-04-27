'use strict';

var meanArchiControllers=angular.module('transformationModule',[]);

meanArchiControllers.controller('transformationsController',
	['$scope','transformationsFactory','commonServices','$mdDialog','$rootScope','transformationsService',
	'$sessionStorage',
	function($scope,transformationsFactory,commonServices,$mdDialog,$rootScope,transformationsService,
		$sessionStorage){
		$scope.selectedTableColumnList=[];
		transformationsFactory.getImpalaBuiltInLibrary()
		.success(function(response){
			if(response && response.data && response.data.success && response.data.success.length>0)
			{
				var builtInFunctionList=response.data.success;
				for (let i in builtInFunctionList)
				{
					$scope.selectedTableColumnList.push(builtInFunctionList[i].value);	
				}
				
			}
			else
			{
				commonServices.showAlert('No Built in Function List found. ');	
			}
		})
		.error(function(response){
			if(response && response.data && response.data.error )
			{
				commonServices.showAlert(response.data.error);	
			}
			else if(response)
				commonServices.showAlert('Error While Getting Function List');		
		})

		if($sessionStorage && $sessionStorage.selectedChildTable)
			$rootScope.$broadcast('pageRefreshed',{ taskDetails: $sessionStorage.selectedChildTable });
		
		$scope.selectedTableColumnList=commonServices.getColumnList();
		$rootScope.$on('tableSelected',function(){
			$scope.selectedTableColumnList=commonServices.getColumnList();
		});


		$scope.transformationsList=[];
		var rowDefaultData={};
		rowDefaultData.id=0;
		rowDefaultData.errorMessage='';
		$scope.transformationsList.push(rowDefaultData);

		var funList=[];
		var funDetails={};
		funDetails.name='abs';
		funDetails.purpose='Returns the absolute value of the argument.';
		funDetails.returnType='Same as the input value' ;
		funDetails.usageNotes='Use this function to ensure all return values are positive. This is different than the positive() function, which returns its argument unchanged (even if the argument was negative).' ;
		funDetails.syntax='abs(numeric_type a)';
		funList.push(funDetails);	

		var funDetails={};
		funDetails.name='acos';
		funDetails.purpose='Returns the arccosine of the argument.';
		funDetails.returnType='Double' ;		
		funDetails.syntax='acos(double a)';
		funList.push(funDetails);	

		var funDetails={};
		funDetails.name='asin';
		funDetails.purpose='Returns the arcsine of the argument.';
		funDetails.returnType='Double' ;		
		funDetails.syntax='asin(double a)';
		funList.push(funDetails);	

		var funDetails={};
		funDetails.name='atan';
		funDetails.purpose='Returns the arctangent of the argument.';
		funDetails.returnType='Double' ;		
		funDetails.syntax='atan(double a)';
		funList.push(funDetails);	

		$scope.accordianData = [
		{
			"heading" : "Mathematical Function",
			"content" : funList
		},
		{
			"heading" : "Date and Time Function",
			"content" : funList
		},
		{
			"heading" : "Conditional Function",
			"content" : funList
		}
		];
		$scope.getFunctionList=function(currRow){
			if(!currRow.isDisabled)
			{
				$mdDialog.show({
					templateUrl:'./partials/transformation/inbuiltFunctionDialog.html',      
					scope:$scope.$new(),    
					locals: {
						accordianData:$scope.accordianData,
						currRow:currRow
					},
					controller: inBuiltFunctnDialogCtrl
				});
			}
		};


		function inBuiltFunctnDialogCtrl($scope,accordianData,currRow) {
			var currRow=currRow;
			$scope.accordianData=  accordianData;

			$scope.collapseAll = function(data) {
				for(var i in $scope.accordianData) {
					if($scope.accordianData[i] != data) {
						$scope.accordianData[i].expanded = false;   
					}
				}
				data.expanded = !data.expanded;
			};	
			$scope.currChipClicked=function(currChip){
				var dialogData={};
				if(commonServices.getColumnList()==undefined)
				{
					commonServices.showAlert('Select Child and try again.');		
					return false;			
				}
				dialogData.columnList=commonServices.getColumnList();
				dialogData.currChip=currChip;

				showDialog(dialogData,currRow);
			}

		};


		$scope.transformation=function(currRow){
			if(currRow)
			{
				if(currRow.srcColumn && currRow.srcColumn!='' && currRow.searchColumnName && currRow.searchColumnName!='')
				{

				}
			}
		};


		
		$scope.querySearchedColumnName =function(e){

			$scope.columnFunctionList=[];
			if(e && e.key)
				var serachText=e.key;
			else
				var serachText='';
			if(serachText && serachText!='' && $scope.selectedTableColumnList && $scope.selectedTableColumnList.length>0)
			{				
				serachText=serachText.toLowerCase();
				serachText=serachText.slice(serachText.length-1,serachText.length)
				var columnsList=[];
				columnsList=$scope.selectedTableColumnList;
				for(var i=0;i<columnsList.length;i++)
				{
					var lowerCaseData=columnsList[i].toLowerCase();
					if(lowerCaseData.indexOf(serachText)>=0)
						$scope.columnFunctionList.push(columnsList[i])
				}
				//return $scope.columnFunctionList;
			}
			else if(serachText && serachText!='')
			{
				commonServices.showAlert('Select Child Table and try again.');		
			}
			
			
		};

		

		$scope.closeDialog=function(){
			$mdDialog.destroy();
		};
		var showDialog=function(dialogData,currRow){			
			$mdDialog.show({
				templateUrl:'./partials/transformation/dialogContent.html',      
				scope:$scope.$new(),    
				locals: {
					dialogData: dialogData,
					currRow:currRow
				},
				controller: functionDetailDialogCtrl
			});

			function functionDetailDialogCtrl($scope,  dialogData,currRow) {
				$scope.dialogData = dialogData;  	
				var currRow=currRow;
				$scope.addTransformation=function(){
					if($scope.dialogData && $scope.dialogData.currChip && $scope.dialogData.currChip.name && currRow)
					{
						currRow.transformationFunction=$scope.dialogData.currChip.name;
						currRow.transformationFunction=$scope.dialogData.currChip.name;
					}
					$scope.closeDialog();	
				};

			};
		};



		/*Table General Operations*/
		$scope.addDeleteRow=function(task,row){
			if(task=='add')
			{
				commonServices.addRow($scope.transformationsList);				
			}
			else
			{
				commonServices.deleteRow(row,$scope.transformationsList,'transformation');
			}
		};

		$scope.clearRow=function(currRow){	
			commonServices.clearRow(currRow,$scope.transformationsList,'transformation');					
		};

		

		$scope.createTransformations=function(){
			var count=0;
			for(let i=0;i<$scope.transformationsList.length;i++)
			{
				if($scope.transformationsList[i].targetColumn!=null && validateData($scope.transformationsList[i]))
					break;
				else if($scope.transformationsList[i].targetColumn!=null)
					count++;
			}
			var allTransformationsCreated=false;
			if(count==$scope.transformationsList.length)
			{
				allTransformationsCreated=true;
				transformationsService.setTransformationsList($scope.transformationsList);
				$sessionStorage.transformationsList=$scope.transformationsList;
				$rootScope.$broadcast('transformationsCreatred');
			}
			if(allTransformationsCreated)
			{
				for(let i=0;i<$scope.transformationsList.length;i++)
					$scope.transformationsList[i].isDisabled=true;	
			}
			else
				commonServices.showAlert('Complete all blank Transformation or delete additional rows.');			

		};


		var validateData=function(currRow){
			var anyError=false;	
			currRow.errorMessage='';		
			if(currRow.transformationFunction== null || currRow.transformationFunction==undefined ||currRow.transformationFunction=='')
			{
				if(currRow.searchColumnName!=null && currRow.searchColumnName!=undefined && currRow.searchColumnName!='' )
					currRow.transformationFunction=currRow.searchColumnName
				else
				{
					currRow.errorMessage='Select some Trasnformation Function';
					anyError=true;	
				}
				
			}

			/*if(currRow.srcColumn==undefined || currRow.srcColumn=='')
			{
				currRow.errorMessage +=' Enter some Source Column ';
				anyError=true;
			}*/
			return anyError;
		};

	}]);


