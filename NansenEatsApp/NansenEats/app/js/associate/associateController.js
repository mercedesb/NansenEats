(function() {
	'use strict';
	angular
		.module('app')
		.controller('AssociateController', AssociateController);

	AssociateController.$inject = ['$location', 'authService', '$timeout'];

	function AssociateController($location, authService, $timeout) {

		var vm = this;
		vm.savedSuccessfully = false;
		vm.message = "";

		vm.registerData = {
			userName: authService.externalAuthData.userName,
			provider: authService.externalAuthData.provider,
			externalAccessToken: authService.externalAuthData.externalAccessToken
		};

		vm.registerExternal = function() {

			authService.registerExternal(vm.registerData).then(function(response) {

					vm.savedSuccessfully = true;
					vm.message = "User has been registered successfully, you will be redicted to orders page in 2 seconds.";
					startTimer();

				},
				function(response) {
					var errors = [];
					for (var key in response.modelState) {
						errors.push(response.modelState[key]);
					}
					vm.message = "Failed to register user due to:" + errors.join(' ');
				});
		};

		var startTimer = function() {
			var timer = $timeout(function() {
				$timeout.cancel(timer);
				$location.path('/');
			}, 2000);
		}

	}
})();