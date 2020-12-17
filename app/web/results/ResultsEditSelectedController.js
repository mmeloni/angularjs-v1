(function(){
    'use strict';

    angular.module('wayonara.tour').controller('ResultsEditSelectedController', ResultsEditSelectedController);

    ResultsEditSelectedController.$inject = ['$scope', '$rootScope', '$log', '$state', '$stateParams', 'tourResolved', 'TourService', 'translationResolved', 'WayonaraTutorialService', 'VectorBitmaskService'];
    function ResultsEditSelectedController($scope, $rootScope, $log, $state, $stateParams, tourResolved, TourService, translationResolved, WayonaraTutorialService, VectorBitmaskService) {

        var vm = this;

        vm.isLoadingButtonRemoveQuotation = false;

        vm.translation = translationResolved;
        $state.current.breadcrumbs = [{ label: translationResolved.editAtransport }];

        WayonaraTutorialService.setCurrentStep('done');

        vm.tour = tourResolved;
        vm.callInError = false;
        vm.enteringRecap = false;

        // NOTE SIMO: must check if node has linked roundtrip and out outbound segment origins and destinations
        var currentNodeId = parseInt($state.params.index);
        var linkedNodeRoundtripId = null;
        vm.roundtrip = (vm.tour.timeline[currentNodeId].model.linkedNodeRoundtripId) ? true : false;

        if(vm.roundtrip === true) {
            linkedNodeRoundtripId = vm.tour.timeline[currentNodeId].model.linkedNodeRoundtripId;
        }

        // we are in return segment of roundtrip if current vector node has index > of linked roundtrip node.
        // If it happens, must be taken outbound segment params for "origin" (so params in linked node roundtrip) and return segment params for "destination" (so params in linked node roundtrip)
        // Otherwise must be taken params of current node as "origin" and params of linked roundtrip node as "destination"
        if((vm.roundtrip === true) && (currentNodeId > linkedNodeRoundtripId)){
            vm.tripOriginName = vm.tour.timeline[linkedNodeRoundtripId - 1].model.name;
            vm.tripDestinationName = vm.tour.timeline[linkedNodeRoundtripId + 1].model.name;
        } else {
            vm.tripOriginName = vm.tour.timeline[currentNodeId - 1].model.name;
            vm.tripDestinationName = vm.tour.timeline[currentNodeId + 1].model.name;
        }

        vm.resultSelected = vm.tour.timeline[currentNodeId].model.resultSelected;
        vm.resultSelected.totalStats = {
            outboundSegment:{
                maxStop:0
            },
            returnSegment:null
        };
        vm.quoteError = false;

        var selectedVectorType = vm.tour.timeline[parseInt($state.params.index)].model.type;

        vm.models = {};
        vm.models.skipOutboundVectors = VectorBitmaskService.getNotSelectedAndAncillaries(selectedVectorType);
        vm.models.skipReturnVectors = 0;
        vm.models.maxStopsNumberOut = 0;
        vm.models.maxStopsNumberRet = 0;
        vm.models.maxWaitingTimeOut = 0;
        vm.models.maxWaitingTimeRet = 0;
        vm.models.outcarriers = [];
        vm.models.outfrom = [];
        vm.models.outto = [];

        $log.debug('--- ResultsEditSelectedController - $scope.resultSelected -', vm.resultSelected);

        vm.changeQuote = function(){
            //reset result selected to go back and quote again
            vm.tour.timeline[parseInt($stateParams.index)].model.resultSelected = null;
            $state.go('tour.edit.quote',{ index: parseInt($stateParams.index) });
        };

        vm.removeQuotation = function() {
            vm.isLoadingButtonRemoveQuotation = true;

            var index = parseInt($stateParams.index);
            var node = vm.tour.timeline[index].model;
            // Rimuovo la quotation dalla timeline
            delete node.resultSelected;

            if (node.hasOwnProperty('linkedNodeRoundtripId')) {
                var pairedNode = vm.tour.timeline[node.linkedNodeRoundtripId].model;
                delete pairedNode.resultSelected;
            }

            $rootScope.$broadcast('WN_EVT_TIMELINE_UPDATED', { nodes: vm.tour.timeline });

            TourService.updateTour(tourResolved).then(function(response) {
                    vm.isLoadingButtonRemoveQuotation = false;
                    $log.debug('Tour quotation removed from tour', response);
                    $state.go('tour.edit.quote',{ index: parseInt($stateParams.index) });
                }).catch(function(error) {
                    $log.debug('Tour quotation NOT removed from tour', error);
                    vm.isLoadingButtonRemoveQuotation = false;
                });
        };

        $scope.$on('$viewContentLoaded', function() {
            $log.debug('ResultsEditSelectedController.$viewContentLoaded---');
            $rootScope.$broadcast('WN_EVT_TL_SELECT_SUBTREE', { index: $stateParams.index });
        });
    }
}());
