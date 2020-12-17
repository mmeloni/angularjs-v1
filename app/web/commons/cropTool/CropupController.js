(function(){
    'use strict';

    angular.module('wayonara.social').controller('CropupController', CropupController);

    CropupController.$inject = ['$scope', '$uibModalInstance','$log', 'UserService', 'loggedUser', 'TranslationService'];
    function CropupController($scope, $uibModalInstance, $log, UserService, loggedUser, TranslationService) {

        $scope.translation = TranslationService.getTranslationLabels();
        $scope.isLoading = false;

        $scope.ok = function () {
            $scope.isLoading = true;

            var croppedImg = $('#image-cropper').cropit('export', {
                type: 'image/jpeg',
                quality: .8,
                originalSize: false
            });

            UserService.uploadAvatar(croppedImg)
                .then(function(response){
                    loggedUser.avatar = response;
                    $uibModalInstance.close(response);
                    $scope.isLoading = false;
                })
                .catch(function(response){
                    $log.debug("CropController.ok() - An error occurred", response);
                    $scope.isLoading = false;
                });

        };

        $scope.cancel = function () {
            $scope.isLoading = false;
            $uibModalInstance.dismiss('cancel');
        };
    }

})();
