(function () {
    'use strict';

    angular.module('wayonara.tour').controller('TourQuoteController', TourQuoteController);

    TourQuoteController.$inject = ['$scope', '$log', '$rootScope', 'tourResolved', 'departure', 'arrival', 'oneWayQuoted', '$state', 'translationResolved', 'WayonaraTutorialService'];
    function TourQuoteController($scope, $log, $rootScope, tourResolved, departure, arrival, oneWayQuoted, $state, translationResolved, WayonaraTutorialService) {

        var vm = this;

        vm.tour = tourResolved;
        vm.oneWayQuoted = oneWayQuoted;
        vm.departure = departure;
        vm.arrival = arrival;
        vm.showRoundtripWarning = false;

        if(vm.oneWayQuoted !== false) {
            vm.showRoundtripWarning = true;
            var nodeVectorIndex = parseInt($state.params.index);
            var nodeVectorLinkedRoundtripIndex = vm.tour.timeline[nodeVectorIndex].model.linkedNodeRoundtripId;

            vm.linkedRoundtripDeparture = vm.tour.timeline[nodeVectorLinkedRoundtripIndex - 1].model.name;
            vm.linkedRoundtripArrival = vm.tour.timeline[nodeVectorLinkedRoundtripIndex + 1].model.name;
        }

        $log.debug('--- TourQuoteController - $scope.oneWayQuoted -', vm.oneWayQuoted);
        $log.debug('--- TourQuoteController - $scope.showRoundtripWarning -', vm.showRoundtripWarning);

        vm.translation = translationResolved;
        $state.current.breadcrumbs = [{ label: translationResolved.chooseAtransport }]

        if (vm.tour.timeline) {
            if (vm.tour.timeline[parseInt($state.params.index)].model.resultSelected) {
                //timeline analysis and update to check roundtrip solutions
                $state.go('tour.edit.selected', { 'index': parseInt($state.params.index) });
            }
            else {
                //todo modificarlo e andare direttamente alla pagina di quote
                WayonaraTutorialService.setCurrentStep('quoteEmpty');
            }
        }

        $log.debug('--- TourQuoteController - ', vm.tour, departure, arrival);

        vm.startQuote = function () {
            WayonaraTutorialService.setCurrentStep('quoteBeforeSearch');
            $log.debug('-- TourQuoteController.startQuote - vm.oneWayQuoted', vm.oneWayQuoted);
            $log.debug('-- TourQuoteController.startQuote - vm.showRoundtripWarning', vm.showRoundtripWarning);
        };

        vm.keepOneway = function () {
            vm.showRoundtripWarning = false;


            $rootScope.$broadcast('WN_EVT_TIMELINE_KEEP_ONEWAY', { nodeVectorIndex: nodeVectorIndex, nodeVectorLinkedRoundtripIndex: nodeVectorLinkedRoundtripIndex });

            vm.startQuote();
            $scope.roundtrip = false;
        };

        vm.roundtripQuote = function () {
            vm.showRoundtripWarning = false;
            vm.startQuote();
        }
    }
})();
