angular.module('testApp')
.constant('baseURL', 'http://api.openweathermap.org/data/2.5/')
.constant('apiKey', '1d4689d66facb710550044dbdfb307f1')
.constant('app_id', 'f8b7fb8f')
.service('weatherService', ['$resource', 'baseURL', 'apiKey', '$rootScope', function($resource, baseURL, apiKey, $rootScope){
  this.getWeatherInfoByCityId = function(cityId){
    if (cityId == null || cityId == undefined || cityId == 0 || cityId == {})
    {
      cityId = 3674962; //<--- Medellin,CO by default
    }

    if ($rootScope.weatherUnits == undefined || $rootScope.weatherUnits == null || $rootScope.weatherUnits.trim() == ''){
    	$rootScope.weatherUnits = 'metric';
    }

    console.log($rootScope.weatherUnits);
    return $resource(baseURL+'weather?id=' + cityId + '&APPID=' + apiKey 
    	+ '&units='+ $rootScope.weatherUnits + '&lang=es');
  }
}])


.service('loginService', ['$resource', '$ionicAuth', '$ionicUser', 'app_id', '$timeout'
			, function($resource, $ionicAuth, $ionicUser, app_id, $timeout){

	this.login = function(email, password){
		if (email == undefined || email == null || email == ""){
			throw 'El correo electrónico es requerido.';
		}
		if (password == undefined || password == null || password == ""){
			throw 'La contraseña es requerida.';
		}

		loginData = {'email': email, 'password': password};

		return $ionicAuth.login('basic', loginData);

	}

	this.logout = function(){
		$ionicAuth.logout();
	}

	this.signup = function(email, password, name){
		if (email == undefined || email == null || email == ""){
			throw 'El correo electrónico es requerido.';
		}
		if (password == undefined || password == null || password == ""){
			throw 'La contraseña es requerida.';
		}

		return $ionicAuth.signup({'app_id': app_id, 'email': email, 'password': password, 'name': name});
	}

	this.getUser = function(){
		return $ionicUser.details;
	}

}])

;

/*
GET CURRENT WEATHER INFORMATION FOR MEDELLIN (metric units, lang = spanish):

http://api.openweathermap.org/data/2.5/weather?id=3674962&APPID=1d4689d66facb710550044dbdfb307f1&units=metric&lang=es

RESPONSE (data example):
{"coord":{"lon":-75.56,"lat":6.25},"weather":[{"id":701,"main":"Mist","description":"niebla","icon":"50d"}],"base":"stations","main":{"temp":19.39,"pressure":1023,"humidity":64,"temp_min":16,"temp_max":23},"visibility":10000,"wind":{"speed":0.62,"deg":61.5015},"clouds":{"all":75},"dt":1485871200,"sys":{"type":1,"id":4261,"message":0.1867,"country":"CO","sunrise":1485861600,"sunset":1485904303},"id":3674962,"name":"Medellin","cod":200}

*/
