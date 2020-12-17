/**
 * Created by paolomastinu on 26/04/16.
 */
(function(){
    'use strict';

    angular.module('wayonara.social').controller('TourViewCardController', TourViewCardController);

    TourViewCardController.$inject = ['$scope', 'UserService', '$log', 'TranslationService'];
    function TourViewCardController($scope, UserService, $log, TranslationService) {
        $scope.translation = TranslationService.getTranslationLabels();
        $scope.actor = UserService.getUser();

        UserService.loadUserFullData($scope.actor.nid).then(function(response){
            $scope.shards = UserService.deserialize(response);
            $log.debug('Inside TourViewCardController', $scope.shards);
        });

    }
})();
