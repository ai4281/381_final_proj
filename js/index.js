var app = angular.module('StarterApp', ['ngMaterial']);


// app.config (['$routeProvider', 

// 	function($routeProvider) {
// 			$routeProvider
// 			.when('/main', {
// 				controller: 'AppCtrl',
// 				templateUrl: 'main.html'
// 			})
// 			.otherwise({ redirectTo: '/main' });
// 		} 
// 	]
// );


app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };


  // $scope.colorClicked = function() {
  // 		setVariables($scope.color.red);

  // 	}
}]);


