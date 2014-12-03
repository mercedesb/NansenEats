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
			return $http.get(baseUrl + '/api/search/' + searchTerm)
			.then(searchComplete)
				.catch(function (message) {
					exception.catcher('XHR Failed for getComment')(message);
					$location.url('/');
				});

			function searchComplete(data, status, headers, config) {
				return data.data;
			}
		}
	}
})();