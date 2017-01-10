'use strict';

angular.module('dTable', [])
  .directive('dTable', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 2,
		// terminal: true,
		 // scope: { }, // {} = isolate, true = child, false/undefined = no change
		 controller: function($scope, $element, $attrs, $transclude) {

		 	console.log("called pre dir")
		 	$scope.filtered_data = null;
		 	$scope.pageItems = $attrs.dMaxRows;
		 	$scope.pageNum = [];
		 	$scope.currentPage = null;
		 	$scope.isNoPagination = false;

		 	if($attrs.noPagination != undefined) {
		 		$scope.isNoPagination = true;
		 	}


		 	if($scope.pageItems == undefined || $scope.pageItems == '')
		 		$scope.pageItems = 10;
		 	

		 	$scope.searchObj = function searchObj (obj, query) {

                console.log("searching...")
		 		var temp = {};

				    for (var key in obj) {
				         var value = obj[key];

				         if (typeof value === 'object') {
				             searchObj(value, query);
				         } else {
				         	  value = String(value)
					         if (value.includes(query)) {
					             console.log('property=' + key + ' value=' + value);
					         }
				       }
                        
				        

				    }

				}

		    $scope.goPage = function(n) {
		    	 $scope.filterTr(n);
		    }

		 	$scope.nextPage = function() {
                 $scope.filterTr($scope.currentPage + 1);
		 	}
		 	$scope.prePage = function() {
                 $scope.filterTr($scope.currentPage - 1);
		 	}

		 	$scope.doPagination = function(cur, n, ele) {
		 		if($scope.isNoPagination)
		 			return;

		 		var page_no_count;

		 		//styles
		 		$scope.activePageStyle = [];
		 		$scope.activePageStyle[cur] = "active"

		 		$scope.disablePrevStyle = null;
		 		$scope.disableNextStyle = null;


		 		$scope.pageNum = [];
		 		$scope.currentPage = cur;

		 		console.log("cur:" + cur + ",n:" + n )

		 		 

                //calculate no of page indexes to display
                page_no_count = Math.ceil(n/$scope.pageItems);


                if(cur == 0)
		 			$scope.disablePrevStyle = "disable";
		 		if(cur == page_no_count-1)
		 			$scope.disableNextStyle = "disable"
		 	    
		 	    for(var i=0;i<page_no_count;i++) {
		 				$scope.pageNum[i] = i+1;
		 	    }

		 	    console.log("length of pages : " + page_no_count)


		 		//console.log(ele)
		 		var _l = cur*$scope.pageItems;
		 		var _r = $scope.pageItems*(cur+1);
		 		console.log(_l + "<--left")
		 		console.log(_l + " : " + _r);

		 		$scope.paginationInfo = "Showing " + (_l+1) + " to " + _r +" of " + n + " results";
		 		console.log("page info:" + $scope.paginationInfo)
		 		//console.log(n);
		 		for(var i=0;i<ele.length;i++) {
		 			if( ! ((_l<=i) && (_r>i)) )
		 				ele[i].innerHTML = '';
		 		}
		 	}

		 	$scope.findUpdaters = function() {
		 		//console.log("complile coun")
		 		var _c = $element["0"].childNodes;
					for(var i=0;i<_c.length;i++) {
								if(_c[i].localName == 'table') {
									$scope.tableH = angular.element(_c[i]);
									var __c = $scope.tableH[0].childNodes;
									  for(var j=0;j<__c.length;j++) {
									  	if(__c[j].localName == 'tbody') {
									  	var ___c = angular.element(__c[j]);
									  	
									  	//___c = ___c[0].childNodes;
									  	//console.log(___c[0].childElementCount)

									  	var trr = angular.element(___c[0])["0"].children;
									  	console.log(___c)
									  	var _e = {
									  		tr:___c,
									  		td:trr
									  	};
									  	return _e;

									   }
									  }
								}
							
					}
		 	}

		 	$scope.filterTr = function(page_no) { 
               	
									  	//console.log($scope.tdArray);
									  
									  	//___c[0].innerHTML = trr[0].outerHTML;
									  	// if(___c.length == 1) {
									  	// 	console.log("length is one")
									  	// 	//return;
									  	// }
									  	var filtered_rows_no = 0;
									  	var len = ($scope.tdArray.length)
									  	
									  	
									  	var html_ = '';
									  	for(var k=0;k<len;k++) {
									  		if(($scope.tdArray[k].innerText.includes($scope.$search))) {
									  			//console.log($scope.tdArray[k].innerText + "->" + $scope.$search)
									  			 html_ += $scope.tdArray[k].outerHTML;
									  			 filtered_rows_no++
									  			}
									  	}

									  	$scope.trHolder[0].innerHTML = html_;
									  	console.log("loop:" + filtered_rows_no)

									    $scope.doPagination(page_no,filtered_rows_no, $scope.findUpdaters().td);
									  		return;


		 	}

		 


		 	




		 	
		 },
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		 restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		 template: function(iElm, attrs) {
  
			var header = null;
			var body = null;
			var _c = iElm["0"].childNodes;
			var pagination_position = attrs.dPaginationPosition;
			var search_position = attrs.dSearchPosition;
			console.log(search_position)
			for(var i=0;i<_c.length;i++) {
						if(_c[i].localName == 'table-header')
							header = angular.element(_c[i]);
						if(_c[i].localName == 'table-body')
							body = angular.element(_c[i]);
					
			}

            body = body[0].outerHTML;
            header = header[0].outerHTML;
			header = header.replace(/<colm/g, "<th class='btn-primary'");
			header = header.replace(/<\/colm>/g, "</th>");
			body = body.replace(/<colm/g, "<td");
			body = body.replace(/<\/colm>/g, "</td>");
			body = body.replace(/table-body/g, "tr");


			var searchHtml = `<div class="d-t-search"><input type='text' class="form-control input-sm" ng-model='$search' placeholder="Search"/></div>`;
            var paginationHtml = `<div class="pager" ng-if="!isNoPagination">
            <span >{{paginationInfo}}</span>
            <span ng-click="prePage()" class="page-num {{disablePrevStyle}}">Prev</span>
            <span ng-click="goPage($index)" class="page-num {{activePageStyle[$index]}}" ng-repeat="p in pageNum">{{p}}</span>
            <span ng-click="nextPage()" ng-disable="true" class="page-num {{disableNextStyle}}">Next</span>

            </div>`;


            //set defaults for handling exceptions and errors
            if( (pagination_position==undefined) || (pagination_position == '') ) pagination_position = 'bottom';
            if( (search_position==undefined) || (search_position == '') ) search_position = 'top';
            var topHtml = '';
            var bottomHtml = '';
            if( (search_position == 'top') || (search_position == 'top||bottom') ) {
            	topHtml = searchHtml;
            	if(pagination_position != "bottom")
            		topHtml =  paginationHtml + searchHtml;
            }
            if( (pagination_position == 'top') || (pagination_position == 'top||bottom') ) {
            	topHtml = paginationHtml;
            	if(search_position != 'bottom') 
            		topHtml =  paginationHtml + searchHtml;
            }
            if( (search_position == 'bottom') || (search_position == 'top||bottom') ) {
            	bottomHtml = searchHtml;
                 if(pagination_position != "top")
            		bottomHtml = searchHtml + paginationHtml
            }
            
            if( (pagination_position == 'bottom') || (pagination_position == 'top||bottom') ) {
            	bottomHtml = paginationHtml;
            	if(search_position != 'top') 
            		bottomHtml = searchHtml + paginationHtml;
            }




            // if(search_position == 'bottom' || search_position =='top||bottom') {
            //   if(pagination_position != 'top') {
            //     	topHtml = searchHtml;
            //   	} 
            //   else
            //   	topHtml = pagination_position;
            //  }   

			var outerHtml = `
			` + topHtml + `
			<table>
			 <thead>
			  <tr> ` + header + `
			  </tr>
			 </thead> 
			 <tbody ng-init="$search = ''">
			  ` + body + `
			 </tbody> 
			  </table> 

              ` + bottomHtml + `
			`; 

			return outerHtml;
		 },
		// templateUrl: '',
		// replace: true,
		 //transclude: true,
		compile: function($scope, tElement, tAttrs, transclude){

            
           return {

           	pre: function($scope, iElm) {
           		
             	  
           	},
             
             post: function($scope, iElm) {

             	angular.element(document).ready(function () {
                var get_updaters = $scope.findUpdaters();	
                $scope.trHolder = get_updaters.tr;
                $scope.tdArray = Array.prototype.slice.call(get_updaters.td);
                $scope.filterTr(0);
                $scope.$apply();

             	$scope.$watch(function(scope) { return 	$scope.$search},
			              function(newValue, oldValue) {
			              
			              	  	console.log($scope.$search)
			              	  	$scope.filterTr(0);
			              	  	//console.log($scope.tData.length)
			                   // $scope.pageUpdate($scope.currentPage, $scope.tData.length)
			              
			              }
                  );
             	
           }); 
             





             	
                
             }

           };

		},
		link: function($scope, iElm, iAttrs, controller) {


			       console.log("link")
			
                    $scope.getTrCount();
			
		}
	};
});