/**
*
* wnResultsDetailsRow: render details row for outbound and return segment
* @author Simone Pitzianti
*
*/

(function(){
    'use strict';

    angular.module('wayonara.booking').directive('wnResultsDetailsRow', WayonaraResultsDetailsRow);
    WayonaraResultsDetailsRow.$inject = ['$log'];

    function WayonaraResultsDetailsRow($log) {

        var config = {
            restrict: 'EA',
            templateUrl: 'web/results/results-details-row.html',
            replace: true,
            scope: {
                segment: '=',
                tour: '='
            }
            //controller: 'ResultsController'
        };

        return config;
    }
})();
