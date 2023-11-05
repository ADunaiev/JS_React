const mainApp = angular.module("mainApp", []);
// omdb settingss
const baseUrl = "http://www.omdbapi.com/";
const myApi = "a4a199c8"; 


mainApp.controller('PagerController', PagerController)
// pagination
.directive('pagingControl', [function($scope){
  return {
    restrict: 'E',
    template: `<ul ng-if="pager.pages.length" class="pager pagination">
          <li ng-class="{disabled:pager.currentPage === 1}">
            <a ng-click="setPage(1)">First</a>
          </li>
          <li ng-class="{disabled:pager.currentPage === 1}">
            <a ng-click="setPage(pager.currentPage - 1)"><i class="material-icons">chevron_left</i></a>
          </li>
          <li ng-repeat="page in pager.pages" ng-class="{active:pager.currentPage === page}">
            <a ng-click="setPage(page)">{{page}}</a>
          </li>                
          <li ng-class="{disabled:pager.currentPage === pager.totalPages}">
            <a ng-click="setPage(pager.currentPage + 1)"><i class="material-icons">chevron_right</i></a>
          </li>
          <li ng-class="{disabled:pager.currentPage === pager.totalPages}">
            <a ng-click="setPage(pager.totalPages)">Last</a>
          </li>
      </ul>`,
    controller: PagingController,
    scope: {
      totalItems: "=",
      displayItems: '=',
      pagingSize: '=',
      itemPerPage: '=noofitem',
      searchName: "=",
      searchType: "=",
      findedMovies: '=',
      numberOfItems: "=",
    }
  };
}]);

function PagingController($scope, $http) {
  	
  // data
  $scope.pager = {};
  $scope.pagingSize = $scope.pagingSize || 10;
  $scope.itemPerPage = $scope.itemPerPage || 10;
  $scope.movieDetails = '';
  
  // pager settings
  function setPager (itemCount, currentPage, itemPerPage) {
    currentPage = currentPage || 1;
    var startPage, endPage;

    var totalPages = Math.ceil(itemCount / itemPerPage);		
    if (totalPages <= $scope.pagingSize) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage + 1 >= totalPages) {
        startPage = totalPages - ($scope.pagingSize - 1);
        endPage = totalPages;
      } else {
        startPage = currentPage - parseInt($scope.pagingSize/2);
        startPage = startPage <= 0 ? 1 : startPage;
        endPage = (startPage + $scope.pagingSize - 1) <= totalPages ? (startPage + $scope.pagingSize - 1) : totalPages;
        if(totalPages === endPage) {
          startPage = endPage - $scope.pagingSize + 1;
        }
      }
    }

    var startIndex = (currentPage - 1) * itemPerPage;
    var endIndex = startIndex + itemPerPage - 1;

    var index = startPage;
    var pages = [];
    for(; index < endPage + 1; index++)
      pages.push(index);
      
    $scope.pager.currentPage = currentPage;
    $scope.pager.totalPages = totalPages;
    $scope.pager.startPage = startPage;
    $scope.pager.endPage = endPage;
    $scope.pager.startIndex = startIndex;
    $scope.pager.endIndex = endIndex;
    $scope.pager.pages = pages;
  }
  
  $scope.setPage = function(currentPage) {
    if (currentPage < 1 || currentPage > $scope.pager.totalPages)
      return;

    setPager($scope.numberOfItems, currentPage, $scope.itemPerPage);
    
   $http.get(`${baseUrl}?apikey=${myApi}&s=` + $scope.searchName + `&r=json&type=` + $scope.searchType +`&page=${currentPage}`).then( r  =>  {
        if(r.status === 200) {         
            $scope.findedMovies = r.data;
          }
          else {
            alert(`fetch error: got status ${r.status}`);
          }
    });  
  };
  
  $scope.setPage(1);
}

function PagerController($scope, $http){
  $scope.pagingSize = 5;
  $scope.dataPerPage = 10;
  $scope.totalItems = [];
  $scope.searchName = '';
  $scope.searchType = '';
  $scope.findedMovies = [];
  $scope.numberOfItems = 0;
  $scope.movieDetails = '';

  // materialize select activation
  $(document).ready(function(){
    $('select').formSelect()});

  // search Button click-event handler
  $scope.searchBtnClick = () => {
    $scope.findedMovies = [];
    $scope.searchName = $scope.searchTextarea;
    $scope.searchType = $scope.movieType;
      
    //search query to server
    $http.get(`${baseUrl}?apikey=${myApi}&s=` + $scope.searchTextarea + `&r=json&type=${$scope.movieType}&s`).then( r  =>  {
          if(r.status === 200) {
              
              $scope.findedMovies = r.data;
              $scope.numberOfItems = parseInt(r.data.totalResults);
            }
            else {
              alert(`fetch error: got status ${r.status}`);
            }
      });

    
  };

  // details button click-event handler
  $scope.detailsBtnClick = (title) => {

      //search query to server
       $http.get(`${baseUrl}?apikey=${myApi}&t=` + title).then( r  =>  {
        if(r.status === 200) {     
            $scope.movieDetails = r.data;
          }
          else {
            alert(`fetch error: got status ${r.status}`);
          }
    });
  };

};
