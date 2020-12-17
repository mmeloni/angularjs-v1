(function() {
    'use strict';
    angular.module('wayonara.social').controller('NavbarTourPresentationController', NavbarTourPresentationController);

    NavbarTourPresentationController.$inject = ['$scope', '$state', '$log', 'TranslationService', 'TourService', 'ToastService', 'constants', 'UserService'];
    function NavbarTourPresentationController($scope, $state, $log, TranslationService, TourService, ToastService, constants, UserService) {
        $scope.toggle = false;
        $scope.$toggleText = 'Hide';
        $scope.showPublish = false;

        var translation = TranslationService.getTranslationLabels();
        $scope.translation = translation;

        $scope.save = function() {
            //$state.go('profile.view.tours', { userId: UserService.getUser().nid });

            const user = UserService.getUser();

            $state.go('profileByView', {
                userNid: user.nid,
                viewType: 'tours'
            });
        };

        $scope.backToWayonaraHome = function() {
            $state.go('home');
        };

        /** Controllo se l'utente connesso ha i permessi per pubblicare il tour **/
        $scope.showPublish = function() {
            return ($scope.tourModel.bitMaskPermission === 128);
        };

        $scope.goToTourEditPlan = function() {
            $state.go('tour.edit.plan', { tourId: $scope.tourModel.id });
        }

        $scope.publish = function() {
            $log.debug($scope.tourModel);
            //set tour in publish for update tout in same session
            $scope.tourModel.status = 2;
            TourService.publishTour($scope.tourModel).then(
                function() {
                    $log.debug('Tour published: ');
                    $log.debug($scope.tourModel);
                    ToastService.raiseInfo(translation.tourPublished);
                }
            );
        };
    }
}());
