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

		vm.sort = 'AverageRating';
		vm.reverse = false;
		vm.offcanvas = true;
		vm.sortGroup = [
			{
				Sort: 'AverageRating',
				Name: 'Rating'
			},
			{
				Sort: 'DistanceFromOffice',
				Name: 'Distance'
			},
			{
				Sort: 'Name',
				Name: 'Name'
			},
			{
				Sort: 'PriceRangeMin',
				Name: 'Price'
			}
		];


		vm.changeSort = changeSort;

		function changeSort(value) {
			if (vm.sort == value) {
				vm.reverse = !vm.reverse;
				return;
			}

			vm.sort = value;
			vm.reverse = false;
		};

		function activate() {
			//            Using a resolver on all routes or dataservice.ready in every controller
			//            var promises = [getAvengers()];
			//            return dataservice.ready(promises).then(function(){
			return getRestaurants().then(function () {
				logger.info('Activated Restaurants View');
				vm.changeSort('AverageRating');
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
