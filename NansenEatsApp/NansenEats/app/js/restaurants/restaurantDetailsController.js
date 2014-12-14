(function () {
	'use strict';

	angular
		.module('app')
		.controller('RestaurantDetailsController', RestaurantDetailsController);

	RestaurantDetailsController.$inject = ['$location', 'dataservice', 'googleMapsService', 'logger', '$routeParams'];

	function RestaurantDetailsController($location, dataservice, googleMapsService, logger, $routeParams) {
		/* jshint validthis:true */
		var vm = this;
		vm.title = 'RestaurantDetailsController';
		vm.restaurant = {};

		activate();

		function activate() {
			//            Using a resolver on all routes or dataservice.ready in every controller
			//            var promises = [getAvengers()];
			//            return dataservice.ready(promises).then(function(){
			return getRestaurant().then(function () {
				logger.info('Activated Restaurant Details View');
			});
		}

		function getRestaurant() {
			vm.restaurantId = $routeParams.restaurantid;
			return dataservice.getRestaurant(vm.restaurantId).then(function (data) {
				vm.restaurant = data;
				if (!!vm.restaurant.Ratings && !!vm.restaurant.Ratings.length) {
					angular.forEach(vm.restaurant.Ratings, function (value, key) {

						if (!!value.Tags && !!value.Tags.length) {
							var tagNames = value.Tags.map(function (item) {
								return item.Name;
							});
							value.TagNames = tagNames.join(', ');
						}
					});
				}
				if (!!vm.restaurant.Lat && !!vm.restaurant.Lng) {
					var markers = [
						[vm.restaurant.Name, vm.restaurant.Lat, vm.restaurant.Lng]
					];

					googleMapsService.load(markers);
				}
				return vm.restaurant;
			});
		}
	}
})();
