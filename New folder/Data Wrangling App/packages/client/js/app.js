'use strict';

var wranglingModule=angular.module('wranglingApp',['ngMaterial','ui.router','ngAnimate','homeModule',
    'headerModule','ngStorage','filterModule','transformationModule','createTaskModule','listTaskModule',
    'taskOperationsModule','lookupModule','previewModule']);


wranglingModule.config(function($stateProvider, $urlRouterProvider){


    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
    .state('home',{
        url:'/home',
        templateUrl:'./partials/home/home.html' ,
        controller:'homeController'
    })
    .state('createTask',{        
        url:'/createTask',
        templateUrl:'./partials/createTask/createTask.html' ,
        controller:'createTaskController'
    })

    .state('listTask',{
        url:'/listTask',
        templateUrl:'./partials/listTask/listTask.html' ,
        controller:'listTaskController'
    })        
    .state('filter',{
        url:'/filter',
        templateUrl:'./partials/filters/filters.html',
        controller :'filtersController'
    })
    .state('transformation',{
        url:'/transformations',
        templateUrl:'./partials/transformation/transformation.html',
        controller:'transformationsController'
    })
    .state('taskOperations',{
        url:'/taskOperations',
        templateUrl:'./partials/taskOperations/taskOperations.html',
        controller:'taskOperationsController'
    })
    .state('lookup',{
        url:'/lookups',
        templateUrl:'./partials/lookup/lookup.html',
        controller:'lookupController'
    })

    .state('preview',{
        url:'/preview',
        templateUrl:'./partials/preview/preview.html',
        controller:'previewController'
    })

});

wranglingModule.service('serverURL',[function(){
    this.URL='http://localhost:8080/#';
}]);



wranglingModule.controller('indexController',['$scope','commonServices','filtersService','$rootScope',
    'lookupService','transformationsService','$sessionStorage','$location','indexFactory',
    function($scope,commonServices,filtersService, $rootScope,lookupService,transformationsService,$sessionStorage, $location,indexFactory){

        $scope.mdsideNavIsOpen=false,$scope.selectedTable=[],$scope.slidePannelList=[];
        var tableListAndData=[];

        $scope.slidePannelList=[
        {
            "id": 1,
            "title": "Child Tables",
            "subNodes": [
            {
                "id": 11,
                "title": "Air India"
            },
            {
                "id": 12,
                "title": "Spice Jet"
            }
            ]
        }
        ];
        
        


        indexFactory.getChildTaleList()
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

        $scope.thisTableSelected=function(tableName){

            for(let i=0;i<tableListAndData.length;i++){
                tableName=tableName.replace(' ','').toLowerCase();
                if(tableListAndData[i].name.replace(' ','').toLowerCase()==tableName) 
                {
                    if($sessionStorage)
                        $sessionStorage.childTable=tableListAndData[i].name;
                    $scope.selectedTable.push(tableListAndData[i]);
                    commonServices.setColumnList(tableListAndData[i].columns);
                    $rootScope.$broadcast('tableSelected');   
                } 
            }
        };



        $rootScope.$on('taskCreatedORSelected',function(event,taskDetails){
            if(taskDetails && taskDetails.taskDetails && taskDetails.taskDetails.selectedTableData )
            {
                $scope.selectedTable=[];
                $sessionStorage.selectedChildTable=taskDetails.taskDetails.selectedTableData;
                $sessionStorage.taskName=taskDetails.taskDetails.taskName;
                $scope.mdsideNavIsOpen=true; 
                $scope.taskName=taskDetails.taskDetails.taskName;
                $scope.selectedTable.push(taskDetails.taskDetails.selectedTableData);
                commonServices.setColumnList(taskDetails.taskDetails.selectedTableData.columns);
                $rootScope.$broadcast('tableSelected');

                if($sessionStorage.filtersList && $sessionStorage.filtersList.length>0 )
                    $sessionStorage.filtersList=[];
                if($sessionStorage.lookupList && $sessionStorage.lookupList.length>0 )
                    $sessionStorage.lookupList=[];
                if($sessionStorage.transformationsList && $sessionStorage.transformationsList.length>0 )
                    $sessionStorage.transformationsList=[];
                $scope.filtersList=[];
                $scope.transformationsList=[];
                $scope.lookupList=[];   
            }     
            else
            {
                commonServices.showAlert("Select child Table")
                $location.url("/home");
            }     
        });

        $rootScope.$on('pageRefreshed',function(event,taskDetails){
            if(taskDetails && taskDetails.taskDetails && taskDetails.taskDetails.name )
            {
                var t=commonServices.getColumnList();

                $scope.mdsideNavIsOpen=true; 
                $scope.taskName=$sessionStorage.taskName;
                $scope.selectedTable.push($sessionStorage.selectedChildTable);           
                commonServices.setColumnList(taskDetails.taskDetails.columns); 

                var r=commonServices.getColumnList();               
                $scope.filtersList=($sessionStorage.filtersList);
                $scope.lookupList=($sessionStorage.lookupList);
                $scope.transformationsList=($sessionStorage.transformationsList);
                $rootScope.$broadcast('tableSelected');
            }          
        });

        $rootScope.$on('filtersCreatred',function(){     
            if($scope.filtersList)
            {
                var array=filtersService.getFiltersList();
                for(let i in array)
                    $scope.filtersList.push(array[i]);
            }
            else
            {
                $scope.filtersList=[];
                $scope.filtersList=(filtersService.getFiltersList());
            }
            $sessionStorage.filtersList=$scope.filtersList;
        });


        $rootScope.$on('transformationsCreatred',function(){
            if($scope.transformationsList)
            {
                var array=transformationsService.getTransformationsList();
                for(let i in array)
                    $scope.transformationsList.push(array[i]);
            }
            else
            {
                $scope.transformationsList=[];
                $scope.transformationsList=transformationsService.getTransformationsList();
            }   
            $sessionStorage.transformationsList=$scope.transformationsList;        
        });


        $rootScope.$on('lookupsCreated',function(){
            if($scope.lookupList)
            {
                var array=lookupService.getLookupsList();
                for(let i in array)
                    $scope.lookupList.push(array[i]);
            }
            else
            {
                $scope.lookupList=[];
                $scope.lookupList=lookupService.getLookupsList();
            }   
            $sessionStorage.lookupList=$scope.lookupList;    
        });

        $rootScope.$on('clearedOnlyFilter',function(){
            $scope.filtersList=[];
        });

        $rootScope.$on('clearedOnlyTransformation',function(){
            $scope.transformationsList=[];
        });

        $rootScope.$on('clearedOnlyLookup',function(){
            $scope.lookupList=[];
        });



        $rootScope.$on('clearedCurrRow',function(event, obj){
         if($scope.filtersList.length>0)
         {
            for(let i=0;i<$scope.filtersList.length;i++)
            {
                if($scope.filtersList[i].id==obj.thisRowCleared.id)
                    $scope.filtersList.splice(i,1);
            }
        }
    });
    }]);



wranglingModule.factory('indexFactory',['$http','serverURL',function($http,serverURL){

    return{
        getChildTaleList: function(){
            var url='http://localhost:8000/impalaServer/getChildTableList/';
            return $http.get(url);
        }
    }

}]); 