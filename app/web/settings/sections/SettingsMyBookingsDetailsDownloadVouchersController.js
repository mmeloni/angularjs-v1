/**
 * Created by paolomastinu on 27/07/16.
 */

(function(){
    'use strict';

    angular.module('wayonara.social').controller('SettingsMyBookingsDetailsDownloadVouchersController', SettingsMyBookingsDetailsDownloadVouchersController);
    SettingsMyBookingsDetailsDownloadVouchersController.$inject = ['$scope', '$uibModalInstance','$log', 'tickets', '$state', '$stateParams', 'TranslationService'];

    /**
     *
     * @param $scope
     * @param $uibModalInstance
     * @param $log
     * @constructor
     */
    function SettingsMyBookingsDetailsDownloadVouchersController($scope, $uibModalInstance, $log, tickets, $state, $stateParams, TranslationService) {
            var translation = TranslationService.getTranslationLabels();
            $scope.translation = translation;
            $scope.title = translation.hereWeAre + "!";
            $scope.subtitle = translation.downloadYourVouchers;

        $scope.tickets = tickets;

        $scope.downloadTicket = function(downloadLink){
            window.open(downloadLink, '_blank');
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

    }

})();
