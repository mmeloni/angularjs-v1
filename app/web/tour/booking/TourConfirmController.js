/**
*
* TourBooking Service.
* @author Simone Pitzianti
*
*/

(function(){
    'use strict';

    angular.module('wayonara.tour').controller('TourConfirmController', TourConfirmController);

    TourConfirmController.$inject = ['$scope', '$rootScope', '$log', '$state', 'translationResolved', 'TourService', 'UserService', 'PO_IO'];
    function TourConfirmController($scope, $rootScope, $log, $state, translationResolved, TourService, UserService, PO_IO){

        var vm = this;

        vm.translation = translationResolved;
        $state.current.breadcrumbs = [
                {
                    label: translationResolved.recap
                },
                {
                    label: translationResolved.booking
                },
                {
                    label: translationResolved.confirm
                }
            ];

        vm.backToWayonaraHome = function(){
            $state.go('home');
        };

        $log.debug('--- TourConfirmController - paymentOrder', PO_IO.paymentOrder);
        $log.debug('--- TourConfirmController - itineraryOperation', PO_IO.itineraryOperation);

        vm.paymentOrder = PO_IO.paymentOrder;
        vm.itineraryOperation = PO_IO.itineraryOperation;

        TourService.getTourById(vm.itineraryOperation.tourId).then(function(response){
            $log.debug('--- TourConfirmController - tour', response.data);
            $scope.tour = response.data; // parent scope ?
            vm.ancillaryVectors = [];

            angular.forEach(vm.paymentOrder.bookingTravel, function(bookingTravel, bookingTravelkey){
                angular.forEach(bookingTravel.nextopSearchResultTrip.outboundSegment.vectors, function(notSalableAncillary, notSalableAncillaryKey){
                    if(notSalableAncillary.isAncillary){
                        vm.ancillaryVectors.push(notSalableAncillary);
                    }
                });
                if(bookingTravel.nextopSearchResultTrip.returnSegment){
                    angular.forEach(bookingTravel.nextopSearchResultTrip.returnSegment.vectors, function(notSalableAncillary, notSalableAncillaryKey){
                        if(notSalableAncillary.isAncillary){
                            vm.ancillaryVectors.push(notSalableAncillary);
                        }
                    });
                }

            });

            $log.debug('--- TourConfirmController - vm.ancillaryVectors', vm.ancillaryVectors);
        });

        vm.goToMyBookings = function(){
            $state.go('settings.mybookings', {'userId': UserService.getUser().nid});
        }
    }
})();
