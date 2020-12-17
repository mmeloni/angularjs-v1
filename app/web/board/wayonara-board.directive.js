(function(){
	'use strict';

	angular.module('wayonara.social').directive('wnBoardPreview', WayonaraBoardPreview);

	WayonaraBoardPreview.$inject = ['$log'];
	function WayonaraBoardPreview($log){
		return {
			restrict: 'EA',
			templateUrl: 'web/board/preview.html',
			controller: 'BoardPreviewController',
			link: function(scope, element){

			}
		};
	}
})();
