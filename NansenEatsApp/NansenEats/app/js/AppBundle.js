///#source 1 1 /app/js/app.js
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
    		.otherwise({ redirectTo: "/" });
    });
})();
///#source 1 1 /app/js/dataservice.js
(function () {
    'use strict';

    angular
        .module('app')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$http', '$location', 'exception'];

    function dataservice($http, $location, exception) {
        var service = {
        	getRestaurants: getRestaurants,
			getRestaurant: getRestaurant
        };

        return service;

        function getRestaurants() {
        	return $http.get('http://eatsapi.local/api/restaurants')
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
        	return $http.get('http://eatsapi.local/api/restaurants/' + id)
			.then(getRestaurantComplete)
					.catch(function (message) {
						exception.catcher('XHR Failed for getRestaurant')(message);
						$location.url('/');
					});

        	function getRestaurantComplete(data, status, headers, config) {
        		return data.data;
        	}
        }
    }
})();
///#source 1 1 /app/js/exception.js
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
///#source 1 1 /app/js/logger.js
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
///#source 1 1 /app/js/restaurantController.js
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

///#source 1 1 /app/js/restaurantDetailsController.js
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

