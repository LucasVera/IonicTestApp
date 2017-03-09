angular.module('testApp')

.controller('HomeCtrl', ['$scope', '$rootScope', 'weatherService', '$ionicModal'
  , '$ionicPopover', '$ionicPopup', '$timeout'
  , function($scope, $rootScope, weatherService, $ionicModal, $ionicPopover
    , $ionicPopup, $timeout) {
  
  $scope.initCtrl = function(){
  	try{
		$scope.showMsg = false;
		$scope.showWeather = false;

		$scope.modalInit();
    $scope.initOptionsPopover();
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
	});

  $scope.modalInit = function(){
  	$ionicModal.fromTemplateUrl('/templates/modals/weatherInfo.html',{
      scope: $scope
    }).then(function(modal){
      $scope.weatherDetailsModal = modal;
    });

  }	

  $scope.showWeatherDetails = function(){
		$scope.weatherDetailsModal.show();
	}
	$scope.closeWeatherDetails = function(){
		$scope.weatherDetailsModal.hide();
	}

  $scope.queryAndShowWeather = function(hideWeather){
  	if (hideWeather){
		$scope.showWeather = !$scope.showWeather;
  	}
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
        $scope.fullWeatherInfo = response;
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
  		return 'http://host.coxmediagroup.com/wpb/editorial/insuranceexplorer/icons/icon0.png';
  	}

  	return 'http://openweathermap.org/img/w/' + $scope.localWeather.icon + '.png';
  }

  $scope.getCurrentTemperatureSign = function(){
  	var ret = '';
  	switch($rootScope.weatherUnits){
  		case 'metric':
  			ret = '°C';
  			break;

  		case 'imperial':
  			ret = '°F';
  			break;

  		default:
  			ret = 'K';
  			break;
  	}
  	return ret;
  }

  $scope.initOptionsPopover = function(){
    $ionicPopover.fromTemplateUrl('templates/popovers/options.html', {
      scope: $scope
    }).then(function(popover){
      $scope.optionsPopover = popover;
      console.log('popover created');
    });
  }

  $scope.showOptionsPopover = function($event){
    $scope.optionsPopover.show($event);
  }

  $scope.closeOptionsPopover = function(){
    $scope.optionsPopover.hide();
  }

  $scope.confirmAction = function(){
    $scope.closeOptionsPopover();
    console.log('confirm action');
    var confirmPopup = $ionicPopup.confirm({
      template: '<span class="dark">¿Está seguro que desea hacer esto?</span>',
      title: '<h3 class="dark">Acción 1</h3>'
    });
    confirmPopup.then(function(res){
      if (res){
        console.log('action 1 confirmed!');
      }
      else{
        console.log('action 1 NOT confirmed');
      }
    });
  }

  $scope.logout = function(){
    console.log('logout');
    $scope.closeOptionsPopover();

    var loadingPopup = $ionicPopup.show({
      template: '<div class="bg-pad dark">'
                + '<h4 class="dark icon"><ion-spinner class="icon dark"></ion-spinner>'
                + 'Procesando...</h4></div>',
      scope: $scope
    });

    $timeout(function(){
      // simulate that the app is working on something
      loadingPopup.close();
    }, 4000);

  }

  $scope.initCtrl();

}])

.controller('LoginCtrl', ['$scope', 'loginService', '$timeout', '$ionicModal', '$ionicUser'
  , function($scope, loginService, $timeout, $ionicModal, $ionicUser){
  $scope.title = 'Login page';

  $scope.initCtrl = function(){
  	$scope.username='';
  	$scope.password='';
  	$scope.showLoginMsg = false;
  	$scope.loginMsgClass = '';
    $scope.newAccount={};
    $scope.showLoginForm = true;
    $ionicModal.fromTemplateUrl('templates/modals/createAccount.html',{
      scope:$scope
    }).then(function(modal){
      $scope.newAccountModal = modal;
    });
  }

  $scope.validateLoginInfo = function(username, password){
  	if (username == undefined || username == null || username.trim() == ""){
	  		$scope.showMessage('El usuario es requerido', 'assertive-bg');
	  		return false;
	  	}
	  	if (password == undefined || password == null || password.trim() == ""){
	  		$scope.showMessage('La contraseña es requerida', 'assertive-bg');
	  		return false;
	  	}  	

	  	$scope.username = username;
	  	$scope.password = password;

	  	return true;
  }

  $scope.login = function(username, password){
  	try{
  		if (!$scope.validateLoginInfo(username, password)){
  			return;
  		}

	  	$scope.showMessage('Autenticando...', 'calm-bg');

	  	loginService.login(username, password)
        .then(function(){
          console.log($ionicUser.details);
          $scope.closeNewAccountModal();
          $scope.showMessage('Autenticado con éxito', 'balanced-bg');
          $timeout(function(){
              $scope.showLoginForm = false;
            }, 1000)
        }, function(err){
          console.log(JSON.stringify(err));
          $scope.showMessage('No se pudo hacer login... Verifique sus credenciales e inténtelo de nuevo', 'assertive-bg');
        });
  	}
  	catch(ex){
  		$scope.showMessage('Ocurrió un error. ' + ex.message, 'assertive-bg');
  	}
  }

  $scope.getLoginName = function(){
    var user = loginService.getUser();

    if (user == undefined || user == null || user == {}){
      return '';
    }

    return user.name;
  }

  $scope.closeNewAccountModal = function(){
    $scope.newAccountModal.hide();
  }

  $scope.createAccount = function(){
    $scope.initNewAccountModal();
    $scope.newAccountModal.show();
  }

  $scope.initNewAccountModal = function(){
    $scope.newAccount = {};
    $scope.showNewAccountMsg = false;
  }

  $scope.doCreateAccount = function(){
  	try{
      console.log(JSON.stringify($scope.newAccount));
  		if (!$scope.validateNewAccountData()){
  			return;
  		}

  		$scope.createAccountMsg('Creando cuenta...', 'calm-bg');

  		loginService.signup(
              $scope.newAccount.email, 
              $scope.newAccount.password, 
              $scope.newAccount.name)
      .then(function(response){
				console.log('Success!');
				$scope.createAccountMsg('Cuenta creada con éxito! haciendo login ahora...', 'balanced-bg');
        loginService.login($scope.newAccount.email, $scope.newAccount.password)
          .then(function(){
            console.log($ionicUser.details);
            $scope.closeNewAccountModal();
            $timeout(function(){
              $scope.showLoginForm = false;
            }, 1000)
          }, function(err){
            $scope.createAccountMsg('El login falló... ' + err.details, 'assertive-bg');
          });
			}, function(err){
				for (var e of err.details){
					if (e == 'conflict_email'){
						$scope.createAccountMsg('El email ya está registrado', 'assertive-bg');
					}
					else{
						$scope.createAccountMsg('Ocurrió un error: ' + e, 'assertive-bg');
					}
				}
			});
  	}
  	catch(ex){
      console.log(ex.message);
  		$scope.createAccountMsg('Ocurrió un error al ingresar usuario. ' + ex.message, 'assertive-bg');
  	}
  }

  $scope.validateNewAccountData = function(){
    var data = $scope.newAccount;
    if (data.email == undefined || data.email == null || data.email.trim() == ""){
      $scope.createAccountMsg('El email es requerido.', 'assertive-bg');
      return false;
    }
    if (data.password == undefined || data.password == null || data.password.trim() == ""){
      $scope.createAccountMsg('La contraseña es requerida.', 'assertive-bg');
      return false;
    }
    if (data.confirmPassword == undefined || data.confirmPassword == null
    || data.confirmPassword.trim() == "" || data.password != data.confirmPassword){
      $scope.createAccountMsg('La confirmación de contraseña no coincide.', 'assertive-bg');
      return false;
    }
    if (data.name == undefined || data.name == null || data.name.trim() == ""){
      $scope.createAccountMsg('Debe ingresar su nombre.', 'assertive-bg');
      return false;
    }

    return true;
  }

  $scope.hideLoginMsg = function(){
  	$scope.showLoginMsg = false;
  }

  $scope.hideNewAccountMsg = function(){
    $scope.showNewAccountMsg = false;
  }

  $scope.showMessage = function(message, cssClass){
  	$scope.showLoginMsg = true;
  	$scope.loginMsg = message;
  	$scope.loginMsgClass = cssClass;
  }

  $scope.createAccountMsg = function(message, cssClass){
    $scope.showNewAccountMsg = true;
    $scope.newAccountMsg = message;
    $scope.newAccountClass = cssClass;
  }

  $scope.initCtrl();

}])

.controller('SettingsCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.initCtrl = function(){
  	$scope.weatherUnits = 'metric';
  	$rootScope.weatherUnitsChanged = false;
  }

  $scope.testClicked=function(){
  	console.log($scope.weatherUnits);
  }

  $scope.changeWeatherUnit = function(unit){
  	$rootScope.weatherUnits = unit;
  	if ($rootScope.weatherUnits != $scope.weatherUnits){
  		$rootScope.weatherUnitsChanged = true;
  	}
  }

  $scope.initCtrl();

}]);
