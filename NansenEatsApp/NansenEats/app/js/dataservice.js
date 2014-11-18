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