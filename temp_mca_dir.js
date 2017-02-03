.directive('dTable', function($timeout){
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
                //handle for last page clicked
                 if(n == 'n')
                    $scope.isLastPageLinkClicked = true;
                 else
                    $scope.isLastPageLinkClicked = false;


                 $scope.filterTr(n);
            }

            $scope.nextPage = function() {
                 $scope.filterTr($scope.currentPage + 1);
            }
            $scope.prePage = function() {
                 $scope.filterTr($scope.currentPage - 1);
                 console.log("go to pre of : " + $scope.currentPage)
            }

            $scope.doPagination = function(cur, n, ele) {
                if($scope.isNoPagination)
                    return;

                var page_no_count;
                //calculate no of page indexes to display
                page_no_count = Math.ceil(n/$scope.pageItems);

                ////handle for last page clicked for cur
                if($scope.isLastPageLinkClicked)
                    cur = page_no_count-1;

                //styles
                $scope.activePageStyle = [];
                $scope.activePageStyle[cur] = "active"

                $scope.disablePrevStyle = null;
                $scope.disableNextStyle = null;


                $scope.pageNum = [];
                $scope.currentPage = parseInt(cur);

                console.log("cur:" + cur + ",n:" + n )

                 

                


                if(cur == 0)
                    $scope.disablePrevStyle = "disable";
                if(cur == page_no_count-1)
                    $scope.disableNextStyle = "disable"
                
                for(var i=0;i<page_no_count;i++) {
                        $scope.pageNum[i] = i;
                }

                //slice no of page links per to displayed
                var dMaxLinks = $attrs.dMaxPageLinks;
                if(dMaxLinks != undefined && dMaxLinks!= '') {
                    if(dMaxLinks < page_no_count) {
                        $scope.isMaxPageLink = true;
                        $scope.pageNum = $scope.pageNum.slice(cur, (parseInt(dMaxLinks)+cur));
                    }
                }

                console.log($scope.pageNum)

                console.log("length of pages : " + page_no_count)


                //console.log(ele)
                var _l = cur*$scope.pageItems;
                var _r = $scope.pageItems*(cur+1);
                console.log(_l + "<--left")
                console.log(_l + " : " + _r);

                var _r_max = _r;
                if(_r>n)
                    _r_max = n;

                $scope.paginationInfo = "Showing " + (_l+1) + " to " + _r_max +" of " + n + " results";
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
                                        //  console.log("length is one")
                                        //  //return;
                                        // }
                                        var filtered_rows_no = 0;
                                        var len = ($scope.tdArray.length);

                                        var srch = $scope.$search;
                                            if(srch != undefined)
                                                srch = srch.toLowerCase();
                                            else
                                                srch = '';
                                        
                                        
                                        var html_ = '';
                                        for(var k=0;k<len;k++) {
                                            
                                                


                                            if(($scope.tdArray[k].innerText.toLowerCase().replace(/[^0-9a-z\s]/gi, '').includes(srch))) {
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

            $scope.sortBy = function(field) {
                $scope.$order = field;
                var get_updaters = $scope.findUpdaters(); 
                $scope.trHolder = get_updaters.tr;
                $scope.tdArray = $scope.temp_tdArray;
                console.log($scope.temp_tdArray);
                $timeout(function() {
                   $scope.filterTr(0); 
               }, 1000);
                //
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
                        if(_c[i].localName == 'table-body') {   
                            body = angular.element(_c[i]);
                        }
                    
            }

            body = body[0].outerHTML;
            header = header[0].outerHTML;
            header = header.replace(/<colm/g, "<th class='btn-primary'");
            header = header.replace(/<\/colm>/g, "</th>");
            header = header.replace(/d-sort=["'](.*?)['"]/gi, "ng-click=\"sortBy('$1')\"");
            body = body.replace(/<colm/g, "<td");
            body = body.replace(/<\/colm>/g, "</td>");
            body = body.replace(/table-body/g, "tr");


            var searchHtml = `<div ng-show="tableLoaded" class="d-t-search"><input type='text' class="form-control input-sm" ng-model='$search' placeholder="Search"/></div>`;
            var paginationHtml = `<div ng-show="tableLoaded" class="pager" ng-if="!isNoPagination">

            <span >{{paginationInfo}}</span>
            <span ng-show="isMaxPageLink" ng-click="goPage(0)" class="page-num {{disablePrevStyle}}">First</span>
            <span ng-click="prePage()" class="page-num {{disablePrevStyle}}">Prev</span>
            <span ng-click="goPage(p)" class="page-num {{activePageStyle[p]}}" ng-repeat="p in pageNum">{{p+1}}</span>
            <span ng-click="nextPage()" ng-disable="true" class="page-num {{disableNextStyle}}">Next</span>
            <span ng-show="isMaxPageLink" ng-click="goPage('n')" class="page-num {{disableNextStyle}}">Last</span>

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
            //      topHtml = searchHtml;
            //      } 
            //   else
            //      topHtml = pagination_position;
            //  }   

            var outerHtml = `
            ` + topHtml + `
            <table>
            <span ng-hide="tableLoaded" class="loading-info"><b>Loading data... </b></span>
             <thead>
              <tr> ` + header + `
              </tr>
             </thead> 
             <tbody id="tbody" class="loading{{tableLoaded}}">
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

                console.log(iElm)
                
                  
            },
             
             post: function($scope, iElm) {




                window.onload = init();

                function init() {
                var get_updaters = $scope.findUpdaters(); 


//                 var d = document.getElementById("tbody");

// d.addEventListener ("DOMNodeInserted", function(ev) {
//     if (ev.relatedNode == d) {
//         console.log("element inserted into div");
//     }
// });



                
                console.log(get_updaters)
                if(get_updaters.tr["0"].childElementCount > 0) {
                    console.log("called")
                    $scope.trHolder = get_updaters.tr;
                    $scope.tdArray = Array.prototype.slice.call(get_updaters.td);
                    $scope.temp_tdArray = get_updaters.td;
                    $scope.filterTr(0);
                    $scope.$apply();
                     $scope.$watch(function(scope) { return  $scope.$search},
                          function(newValue, oldValue) {
                          
                                console.log($scope.$search)
                                 $scope.filterTr(0);
                                //console.log($scope.tData.length)
                               // $scope.pageUpdate($scope.currentPage, $scope.tData.length)
                          
                          }
                  );
                     $scope.tableLoaded = true;   
                    
                }
                else {
                    console.log("claasd")
                    $timeout(function() {
                        init();
                }, 0);  
                }
                

               
                }

                console.log("after")

                console.log(iElm)

                angular.element(document).ready(function () {

                   


                  
                
                
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












            <d-table no-paginationS d-max-rows="5" d-pagination-position="bottom" d-search-position="top" d-max-page-links="7" ng-init="$order = 'lender.contact_name'"> 

        <table-header>
                                  <colm ></colm>
                                  <!-- <th nowrap>#</th> -->
                                  <colm nowrap d-sort="program_type">Funding Program {{$order}}</colm>
                                  <colm nowrap>Contact</colm>
                                  <colm nowrap>Term</colm>
                                  <colm nowrap>Time in Business</colm>
                                  <colm nowrap class="text-right">Buy Rate</colm>
                                  <colm nowrap class="text-right">Credit Score</colm>
                                  
                                  <colm nowrap class="text-right">Min Loan</colm>
                                  <colm nowrap class="text-right">Max Loan</colm>
        </table-header>



        <table-body ng-repeat= "program in lendingProgramVm.lendingPrograms | orderObjectBy:$order:false track by $index" >

                                  <colm style="width:7%" class="text-center"><i class="fa fa-check-circle " aria-hidden="true" ng-class='{ "circleGreen" :  program.program_status  == true   , "circleGray" :  program.program_status == false }'></i></colm>
                                  <!-- <colm ng-click="lending_program_add_edit('edit' , dashboard_data)"><a >{{dashboard_data.id}}</a></colm> -->
                                  <colm class="text-left"><a ng-href="#/lending-program-details/{{program.id}}">{{program.program_type}}</a></colm>
                                  <colm class="text-left">{{program.lender.contact_name}}</colm>
                                  <colm class="text-left" nowrap>{{program.max_duration >= 30 ? program.max_duration/30 : program.max_duration }} {{program.max_duration >= 30 ? "months" : "days"}}</colm>
                                  <colm class="text-left">{{program.min_business_age >= 12 ? program.min_business_age/12 : program.min_business_age }} {{program.min_business_age >= 12 ? 'years' : 'months' }}</colm>
                                  <colm class="text-left">{{program.interest | percentage:2}}</colm>
                                  <colm class="text-left">{{program.min_credit_fico}}</colm>
                                  
                                  <colm class="text-left">{{program.min_deal_size | currency:'$':0}}</colm>
                                  <colm class="text-left">{{program.max_deal_size   | currency:'$':0}}</colm>

                               
        </table-body>

</d-table>



d-table {
    width:100%;
    display: block;
    font-family: arial;
    font-size: 12px;

}
d-table table {
    width:100%;
    outline:1px solid #2d3943;
        margin-bottom: 11px;
}

d-table thead th {
    background: #2d3943 !important;
    padding:7px;
}



d-table tbody tr:nth-child(even) {
      background:#f6f6f6;
    }
d-table tbody tr:hover { 
    background-color: #FFF8DC;
} 

d-table tbody td {
    padding:7px;
    border-bottom:1px solid #d5d5d5;
    transition: .2s all;
}



.d-t-search {
    text-align: right;
    padding:4px;
}
.d-t-search input {
    width:220px;
    display: inline-block!important;
    transition: 0.2s all;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
}
.d-t-search input:focus {
    width:250px;
    box-shadow: none;
    border:1px solid #999;
}
d-table .pager {
    text-align: right!important;
    display: block;
    margin:6px!important
}
d-table .page-num {
    border: 1px solid #d9d9d9;
    background:#f0f0f0;
    padding: 5px 9px;
    margin: 2px;
    cursor: pointer;
    border-radius: 1px;
}

d-table .page-num:hover {
        transition: 0.3s all;
        background: #d9d9d9;
   
    }

d-table .page-num.active {
    border: 1px solid #2d3943;
    background:#2d3943;
    color:#fff;
    cursor: default;
}

d-table .page-num.disable {
    border: 1px solid #f0f0f0;
    background:none;
    color:#999;
    pointer-events: none;
}

d-table tbody.loading {
    display:block;
    height:50px;
    overflow:auto;
    opacity:0;
    transition: .4s all;    
}
d-table tbody.loadingtrue {
    opacity:1;
    transition: .7s all;    
}
d-table .loading-info {
    position: relative;
    top: 60px;
    left: 47%;
}