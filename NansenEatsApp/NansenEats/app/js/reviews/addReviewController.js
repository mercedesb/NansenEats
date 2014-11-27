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
