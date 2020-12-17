/**
 * Created by paolomastinu on 21/09/16.
 */
(function(){
    'use strict';

    angular.module('wayonara.social').controller('RulesAndTariffModalController', RulesAndTariffModalController);

    RulesAndTariffModalController.$inject = ['$scope', '$uibModalInstance', '$log', '$state', '$stateParams', 'TourBookingService', 'TranslationService', 'termsAndConditions'];
    function RulesAndTariffModalController($scope, $uibModalInstance, $log, $state, $stateParams, TourBookingService, TranslationService, termsAndConditions){
        var translation = TranslationService.getTranslationLabels();
        $scope.translation = translation;
        $scope.title = translation.rulesAndTariff + "!";
        $scope.subtitle = translation.rulesAndTariffSubtitle;

        $scope.message = "Rules and conditions terms from backend";
        $scope.termsAndConditions = termsAndConditions;

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

    }
})();
