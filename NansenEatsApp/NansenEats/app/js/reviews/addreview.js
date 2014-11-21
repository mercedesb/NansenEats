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
			vm.restaurantId = $routeParams.restaurantid;
		}

		function addReview() {
			if (!vm.rating) {
				return;
			}
			return dataservice.addRating(vm.rating, vm.restaurantId).then(function (data) {
				vm.rating = data;
				return dataservice.addComment(vm.restaurantId, vm.comment).then(function (data) {
					vm.comment = data;
				});
			});
		}
	}
})();
