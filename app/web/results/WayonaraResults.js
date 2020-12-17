/**
 */

(function(){
    'use strict';

    angular.module('wayonara.booking').directive('wnResults', WayonaraResults);
    WayonaraResults.$inject = ['$log'];

    function WayonaraResults($log) {

        var config = {
            restrict: 'EA',
            templateUrl: 'web/results/Results.html',
            replace: true,
            controller: 'ResultsController'
        };

        return config;
    }
})();
