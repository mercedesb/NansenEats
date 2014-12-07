(function () {
	'use strict';

	angular
		.module('app')
		.controller('ShellController', ShellController);

	ShellController.$inject = ['$location', 'dataservice', 'logger', 'authService'];

	function ShellController($location, dataservice, logger, authService) {
		/* jshint validthis:true */
		var vm = this;
		vm.title = 'ShellController';
		vm.searchTerm = '';
		vm.search = search;

		vm.offcanvasActive = false;
		vm.showOffcanvasButton = true;
		vm.toggleCanvas = toggleCanvas;
 
		vm.logOut = function () {
			authService.logOut();
			$location.path('/');
		}
 
		vm.authentication = authService.authentication;

		function toggleCanvas() {
			vm.offcanvasActive = !vm.offcanvasActive;
		}

		function search() {
			$location.url('/search/' + vm.searchTerm);
		}
	}
})();
