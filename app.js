var app = angular.module('app', ['dTable']);
app.controller('appCtrl', ['$scope', function($scope){

	console.log("appctrl called")

	$scope.data = [
          {
          	name: "vinay",
          	age:15
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
          }
	];


	
}]);

