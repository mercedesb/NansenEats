(function () {
    'use strict';

    angular
        .module('app')
        .controller('ShellController', ShellController);

    shellControllerShellController.$inject = ['$location', 'dataservice', 'logger'];

    function ShellController($location, dataservice, logger) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'ShellController';
        vm.searchTerm = '';

        activate();

        function activate() { }

        function search() {
        	$location.url('/search/' + searchTerm);
        }
    }
})();
