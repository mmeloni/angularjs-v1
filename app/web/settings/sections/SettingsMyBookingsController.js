/**
 * Created by paolomastinu on 30/06/16.
 */

(function() {
    'use strict';

    angular.module('wayonara.social').controller('SettingsMyBookingsController', SettingsMyBookingsController);

    SettingsMyBookingsController.$inject = ['$scope', '$state', '$log', 'UserService', 'TourBookingService', '$rootScope', 'constants'];
    function SettingsMyBookingsController($scope, $state, $log, UserService, TourBookingService, $rootScope, constants) {

        $scope.connectedUser = UserService.getUser();
        $scope.page = 1;
        $scope.myBookings = [];
        $scope.coverFormat = 'coverTour';

        $rootScope.$broadcast('WN_EVT_MYBOOKING_ACTIVE_MENU', { activeMenu: 'myBookings' });

        TourBookingService.retrieveBookingsPreviewByUser($scope.page, $scope.connectedUser)
            .then(function(response) {
                $log.debug('Inside MyBookingsController: ', response.data);
                $scope.myBookings = response.data;
                for (var key in $scope.myBookings) {
                    $scope.myBookings[key].tourVectors = createTourVectors($scope.myBookings[key].infoAllVectorsList);
                }
            })
            .catch(function(response) {
                $log.debug('error api retrieve retrieveBookingsPreviewByUser', response);
            });

        $scope.retrieveBookingsByPage = function(page) {
            TourBookingService.retrieveBookingsByUser(page, $scope.connectedUser)
                .then(function(response) {
                    $log.debug('Inside MyBookingsController: ', response.data);
                    $scope.myBookings = response.data;
                })
                .catch(function(response ){
                    $log.debug('error api retrieve booking form', response);
                });
        };

        $scope.goToTour = function(tourId){
            $state.go('tour.view', { tourId: tourId });
        }

        $scope.viewBookingDetails = function(myBooking) {
            $state.go('settings.mybookingDetails', { fullBookingPreviewId: myBooking.id });
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
    }
}());
