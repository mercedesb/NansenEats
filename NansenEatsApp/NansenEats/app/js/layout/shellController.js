(function () {
    'use strict';

    angular
        .module('app')
        .controller('ShellController', ShellController);

    ShellController.$inject = ['$location', 'dataservice', 'logger'];

    function ShellController($location, dataservice, logger) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'ShellController';
        vm.searchTerm = '';
        vm.search = search;

        activate();

        function activate() { }

        function search() {
        	$location.url('/search/' + vm.searchTerm);
        }
    }
})();
