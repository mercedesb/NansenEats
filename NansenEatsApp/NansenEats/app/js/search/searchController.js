(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$location', 'util', 'logger', '$routeParams', '$scope'];

    function SearchController($location, util, logger, $routeParams, $scope) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'SearchController';
        vm.search = doSearch;
        $scope.shell.showOffcanvasButton = false;

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
