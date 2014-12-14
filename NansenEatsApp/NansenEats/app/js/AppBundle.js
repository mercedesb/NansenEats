///#source 1 1 /app/js/core/app.js
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

	app.run(['authService', function (authService) {
		authService.fillAuthData();
	}]);
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
///#source 1 1 /app/js/core/util.js
(function () {
	'use strict';

	angular
		 .module('app')
		 .factory('util', util);

	util.$inject = ['$http', '$location', 'exception', 'dataservice'];

	function util($http, $location, exception, dataservice) {

		var util = {
			search:search
		};

		return util;

		function search(searchTerm) {
			return dataservice.search(searchTerm).then(function (data) {
				return data;
			});
		}
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
			userDisplayName: "",
			userImageUrl: "",
			userEmail: ""
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

				var token = response.access_token;
				var userName = loginData.userName;
				var userId = response.userId;
				var userDisplayName = response.userDisplayName;
				var userImageUrl = response.userImageUrl;
				var userEmail = loginData.email;

				localStorageService.set('authorizationData', { token: token, userName: userName, userId: userId, userDisplayName: userDisplayName, userImageUrl: userImageUrl, userEmail: userEmail });

				_authentication.isAuth = true;
				_authentication.userName = loginData.userName;
				_authentication.userId = response.userId;
				_authentication.userDisplayName = response.displayName;

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
			_authentication.userImageUrl = "";
			_authentication.userEmail = "";

		};

		var _fillAuthData = function () {

			var authData = localStorageService.get('authorizationData');
			if (authData) {
				_authentication.isAuth = true;
				_authentication.userName = authData.userName;
				_authentication.userId = authData.userId;
				_authentication.userDisplayName = authData.userDisplayName;
				_authentication.userImageUrl = authData.userImageUrl;
				_authentication.userEmail = authData.userEmail;
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
			getRating: getRating,
			addRating: addRating,
			editRating: editRating,
			getComment: getComment,
			addComment: addComment,
			editComment: editComment,
			search:search
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

		function getRating(id) {
			return $http.get(baseUrl + '/api/rating/' + id)
			.then(getRatingComplete)
				.catch(function (message) {
					exception.catcher('XHR Failed for getRating')(message);
					$location.url('/');
				});

			function getRatingComplete(data, status, headers, config) {
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

		function editRating(id, rating) {
			return $http.put(baseUrl + '/api/rating/' + id, rating)
			.then(editRatingComplete)
				.catch(function (message) {
					exception.catcher('XHR Failed for editRating')(message);
				});

			function editRatingComplete(data, status, headers, config) {
				return data.data;
			}
		}

		function getComment(id) {
			return $http.get(baseUrl + '/api/comment/' + id)
			.then(getCommentComplete)
				.catch(function (message) {
					exception.catcher('XHR Failed for getComment')(message);
					$location.url('/');
				});

			function getCommentComplete(data, status, headers, config) {
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

		function editComment(id, comment) {
			return $http.put(baseUrl + '/api/comment/' + id, comment)
			.then(editCommentComplete)
				.catch(function (message) {
					exception.catcher('XHR Failed for editComment')(message);
				});

			function editCommentComplete(data, status, headers, config) {
				return data.data;
			}
		}

		function search(searchTerm) {
			return $http.get(baseUrl + '/api/search/?searchTerm=' + searchTerm)
			.then(searchComplete)
				.catch(function (message) {
					exception.catcher('XHR Failed for search')(message);
					$location.url('/');
				});

			function searchComplete(data, status, headers, config) {
				return data.data;
			}
		}
	}
})();
///#source 1 1 /app/js//services/googleMapsService.js
(function () {
	'use strict';

	angular
		.module('app')
		.factory('googleMapsService', googleMapsService);

	googleMapsService.$inject = ['$http', '$location', 'exception'];

	function googleMapsService($http, $location, exception) {
		var office = {
			name: 'Office',
			lat: 41.8894833,
			lng: -87.6517529
		}

		var service = {};

		function _load(markers) {
			_loadScript();

			function _loadScript() {
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&callback=initializeMap';

				//so google maps can find the callback
				window.initializeMap = _initializeMap;

				document.body.appendChild(script);
			}

			function _initializeMap() {
				var officeMarker = [office.name, office.lat, office.lng];
				markers.unshift(officeMarker);

				var map;
				var mapOptions = {
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					mapTypeControl: false
				};

				// Display a map on the page
				map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

				// Display multiple markers on a map
				var infoWindow = new google.maps.InfoWindow(), marker, i;
				var bounds = new google.maps.LatLngBounds();


				// Loop through our array of markers & place each one on the map  
				for (i = 0; i < markers.length; i++) {
					var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
					bounds.extend(position);
					marker = new google.maps.Marker({
						position: position,
						map: map,
						title: markers[i][0]
					});
					// Automatically center the map fitting all markers on the screen
					map.fitBounds(bounds);
				}
			}
		}

		service.load = _load;
		return service;

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
			displayName: "",
			email: "",
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
///#source 1 1 /app/js/layout/shellController.js
(function () {
	'use strict';

	angular
		.module('app')
		.controller('ShellController', ShellController);

	ShellController.$inject = ['$location', 'dataservice', 'logger', 'authService'];

	function ShellController($location, dataservice, logger, authService) {
		/* jshint validthis:true */
		var vm = this;
		vm.title = 'ShellController';
		vm.searchTerm = '';
		vm.search = search;

		vm.offcanvasActive = false;
		vm.showOffcanvasButton = true;
		vm.toggleCanvas = toggleCanvas;
 
		vm.logOut = function () {
			authService.logOut();
			$location.path('/');
		}
 
		vm.authentication = authService.authentication;

		function toggleCanvas() {
			vm.offcanvasActive = !vm.offcanvasActive;
		}

		function search() {
			$location.url('/search/' + vm.searchTerm);
		}
	}
})();

///#source 1 1 /app/js/search/searchController.js
(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$location', 'util', 'logger', '$routeParams'];

    function SearchController($location, util, logger, $routeParams) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'SearchController';
        vm.search = doSearch;

        activate();

        function activate() {
        	vm.searchTerm = $routeParams.searchTerm;
        	return doSearch(vm.searchTerm);
        }

        function doSearch(searchTerm) {
        	return util.search(searchTerm).then(function (data) {
        		vm.results = data;
        		return vm.results;
        	});
        }
    }
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
		vm.handleReview = addReview;
		vm.showComment = true;
		vm.showRating = true;
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

					vm.availableTags = data;

					vm.options = {
						dataTextField: 'Name',
						dataSource: vm.availableTags,
						template: '<span title="#: Description#">#: Name#</span>',
						separator: ", ",
						select: _autocompleteChange
					}
				}
				
			});
		}

		function addReview() {
			if (!vm.rating) {
				return;
			}
			dataservice.addRating(vm.rating).then(function (data) {
				if (data && vm.comment.Value) {
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

		function _autocompleteChange(e) {
			// get data item
			var dataItem = this.dataItem(e.item.index());
			if (!vm.rating.Tags) {
				vm.rating.Tags = [];
			}
			vm.rating.Tags.push(dataItem);
		}
	}
})();

///#source 1 1 /app/js/reviews/editRatingController.js
(function () {
	'use strict';

	angular
		 .module('app')
		 .controller('EditRatingController', EditRatingController);

	EditRatingController.$inject = ['$location', 'dataservice', 'logger', '$routeParams'];

	function EditRatingController($location, dataservice, logger, $routeParams) {
		/* jshint validthis:true */
		var vm = this;
		vm.title = 'EditRatingController';
		vm.rating = {};
		vm.handleReview = editRating;
		vm.showComment = false;
		vm.showRating = true;

		activate();

		function activate() {
			//            Using a resolver on all routes or dataservice.ready in every controller
			//            var promises = [getAvengers()];
			//            return dataservice.ready(promises).then(function(){
			vm.ratingId = $routeParams.ratingid;
			dataservice.getRating(vm.ratingId).then(function (data) {
				vm.rating = data;
				return vm.rating;
			});

			dataservice.getTags().then(function (data) {
				if (data) {
					vm.availableTags = data;

					vm.options = {
						dataTextField: 'Name',
						dataSource: vm.availableTags,
						template: '<span title="#: Description#">#: Name#</span>',
						separator: ", ",
						select: _autocompleteChange
					}
				}
			});
		}

		function editRating() {
			if (!vm.rating) {
				return;
			}
			dataservice.editRating(vm.ratingId, vm.rating).then(function (data) {
				if (data) {
					$location.url('/restaurant/' + data.RestaurantId);
				} else {
					//handle exception (show error or something)
				}
			});
		}

		function _autocompleteChange(e) {
			// get data item
			var dataItem = this.dataItem(e.item.index());
			if (!vm.rating.Tags) {
				vm.rating.Tags = [];
			}
			vm.rating.Tags.push(dataItem);
		}
	}
})();

///#source 1 1 /app/js/reviews/editCommentController.js
(function () {
	'use strict';

	angular
		 .module('app')
		 .controller('EditCommentController', EditCommentController);

	EditCommentController.$inject = ['$location', 'dataservice', 'logger', '$routeParams'];

	function EditCommentController($location, dataservice, logger, $routeParams) {
		/* jshint validthis:true */
		var vm = this;
		vm.title = 'EditCommentController';
		vm.rating = {};
		vm.handleReview = editComment;
		vm.showComment = true;
		vm.showRating = false;

		activate();

		function activate() {
			//            Using a resolver on all routes or dataservice.ready in every controller
			//            var promises = [getAvengers()];
			//            return dataservice.ready(promises).then(function(){
			vm.commentId = $routeParams.commentid;
			return dataservice.getComment(vm.commentId).then(function (data) {
				vm.comment = data;
				return vm.comment;
			});
		}

		function editComment() {
			if (!vm.comment) {
				return;
			}
			dataservice.editComment(vm.commentId, vm.comment).then(function (data) {
				if (data) {
					$location.url('/restaurant/' + data.RestaurantId);
				} else {
					//handle exception (show error or something)
				}
			});
		}
	}
})();

