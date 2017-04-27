var wranglingModule=angular.module('wranglingApp');
wranglingModule.service('commonServices',["$mdDialog",'$sessionStorage',function($mdDialog,$sessionStorage){	
	this.setColumnList=function(columnList){
		this.columnList=[];
		this.columnList=columnList;
	}
	this.getColumnList=function(){
		return this.columnList;
	};
	this.setChilTablesList=function(chilTablesList){
		this.chilTablesList=chilTablesList;
	};
	this.getChilTablesList=function(){
		return this.chilTablesList;
	};

	this.setTaskDetails=function(taskDetails){
		this.taskDetails=taskDetails;
	};
	this.getTaskDetails=function(){
		return this.taskDetails;
	}
	this.clearRow=function(currRow,list,callFrom){
		if(currRow && !currRow.isDisabled)
		{
			for(var k in  currRow)
			{
				if(k!='id')
					currRow[k]=undefined;
			}

		}

		if(list && list.length==1)
			{
				switch(callFrom)
				{
					case 'filter':
					$rootScope.$broadcast('clearedOnlyFilter');
					break;

					case 'lookup':
					$rootScope.$broadcast('clearedOnlyLookup');
					break;

					case 'transformation':
					$rootScope.$broadcast('clearedOnlyTransformation');
					break;
				}
			}
	};
	this.deleteRow=function(row,list,callFrom){
		if(!row.isDisabled)
		{
			if(list.length>1)
			{
				for(let i=0;i<list.length;i++)
				{
					if(list[i].id==row.id)
						list.splice(i,1);
				}
			}
			else if(list && list.length==1)
			{
				switch(callFrom)
				{
					case 'filter':
					$rootScope.$broadcast('clearedOnlyFilter');
					break;

					case 'lookup':
					$rootScope.$broadcast('clearedOnlyLookup');
					break;

					case 'transformation':
					$rootScope.$broadcast('clearedOnlyTransformation');
					break;
				}
				
				

			}
		}
	};
	this.showAlert=function(textContent){
			$mdDialog.show(
				$mdDialog.alert()
				.parent(angular.element(document.querySelector('body')))
				.clickOutsideToClose(true)
				.title('Alert')
				.textContent(textContent)
				.ariaLabel('Alert Dialog Demo')
				.ok('Got it!')
				);
		};

	this.addRow=function(list){
		var rowDefaultData={};
		var lastId=list[list.length-1].id+1
		rowDefaultData.id=lastId;
		list.push(rowDefaultData);
	};

	this.getTaskDetailsForDBOprtns=function(){
			var taskDetails={};
			taskDetails.taskName=$sessionStorage.taskName;

			if($sessionStorage.childTable)
				taskDetails.childTable=$sessionStorage.childTable;

			if($sessionStorage.filtersList && $sessionStorage.filtersList.length>0 )
				taskDetails.filterList=$sessionStorage.filtersList;

			if($sessionStorage.lookupList && $sessionStorage.lookupList.length>0 )
				taskDetails.lookupList=$sessionStorage.lookupList;

			if($sessionStorage.transformationsList && $sessionStorage.transformationsList.length>0 )
				taskDetails.transformationList=$sessionStorage.transformationsList;

			taskDetails=JSON.stringify(taskDetails)
			return taskDetails;
		};

}]);