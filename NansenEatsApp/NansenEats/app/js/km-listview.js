(function() {
    'use strict';

    angular
        .module('app')
        .directive('km_listview', km_listview);

    km_listview.$inject = ['$window'];
    
    function km_listview ($window) {
        // Usage:
        //     <km_listview></km_listview>
        // Creates:
        // 
        var directive = {
        	restrict: 'EA',
        	scope: {
        		'title': '@',
        		'subtitle': '@',
        		'rightText': '@',
        		'allowCollapse': '@'
        	},
        	templateUrl: 'app/templates/restaurantlist.html',
        };
        return directive;
    }

})();