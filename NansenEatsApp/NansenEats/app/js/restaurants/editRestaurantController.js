(function () {
	'use strict';

	angular
		 .module('app')
		 .controller('EditRestaurantController', EditRestaurantController);

	EditRestaurantController.$inject = ['$location', 'dataservice', 'logger', '$routeParams'];

	function EditRestaurantController($location, dataservice, logger, $routeParams) {
		/* jshint validthis:true */
		var vm = this;
		vm.title = 'EditRestaurantController';
		vm.restaurant = {};
		vm.handleRestaurant = editRestaurant;

		activate();

		function activate() {
			//            Using a resolver on all routes or dataservice.ready in every controller
			//            var promises = [getAvengers()];
			//            return dataservice.ready(promises).then(function(){
			vm.restaurantId = $routeParams.restaurantid;
			return dataservice.getRestaurant(vm.restaurantId).then(function (data) {
				vm.restaurant = data;
				return vm.restaurant;
			});
		}

		function editRestaurant() {
			if (!vm.restaurant) {
				return;
			}
			dataservice.editRestaurant(vm.restaurantId, vm.restaurant).then(function (data) {
				if (data) {
					$location.url('/restaurant/' + data.Id);
				} else {
					//handle exception (show error or something)
				}
			});
		}
	}
})();
