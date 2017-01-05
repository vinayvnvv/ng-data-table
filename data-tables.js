angular.module('dTable', [])
  .directive('dTable', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		 scope: {
			tData : "="
		}, // {} = isolate, true = child, false/undefined = no change
		 controller: function($scope, $element, $attrs, $transclude) {
		 	$scope.filtered_data = null;
		 	$scope.pageItems = 3;
		 	$scope.pageNum = [];
		 	

		 	$scope.pageUpdate = function(page_no,length) {

		 		$scope.currentPage = page_no;

		 		var max_loop = length/$scope.pageItems;

                for(var i=0;i<max_loop;i++) {
		 				$scope.pageNum[i] = i+1;
		 	    }

                $scope.filtered_data = $scope.tData.slice(page_no*$scope.pageItems, $scope.pageItems * (page_no+1));
                console.log($scope.filtered_data)
                

		 	}

		 	$scope.goPage = function (n) {
                 $scope.pageUpdate(n, 10)
		 	}

		 


		 	$scope.getTrCount = function() {
		 		_c = $element["0"].childNodes;
					for(var i=0;i<_c.length;i++) {
								if(_c[i].localName == 'table') {
									$scope.tableH = angular.element(_c[i]);
									var __c = $scope.tableH[0].childNodes;
									  for(var j=0;j<__c.length;j++) {
									  	if(__c[j].localName == 'tbody') {
									  	var ___c = angular.element(__c[j]);
									  	
									  	//___c = ___c[0].childNodes;
									  	console.log(___c['tbody'])
									  	for(var k=0;k<___c.length;k++) {
									  		if(___c[k].localName == 'tr') {
									  			 console.log("tr")
									  			}
									  	}



									   }
									  }
								}
							
					}

		 	}




		 	
		 },
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		 restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		 template: function(iElm) {


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
			header = header.replace(/colm/g, "th class='btn-primary'");
			body = body.replace(/colm/g, "td");
			body = body.replace(/table-body/g, "tr ng-repeat='data in filtered_data | filter:_search_text_'");


			var searchHtml = `<div class="d-t-search"><input type='text' class="form-control input-sm" ng-model='_search_text_' placeholder="Search"/></div>`;
            var paginationHtml = `<div class="pager">
            <span ng-click="pageUpdate($index, 10)" class="page-num" ng-repeat="p in pageNum">{{p}}</span>
            </div>`;

			var outerHtml = `
			` + searchHtml + `
			<table>
			{{tData}}
			 <thead>
			  <tr> ` + header + `
			  </tr>
			 </thead> 
			 <tbody>
			  ` + body + `
			 </tbody> 
			  </table> 

              ` + paginationHtml + `
			`; 

			return outerHtml;
		 },
		// templateUrl: '',
		// replace: true,
		 //transclude: true,
		compile: function(scope, tElement, tAttrs, transclude){
            
           return {
             
             post: function($scope, iElm) {

             	$scope.pageUpdate(0, 10)


             	$scope.getTrCount();


             	//tr holder array
    //              $scope.trH = null;
				// console.log($scope.trH)	

             	

             	$scope.$watch(function(scope) { return scope._search_text_ },
			              function(newValue, oldValue) {
			              	  if($scope.filtered_data != null) {
			              	  	console.log($scope.tData.length)
			                    $scope.pageUpdate($scope.currentPage, $scope.tData.length)
			                }
			              }
                  );
             	  
                
             }
           };

		},
		link: function($scope, iElm, iAttrs, controller) {
			

			
		}
	};
});