///#source 1 1 /app/js/core/app.js
(function () {
	'use strict';

	var app = angular.module('app', [
		 // Angular modules 
		 'ngAnimate',
		 'ngRoute',

		 // Custom modules 

		 // 3rd Party Modules
		 'kendo.directives'

	]);

	app.config(function ($routeProvider) {
		$routeProvider
			.when("/", {
				templateUrl: "app/templates/restaurantlist.html",
				controller: "RestaurantListController as vm"
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
			.otherwise({ redirectTo: "/" });
	});
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
			editComment: editComment
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
					vm.availableTags = data.map(function (item) {
						return item.Name;
					});

					vm.tags = new kendo.data.DataSource({
						data: data
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
					vm.availableTags = data.map(function (item) {
						return item.Name;
					});

					//create AutoComplete UI component
					$("#tags").kendoAutoComplete({
						dataSource: vm.availableTags,
						filter: "startswith",
						separator: ", "
					});
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

