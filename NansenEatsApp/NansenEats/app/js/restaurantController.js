(function () {
	'use strict';

	angular
		 .module('app')
		 .controller('RestaurantsController', RestaurantsController);

	RestaurantsController.$inject = ['$location', 'dataservice', 'logger', '$routeParams'];

	function RestaurantsController($location, dataservice, logger, $routeParams) {
		/* jshint validthis:true */
		var vm = this;
		vm.title = 'RestaurantsController';
		vm.restaurants = [];

		activate();

		function activate() {
			//            Using a resolver on all routes or dataservice.ready in every controller
			//            var promises = [getAvengers()];
			//            return dataservice.ready(promises).then(function(){
			return getRestaurants().then(function () {
				logger.info('Activated Restaurants View');
			});
		}

		function getRestaurants() {
			return dataservice.getRestaurants().then(function (data) {
				vm.restaurants = data;
				return vm.restaurants;
			});
		}
	}
})();
