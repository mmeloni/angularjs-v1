(function(){
    'use strict';

    angular.module('wayonara.social').controller('CropToolController', CropToolController);
    CropToolController.$inject = ['$scope', 'TranslationService'];

    function CropToolController($scope, TranslationService) {
        $scope.file = null;

        $scope.translation = TranslationService.getTranslationLabels();

        $scope.showUploadError = function(){
            $scope.uploadError = true;
	        $scope.$apply();
        };

        $scope.updateFile = function(){
            $scope.uploadError = false;
	        $scope.$apply();
        };
    }
})();
