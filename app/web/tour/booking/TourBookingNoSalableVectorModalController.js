/**
 * Created by paolomastinu on 19/09/16.
 */
(function(){
    'use strict';

    angular.module('wayonara.social').controller('TourBookingNoSalableVectorModalController', TourBookingNoSalableVectorModalController);

    TourBookingNoSalableVectorModalController.$inject = ['$scope', '$uibModalInstance', '$log', 'timeLine', '$state', '$stateParams', 'TourBookingService', 'TranslationService', "$window"];
    function TourBookingNoSalableVectorModalController($scope, $uibModalInstance, $log, timeLine, $state, $stateParams, TourBookingService, TranslationService, $window){

        var translation = TranslationService.getTranslationLabels();
        $scope.translation = translation;
        $scope.title = translation.justForInformation + "!";
        $scope.subtitle = translation.isAccredited;
        $scope.wayonaraTipTitle = translation.wayonaraTipTitle;
        $scope.noSalableTipText = translation.noSalableTipText;

        $scope.redirectToLink = function(vendor_url){
            $window.open(vendor_url);
        };

        $scope.getNonSlableVectors = function(){
            try {
                var allVectors = TourBookingService.getAllVectorObjects(timeLine);
                $scope.notSalableVectors = allVectors;
                return allVectors;
            }
            catch(err) {
                $log.error("TourBookingErrorModalController - an error occurred:", err);
                $uibModalInstance.dismiss('cancel');
                $state.go('error');
            }
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        //--Load the errors
        $scope.getNonSlableVectors();
    }
})();
