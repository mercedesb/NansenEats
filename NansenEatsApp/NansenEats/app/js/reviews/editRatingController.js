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
