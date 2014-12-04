(function () {
	'use strict';

	angular
		.module('app')
		.controller('ShellController', ShellController);

	ShellController.$inject = ['$location', 'dataservice', 'logger'];

	function ShellController($location, dataservice, logger) {
		/* jshint validthis:true */
		var vm = this;
		vm.title = 'ShellController';
		vm.searchTerm = '';
		vm.search = search;

		activate();

		function activate() {
			bindEvents();
		}

		function bindEvents() {
			$(document).on('click', '[data-toggle="offcanvas"]', function (e) {
				e.preventDefault();
				$('.row-offcanvas').toggleClass('active');
			});
		}

		function search() {
			$location.url('/search/' + vm.searchTerm);
		}
	}
})();
