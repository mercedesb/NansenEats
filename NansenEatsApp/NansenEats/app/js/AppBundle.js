///#source 1 1 /app/js/app.js
(function () {
    'use strict';

    angular.module('app', [
        // Angular modules 
        'ngAnimate',
        'ngRoute',

        // Custom modules 

        // 3rd Party Modules
        
    ]);
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
        	getRestaurants: getRestaurants
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

    RestaurantsController.$inject = ['$location', 'dataservice', 'logger'];

    function RestaurantsController($location, dataservice, logger) {
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

