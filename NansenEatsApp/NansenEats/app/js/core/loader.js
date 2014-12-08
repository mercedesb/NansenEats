(function () {
	'use strict';

	angular
		.module('app')
		.directive('loader', loader);

	loader.$inject = ['$window'];

	function loader($window) {
		// Usage:
		//     <loader></loader>
		// Creates:
		// 
		var directive = {
			restrict: 'EA',
			scope: {
				loadedproperty: "="
			},
			template: '<div ng-hide="loadedproperty" class="col-sm-12 loading"></div>'
		};
		return directive;
	}

})();