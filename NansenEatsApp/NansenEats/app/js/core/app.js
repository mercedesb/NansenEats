(function () {
	'use strict';

	var app = angular.module('app', [
		 // Angular modules 
		 'ngAnimate',
		 'ngRoute',
		 'ngSanitize',

		 // Custom modules 

		 // 3rd Party Modules
		 'kendo.directives',
		 'LocalStorageModule'
	]);

	app.config(function($routeProvider) {
		$routeProvider
			.when("/", {
				templateUrl: "app/templates/restaurantlist.html",
				controller: "RestaurantListController as vm"
			})
			.when("/login", {
				templateUrl: "app/templates/login.html",
				controller: "LoginController as vm"
			})
			.when("/associate", {
				templateUrl: "app/templates/associate.html",
				controller: "AssociateController as vm"
			})
			.when("/signup", {
				templateUrl: "app/templates/signup.html",
				controller: "SignupController as vm"
			})
			.when("/restaurant/new-restaurant", {
				templateUrl: "app/templates/restaurantform.html",
				controller: "AddRestaurantController as vm"
			})
			.when("/restaurant/:restaurantid", {
				templateUrl: "app/templates/restaurantdetails.html",
				controller: "RestaurantDetailsController as vm"
			})
			.when("/restaurant/:restaurantid/edit", {
				templateUrl: "app/templates/restaurantform.html",
				controller: "EditRestaurantController as vm"
			})
			.when("/restaurant/:restaurantid/new-review", {
				templateUrl: "app/templates/reviewForm.html",
				controller: "AddReviewController as vm"
			})
			.when("/rating/:ratingid/edit", {
				templateUrl: "app/templates/reviewForm.html",
				controller: "EditRatingController as vm"
			})
			.when("/comment/:commentid/edit", {
				templateUrl: "app/templates/reviewForm.html",
				controller: "EditCommentController as vm"
			})
			.when("/search/:searchTerm", {
				templateUrl: "app/templates/search.html",
				controller: "SearchController as vm"
			})
			.otherwise({ redirectTo: "/" });
	});

	app.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
		localStorageServiceProvider.setPrefix('app');
	}]);

	app.config(function ($httpProvider) {
		$httpProvider.interceptors.push('authInterceptorService');
	});

	var serviceBase = 'http://eatsapi.azurewebsites.net';//'http://eatsapi';
	app.constant('ngAuthSettings', {
		apiServiceBaseUri: serviceBase,
		clientId: 'angJsAzureApp' //'angJsApp'
	});

	app.run(['authService', function (authService) {
		authService.fillAuthData();
	}]);
})();