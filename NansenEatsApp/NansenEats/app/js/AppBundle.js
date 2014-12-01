///#source 1 1 /app/js/core/app.js
(function () {
	'use strict';

	var app = angular.module('app', [
		 // Angular modules 
		 'ngAnimate',
		 'ngRoute',

		 // Custom modules 

		 // 3rd Party Modules
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
				templateUrl: "app/templates/addreview.html",
				controller: "AddReviewController as vm"
			})
			.otherwise({ redirectTo: "/" });
	});

	app.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
		localStorageServiceProvider.setPrefix('app');
	}]);
	//.config(function ($httpProvider) {
	//	$httpProvider.interceptors.push('authInterceptorService');
	//});
})();
///#source 1 1 /app/js/core/exception.js
(function () {
	'use strict';

	angular
		  .module('app')
		  .factory('exception', exception);

	exception.$inject = ['logger'];

	function exception(logger) {
		var service = {
			catcher: catcher
		};
		return service;

		function catcher(message) {
			return function (reason) {
				logger.error(message, reason);
			};
		}
	}
})();
///#source 1 1 /app/js/core/logger.js
(function () {
	'use strict';

	angular
		  .module('app')
		  .factory('logger', logger);

	logger.$inject = ['$log'];

	function logger($log) {
		var service = {
			error: error,
			info: info,
			success: success,
			warning: warning,

			// straight to console; bypass toastr
			log: $log.log
		};

		return service;
		/////////////////////

		function error(message, data, title) {
			$log.error('Error: ' + message, data);
		}

		function info(message, data, title) {
			$log.info('Info: ' + message, data);
		}

		function success(message, data, title) {
			$log.info('Success: ' + message, data);
		}

		function warning(message, data, title) {
			$log.warn('Warning: ' + message, data);
		}
	}
}());
///#source 1 1 /app/js/core/loader.js
(function () {
	'use strict';

	angular
		.module('app')
		.directive('loader', loader);

	loader.$inject = ['$window'];

	function loader($window) {
		// Usage:
		//     <loader></loader>
		// Creates:
		// 
		var directive = {
			restrict: 'EA',
			scope: {
				loadedproperty: "="
			},
			template: '<div ng-hide="loadedproperty" class="col-sm-12 loading"></div>'
		};
		return directive;
	}

})();
///#source 1 1 /app/js/services/authInterceptorService.js
(function() {
	'use strict';

	angular
		.module('app')
		.factory('authInterceptorService', authInterceptorService);

	authInterceptorService.$inject = ['$q', '$location', 'localStorageService'];

	function authInterceptorService($q, $location, localStorageService) {

		var authInterceptorServiceFactory = {};

		var _request = function (config) {

			config.headers = config.headers || {};

			var authData = localStorageService.get('authorizationData');
			if (authData) {
				config.headers.Authorization = 'Bearer ' + authData.token;
			}

			return config;
		}

		var _responseError = function (rejection) {
			if (rejection.status === 401) {
				$location.path('/login');
			}
			return $q.reject(rejection);
		}

		authInterceptorServiceFactory.request = _request;
		authInterceptorServiceFactory.responseError = _responseError;

		return authInterceptorServiceFactory;
	}
})();
///#source 1 1 /app/js/services/authService.js
(function () {
	'use strict';

	angular
		.module('app')
		.factory('authService', authService);

	authService.$inject = ['$http', '$q', 'localStorageService'];

	function authService($http, $q, localStorageService) {

		var serviceBase = 'http://eatsapi.local/';
		var authServiceFactory = {};

		var _authentication = {
			isAuth: false,
			userName: "",
			userId: "",
			userDisplayName: ""
		};

		var _saveRegistration = function (registration) {

			_logOut();

			return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
				return response;
			});

		};

		var _login = function (loginData) {

			var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

			var deferred = $q.defer();

			$http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

				localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName });

				_authentication.isAuth = true;
				_authentication.userName = loginData.userName;

				deferred.resolve(response);

			}).error(function (err, status) {
				_logOut();
				deferred.reject(err);
			});

			return deferred.promise;

		};

		var _logOut = function () {

			localStorageService.remove('authorizationData');

			_authentication.isAuth = false;
			_authentication.userName = "";
			_authentication.userId = "";
			_authentication.userDisplayName = "";

		};

		var _fillAuthData = function () {

			var authData = localStorageService.get('authorizationData');
			if (authData) {
				_authentication.isAuth = true;
				_authentication.userName = authData.userName;
				_authentication.userId = authData.userId;
				_authentication.userDisplayName = authData.userDisplayName;
			}

		}

		authServiceFactory.saveRegistration = _saveRegistration;
		authServiceFactory.login = _login;
		authServiceFactory.logOut = _logOut;
		authServiceFactory.fillAuthData = _fillAuthData;
		authServiceFactory.authentication = _authentication;

		return authServiceFactory;
	}
})();
///#source 1 1 /app/js/services/dataservice.js
(function () {
	'use strict';

	angular
		 .module('app')
		 .factory('dataservice', dataservice);

	dataservice.$inject = ['$http', '$location', 'exception'];

	function dataservice($http, $location, exception) {
		var baseUrl = "http://eatsapi.local";

		var service = {
			getRestaurants: getRestaurants,
			getRestaurant: getRestaurant,
			addRestaurant: addRestaurant,
			editRestaurant: editRestaurant,
			getTags: getTags,
			addRating: addRating,
			addComment: addComment
		};

		return service;

		function getRestaurants() {
			return $http.get(baseUrl + '/api/restaurants')
					.then(getRestaurantsComplete)
					.catch(function (message) {
						exception.catcher('XHR Failed for getRestaurants')(message);
						$location.url('/');
					});

			function getRestaurantsComplete(data, status, headers, config) {
				return data.data;
			}
		}

		function getRestaurant(id) {
			return $http.get(baseUrl + '/api/restaurants/' + id)
			.then(getRestaurantComplete)
					.catch(function (message) {
						exception.catcher('XHR Failed for getRestaurant')(message);
						$location.url('/');
					});

			function getRestaurantComplete(data, status, headers, config) {
				return data.data;
			}
		}

		function addRestaurant(restaurant) {
			return $http.post(baseUrl + '/api/restaurants', restaurant)
			.then(addRestaurantComplete)
				.catch(function (message) {
					exception.catcher('XHR Failed for addRestaurant')(message);
				});

			function addRestaurantComplete(data, status, headers, config) {
				return data.data;
			}
		}

		function editRestaurant(id, restaurant) {
			var data = {
				id: id,
				restaurant: restaurant
			}
			return $http.put(baseUrl + '/api/restaurants/' + id, restaurant)
			.then(editRestaurantComplete)
				.catch(function (message) {
					exception.catcher('XHR Failed for editRestaurant')(message);
				});

			function editRestaurantComplete(data, status, headers, config) {
				return data.data;
			}
		}

		function getTags() {
			return $http.get(baseUrl + '/api/categories')
					.then(getTagsComplete)
					.catch(function (message) {
						exception.catcher('XHR Failed for getTags')(message);
						$location.url('/');
					});

			function getTagsComplete(data, status, headers, config) {
				return data.data;
			}
		}

		function addRating(rating) {
			return $http.post(baseUrl + '/api/rating', rating)
			.then(addRatingComplete)
				.catch(function (message) {
					exception.catcher('XHR Failed for addRating')(message);
					//$location.url('/#/restaurant/' + rating.RestaurantId + '/new-review');
				});

			function addRatingComplete(data, status, headers, config) {
				return data.data;
			}
		}

		function addComment(comment) {
			return $http.post(baseUrl + '/api/comment', comment)
				.then(addCommentComplete)
					.catch(function (message) {
						exception.catcher('XHR Failed for addComment')(message);
					});

			function addCommentComplete(data, status, headers, config) {
				return data.data;
			}
		}
	}
})();
///#source 1 1 /app/js/login/loginController.js
(function() {
	'use strict';
	angular
		.module('app')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['$location', 'authService'];

	function LoginController($location, authService) {

		var vm = this;
		vm.loginData = {
			userName: "",
			password: ""
		};

		vm.message = "";

		vm.login = function () {

			authService.login(vm.loginData).then(function (response) {

				$location.path('/');

			},
			 function (err) {
			 	vm.message = err.error_description;
			 });
		};

	};
})();
///#source 1 1 /app/js/signup/signupController.js
(function() {
	'use strict';

	angular
		.module('app')
		.controller('SignupController', SignupController);

	SignupController.$inject = ['$location', '$timeout', 'authService'];
	
	function SignupController($location, $timeout, authService) {
		var vm = this;
		vm.savedSuccessfully = false;
		vm.message = "";

		vm.registration = {
			userName: "",
			password: "",
			confirmPassword: ""
		};

		vm.signUp = function () {

			authService.saveRegistration(vm.registration).then(
				function () {
					vm.savedSuccessfully = true;
					vm.message = "User has been registered successfully, you will be redicted to login page in 2 seconds.";
					startTimer();
				},
				function (response) {
			 		var errors = [];
			 		for (var key in response.data.modelState) {
			 			for (var i = 0; i < response.data.modelState[key].length; i++) {
			 				errors.push(response.data.modelState[key][i]);
			 			}
			 		}
			 		vm.message = "Failed to register user due to:" + errors.join(' ');
				}
			);
		};

		var startTimer = function () {
			var timer = $timeout(function () {
				$timeout.cancel(timer);
				$location.path('/login');
			}, 2000);
		}
	};
})();
///#source 1 1 /app/js/restaurants/restaurantListController.js
(function () {
	'use strict';

	angular
		 .module('app')
		 .controller('RestaurantListController', RestaurantListController);

	RestaurantListController.$inject = ['$location', 'dataservice', 'logger', '$routeParams'];

	function RestaurantListController($location, dataservice, logger, $routeParams) {
		/* jshint validthis:true */
		var vm = this;
		vm.title = 'RestaurantListController';
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

///#source 1 1 /app/js/restaurants/restaurantDetailsController.js
(function () {
	'use strict';

	angular
		.module('app')
		.controller('RestaurantDetailsController', RestaurantDetailsController);

	RestaurantDetailsController.$inject = ['$location', 'dataservice', 'logger', '$routeParams'];

	function RestaurantDetailsController($location, dataservice, logger, $routeParams) {
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
				return vm.restaurant;
			});
		}
	}
})();

///#source 1 1 /app/js/restaurants/addRestaurantController.js
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

///#source 1 1 /app/js/restaurants/editRestaurantController.js
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

///#source 1 1 /app/js/reviews/addReviewController.js
(function () {
	'use strict';

	angular
		 .module('app')
		 .controller('AddReviewController', AddReviewController);

	AddReviewController.$inject = ['$location', 'dataservice', 'logger', '$routeParams'];

	function AddReviewController($location, dataservice, logger, $routeParams) {
		/* jshint validthis:true */
		var vm = this;
		vm.title = 'AddReviewController';
		vm.rating = {};
		vm.comment = {};
		vm.addReview = addReview;
		vm.availableTags = [];

		activate();

		function activate() {
			//            Using a resolver on all routes or dataservice.ready in every controller
			//            var promises = [getAvengers()];
			//            return dataservice.ready(promises).then(function(){
			setupNewReview();
		}

		function setupNewReview() {
			vm.rating.RestaurantId = $routeParams.restaurantid;
			vm.comment.RestaurantId = $routeParams.restaurantid;
			dataservice.getTags().then(function (data) {
				if (data) {
					vm.availableTags = data.map(function (item) {
						return item.Name;
					});
				}
				
			});
		}

		function addReview() {
			if (!vm.rating) {
				return;
			}
			dataservice.addRating(vm.rating).then(function (data) {
				if (data && vm.comment.value) {
					dataservice.addComment(vm.comment).then(function (data) {
						if (data) {
							$location.url('/restaurant/' + $routeParams.restaurantid);
						}
					});
				} else {
					if (data) {
						$location.url('/restaurant/' + $routeParams.restaurantid);
					} else {
						vm.rating.RestaurantId = $routeParams.restaurantid;
						vm.comment.RestaurantId = $routeParams.restaurantid;
						//handle exception (show error or something)
					}
				}
			});
		}
	}
})();

