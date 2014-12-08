(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$location', 'util', 'logger', '$routeParams'];

    function SearchController($location, util, logger, $routeParams) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'SearchController';
        vm.search = doSearch;

        activate();

        function activate() {
        	vm.searchTerm = $routeParams.searchTerm;
        	return doSearch(vm.searchTerm);
        }

        function doSearch(searchTerm) {
        	return util.search(searchTerm).then(function (data) {
        		vm.results = data;
        		return vm.results;
        	});
        }
    }
})();
