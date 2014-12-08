(function() {
	'use strict';
	angular
		.module('app')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['$location', 'authService'];

	function LoginController($location, authService) {

		var vm = this;
		vm.loginData = {
			userName: "",
			password: ""
		};

		vm.message = "";

		vm.login = function () {

			authService.login(vm.loginData).then(function (response) {

				$location.path('/');

			},
			 function (err) {
			 	vm.message = err.error_description;
			 });
		};

	};
})();