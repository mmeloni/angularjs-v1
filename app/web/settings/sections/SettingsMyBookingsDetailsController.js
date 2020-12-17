/**
 * Created by paolomastinu on 04/07/16.
 */

(function() {
    'use strict';

    angular.module('wayonara.social').controller('SettingsMyBookingsDetailsController', SettingsMyBookingsDetailsController);

    SettingsMyBookingsDetailsController.$inject = [
        '$scope',
        '$state',
        '$log',
        'userResolved',
        'bookingDetails',
        '$rootScope',
        '$uibModal',
        'myBooking',
        'constants',
        'TourBookingService'
    ];
    function SettingsMyBookingsDetailsController(
        $scope,
        $state,
        $log,
        userResolved,
        bookingDetails,
        $rootScope,
        $uibModal,
        myBooking,
        constants,
        TourBookingService
    ) {

        $scope.Math = window.Math;
        $scope.bookingDetails = bookingDetails;
        $scope.paymentOrder = bookingDetails.paymentOrder;
        $scope.tour = bookingDetails.tour;
        $scope.fullBookingPreview = bookingDetails.fullBookingPreview;
        $scope.fullBookingPreview.tourVectors = createTourVectors($scope.fullBookingPreview.infoAllVectorsList);
        $scope.bookingTravels = $scope.paymentOrder.bookingTravel;

        $scope.myBooking = myBooking;

        $scope.departureDate = $scope.paymentOrder.bookingTravel[0].nextopSearchResultTrip.outboundSegment.vectors[0].departureDate;

        $rootScope.$broadcast('WN_EVT_MYBOOKING_ACTIVE_MENU', { activeMenu: 'myBookings' });

        $scope.downloadYourVouchers = function(ticketData) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'web/settings/sections/blocks/vouchers-download-modal.html',
                controller: 'SettingsMyBookingsDetailsDownloadVouchersController',
                size: 'lg',
                windowTopClass: 'booking-error-modal-dialog-top-class',
                resolve: {
                    tickets: function () {
                        return ticketData;
                    },
                }
            });

        }

        $scope.goToTour = function(tourId) {
            $state.go('tour.view', { tourId: tourId });
        }

        $scope.backToMyBookings = function() {
            $state.go('settings.mybookings', { userId: userResolved.nid });
        }

        function createTourVectors(infoAllVectorsList) {
            var tourVectors = [];

            for (var key in infoAllVectorsList) {
                var tourVector = { name: getVectorName(key), number: infoAllVectorsList[key] };
                tourVectors.push(tourVector);
            }

            return tourVectors;
        }

        function getVectorName(vectorInt) {
            switch (parseInt(vectorInt)) {
                case constants._VECTORS_BIT_MASK.flight:
                    return 'flight';
                    break;
                case constants._VECTORS_BIT_MASK.train:
                    return 'train';
                    break;
                case constants._VECTORS_BIT_MASK.bus:
                    return 'bus';
                    break;
                case constants._VECTORS_BIT_MASK.ferry:
                    return 'ferry';
                    break;
                case constants._VECTORS_BIT_MASK.taxi:
                    return 'taxi';
                    break;
                case constants._VECTORS_BIT_MASK.subway:
                    return 'subway';
                    break;
                case constants._VECTORS_BIT_MASK.walk:
                    return 'walk';
                    break;
                case constants._VECTORS_BIT_MASK.car:
                    return 'car';
                    break;
                case constants._VECTORS_BIT_MASK.raidshare:
                    return 'car sharing';
                    break;
                case constants._VECTORS_BIT_MASK.ancillary:
                    return 'ancillary';
                    break;
                case constants._VECTORS_BIT_MASK.highspeedtrain:
                    return 'train';
                    break;
                case constants._VECTORS_BIT_MASK.ncc:
                    return 'ncc';
                    break;
                case constants._VECTORS_BIT_MASK.transit:
                    return 'transit';
                    break;
                case constants._VECTORS_BIT_MASK.ancillarystore:
                    return 'ancillary store';
                    break;
                default:
                    return 'walk';
                    break;
            }
        }

        var termsAndConditionsObject = null;

        $scope.openRulesAndTariffModal = function(bookingGroupChunk) {
            return TourBookingService.buildRulesAndTariffModalData(bookingGroupChunk);
        }
    }
}());
