//VectorShardifierController CONTROLLER
(function(){
    'use strict';

    angular.module('wayonara.social').controller('VectorShardifierController', VectorShardifierController);
    VectorShardifierController.$inject = ['$scope', 'TranslationService'];

    function VectorShardifierController($scope, TranslationService) {
        $scope.translation = TranslationService.getTranslationLabels();
    }
})();
