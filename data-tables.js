'use strict';

angular.module('dTable', [])
  .directive('dTable', function($timeout){
	// Runs during compile
	return {
		// name: '',
		// priority: 2,
		// terminal: true,
		 // scope: {
   //          dData : "&"
		 //  }, // {} = isolate, true = child, false/undefined = no change
		 controller: function($scope, $element, $attrs, $transclude) {

		 	$scope.$reverse = false;
		 	$scope.$currentPage = 0;
		 	$scope.$pageSize = $attrs.dMaxRows;
		 	$scope.isNoPagination = false;

            if($attrs.noPagination != undefined) {
                $scope.isNoPagination = true;
            }

            

            $scope.tbody = $element.find('tbody'); 



		 	$scope.sortBy = function(field) {

		 		$scope.$reverse = !$scope.$reverse;
		 		$scope.$field = field;
		 		$scope.filterPage(0);
		 	}

		 	 $scope.nextPage = function() {
                 $scope.filterPage($scope.$currentPage + 1);
            }

             $scope.prePage = function() {
                 $scope.filterPage($scope.$currentPage - 1);
                 console.log("go to pre of : " + $scope.$currentPage)
            }


            $scope.animate = function() {
            	console.log($scope.tbody)
            	$scope.tbody.removeClass("_animi_from")
            	$scope.tbody.addClass("_animi_end");
            	$timeout(function() {
            	   $scope.tbody.removeClass("_animi_end")
                   $scope.tbody.addClass("_animi_from");

            	}, 200);
            }



		 	$scope.goPage = function(n) {
                //handle for last page clicked
                 if(n == 'n')
                    $scope.isLastPageLinkClicked = true;
                 else
                    $scope.isLastPageLinkClicked = false;


                 $scope.filterPage(n);
            }

		 	$scope.doPagination = function(cur, n) {
		 		if($scope.isNoPagination)
                    return;
		 		 var page_no_count;


		 		  //calculate no of page indexes to display
                page_no_count = Math.ceil(n/$scope.$pageSize);

                
                ////handle for last page clicked for cur
                if($scope.isLastPageLinkClicked)
                    cur = page_no_count-1;




		 		 //styles
                $scope.activePageStyle = [];
                $scope.activePageStyle[cur] = "active"

                $scope.disablePrevStyle = null;
                $scope.disableNextStyle = null;


                $scope.pageNum = [];
                $scope.$currentPage = parseInt(cur);

                 if(cur == 0)
                    $scope.disablePrevStyle = "disable";
                if(cur == page_no_count-1)
                    $scope.disableNextStyle = "disable"



                console.log("cur:" + cur + ",n:" + n )






		 		 $scope.pageNum = [];


                for(var i=0;i<page_no_count;i++) {
                        $scope.pageNum[i] = i;
                }




                //slice no of page links per to displayed
                var dMaxLinks = $attrs.dMaxPageLinks;
                if(dMaxLinks != undefined && dMaxLinks!= '') {
                    if(dMaxLinks < page_no_count) {
                        $scope.isMaxPageLink = true;
                        if( ((parseInt(dMaxLinks)+cur) > page_no_count )   ) {
                        	$scope.pageNum = $scope.pageNum.slice(cur-((parseInt(dMaxLinks)+cur) - page_no_count ), (parseInt(dMaxLinks)+cur));
                        } else {
                        $scope.pageNum = $scope.pageNum.slice(cur, (parseInt(dMaxLinks)+cur));
                    }
                    }
                }


                //console.log(ele)
                var _l = cur*$scope.$pageSize;
                var _r = $scope.$pageSize*(cur+1);
                console.log(_l + "<--left")
                console.log(_l + " : " + _r);

                var _r_max = _r;
                if(_r>n)
                    _r_max = n;

                
                if( (_l+1) > _r_max ) {
                	$scope.paginationInfo = "No results Found ";
                	$scope.disableNextStyle = "disable";
                	$scope.disablePrevStyle = "disable";
                } else {
                	$scope.paginationInfo = "Showing " + (_l+1) + " to " + _r_max +" of " + n + " results";
                }





		 	}

		 	$scope.filterPage = function(page) {
		 		

		 		$scope.$currentPage = page;

		 		$scope.dDataSource = ($element["0"].attributes["d-data"].nodeValue);


		 		$scope.doPagination(page, $scope.filtered_search.length);

		 		$scope.animate();

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

            var repeatString = body["0"].attributes["ng-repeat"].nodeValue;
            var repeatData = repeatString.replace(/(.*) in (.*)/gi, "$2") + " ";
            var repeatItem = repeatString.replace(/(.*) in (.*)/gi, "$1");

            repeatData = repeatData.slice(0, repeatData.indexOf(' ')) ;
            iElm.attr("d-data", repeatData)

            //check if custom filter
            if(body["0"].attributes["d-filter"] != undefined) {
           		 var customFilter = (body["0"].attributes["d-filter"].nodeValue);
         	 } else { var customFilter = undefined }
            console.log(customFilter)
            if(customFilter==undefined || customFilter == '') {
            	customFilter = '';
            } else {
            	customFilter = " | " + customFilter;
            }

            console.log(customFilter);

            repeatString = repeatItem +" in filtered = ( filtered_search = (" + repeatData + customFilter + " | filter:$search | orderBy:$field:$reverse) | startFrom:$currentPage*$pageSize | limitTo:$pageSize)";
            body.attr("ng-repeat", repeatString);
            body = body[0].outerHTML;
            header = header[0].outerHTML;
			header = header.replace(/<colm/g, "<th class='btn-primary'");
			header = header.replace(/<\/colm>/g, "</th>");
			header = header.replace(/d-sort=["'](.*?)['"]/gi, "ng-click=\"sortBy('$1')\"");
			body = body.replace(/<colm/g, "<td");
			body = body.replace(/<\/colm>/g, "</td>");
			body = body.replace(/table-body/g, "tr");


			var searchHtml = `<div class="d-t-search"><input type='text' class="form-control input-sm" ng-model='$search' placeholder="Search"/></div>`;
            var paginationHtml = `<div class="pager" ng-if="!isNoPagination">
            <span >{{paginationInfo}}</span>
            <span ng-show="isMaxPageLink" ng-click="goPage(0)" class="page-num {{disablePrevStyle}}">First</span>
            <span ng-click="prePage()" class="page-num {{disablePrevStyle}}">Prev</span>
            <span ng-click="goPage(p)" class="page-num {{activePageStyle[p]}}" ng-repeat="p in pageNum">{{p+1}}</span>
            <span ng-click="nextPage()" ng-disable="true" class="page-num {{disableNextStyle}}">Next</span>
            <span ng-show="isMaxPageLink" ng-click="goPage('n')" class="page-num {{disableNextStyle}}">Last</span>

            </div>`;
            var noRecordsHtml = `<div ng-if="isNoRecords" class="no-rec">No results in the table</div>


            `;


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
			 <tbody id="_animi_">
			  ` + body + `
			 </tbody> 
			  </table> 

              ` + bottomHtml + noRecordsHtml + `
			`; 

			return outerHtml;
		 },
		// templateUrl: '',
		// replace: true,
		 //transclude: true,
		link: function($scope, iElm, iAttrs, controller) {


			      $scope.initCall = false;


			
                    $scope.$watch(function(scope) { return  $scope.$search},
                          function(newValue, oldValue) {
                          	if($scope.initCall)
                          	$scope.filterPage(0);
                          	$scope.animate();
                          }
                  );



                    $scope.$watch('filtered', function (newValue, oldValue, scope) {
                       if($scope.filtered) {
                       		$scope.isNoPagination = false;
                            if(!$scope.initCall) {
                       			$scope.filterPage(0);
                       			$scope.initCall = true;
                         	} 
                         	$scope.isNoRecords = false;
                       	}
                       	else {
                           $scope.isNoPagination = true;
                           $scope.isNoRecords = true;
                       	}
                       
                 }, true);

                    



			
		}
	};
})

.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        if(input)
        return input.slice(start);
    }
});