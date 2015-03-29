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
				templateUrl: "app/templates/restaurantlist.html"
			})
			.when("/login", {
				templateUrl: "app/templates/login.html"
			})
			.when("/associate", {
				templateUrl: "app/templates/associate.html",
				controller: "AssociateController as vm"
			})
			.when("/signup", {
				templateUrl: "app/templates/signup.html"
			})
			.when("/restaurant/new-restaurant", {
				templateUrl: "app/templates/addrestaurant.html"
			})
			.when("/restaurant/:restaurantid", {
				templateUrl: "app/templates/restaurantdetails.html"
			})
			.when("/restaurant/:restaurantid/edit", {
				templateUrl: "app/templates/editrestaurant.html"
			})
			.when("/restaurant/:restaurantid/new-review", {
				templateUrl: "app/templates/addreview.html"
			})
			.when("/rating/:ratingid/edit", {
				templateUrl: "app/templates/editrating.html"
			})
			.when("/comment/:commentid/edit", {
				templateUrl: "app/templates/editcomment.html"
			})
			.when("/search/:searchTerm", {
				templateUrl: "app/templates/search.html"
			})
			.otherwise({ redirectTo: "/" });
	});

	app.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
		localStorageServiceProvider.setPrefix('app');
	}]);

	app.config(function ($httpProvider) {
		$httpProvider.interceptors.push('authInterceptorService');
	});

	var serviceBase = 'http://eatsapi.azurewebsites.net'; //'http://eatsapi.azurewebsites.net';//'http://eatsapi';
	app.constant('ngAuthSettings', {
		apiServiceBaseUri: serviceBase,
		clientId: 'angJsAzureApp' //'angJsApp'
	});

	app.run(['authService', function (authService) {
		authService.fillAuthData();
	}]);
})();