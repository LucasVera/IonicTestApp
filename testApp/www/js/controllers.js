angular.module('testApp')

.controller('HomeCtrl', ['$scope', 'weatherService', function($scope, weatherService) {
  $scope.showMsg = false;
  $scope.clickedTest = function(){
    $scope.showMsg = !$scope.showMsg;
    $scope.getWeatherInfo(3674962);
  }

  $scope.getWeatherInfo = function(cityId){
  	weatherService.getWeatherInfoByCityId(cityId).get().$promise.then(
  		function(response){
  			console.log(JSON.stringify(response));
  			$scope.localWeather = response.weather;
  		},
  		function(response){
  			console.log(JSON.stringify(response));
  		});

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
