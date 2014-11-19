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