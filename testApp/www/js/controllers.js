angular.module('testApp')

.controller('HomeCtrl', ['$scope', 'weatherService', function($scope, weatherService) {
  $scope.showMsg = false;
  $scope.showWeather = false;
  
  $scope.clickedTest = function(){
    $scope.showMsg = !$scope.showMsg;
    $scope.showWeather = !$scope.showWeather;
    $scope.getWeatherInfo(3674962);
  }

  $scope.getWeatherInfo = function(cityId){
  	var localWeatherTmp = null;
  	if ($scope.localWeather != undefined && $scope.localWeather != null && $scope.localWeather != {}){
  		localWeatherTmp = $scope.localWeather;
  	}

  	var localTempTmp = null;
  	if ($scope.localTemp != undefined && $scope.localTemp != null && $scope.localTemp != {}){
  		localTempTmp = $scope.localTemp;
  	}
  	weatherService.getWeatherInfoByCityId(cityId).get().$promise.then(
  		function(response){
  			console.log(JSON.stringify(response.main));
  			$scope.localWeather = response.weather[0];
  			$scope.localTemp = response.main;
  			if ($scope.localWeather == undefined || $scope.localWeather == null || $scope.localWeather == {}){
  				$scope.localWeather = localWeatherTmp != null ? localWeatherTmp : {};
  			}
  			if ($scope.localTemp == undefined || $scope.localTemp == null || $scope.localTemp == {}){
  				$scope.localTemp = localTempTmp != null ? localTempTmp : {};
  			}
  		},
  		function(response){
  			console.log(JSON.stringify(response));
  		});
  }

  $scope.getCurrentWeatherIconUrl = function(){
  	if ($scope.localWeather.icon == null || $scope.localWeather.icon == undefined || $scope.localWeather == {}){
  		return "http://host.coxmediagroup.com/wpb/editorial/insuranceexplorer/icons/icon0.png";
  	}

  	return "http://openweathermap.org/img/w/" + $scope.localWeather.icon + ".png";
  }

}])


.controller('LoginCtrl', function($scope, $ionicAuth, $ionicUser){
  $scope.title = 'Login page';
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };

});
