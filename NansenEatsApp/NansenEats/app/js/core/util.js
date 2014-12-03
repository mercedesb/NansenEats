(function () {
	'use strict';

	angular
		 .module('app')
		 .factory('util', util);

	util.$inject = ['$http', '$location', 'exception', 'dataservice'];

	function util($http, $location, exception, dataservice) {

		var util = {
			search:search
		};

		return util;

		function search(searchTerm) {
			dataservice.search(searchTerm).then(function (data) {
				if (data) {
					$location.url('/search/?q=' + data.Query);
				} else {
					//handle exception (show error or something)
				}
			});
		}
	}
})();