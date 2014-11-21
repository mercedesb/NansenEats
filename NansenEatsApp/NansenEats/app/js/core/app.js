(function () {
	'use strict';

	var app = angular.module('app', [
		 // Angular modules 
		 'ngAnimate',
		 'ngRoute',

		 // Custom modules 

		 // 3rd Party Modules

	]);

	app.config(function ($routeProvider) {
		$routeProvider
			.when("/", {
				templateUrl: "app/templates/restaurantlist.html",
				controller: "RestaurantsController as vm"
			})
			.when("/restaurant/:restaurantid", {
				templateUrl: "app/templates/restaurantdetails.html",
				controller: "RestaurantDetailsController as vm"
			})
			.when("/restaurant/:restaurantid/new-review", {
				templateUrl: "app/templates/addreview.html",
				controller: "AddReviewController as vm"
			})
			.otherwise({ redirectTo: "/" });
	});
})();