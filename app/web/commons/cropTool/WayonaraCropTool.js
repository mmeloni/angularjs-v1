/**
 * Directive for Input. Manages input text/password/and email
 */

(function(){
    'use strict';

    angular.module('wayonara.social').directive('wnCropTool', WayonaraCropTool);
    WayonaraCropTool.$inject = ['$log'];

    function WayonaraCropTool($log) {

        var config = {
            restrict: 'EA',
            templateUrl: 'web/commons/cropTool/CropTool.html',
            replace: true,
            scope: {
                weight: '@',
                height: '@'
            },
            controller: 'CropToolController',
            link: function(scope, element){
                var $cropWrapper = element.find('#image-cropper');

                scope.croppedImage = $cropWrapper.cropit({
	                smallImage:'stretch',
	                minZoom: 'fill',
	                onImageError: function(){
		                scope.showUploadError();
	                },
	                onFileChange: function(){
		                scope.updateFile();
	                }
                });

                $('[data-open="select-image"]').click(function() {
                    $('.cropit-image-input').click();
                });
            }
        };

        return config;
    }
})();
