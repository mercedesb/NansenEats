(function () {
	'use strict';

	angular
		 .module('app')
		 .controller('AddRestaurantController', AddRestaurantController);

	AddRestaurantController.$inject = ['$location', 'dataservice', 'logger'];

	function AddRestaurantController($location, dataservice, logger) {
		/* jshint validthis:true */
		var vm = this;
		vm.title = 'AddRestaurantController';
		vm.restaurant = {};
		vm.handleRestaurant = addRestaurant;

		activate();

		function activate() {
			//            Using a resolver on all routes or dataservice.ready in every controller
			//            var promises = [getAvengers()];
			//            return dataservice.ready(promises).then(function(){
			setupNewRestaurant();
		}

		function setupNewRestaurant() {
			vm.restaurant.city = 'Chicago';
		}

		function addRestaurant() {
			if (!vm.restaurant) {
				return;
			}
			dataservice.addRestaurant(vm.restaurant).then(function (data) {
				if (data) {
					$location.url('/restaurant/' + data.Id);
				}
				else {
					vm.restaurant = {};
					//handle exception (show error or something)
				}
			});
		}
	}
})();
