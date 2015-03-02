(function () {
	'use strict';

	angular
		.module('app')
		.factory('authService', authService);

	authService.$inject = ['$http', '$q', 'localStorageService', 'ngAuthSettings'];

	function authService($http, $q, localStorageService, ngAuthSettings) {

		var serviceBase = ngAuthSettings.apiServiceBaseUri;
		var authServiceFactory = {};

		var _authentication = {
			isAuth: false,
			userName: "",
			userId: "",
			userDisplayName: "",
			userImageUrl: "",
			userEmail: "",
			useRefreshTokens: false
		};

		var _externalAuthData = {
			provider: "",
			userName: "",
			externalAccessToken: ""
		};
		var _saveRegistration = function (registration) {

			_logOut();

			return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
				return response;
			});

		};

		var _login = function (loginData) {

			var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

			if (loginData.useRefreshTokens) {
				data = data + "&client_id=" + ngAuthSettings.clientId;
			}

			var deferred = $q.defer();

			$http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

				var token = response.access_token;
				var userName = loginData.userName;
				var userId = response.userId;
				var userDisplayName = response.userDisplayName;
				var userImageUrl = response.userImageUrl;
				var userEmail = loginData.email;

				if (loginData.useRefreshTokens) {
					localStorageService.set('authorizationData', { token: token, userName: userName, refreshToken: response.refresh_token, useRefreshTokens: true, userId: userId, userDisplayName: userDisplayName, userImageUrl: userImageUrl, userEmail: userEmail });
				}
				else {
					localStorageService.set('authorizationData', { token: token, userName: userName, refreshToken: "", useRefreshTokens: false, userId: userId, userDisplayName: userDisplayName, userImageUrl: userImageUrl, userEmail: userEmail });
				}

				_authentication.isAuth = true;
				_authentication.userName = userName;
				_authentication.userId = userId;
				_authentication.userDisplayName = userDisplayName;
				_authentication.userImageUrl = userImageUrl;
				_authentication.userEmail = "";
				_authentication.useRefreshTokens = loginData.useRefreshTokens;

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
			_authentication.useRefreshTokens = false;
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
				_authentication.useRefreshTokens = authData.useRefreshTokens;
			}

		};

		var _refreshToken = function () {
			var deferred = $q.defer();

			var authData = localStorageService.get('authorizationData');

			if (authData) {

				if (authData.useRefreshTokens) {

					var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

					localStorageService.remove('authorizationData');

					$http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

						localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

						deferred.resolve(response);

					}).error(function (err, status) {
						_logOut();
						deferred.reject(err);
					});
				}
			}

			return deferred.promise;
		};

		var _obtainAccessToken = function (externalData) {

			var deferred = $q.defer();

			$http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {

				localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

				_authentication.isAuth = true;
				_authentication.userName = response.userName;
				_authentication.useRefreshTokens = false;

				deferred.resolve(response);

			}).error(function (err, status) {
				_logOut();
				deferred.reject(err);
			});

			return deferred.promise;

		};

		var _registerExternal = function (registerExternalData) {

			var deferred = $q.defer();

			$http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function (response) {

				localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

				_authentication.isAuth = true;
				_authentication.userName = response.userName;
				_authentication.useRefreshTokens = false;

				deferred.resolve(response);

			}).error(function (err, status) {
				_logOut();
				deferred.reject(err);
			});

			return deferred.promise;

		};
		authServiceFactory.saveRegistration = _saveRegistration;
		authServiceFactory.login = _login;
		authServiceFactory.logOut = _logOut;
		authServiceFactory.fillAuthData = _fillAuthData;
		authServiceFactory.authentication = _authentication;
		authServiceFactory.refreshToken = _refreshToken;

		authServiceFactory.obtainAccessToken = _obtainAccessToken;
		authServiceFactory.externalAuthData = _externalAuthData;
		authServiceFactory.registerExternal = _registerExternal;
		return authServiceFactory;
	}
})();