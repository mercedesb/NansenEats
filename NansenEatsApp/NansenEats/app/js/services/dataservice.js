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