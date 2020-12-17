/**
* TourBooking Service.
* @author Alessandro Casu
*/

(function(){
    'use strict';

    angular.module('wayonara.social').factory('TourBookingService', TourBookingService);
    TourBookingService.$inject = ['$http', 'SessionService', '$log', '$q', '$filter', 'ResultsService', '$uibModal', 'api'];

    /**
    * Tour Booking service
    *
    * @param $http
    * @param SessionService
    * @param $log
    *
    * @returns {Object}
    */
    function TourBookingService($http, SessionService, $log, $q, $filter, ResultsService, $uibModal, api){
        var bookingService = {};

        bookingService.itineraryRecap = function(itineraryOperation){
            $log.debug("TourBookingService API itineraryRecap", itineraryOperation);
            var uri = api._ITINERARY_RECAP;
            return $http.post(uri, itineraryOperation,  {headers: {"Authorization": 'Bearer ' + SessionService.getToken()}});
        };

        bookingService.retrieveBookingRequirements = function(itineraryOperation){
            $log.debug("TourBookingService API retrieveBookingRequirements", itineraryOperation);
            var uri = api._RETRIEVE_BOOKING_REQUIREMENTS;
            return $http.post(uri, itineraryOperation,  {headers: {"Authorization": 'Bearer ' + SessionService.getToken()}});
        };

        bookingService.bookAll = function(tour){
            var itineraryOperation = this.buildItineraryOperation(tour);
            var api = this.itineraryRecap(itineraryOperation);
            var deferred = $q.defer();

            api.then(
                function(response){
                    var okResponse = {};

                    okResponse.callInError = false;
                    okResponse.remoteValidation = true;
                    okResponse.paymentOrder = response.data;
                    okResponse.enteringRecap = false;
                    okResponse.itineraryOperation = itineraryOperation;

                    deferred.resolve(okResponse);

                },
                function(error){
                    deferred.reject(error.data);
                }
            );

            return deferred.promise;
        };

        bookingService.fillPaymentOrderAndItineraryOnRecap = function(tour){
            var api = this.bookAll(tour);
            var deferred = $q.defer();

            api.then(
                function(response){
                    var returnedObject =  {'paymentOrder': response.paymentOrder, 'itineraryOperation': response.itineraryOperation};
                    deferred.resolve(returnedObject);
                },
                function(error){
                    $rootScope.$broadcast('WN_EVT_PAGELOADED');

                    var modalInstance = $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'tour/booking/booking-error-modal.html',
                        controller: 'TourBookingErrorModalController',
                        size: 'lg',
                        windowTopClass: 'booking-error-modal-dialog-top-class',
                        resolve: {
                            timeLine: function () {
                                return tour.timeline;
                            },
                            bookingQuoteErrorsAPIResult: function(){
                                return error;
                            }
                        }
                    });

                    deferred.reject(error.data);
                }
            );

            return deferred.promise;
        };

        /**
        * bookingService.buildItineraryOperation
        *
        * creates itineraryOperation from tour.timeline
        *
        * @param tour
        * @returns itineraryOperation
        */
        bookingService.buildItineraryOperation = function(tour){
            var itineraryOperation = {"itinerarySegment":[], "language":"IT", "tourId":tour.id, "travelers":[], "customer":{}, "paymentGatewayToken":"", "status":"" };
            var origin = null;
            var destination = null;
            var trip = null;
            var departureDate = null;
            var roundTripProcessed = [];
            var passengers = [];

            angular.forEach(tour.participants, function(participant, key) {
                if(participant.age === null){
                    passengers.push({"keyCode":key+"_", "age":null});
                } else {
                    passengers.push({"keyCode":key+"_"+participant.age, "age":+participant.age});
                }

            });

            angular.forEach(tour.timeline, function(element, key) {

                if(element.model.category == "vehicle"){
                    if (element.model.resultSelected){
                        trip = element.model.resultSelected.trip;
                        departureDate = $filter('date')(trip.outboundSegment.startTime, 'yyyy-MM-dd');
                    }

                    origin = tour.timeline[key - 1].model.nearestPoiId;
                    destination = tour.timeline[key + 1].model.nearestPoiId;

                    var searchParams = {"departureDate":departureDate,"origin":origin,"destination":destination};
                    searchParams.passengers = {"passenger":passengers};

                    //ROUNDTRIP if element.model.linkedNodeRoundtripId is empty/null/not defined is a oneway
                    if( typeof(element.model.linkedNodeRoundtripId)!=='undefined' && element.model.linkedNodeRoundtripId !== null ){
                        searchParams.returnDate = $filter('date')(trip.returnSegment.startTime, 'yyyy-MM-dd');
                        searchParams.travelMode = 'roundtrip';

                        var itinerarySegmentObject = {"nextopSearchResultTrip": ResultsService.vectorsIdFromTrip(trip), "searchParams" : searchParams};

                        var actualKey = key;
                        var actualKeyIndex = roundTripProcessed.indexOf(actualKey);

                        var linkeRoundtripKey = element.model.linkedNodeRoundtripId;
                        var linkeRoundtripKeyIndex = roundTripProcessed.indexOf(linkeRoundtripKey);

                        //must create only 1 itinerarySegment and avoid duplicates for roundtrip solutions
                        //if dealCode of actual segment is present in cached array, it means we are cycling returnSegment of the roundtrip, so itinerarySegment will be created
                        if((actualKeyIndex === -1) && (linkeRoundtripKeyIndex === -1)){
                            if( typeof(element.model.resultSelected) !== 'undefined' && element.model.resultSelected !== null){
                                itineraryOperation.itinerarySegment.push(itinerarySegmentObject);
                                roundTripProcessed.push(actualKey);
                                roundTripProcessed.push(linkeRoundtripKey);
                            }
                        }
                    } else {
                        searchParams.travelMode = 'oneway';
                        if( typeof(trip) !== 'undefined' && trip !== null){
                            if( typeof(element.model.resultSelected) !== 'undefined' && element.model.resultSelected !== null){
                                var itinerarySegmentObject = {"nextopSearchResultTrip": ResultsService.vectorsIdFromTrip(trip), "searchParams" : searchParams};
                                itineraryOperation.itinerarySegment.push(itinerarySegmentObject);
                            }

                        }
                    }
                }
            });

            $log.debug('--- TourBookingService - roundTripProcessed - ', roundTripProcessed);
            return itineraryOperation;
        };

        bookingService.getUnquotedTimelineNodes = function(tour){

            var unquotedVehicleNodesWithIndex = [];

            tour.timeline.forEach(function(timeLineNode, index) {
                if(timeLineNode.model.category === "vehicle"){
                    if(typeof(timeLineNode.model.resultSelected) == 'undefined' || timeLineNode.model.resultSelected === null){

                        var timeLineNodeWithIndex = {"timelineIndex": index, "timeLineNode": timeLineNode};
                        //Inserisco nell'array da restituire
                        unquotedVehicleNodesWithIndex.push(timeLineNodeWithIndex);
                    }
                }
            });

            return unquotedVehicleNodesWithIndex;
        };

        bookingService.getQuotedTimelineNodes = function(tour){
            var quotedVehicleNodesWithIndex = [];

            tour.timeline.forEach(function(timeLineNode, index) {
                if(timeLineNode.model.category === "vehicle"){
                    if(typeof(timeLineNode.model.resultSelected) !== 'undefined' && timeLineNode.model.resultSelected !== null){

                        var timeLineNodeWithIndex = {"timelineIndex": index, "timeLineNode": timeLineNode};
                        //Inserisco nell'array da restituire
                        quotedVehicleNodesWithIndex.push(timeLineNodeWithIndex);
                    }
                }
            });

            return quotedVehicleNodesWithIndex;
        };

        bookingService.itineraryBooking = function(itineraryOperation){
            $log.debug("TourBookingService API itineraryBooking", itineraryOperation);
            var uri = api._ITINERARY_BOOKING;
            return $http.post(uri, itineraryOperation,  {headers: {"Authorization": 'Bearer ' + SessionService.getToken()}});
        };

        bookingService.retrieveBookingsPreviewByUser = function(page, user){
            $log.debug("RetrieveBookingsPreviewByUser API Retrieve Bookings By User", page, user);
            var uri = api._RETRIEVE_BOOKINGS_PREVIEW_BY_USER;
            var searchParams = {"page":page, "user":user.nid};
            return $http.post(uri, searchParams,  {headers: {"Authorization": 'Bearer ' + SessionService.getToken()}});
        };

        bookingService.retrieveBookingDetail = function(fullBookingPreviewId){
            $log.debug("retrieveBookingDetail API Retrieve Booking Details", fullBookingPreviewId);
            var uri = api._RETRIEVE_BOOKING_DETAIL;
            var searchParams = {"fullBookingPreviewId":fullBookingPreviewId};
            return $http.post(uri, searchParams,  {headers: {"Authorization": 'Bearer ' + SessionService.getToken()}});
        };

        /**
         * Creo gli oggetti che mi serviranno per andare al view details degli errori, ciclando sulla timeline
         */
        bookingService.createVectorObjects = function(timeLine){
            var vectors = [];

            timeLine.forEach(function(timeLineNode, index) {
                if(timeLineNode.model.category === "vehicle"){
                    if(typeof(timeLineNode.model.resultSelected) != 'undefined' && timeLineNode.model.resultSelected !== null){
                        //Cerco il vettore vendibile
                        var buyableVector = null;
                        for(var i = 0; i < timeLineNode.model.resultSelected.trip.outboundSegment.vectors.length; i++){
                            if(timeLineNode.model.resultSelected.trip.outboundSegment.vectors[i].buyable === true){
                                buyableVector = timeLineNode.model.resultSelected.trip.outboundSegment.vectors[i];
                                break;
                            }
                        }

                        var travelVector = {timeLineId:index, buyableVectorId:buyableVector.id, buyableVector:buyableVector, timeLineNode:timeLineNode};

                        //Inserisco nell'array da restituire
                        vectors.push(travelVector);
                    }
                }
            });

            return vectors;
        };

        /**
         * Recupero i vettori dalla timeline
         */
        bookingService.getAllVectorObjects = function(timeLine){
            var vectors = [];

            timeLine.forEach(function(timeLineNode, index) {
                if(timeLineNode.model.category === "vehicle"){
                    if(typeof(timeLineNode.model.resultSelected) != 'undefined' && timeLineNode.model.resultSelected !== null){
                        //Cerco il vettore vendibile
                        var tempVector = null;
                        for(var i = 0; i < timeLineNode.model.resultSelected.trip.outboundSegment.vectors.length; i++){
                            tempVector = timeLineNode.model.resultSelected.trip.outboundSegment.vectors[i];
                        }

                        var foundVector = {vector:tempVector};

                        //Inserisco nell'array da restituire
                        vectors.push(foundVector);
                    }
                }
            });

            return vectors;
        };

        /**
         * Creo gli oggetti quote Error da renderizzare nel front
         */
        bookingService.bookingQuoteErrorToRender = function(bookingQuoteErrors, travelVectors){
            var bookingQuoteErrorToRenderizeVectors = [];

            bookingQuoteErrors.forEach(function(bookingQuoteError, index) {

                var bookingQuoteErrorToRenderizeVector = null;
                for(var i = 0; i < travelVectors.length; i++){
                    if( typeof(bookingQuoteError.vectorId) !== 'undefined' && bookingQuoteError.vectorId !== null ){
                        if(travelVectors[i].buyableVectorId === bookingQuoteError.vectorId){
                            bookingQuoteErrorToRenderizeVector = {travelVector:travelVectors[i], bookingQuoteError:bookingQuoteError};
                            //Inserisco nell'array da restituire
                            bookingQuoteErrorToRenderizeVectors.push(bookingQuoteErrorToRenderizeVector);
                            break;
                        }
                    }
                }

            });

            return bookingQuoteErrorToRenderizeVectors;
        };

        /**
         *  Retrieves rules and tariff for bookingchunk
         */
        bookingService.rulesAndTariffRestrictions = function(bookingchunk){
            $log.debug("TourBookingService API rulesAndTariffRestrictions", bookingchunk);
            var uri = api._RULES_AND_TARIFF_RESTRICTIONS;
            return $http.post(uri, bookingchunk,  {headers: {"Authorization": 'Bearer ' + SessionService.getToken()}});
        };

        bookingService.buildRulesAndTariffModalData = function(bookingGroupChunk) {
            /** Prendo il primo dei bookingChunk dentro il bookingGroupChunk **/
            var bookingChunkOriginal = bookingGroupChunk.bookingChunks[0];
            var bookingChunkCloned = jQuery.extend(true, {}, bookingChunkOriginal);
            /** Svuoto gli oggetti vectors e rimetto solo un array di id dei vettori **/
            if (typeof(bookingChunkCloned.vectors) !== 'undefined' && bookingChunkCloned.vectors !== null) {
                var vectorIds = [];
                for (var i = 0; i < bookingChunkCloned.vectors.length; i++) {
                    vectorIds.push(bookingChunkCloned.vectors[i].id);
                }
                bookingChunkCloned.vectors = vectorIds;
            }

            $log.debug('-- TourBookingService - bookingChunkOriginal', bookingChunkOriginal);
            $log.debug('-- TourBookingService - bookingChunkCloned', bookingChunkCloned);
            $log.debug('-- TourBookingService - bookingChunkCloned.vectors', vectorIds);

            bookingService.rulesAndTariffRestrictions(bookingChunkCloned).then(
                function (response) {
                    var termsAndConditionsObject = response.data;
                    var modalInstance = $uibModal.open({
                        animation: false,
                        templateUrl: 'web/tour/booking/rules-and-tariff-modal.html',
                        controller: 'RulesAndTariffModalController',
                        size: 'lg',
                        windowTopClass: 'booking-error-modal-dialog-top-class',
                        resolve: {
                            termsAndConditions: function () {
                                return termsAndConditionsObject;
                            }
                        }
                    });
                },
                function (error) {
                    $log.debug("Error retrieving terms and conditions");
                }
            );

        };

        /**
         *  Select fare offer
         */
        bookingService.itineraryretrieveprebookingform = function(tourId, bookingTravel, fare_offer){
            var fareOfferRequest = this.buildFareOfferRequest(tourId, bookingTravel, fare_offer);

            $log.debug("TourBookingService API itineraryretrieveprebookingform", fareOfferRequest);
            var uri = api._ITINERARY_RETRIEVE_PREBOOKING_FORM;
            return $http.post(uri, fareOfferRequest,  {headers: {"Authorization": 'Bearer ' + SessionService.getToken()}});
        };

        bookingService.buildFareOfferRequest = function(tourId, bookingTravel, fare_offer){
            var fareOfferRequest = {
                "itinerarySegment":[], 
                "language":"IT", 
                "tourId":tourId, 
                "travelers":[], 
                "customer":{}, 
                "paymentGatewayToken":"", 
                "status":"" 
            };

            var departureDate = departureDate = $filter('date')(bookingTravel.searchParams.departureDate, 'yyyy-MM-dd');
            var origin = bookingTravel.searchParams.origin.id;
            var destination = bookingTravel.searchParams.destination.id;
            var passengers = bookingTravel.searchParams.passengers;
            var travelMode = bookingTravel.searchParams.travelMode;
            var searchParams = {
                "departureDate": departureDate,
                "origin":origin,
                "destination":destination,
                "passengers":passengers,
                "travelMode":travelMode
            };
            if( bookingTravel.searchParams.travelMode === 'roundtrip' ){
                searchParams.returnDate = $filter('date')(bookingTravel.searchParams.returnDate, 'yyyy-MM-dd');
            }

            var itinerarySegmentObject = {
                "nextopSearchResultTrip": ResultsService.vectorsIdFromTrip(bookingTravel.nextopSearchResultTrip), 
                "searchParams" : searchParams
            };

            itinerarySegmentObject.nextopSearchResultTrip.outboundSegment.fareOfferId = fare_offer.fare_offer_id;
            fareOfferRequest.itinerarySegment.push(itinerarySegmentObject);
            console.log(fareOfferRequest);
            return fareOfferRequest;
        };

        return bookingService;
    }
})();
