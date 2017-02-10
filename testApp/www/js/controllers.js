angular.module('testApp')

.controller('HomeCtrl', ['$scope', 'weatherService', '$ionicModal', function($scope, weatherService, $ionicModal) {
  
  $scope.initCtrl = function(){
  	try{
		$scope.showMsg = false;
		$scope.showWeather = false;

		$scope.modalInit();

	  	$scope.openModal = function(){
	  		$scope.modal.show();
	  	}
	  	$scope.closeModal = function(){
	  		$scope.modal.hide();
	  	}
	  	console.log($scope.showMsg ? "true" : "false");
  	} catch(ex){
  		console.log(ex.message);
  	}
  }

  	$scope.$on('$destroy', function(){
  		$scope.modal.remove();
  	});
	$scope.$on('modal.hidden', function(){
		// do something
	});
	$scope.$on('modal.removed', function(){
		// do something...
	})

  $scope.modalInit = function(){
  	$ionicModal.fromTemplateUrl('/templates/modals/weatherInfo.html',
	  	{
	  		scope: $scope,
	  		animation: 'slide-in-up'
	  	}).then(function(modal){
	  		$scope.modal = modal;
	  	});
  }
  
  $scope.showWeatherDetails = function(){
  	$scope.openModal();
  }

  $scope.queryAndShowWeather = function(){
  	$scope.showWeather = !$scope.showWeather;
  	if ($scope.showWeather == true){
		$scope.getWeatherInfo();
  	}
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
  	if ($scope.localWeather == undefined || $scope.localWeather == null || $scope.localWeather == {}){
  		return "http://host.coxmediagroup.com/wpb/editorial/insuranceexplorer/icons/icon0.png";
  	}

  	return "http://openweathermap.org/img/w/" + $scope.localWeather.icon + ".png";
  }

  $scope.initCtrl();

}])


.controller('LoginCtrl', function($scope, $ionicAuth, $ionicUser){
  $scope.title = 'Login page';
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };

});
