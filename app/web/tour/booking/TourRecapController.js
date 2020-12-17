(function(){
    'use strict';

    angular.module('wayonara.tour').controller('TourRecapController', TourRecapController);

    TourRecapController.$inject = ['$scope', '$rootScope', '$log', '$state', 'TourBookingService', 'translationResolved', 'PO_IO', '$uibModal', 'constants'];
    /**
    * Tour booking Controller
    *
    * @param $scope
    * @param $log
    */
    function TourRecapController($scope, $rootScope, $log, $state, TourBookingService, translationResolved, PO_IO, $uibModal, constants){
        var vm = this;

        vm.translation = translationResolved;
        $state.current.breadcrumbs = [{ label: translationResolved.recap }];

        vm.Math = window.Math;
        //$scope.breadcrumbs.length = 0;
        //$scope.breadcrumbs.push({label:"Recap", icon:""});

        vm.bookAllDisable = false;

        /**
        *   DISABILITIAMO IL BOOKING IN PRODUZIONE, KEEP COMMENTED/UNCOMMENTED FOLOWING MANAGEMENT REQUIREMENTS
        **/
        /*
        if( typeof(webpackGlobalVars.env) !== 'undefined' && webpackGlobalVars.env === constants._ENV.production ){
            vm.bookAllDisable = true;
        }
        */

        //grid for every passenger
        vm.ancillaryServiceList = [];
        //grid for every segment
        vm.ancillaryServiceTripList = [];

        vm.totalAncillaryService = 0;
        $scope.remoteValidation = true;
        //$log.debug('State parameters on tour recap controller: ',$state);

        vm.paymentOrder = PO_IO.paymentOrder;
        vm.itineraryOperation = PO_IO.itineraryOperation;

        $log.debug('--- TourRecapController - $scope.paymentOrder -',vm.paymentOrder);
        $log.debug('--- TourRecapController - $scope.itineraryOperation -',vm.itineraryOperation);

        vm.enteringForm = false;

        vm.buildBookingForm = function(){
            $rootScope.$broadcast('WN_EVT_PAGELOADING');
            vm.enteringForm = true;

            $log.debug('scope itinerary operation', vm.itineraryOperation);
            TourBookingService.retrieveBookingRequirements(vm.itineraryOperation)
                .then(function(response){
                    $log.debug("--- bookingFormFields", response.data.bookingFormFields);
                    $log.debug("--- paymentOrder", response.data.paymentOrder);

                    $rootScope.$broadcast('WN_EVT_PAGELOADED');
                    vm.enteringForm = false;

                    $state.go('tour.booking.form',{
                        bookingFormFields: response.data.bookingFormFields,
                        paymentOrder: response.data.paymentOrder,
                        itineraryOperation: vm.itineraryOperation
                    });
                })
                .catch(function(response){
                    $rootScope.$broadcast('WN_EVT_PAGELOADED');
                    vm.enteringForm = false;

                    $log.debug("error api retrieve booking form", response);
                });
        };

        /**
        * addAncillaryServices
        *
        * @param ancillaryServiceAvailable
        * @param index
        * @param bookingChunk
        *
        */
        vm.addAncillaryServices = function(ancillaryServiceAvailable, bookingChunk, bookingTravelIndexId, bookingChunkIndexId, traveler, index) {
            //get parameters
            var bti = bookingTravelIndexId;
            var bci = bookingChunkIndexId;
            var tk = traveler.keyCode;

            //note:
            /*
            Luggage must be assigned to correct passenger in correct booking chunk inside correct booking travel, so we need these 3 indexes to assign it correctly.
            ancillaryServiceList is the array that stores luggage selection information but it should be refactored because to show correctly the luggage to the passenger in right sidebar we are cicling this common grid
            and also in template we need these 3 indexes to identify correct informations, so it comes ng-init="ancillarySelectedIndex = travelIndex + '_' + bookingChunkIndex + '_' + travelerAs.traveler.keyCode"
            */
            vm.keybtitk = bti+"_"+bci+"_"+tk;

            //build specific element
            var elemento = "#"+bti+"_"+bci+"_"+tk+"_"+index;
            var ancillaryElement = angular.element(elemento);

            if (angular.isUndefined(vm.ancillaryServiceList[vm.keybtitk])){
                 vm.ancillaryServiceList[vm.keybtitk] = [];
            }

            if (angular.isUndefined(vm.ancillaryServiceTripList[bti])){
                 vm.ancillaryServiceTripList[bti] = [];
            }

            //check if not clicked
            if ($scope[elemento] != "clicked"){

                //add ancillaryService
                vm.ancillaryServiceList[vm.keybtitk].push(ancillaryServiceAvailable);
                //update total import
                vm.totalAncillaryService = vm.totalAncillaryService + ancillaryServiceAvailable.amount;

                $log.debug('-- TourRecapController - vm.ancillaryServiceList', vm.ancillaryServiceList);

                $scope[elemento] = "clicked";
                ancillaryElement.removeClass();
                ancillaryElement.addClass("ui-action-button expanded wn-btn-neutral btn-ancillary-vector  ng-scope active");

                var itinerarySegment = vm.itineraryOperation.itinerarySegment[bookingTravelIndexId];
                if ( vm.itineraryOperation.itinerarySegment[bookingTravelIndexId]){
                    var nextopSearchResultTrip =  vm.itineraryOperation.itinerarySegment[bookingTravelIndexId].nextopSearchResultTrip;
                }
                var vectorsList = bookingChunk.vectors;
                angular.forEach(vectorsList, function(vector, key) {
                    if (vector.bit == 1){
                        vm.vectorId = vector.id;
                    }
                });

                //build AncillaryServiceTrip
                var ancillaryServiceTrip = {
                    ancillaryService: vm.ancillaryServiceList[vm.keybtitk],
                    travelerKeyCode: traveler.keyCode,
                    vectorId: vm.vectorId
                };

                //update  ancillaryServiceTripList
                vm.ancillaryServiceTripList[bti].push(ancillaryServiceTrip);


            }else{

               //remove element
               vm.ancillaryServiceList[vm.keybtitk].splice(vm.keybtitk,1);
               angular.forEach(vm.ancillaryServiceTripList[bti], function(ancillaryServiceTrip, key) {
                   if (ancillaryServiceTrip.travelerKeyCode == traveler.keyCode){
                        vm.ancillaryServiceTripList[bti].splice(key,1);
                   }
               });

               //update total import
               vm.totalAncillaryService = vm.totalAncillaryService - ancillaryServiceAvailable.amount;

               $scope[elemento] = "null";
               ancillaryElement.removeClass();
               ancillaryElement.addClass("ui-action-button expanded wn-btn-neutral btn-ancillary-vector  ng-scope inactive");
            }

            //update itinerary operation
            vm.itineraryOperation.itinerarySegment[bookingTravelIndexId].nextopSearchResultTrip.userInputData = {
                ancillaryServiceTripList: vm.ancillaryServiceTripList[bti]
            };
        };

        vm.openRulesAndTariffModal = function(bookingGroupChunk) {
            return TourBookingService.buildRulesAndTariffModalData(bookingGroupChunk);
        }

        vm.selectFareOffer = function(tourId, bookingTravel, fare_offer){
            $rootScope.$broadcast('WN_EVT_PAGELOADING');
            vm.enteringForm = true;

            TourBookingService.itineraryretrieveprebookingform(tourId, bookingTravel, fare_offer)
                .then(function(response){
                    $log.debug("--- itineraryretrieveprebookingform", response.data);

                    $rootScope.$broadcast('WN_EVT_PAGELOADED');
                    vm.enteringForm = false;
                })
                .catch(function(response){
                    $rootScope.$broadcast('WN_EVT_PAGELOADED');
                    vm.enteringForm = false;

                    $log.debug("error api selectFareOffer", response);
                });
        }

        vm.parseFareRules = function (json) {
            const fare_rules = angular.fromJson(json);
            // fare_rules.forEach(fare_rule => {
            //     console.log(fare_rule.header, fare_rule.text)                
            // })
            return [];
        }
    }
})();
