var app = angular.module('app', ['dTable']);
app.controller('appCtrl', ['$scope', function($scope){

	console.log("appctrl called")
     $scope.data = {};
	$scope.data.users = [
          {
          	name: "vinay",
          	age:15,
               a :"bv"
          },
          {
          	name: "vinay",
          	age:16
          },
          {
          	name: "vinay",
          	age:13
          },
          {
          	name: "vinay",
          	age:13
          },
          {
          	name: "vinay",
          	age:13
          },
          {
          	name: "vinay",
          	age:13
          },
          {
          	name: "vinay",
          	age:13
          },
          {
          	name: "vinay",
          	age:13
          },
          {
          	name: "vinay",
          	age:13
          },
          {
          	name: "vinay",
          	age:13
          },
          {
          	name:"last",
          	age:15
          },
           {
               name: "vinay",
               age:15,
               a :"bv"
          },
          {
               name: "yadav",
               age:16
          },
          {
               name: "yadav",
               age:13
          },
          {
               name: "yadav",
               age:13
          },
          {
               name: "yadav",
               age:13
          },
          {
               name: "yadav",
               age:13
          },
          {
               name: "yadav",
               age:13
          },
          {
               name: "yadav",
               age:13
          },
          {
               name: "yadav",
               age:13
          },
          {
               name: "yadav",
               age:13
          },
          {
               name:"last",
               age:15
          }
	];


	
}]);

