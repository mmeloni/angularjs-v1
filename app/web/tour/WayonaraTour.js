(function(){
	'use strict';

	angular.module('wayonara.tour').directive('wnTour', WayonaraTour);
	WayonaraTour.$inject = ['$log'];

	function WayonaraTour($log){
		return {
			restrict: 'EA',
			templateUrl: 'web/tour/edit/editor.html',
			replace: true
		};
	}
})();
