var app = angular.module('MyApp', ['ngMaterial', 'ngRoute']);
var json;
var myJsonURL = "https://api.myjson.com/bins/2rhv1";

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/main', {
		templateUrl: 'pages/main.html'
    }).
      when('/intro', {
      	templateUrl: 'pages/intro.html'
    }).

      when('/', {
        templateUrl: 'pages/intro.html'
      });

}]);

init();

loadJSON();

app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();

    console.log("sidebar toggled");
  };

  $scope.changeTempo = function() {
    console.log("tempo changed");
    setBPM($scope.color.blue);
  }

  $scope.setBass = function() {
    bassFreq = $scope.color.red;
  }

  $scope.saveSettings = function() {
    console.log("saving");

    saveJSON();
  }

  $scope.loadSettings = function() {
    console.log("loading");

    try {
      $scope.color = {
        red: json.red,
        green: json.green,
        blue: json.blue,
        zAngle: json.fov
      } 
    }
    catch(err)
    {
      $scope.color = {
        red: data.red,
        green: data.green,
        blue: data.blue,
        zAngle: data.fov
      }
    }

    setBPM($scope.color.blue);
    bassFreq = $scope.color.red;

  }

  $scope.color = {
      red: data.red,
      green: data.green,
      blue: data.blue,
      zAngle: data.fov
  }

  bassFreq = $scope.color.red;


  

  setupIntervals();

}]);

app.controller('IntroCtrl', ['$scope', function($scope){


}]);




function loadJSON()
{
  $.get(myJsonURL, function (data, textStatus, jqXHR) {
      json = (data);
      console.log(json);
  });
}

function saveJSON()
{
  json = {"red":x,"green":y,"blue":z,"fov":zAngle};

  $.ajax({
    url: myJsonURL,
    type: "PUT",
    data: JSON.stringify(json),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
        console.log("uploaded");
        loadJSON();
    }

  });
}

// function changeTempoNA()
// {
//   setBPM(z);
// }


