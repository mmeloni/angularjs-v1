/**
 * Created by paolomastinu on 23/06/16.
 */

(function(){
    'use strict';

    angular.module('wayonara.social').controller('TourBookingNotQuotedModalController', TourBookingNotQuotedModalController);
    TourBookingNotQuotedModalController.$inject = ['$scope', '$uibModalInstance','$log','unquotedVehicleNodes', 'timeLine', '$state', '$stateParams', 'TranslationService'];

    /**
     *
     * @param $scope
     * @param $uibModalInstance
     * @param $log
     * @param {UserService} UserService
     * @param {User} loggedUser
     * @constructor
     */
    function TourBookingNotQuotedModalController($scope, $uibModalInstance, $log, unquotedVehicleNodes, timeLine, $state, $stateParams, TranslationService) {
        var translation = TranslationService.getTranslationLabels();
        $scope.translation = translation;
        $scope.title = translation.weAreSorry + "!";
        $scope.subtitle = translation.transportsNotQuoted;

        $scope.unquotedVehicleNodes = unquotedVehicleNodes;
        $scope.timeline = timeLine;

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.quoteTravel = function(timelineIndex){
            //Se devo modificare le date del vettore che sto visualizzando chiudo semplicemente il modal altrimenti cambio pagina
            $state.go('tour.edit.quote',{'index': parseInt(timelineIndex)});
            $scope.cancel();
        }

    }

})();
