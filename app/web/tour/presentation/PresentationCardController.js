/**
 * PresentationCard Controller.
 *
 * @author Paolo Mastinu
 * @version 0.2
 */
(function(){
    'use strict';

    angular.module('wayonara.social').controller('PresentationCardController', PresentationCardController);

    PresentationCardController.$inject = ['$scope', '$state', '$log', 'UserService', '$rootScope', 'TranslationService', 'ShardService', 'ModalService'];
    function PresentationCardController($scope, $state, $log, UserService, $rootScope, TranslationService, ShardService, ModalService) {
        $scope.translation = TranslationService.getTranslationLabels();

        $scope.shard = $scope.ngModel;

        $scope.ownerHover = false;
        $scope.viewer = UserService.getUser();
        $scope.imgFormat = "_single_shard_";

        $scope.showDetails = function(){
            $rootScope.$broadcast('WN_EVT_PAGELOADING');
            ShardService.getShardById($scope.shard.id)
                .then(function(response) {
                    $rootScope.$broadcast('WN_EVT_PAGELOADED');
                    ModalService.openShardDetail(response.data, $scope.viewer);
                })
                .catch(function() {
                    $rootScope.$broadcast('WN_EVT_PAGELOADED');
                });
        };

        $scope.checkShard = function($event, shard){
            var checkedElement = angular.element($event.currentTarget);
            $(checkedElement).toggleClass( "shard-checked");

            $rootScope.$broadcast("wn_evt_checkedShardTourView", {checkedShard : {position:$scope.gridIdentity, shard:shard}});
        };

    }
})();
