/**
 * Navbar Controller.
 *
 * @author Paolo Mastinu
 */
(function() {
    'use strict';

    angular.module('wayonara.social').controller('NavbarTourController', NavbarTourController);

    NavbarTourController.$inject = ['$scope', '$state', '$log', 'DialogService', 'TourService', '$rootScope', '$uibModal', 'TourBookingService', 'TranslationService', 'constants', '_'];
    function NavbarTourController($scope, $state, $log, DialogService, TourService, $rootScope, $uibModal, TourBookingService, TranslationService, constants, _) {
        $log.debug('NavbarTourController - ', $scope, $state);

        $scope.translation = TranslationService.getTranslationLabels();

        $scope.$on('WN_EVT_BREADCRUMB_HOME', function() {
            $state.go('tour.edit.plan', { tourId: $scope.tourModel.id });
        });

        $scope.$on('WN_EVT_BREADCRUMB_SUB', function(event, args) {
            var breadcrumb = args.breadcrumbPressed.breadcrumb;
            $scope.changeOnBreadcrumbClick(breadcrumb);
        });

        $scope.showAddParticipantsDialog = function(event) {
            $log.debug('launching dialog...');

            var options = {
                animation: $scope.animationsEnabled,
                controller: 'AddParticipantsModalController',
                templateUrl: 'web/tour/edit/wn-add-participants-modal.html',
                parent: angular.element(document.querySelector('document.body')),
                targetEvent: event,
                clickOutsideToClose: false,
                preserveScope: true,
                scope: $scope
            };

            DialogService.show(options);
        };

        $scope.closeUiUpload = function() {
            DialogService.cancel();
        };

        //Book Now function
        $scope.bookNowIsDisabled = isBookButtonDisabledByTimeline($scope.tourModel.timeline);

        $scope.book = function() {
            $scope.bookNowIsDisabled = true;

            //Controllo prima che non ci siano vettori non quotati
            var unquotedVehicleNodes = TourBookingService.getUnquotedTimelineNodes($scope.tourModel);
            var quotedVehicleNodes = TourBookingService.getQuotedTimelineNodes($scope.tourModel);

            $log.debug('unquotedVehicleNodes', unquotedVehicleNodes , 'quotedVehicleNodes ', quotedVehicleNodes);

            if ((typeof unquotedVehicleNodes !== 'undefined' && unquotedVehicleNodes.length > 0) && (typeof quotedVehicleNodes !== 'undefined' && quotedVehicleNodes.length === 0)) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'web/tour/booking/booking-notquoted-modal.html',
                    controller: 'TourBookingNotQuotedModalController',
                    size: 'lg',
                    windowTopClass: 'booking-error-modal-dialog-top-class',
                    resolve: {
                        unquotedVehicleNodes: function() {
                            return unquotedVehicleNodes;
                        },
                        timeLine: function() {
                            return $scope.tourModel.timeline;
                        }
                    }
                });
            } else {
                /** Chiamo l'api solo se tutti i vettori sono stati quotati **/
                var api = TourBookingService.bookAll($scope.tourModel);
                $rootScope.$broadcast('WN_EVT_PAGELOADING');

                api.then(
                    function(response) {
                        $rootScope.$broadcast('WN_EVT_PAGELOADED');
                        $state.go('tour.booking.recap', { paymentOrder: response.paymentOrder, itineraryOperation: response.itineraryOperation });
                    },
                    function(error) {
                        $rootScope.$broadcast('WN_EVT_PAGELOADED');

                        var jsonError = angular.fromJson(error.message);

                        switch(jsonError[0].code) {
                            case 3:
                                var modalInstance = $uibModal.open({
                                    animation: $scope.animationsEnabled,
                                    templateUrl: 'web/tour/booking/booking-no-salable-vectors.html',
                                    controller: 'TourBookingNoSalableVectorModalController',
                                    size: 'lg',
                                    windowTopClass: 'booking-error-modal-dialog-top-class',
                                    resolve: {
                                        timeLine: function() {
                                            return $scope.tourModel.timeline;
                                        }
                                    }
                                });
                                break;
                            case 4:
                                var modalInstance = $uibModal.open({
                                    animation: $scope.animationsEnabled,
                                    templateUrl: 'web/tour/booking/booking-max-itinerary-operation.html',
                                    controller: function($scope, TranslationService, $uibModalInstance){
                                        $scope.translation = TranslationService.getTranslationLabels();
                                        $scope.cancel = function() {
                                            $uibModalInstance.dismiss('cancel');
                                        };
                                    },
                                    size: 'lg',
                                    windowTopClass: 'booking-error-modal-dialog-top-class',
                                    resolve: {
                                        timeLine: function() {
                                            return $scope.tourModel.timeline;
                                        }
                                    }
                                });
                                break;
                            default:
                                var modalInstance = $uibModal.open({
                                    animation: $scope.animationsEnabled,
                                    templateUrl: 'web/tour/booking/booking-error-modal.html',
                                    controller: 'TourBookingErrorModalController',
                                    size: 'lg',
                                    windowTopClass: 'booking-error-modal-dialog-top-class',
                                    resolve: {
                                        timeLine: function() {
                                            return $scope.tourModel.timeline;
                                        },
                                        bookingQuoteErrorsAPIResult: function() {
                                            return error;
                                        }
                                    }
                                });
                                break;
                        }

                    }
                );
            }

        };

        $scope.goToTourPreview = function() {
            $state.go('tour.edit-presentation', { tourId: $scope.tourModel.id });
        };

        $scope.backToWayonaraHome = function() {
            $state.go('home');
        };

        $scope.changeOnBreadcrumbClick = function(breadcrumb) {
            switch(breadcrumb.label) {
                case 'Recap':
                    $state.go('tour.booking.recap', { tourId: $scope.tourModel.id });
                    break;
                case 'Booking':
                    $state.go('tour.booking.form', { tourId: $scope.tourModel.id });
                    break;
                case 'Confirm':
                    $state.go('tour.booking.confirm', { tourId: $scope.tourModel.id });
                    break;
                default:
                    break;
            }
        }

        $scope.$on('WN_EVT_TIMELINE_UPDATED', function(event, data) {
            if (data !== undefined && data.nodes !== undefined) {
                $scope.bookNowIsDisabled = isBookButtonDisabledByTimeline(data.nodes);
            }
        });

        function isBookButtonDisabledByTimeline(timeline) {
            // When in timeline there's at least 1 element whith category "vehicle" and "resultSelected" !== undefined, the button is disabled
            var quotedVehicleNodes = _.chain(timeline)
                                      .filter(function(node) {
                                          return node.model !== undefined && node.model.category !== undefined && node.model.category === 'vehicle'
                                      })
                                      .map('model')
                                      .find('resultSelected')
                                      .value();
            return quotedVehicleNodes === undefined;
        }
    }
}());
