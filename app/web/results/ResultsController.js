/**
 * Results Controller.
 * @author Michele Meloni, Simone Pitzianti
*/


(function(){
    'use strict';

    angular.module('wayonara.booking').controller('ResultsController', ResultsController);
    ResultsController.$inject = ['$scope', '$log', '$timeout', '$state', '$filter', 'UserService', 'ResultsService', 'TourService', 'SessionService', 'TranslationService', '$rootScope', 'WayonaraTutorialService', 'VectorBitmaskService', 'constants'];

    function ResultsController($scope, $log, $timeout, $state, $filter, UserService, ResultsService, TourService, SessionService, TranslationService, $rootScope, WayonaraTutorialService, VectorBitmaskService, constants) {
        $scope.translation = TranslationService.getTranslationLabels();

        //loading flags and pagination
        $scope.activatePagination = false;
        $scope.paginationPage = 0;
        $scope.searchLaunched = false;
        $scope.filtersReady = false;
        $scope.loadingDetails = false;

        var linkedNodeRoundtripId = null;

        var currentNodeId = parseInt($state.params.index);
        $scope.roundtrip = ($scope.tour.timeline[currentNodeId].model.linkedNodeRoundtripId) ? true : false;

        if($scope.roundtrip === true) {
            linkedNodeRoundtripId = $scope.tour.timeline[currentNodeId].model.linkedNodeRoundtripId;
        }

        var selectedVectorType = $scope.tour.timeline[currentNodeId].model.type;

        //searchParams setup
        $scope.searchParams = {};
        $scope.searchParams.skipOutboundVectors = VectorBitmaskService.getNotSelectedAndAncillaries(selectedVectorType);
        $scope.extra = {};
        $scope.extra.enabledOutFiltersBm = parseInt(selectedVectorType);

        // we are in return segment of roundtrip if current vector node has index > of linked roundtrip node.
        // If it happens, must be taken outbound segment params for "origin" (so params in linked node roundtrip) and return segment params for "destination" (so params in linked node roundtrip)
        // Otherwise must be taken params of current node as "origin" and params of linked roundtrip node as "destination"
        if(($scope.roundtrip === true) && (currentNodeId > linkedNodeRoundtripId)){
            $scope.tripOriginName = $scope.tour.timeline[linkedNodeRoundtripId - 1].model.name;
            $scope.tripDestinationName = $scope.tour.timeline[linkedNodeRoundtripId + 1].model.name;

            $scope.originId = $scope.tour.timeline[linkedNodeRoundtripId - 1].model.nearestPoiId;
            $scope.destinationId = $scope.tour.timeline[linkedNodeRoundtripId + 1].model.nearestPoiId;
        } else {
            $scope.tripOriginName = $scope.tour.timeline[currentNodeId - 1].model.name;
            $scope.tripDestinationName = $scope.tour.timeline[currentNodeId + 1].model.name;

            $scope.originId = $scope.tour.timeline[currentNodeId - 1].model.nearestPoiId;
            $scope.destinationId = $scope.tour.timeline[currentNodeId + 1].model.nearestPoiId;
        }

        $log.debug('-- ResultsController.init - $scope.originId', $scope.originId);
        $log.debug('-- ResultsController.init - $scope.destinationId', $scope.destinationId);

        $log.debug('-- ResultsController.init - $scope.tripOriginName', $scope.tripOriginName);
        $log.debug('-- ResultsController.init - $scope.tripDestinationName', $scope.tripDestinationName);

        $scope.passengers = [];

        //results models and filters setup
        $scope.results = {};
        $scope.results.cheaper = [];
        $scope.results.faster = [];
        $scope.results.totalStats = {"outboundSegment":{"maxStop":0},"returnSegment":null};
        $scope.ancillaryVectorsSelected = [];
        $scope.ancillaryVectorsSelected['outboundSegment'] = [];
        $scope.ancillaryVectorsSelected['returnSegment'] = [];
        $scope.tripDetails = [];

        // DATEPICKER START
        var dataChanged = false;
        //if data change we have to clear filter
        $scope.$watch("departureDateModel", function(newValue, oldValue) {
                if(newValue != oldValue){
                    dataChanged = true;
                }
            }, true);

        $scope.$watch("returnDateModel", function(newValue, oldValue) {
                if(newValue != oldValue){
                    dataChanged = true;
                }
            }, true);

        // datepicker initialization params
        $scope.dateSelectedFormat = 'yyyy-MM-dd';

        $scope.today = new Date();
        $scope.departureDateModel = $scope.today;

        $scope.tomorrow = new Date();
        $scope.tomorrow.setDate($scope.tomorrow.getDate() + 1);
        $scope.returnDateModel = $scope.tomorrow;

        $log.debug('-- ResultsController - $scope.departureDateModel', $scope.departureDateModel);
        $log.debug('-- ResultsController - $scope.returnDateModel', $scope.returnDateModel);

        $scope.outboundDatePickerOptions = {
            showWeeks: false
        };

        $scope.returnDatePickerOptions = {
            showWeeks: false
        };

        $scope.outboundDateSelected = false;
        $scope.popupOutboundDatepicker = {
            opened: false
        };

        $scope.returnDateSelected = false;
        $scope.popupReturnDatepicker = {
            opened: false
        };

        $scope.openOutboundDatepicker = function() {
            if($scope.outboundDateSelected === false) {
                $scope.popupOutboundDatepicker.opened = true;
            }
            $scope.outboundDateSelected = false;
        };

        $scope.openReturnDatepicker = function() {
            if($scope.returnDateSelected === false) {
                $scope.popupReturnDatepicker.opened = true;
            }
            $scope.returnDateSelected = false;
        };

        $scope.closeOnOutboundDateSelect = function() {
            // once selected departure date, return date too must follow
            $scope.returnDateModel = $scope.departureDateModel;
            $log.debug('-- ResultsController.closeOnOutboundDateSelect - $scope.departureDateModel', $scope.departureDateModel);
            $log.debug('-- ResultsController.closeOnOutboundDateSelect - $scope.returnDateModel', $scope.returnDateModel);
            $scope.outboundDateSelected = true;
            this.openReturnDatepicker();
        };

        $scope.closeOnReturnDateSelect = function(returnDateModel) {
            //directive is bugged, with 2 models needs to be refreshed and do this workaround
            $scope.returnDateModel = returnDateModel;
            $log.debug('-- ResultsController.closeOnReturnDateSelect - $scope.departureDateModel', $scope.departureDateModel);
            $log.debug('-- ResultsController.closeOnReturnDateSelect - $scope.returnDateModel', $scope.returnDateModel);
            $scope.returnDateSelected = true;
        };

        /**
        * launchSearch
        *
        * launches vector search from searchParams
        *
        * @returns $scope.results.selected
        *
        */
        $scope.launchSearchWrap = function(){
            $scope.clearResults();
            $scope.launchSearch();
        };

        /***result filter ***/
        $scope.filterSearch = function(){
            $scope.clearResults();
            $scope.launchSearch();
        };

        /**
        * launchSearch
        *
        * launches vector search from searchParams
        *
        * @returns $scope.results.selected
        *
        */
        $scope.masterSearch = function(){
            $scope.clearResults();
            $scope.launchSearch();
        };

        $scope.launchSearch = function(){
            $scope.searchParams.origin = $scope.originId;
            $scope.searchParams.destination = $scope.destinationId;

            $log.debug('-- ResultsController.launchSearch - $scope.searchParams.origin id', $scope.searchParams.origin);
            $log.debug('-- ResultsController.launchSearch - $scope.searchParams.destination id', $scope.searchParams.destination);

            $log.debug('-- ResultsController.launchSearch - $scope.tripOriginName', $scope.tripOriginName);
            $log.debug('-- ResultsController.launchSearch - $scope.tripDestinationName', $scope.tripDestinationName);

            angular.forEach($scope.tour.participants, function(participant, key) {
                if(participant.isPax){
                    if(participant.age === null){
                        $scope.passengers.push({"keyCode":key+"_", "age":null});
                    } else {
                        $scope.passengers.push({"keyCode":key+"_"+participant.age, "age":+participant.age});
                    }
                }
            });
            $scope.searchParams.passengers = {"passenger":$scope.passengers};

            if($scope.roundtrip){
                $log.debug('-- roundtrip search $scope.departureDateModel', $scope.departureDateModel);
                $log.debug('-- roundtrip search $scope.returnDateModel', $scope.returnDateModel);
                $scope.searchParams.travelMode = "roundtrip";
                $scope.searchParams.departureDate = $filter('date')($scope.departureDateModel, 'yyyy-MM-dd');
                $scope.searchParams.returnDate = $filter('date')($scope.returnDateModel, 'yyyy-MM-dd');;
            } else {
                $log.debug('-- oneway search');
                $scope.searchParams.travelMode = "oneway";
                $scope.searchParams.departureDate = $filter('date')($scope.departureDateModel, 'yyyy-MM-dd');
            }

            $scope.searchLaunched = true;
            $scope.pagLaunched = false;
            if(($scope.results.cheaper.length > 0 || $scope.results.faster.length > 0) && ($scope.activatePagination !== true)){
                $scope.pagLaunched = true;
            }

            $log.debug('scope.searchParams',$scope.searchParams);
            var api = ResultsService.launchSearch($scope.searchParams);
            api.then(
                function(response){
                    $scope.addResultsAfterSearch(response.data);
                    $scope.filtersReady = true;
                    $scope.searchLaunched = false;
                    if($scope.results.cheaper.length > 0 || $scope.results.faster.length > 0){
                        WayonaraTutorialService.setCurrentStep('quoteAfterSearch');
                        if($scope.sortingOrder == "faster"){
                            $scope.results.selected = $scope.results.faster;
                        }
                        if($scope.sortingOrder == "cheaper"){
                            $scope.results.selected = $scope.results.cheaper;
                        }
                    }else{
                        $scope.results.selected = [];
                        $scope.results.cheaper = [];
                        $scope.results.faster = [];

                        WayonaraTutorialService.setCurrentStep('quoteAfterSearchEmpty');
                    }
                    //filters are binded on totalStats. We don't refresh them.
                    if(!$scope.filtersReady || dataChanged){
                        $scope.results.totalStats = response.data.totalStats;
                        $log.debug('--- ResultsController - launchSearch outboundSegment.pois',$scope.results.totalStats);

                        $scope.models.maxStopsNumberOut = response.data.totalStats.outboundSegment.maxStop;
                        $scope.models.maxWaitingTimeOut = response.data.totalStats.outboundSegment.maxWT;
                        if(typeof(response.data.totalStats.returnSegment) !== 'undefined' && response.data.totalStats.returnSegment !== null ){
                            $scope.models.maxStopsNumberRet = response.data.totalStats.returnSegment.maxStop;
                            $scope.models.maxWaitingTimeRet = response.data.totalStats.returnSegment.maxWT;
                        }
                    }
                    /** If Last page deactivate search  **/
                    $scope.activatePagination = (response.data.totalStats.lastpage) ? false : true;
                    $scope.searchLaunched = false;
                    $scope.pagLaunched = false;
                    dataChanged = false;
                },
                function(error){
                    $scope.searchLaunched = false;
                },
                function(evt){
                    $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                }
            );
        };

        /**
        * showDetail
        *
        * returns trip details from api itineraryDetail if accordion is open
        *
        * @param result
        * @param resultIndex
        * @param accordionStatus
        *
        */
        $scope.showDetail = function(result, resultIndex, accordionStatus){
            $log.debug('-- accordion status', accordionStatus);
            $log.debug('-- result', result);
            $log.debug('-- resultIndex', resultIndex);

            $scope.loadingDetails = true;

            if(accordionStatus.open === true){
                var nextopSearchResultTripProcessed = ResultsService.vectorsIdFromTrip(result.trip);
                var itineraryDetail = {"nextopSearchResultTrip": nextopSearchResultTripProcessed, "searchParams" : $scope.searchParams};

                ResultsService.itineraryDetail(itineraryDetail)
                    .then(function(response){
                        $log.debug(response);
                        $scope.tripDetails[resultIndex] = response.data;
                        $log.debug('-- $scope.tripDetails', $scope.tripDetails);
                        $scope.loadingDetails = false;
                    })
                    .catch(function(response){
                        $log.debug('-- error retrieving itinerary details', response.data);
                    });
            } else {
                $scope.loadingDetails = false;
            }
        };

        $scope.ancillaryPopover = {
            templateUrl: 'web/results/results-details-all-ancillaries.html'
        };

        /**
        * addAncillary
        * add ancillary vector selected to $scope.ancillaryVectorsSelected
        *
        * @param ancillaryVector
        * @param ancillaryStore
        * @param resIndex unique index of trip detail result
        * @param segment outboundSegment/returnSegment
        *
        */
        $scope.addAncillary = function(ancillaryVector, ancillaryStore, resIndex, segment) {
            var ancillaryStoreId = ancillaryStore.id;

            //initialize ancillaryVectorsSelected with result index to keep tracking of selected ancillaries in each trip result
            if(!$scope.ancillaryVectorsSelected[segment][resIndex]){
                $scope.ancillaryVectorsSelected[segment][resIndex] = [];
            }

            if($scope.ancillaryVectorsSelected[segment][resIndex][ancillaryStoreId] === ancillaryVector){
                $scope.ancillaryVectorsSelected[segment][resIndex][ancillaryStoreId] = null;
            } else {
                $scope.ancillaryVectorsSelected[segment][resIndex][ancillaryStoreId] = ancillaryVector;
            }

            $log.debug('--- resIndex', resIndex);
            $log.debug('--- ancillaryStore', ancillaryStore);
            $log.debug('--- segment', segment);
            $log.debug('--- ancillary vectors selected', $scope.ancillaryVectorsSelected[segment][resIndex]);
        };

        /**
        * Save quote state to add to timeline node
        *
        * @param resultSelected
        * @param resIndex unique index of trip detail result
        *
        */
        $scope.saveQuote = function(resultSelected, resIndex){

            var quoteResult = angular.copy(resultSelected);

            $log.debug('--- quoteResult',quoteResult);

            //update result selected for outbound segment
            angular.forEach(quoteResult.trip.outboundSegment.vectors, function(outboundVector, key) {
                //process only ancillary store, $scope.ancillaryVectorsSelected does not contains vectors
                if(outboundVector.bit === 8192){

                    if($scope.ancillaryVectorsSelected['outboundSegment'][resIndex]){
                        if($scope.ancillaryVectorsSelected['outboundSegment'][resIndex][outboundVector.id]){
                            quoteResult.trip.outboundSegment.vectors[key] = $scope.ancillaryVectorsSelected['outboundSegment'][resIndex][outboundVector.id];
                        }
                    }
                }
            });

            //update result selected for return segment
            if(quoteResult.trip.returnSegment){
                angular.forEach(quoteResult.trip.returnSegment.vectors, function(returnVector, key) {
                    //process only ancillary store, $scope.ancillaryVectorsSelected does not contains vectors
                    if(returnVector.bit === 8192){
                        if($scope.ancillaryVectorsSelected['returnSegment'][resIndex]){
                            if($scope.ancillaryVectorsSelected['returnSegment'][resIndex][returnVector.id]){
                                quoteResult.trip.returnSegment.vectors[key] = $scope.ancillaryVectorsSelected['returnSegment'][resIndex][returnVector.id];
                            }
                        }
                    }

                });
            }

            //update timeline vector node with quoteResult
            $scope.tour.timeline[parseInt($state.params.index)].model.resultSelected = quoteResult;
            //update linkedNodeRoundtripId with quoteResult
            if($scope.tour.timeline[parseInt($state.params.index)].model.linkedNodeRoundtripId){
                var linkedNodeRoundtripId = $scope.tour.timeline[parseInt($state.params.index)].model.linkedNodeRoundtripId;
                if( typeof(linkedNodeRoundtripId)!=='undefined' && linkedNodeRoundtripId !== null ){
                    $scope.tour.timeline[parseInt(linkedNodeRoundtripId)].model.resultSelected = quoteResult;
	                $rootScope.$broadcast("WN_EVT_TIMELINE_UPDATED");
                }
            }

            //update vector icon in timeline when selecting result
            $scope.timelineVectorIconUpdate(parseInt($state.params.index), quoteResult);
            if($scope.tour.timeline[parseInt($state.params.index)].model.linkedNodeRoundtripId){
                var linkedNodeRoundtripId = $scope.tour.timeline[parseInt($state.params.index)].model.linkedNodeRoundtripId;
                if( typeof(linkedNodeRoundtripId)!=='undefined' && linkedNodeRoundtripId !== null ){
                    $scope.timelineVectorIconUpdate(linkedNodeRoundtripId, quoteResult);
                }
            }

            //update $scope.tour with resultSelected
            TourService.updateTour($scope.tour);
            $log.debug('--- ResultsController - saveQuote - tour updated',$scope.tour);

            $state.go('tour.edit.selected',{'index': parseInt($state.params.index)});
        };



        /**
        * Refresh slider rendering inside a tab
        */
        $scope.refreshSlider = function () {
            $timeout(function () {
                $scope.$broadcast('rzSliderForceRender');
            });
        };

        /** Pagination on scroll **/
        $(window).scroll(function() {
            if($scope.activatePagination) {
                if ($(window).scrollTop() + $(window).height() == $(document).height()) {
                    $log.debug("bottom reached");
                    if($scope.searchLaunched == false){
                        $scope.passengers = [];
                        $scope.paginationPage += 1;
                        $scope.activatePagination = false;
                        /** Rilancio la ricerca  **/
                        $scope.searchParams.page = $scope.paginationPage;
                        $scope.launchSearch();
                        /**  **/
                        $log.debug($scope.paginationPage);
                    }
                }
            }
        });

        $scope.addResultsAfterSearch = function(data){
            $log.debug("ResultsController.addResultsAfterSearch() -", data);
            var cheaper = data.cheaper.nextopSearchResult;
            var faster = data.faster.nextopSearchResult;

            for(var i = 0; i < cheaper.length; i++){
                $scope.results.cheaper.push(cheaper[i]);
            }

            for(var j = 0; j < faster.length; j++){
                $scope.results.faster.push(faster[j]);
            }

            $log.debug("ResultsController.addResultsAfterSearch() -", $scope.results);
        };

        $scope.clearResults = function(){
            $scope.passengers = [];
            $scope.paginationPage = 0;
            $scope.searchParams.page = 0;
            $scope.results.faster = [];
            $scope.results.cheaper = [];
        };

        $scope.vectors = constants._VECTORS_BIT_MASK;

        $scope.clearResults = function(){
            $scope.passengers = [];
            $scope.paginationPage = 0;
            $scope.searchParams.page = 0;
            $scope.results.faster = [];
            $scope.results.cheaper = [];
        };

        $scope.initFilters = function(){
            $scope.models = {};
            $scope.models.skipOutboundVectors = VectorBitmaskService.getNotSelectedAndAncillaries(selectedVectorType);
            $scope.models.skipReturnVectors = 0;
            $scope.models.maxStopsNumberOut = 0;
            $scope.models.maxStopsNumberRet = 0;
            $scope.models.maxWaitingTimeOut = 0;
            $scope.models.maxWaitingTimeRet = 0;
            $scope.models.outcarriers = [];
            $scope.models.outfrom = [];
            $scope.models.outto = [];
            $scope.models.sortingDirection = "option-1";
        };

        $scope.initFilters();


        /**
        * Here we set a timer to avoid turboclick
        */
        var timer;
        $scope.$watch('models.skipOutboundVectors', function(newVal, oldVal){
            if($scope.filtersReady){
                if(timer != undefined){
                    $timeout.cancel(timer);
                }
                timer = $timeout(function() {
                    $scope.searchParams.skipOutboundVectors = $scope.models.skipOutboundVectors;
                    $scope.filterSearch();

                }, 1500);
            }
        }, true);

        $scope.$watch('models.skipReturnVectors', function(newVal, oldVal){
            if($scope.filtersReady){
                if(timer != undefined){
                    $timeout.cancel(timer);
                }
                timer = $timeout(function() {
                    $scope.searchParams.skipReturnVectors = $scope.models.skipReturnVectors;
                    $scope.filterSearch();

                }, 1500);
            }
        }, true);

        $scope.filterOutStops = function(sliderId, modelValue, highValue){
            if(timer != undefined){
                $timeout.cancel(timer);
            }
            timer = $timeout(function() {
                $scope.searchParams.maxStopsNumberOut = $scope.models.maxStopsNumberOut;
                $scope.filterSearch();
            }, 1500);
        };

        $scope.filterRetStops = function(sliderId, modelValue, highValue){
            if(timer != undefined){
                $timeout.cancel(timer);
            }
            timer = $timeout(function() {
                $scope.searchParams.maxStopsNumberRet = $scope.models.maxStopsNumberRet;
                $scope.filterSearch();
            }, 1500);
        };

        $scope.filterMaxWaitingTimeOut = function(sliderId, modelValue, highValue){
            if(timer != undefined){
                $timeout.cancel(timer);
            }
            timer = $timeout(function() {
                $scope.searchParams.maxWaitingTimeOut = $scope.models.maxWaitingTimeOut;
                $scope.filterSearch();
            }, 1500);

        };

        $scope.filterMaxWaitingTimeRet = function(sliderId, modelValue, highValue){
            if(timer != undefined){
                $timeout.cancel(timer);
            }
            timer = $timeout(function() {
                $scope.searchParams.maxWaitingTimeRet = $scope.models.maxWaitingTimeOut;
                $scope.filterSearch();
            }, 1500);
        };

        $scope.updateTimeOutbound = function(attrs){
            if(timer != undefined){
                $timeout.cancel(timer);
            }
            timer = $timeout(function() {
                $scope.searchParams.timeOutLimitStart = moment.unix(attrs.minValue).format('YYYYMMDDHHmmss');
                $scope.searchParams.timeOutLimitEnd = moment.unix(attrs.maxValue).format('YYYYMMDDHHmmss');
                $scope.filterSearch();
            }, 1500);
        };

        $scope.updateTimeReturn = function(attrs){
            if(timer != undefined){
                $timeout.cancel(timer);
            }
            timer = $timeout(function() {
                $scope.searchParams.timeRetLimitStart = moment.unix(attrs.minValue).format('YYYYMMDDHHmmss');
                $scope.searchParams.timeRetLimitEnd = moment.unix(attrs.maxValue).format('YYYYMMDDHHmmss');
                $scope.filterSearch();
            }, 1500);
        };

        //arrivato qua
        $scope.syncCarriers = function(bool, item){
            if(!bool){
                // add item
                $scope.models.outcarriers.push(item.agency);
            } else {
                // remove item
                for(var i=0 ; i < $scope.models.outcarriers.length; i++) {
                    if( $scope.models.outcarriers[i] == item.agency){
                        $scope.models.outcarriers.splice(i,1);
                    }
                }
            }
            if(timer != undefined){
                $timeout.cancel(timer);
            }
            timer = $timeout(function() {
                $scope.searchParams.skipOutboundCarrier = $scope.models.outcarriers;
                $scope.filterSearch();
            }, 1500);
        };

        $scope.syncTo = function(bool, item){
            if(!bool){
                // add item
                $scope.models.outto.push(item);
            } else {
                // remove item
                for(var i=0 ; i <$scope.models.outto.length; i++) {
                    if( $scope.models.outto[i].id == item.id){
                        $scope.models.outto.splice(i,1);
                    }
                }
            }
            if(timer != undefined){
                $timeout.cancel(timer);
            }
            timer = $timeout(function() {
                $scope.searchParams.skipPoisOutboundEnd =  $scope.models.outto;
                $scope.filterSearch();
            }, 1500);
        };

        $scope.syncFrom = function(bool, item){
            if(!bool){
                // add item
                $scope.models.outfrom.push(item);
            } else {
                // remove item
                for(var i=0 ; i < $scope.models.outfrom.length; i++) {
                    if( $scope.models.outfrom[i].id == item.id){
                        $scope.models.outfrom.splice(i,1);
                    }
                }
            }
            if(timer != undefined){
                $timeout.cancel(timer);
            }
            timer = $timeout(function() {
                $scope.searchParams.skipPoisOutboundStart = $scope.models.outfrom;
                $scope.filterSearch();
            }, 1500);
        };

        /*** Sorting elements ***/
        $scope.sortingOptions = [ "faster", "cheaper"];
        $scope.sortingOrder = $scope.sortingOptions[1];
        $scope.sortResult = function(sortingOrder){
            $scope.sortingOrder = sortingOrder;
            if($scope.sortingOrder == "faster"){
                $scope.results.selected = $scope.results.faster;
            }
            if($scope.sortingOrder == "cheaper"){
                $scope.results.selected = $scope.results.cheaper;
            }
        };

        /**
        * $scope.timelineVectorIconUpdate: updates vector icon in timeline when selecting result if selected vector is different from the dragged one
        *
        * @param selectedNodeIndex
        * @returns $scope.tour.timeline
        *
        */
        $scope.timelineVectorIconUpdate = function(selectedNodeIndex, quoteResult){
            var maiVectors = VectorBitmaskService.getMainVectors();
            var mainVectorSelected = maiVectors & quoteResult.bm;
            if($scope.tour.timeline[selectedNodeIndex].model.type != mainVectorSelected){
                var exit = false;
                var counter = 0;
                var type = 0;
                //get first solution of intermodal trip
                while(!exit){
                    if((mainVectorSelected | 1) == 1){
                        type = Math.pow(2,counter);
                        exit = true;
                    }
                    mainVectorSelected = mainVectorSelected >> 1;
                    counter++;
                }
                $scope.tour.timeline[selectedNodeIndex].model.type = type;
                $rootScope.$broadcast("WN_EVT_TIMELINE_UPDATED");
            }
        }

        // This should have been inside a component / directive.
        // But we are not updating this part right now, just fixing bugs.
        $scope.getAncillaryVectorButtonLabel = function(vector) {
            var label = '';

            if (typeof vector.agency !== undefined && vector.agency !== null && vector.agency !== '') {
                label += vector.agency;
            }

            if (typeof vector.price !== undefined && vector.price !== null) {
                label += ' €' + vector.price;
            }

            if (typeof vector.agency === undefined || vector.agency === null || vector.agency === '') {
                label += ' ' + $scope.translation.walking;
            }

            return label;
        }
    }
})();
