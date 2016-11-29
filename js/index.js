var ForecastApp = angular.module('Weather', []);

ForecastApp.factory('WeatherApi', function($http) {
  var obj = {};
  
  obj.getCoords = function() {
    return $http.jsonp("http://ipinfo.io/json?callback=JSON_CALLBACK");
  };
  obj.getWeather = function(city) {
    var api = "http://api.openweathermap.org/data/2.5/weather?q=";
    var units = "&units=metric";
    var appid = "&APPID=e2dd27eb91335a25c1d290ed6241e46d"
    var cb = "&callback=JSON_CALLBACK";
    
    return $http.jsonp(api + city + units + appid + cb);
  };
  return obj
});

ForecastApp.controller('Main', function($scope, WeatherApi) {
  $scope.Data = {};
  $scope.Data.unit ='C';
  WeatherApi.getCoords().success(function(data) {
    var city = data.city + ',' + data.country;
    $scope.Data.city = data.city;
    $scope.Data.country = data.country;
    WeatherApi.getWeather(city).success(function(data) {
      displayWeather(data)
    });
  });

  function displayWeather(data) {
    var d = new Date();
    var n = d.toDateString().split(" ");
    $scope.Data.date = n[0] + ", " + n[1] + " " + n[2];
    $scope.Data.tempC = Math.round(data.main.temp);
    $scope.Data.tempF = Math.round((data.main.temp * 9) / 5 + 32);
    $scope.Data.temp_min = Math.round(data.main.temp_min);
    $scope.Data.temp_max = Math.round(data.main.temp_max);
    $scope.Data.pressure = data.main.pressure;
    $scope.Data.humidity = data.main.humidity;
    $scope.Data.forecast = data.weather[0].main;
    return setWeather($scope.Data.forecast);
  }

  function setWeather(forecast) {
    $('body').removeClass('Default Clouds Snow Clear Rain Thunderstorm');
    $('body').addClass(forecast);
    $('i').removeClass('wi-cloudy wi-snow wi-day-sunny wi-rain wi-storm-showers');
    switch (forecast) {
      case 'Clouds':
        $('i').addClass('wi-cloudy');
        break;
      case 'Snow':
        $('i').addClass('wi-snow');
        break;
      case 'Clear':
        $('i').addClass('wi-day-sunny');
        break;
      case 'Rain':
        $('i').addClass('wi-rain');
        break;
      case 'Thunderstorm':
        $('i').addClass('wi-storm-showers');
        break;
    }
  }
});