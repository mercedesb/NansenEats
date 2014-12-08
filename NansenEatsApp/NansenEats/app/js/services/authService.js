(function () {
	'use strict';

	angular
		.module('app')
		.factory('authService', authService);

	authService.$inject = ['$http', '$q', 'localStorageService'];

	function authService($http, $q, localStorageService) {

		var serviceBase = 'http://eatsapi.local/';
		var authServiceFactory = {};

		var _authentication = {
			isAuth: false,
			userName: "",
			userId: "",
			userDisplayName: "",
			userImageUrl: "",
			userEmail: ""
		};

		var _saveRegistration = function (registration) {

			_logOut();

			return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
				return response;
			});

		};

		var _login = function (loginData) {

			var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

			var deferred = $q.defer();

			$http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

				var token = response.access_token;
				var userName = loginData.userName;
				var userId = response.userId;
				var userDisplayName = response.userDisplayName;
				var userImageUrl = response.userImageUrl;
				var userEmail = loginData.email;

				localStorageService.set('authorizationData', { token: token, userName: userName, userId: userId, userDisplayName: userDisplayName, userImageUrl: userImageUrl, userEmail: userEmail });

				_authentication.isAuth = true;
				_authentication.userName = loginData.userName;
				_authentication.userId = response.userId;
				_authentication.userDisplayName = response.displayName;

				deferred.resolve(response);

			}).error(function (err, status) {
				_logOut();
				deferred.reject(err);
			});

			return deferred.promise;

		};

		var _logOut = function () {

			localStorageService.remove('authorizationData');

			_authentication.isAuth = false;
			_authentication.userName = "";
			_authentication.userId = "";
			_authentication.userDisplayName = "";
			_authentication.userImageUrl = "";
			_authentication.userEmail = "";

		};

		var _fillAuthData = function () {

			var authData = localStorageService.get('authorizationData');
			if (authData) {
				_authentication.isAuth = true;
				_authentication.userName = authData.userName;
				_authentication.userId = authData.userId;
				_authentication.userDisplayName = authData.userDisplayName;
				_authentication.userImageUrl = authData.userImageUrl;
				_authentication.userEmail = authData.userEmail;
			}

		}

		authServiceFactory.saveRegistration = _saveRegistration;
		authServiceFactory.login = _login;
		authServiceFactory.logOut = _logOut;
		authServiceFactory.fillAuthData = _fillAuthData;
		authServiceFactory.authentication = _authentication;

		return authServiceFactory;
	}
})();