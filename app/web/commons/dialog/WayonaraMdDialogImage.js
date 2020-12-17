(function(){
	'use strict';

	angular.module('wayonara.social')

    .directive('wnMdDialogImage', WayonaraMdDialogImage);
	WayonaraMdDialogImage.$inject = ['$log','$window'];

	/**
	 *
	 * @param $log
	 * @returns {} the directive configuration
	 * @constructor
	 */
	function WayonaraMdDialogImage($log, $window){
		var config = {
			restrict:'A',
			link: function(scope, elem, attrs, controller){

                var w = angular.element($window);
                scope.getWindowDimensions = function () {
                    return {
                        'h': w.height(),
                        'w': w.width()
                    };
                };

                var ratioCalc = function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
                    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
                    return { width: srcWidth*ratio, height: srcHeight*ratio };
                }


                var cnt = elem.closest('md-dialog');
                var resize = function () {

                    var multi = ratioCalc(elem.width(),elem.height(), cnt.width()-400, cnt.height() );

                    elem.width( multi.width);
                    elem.height(multi.height);

                };

                scope.$watch(scope.dialogOpened, function(){
                    resize();
                });
                /*scope.$watch(scope.getWindowDimensions, function () {
                    resize();
                });*/
			}
		};

		return config;
	}
})();
