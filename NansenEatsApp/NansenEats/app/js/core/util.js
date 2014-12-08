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
			return dataservice.search(searchTerm).then(function (data) {
				return data;
			});
		}
	}
})();