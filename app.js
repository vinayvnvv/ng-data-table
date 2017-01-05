var app = angular.module('app', []);
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
          }
	];


	
}]);

app.directive('dTable', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		 scope: {
			tData : "="
		}, // {} = isolate, true = child, false/undefined = no change
		 controller: function($scope, $element, $attrs, $transclude) {
		 	//$scope.data = $scope.tData;
		 	console.log($scope.tData)
		 },
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		 restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		 template: function(iElm) {
		 	console.log(iElm)
                 
                 console.log(iElm["0"].childNodes)
			var header = null;
			var body = null;
			_c = iElm["0"].childNodes;
			for(var i=0;i<_c.length;i++) {
						if(_c[i].localName == 'table-header')
							header = angular.element(_c[i]);
						if(_c[i].localName == 'table-body')
							body = angular.element(_c[i]);
					
			}

            body = body[0].outerHTML;
            header = header[0].outerHTML;
			header = header.replace(/colm/g, "th");
			body = body.replace(/colm/g, "td");
			body = body.replace(/table-body/g, "tr ng-repeat='data in tData'");

			console.log(body)
            

			var outerHtml = `
			<table>
			 <thead>
			  <tr> ` + header + `
			  </tr>
			 </thead> 
			 <tbody>
			  ` + body + `
			 </tbody> 
			  </table> 


			`;

			return outerHtml;
		 },
		// templateUrl: '',
		// replace: true,
		 //transclude: true,
		//compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
			
		}
	};
});