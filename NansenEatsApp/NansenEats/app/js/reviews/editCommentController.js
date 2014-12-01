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
