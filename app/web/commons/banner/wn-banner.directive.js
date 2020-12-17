(function(){
	'use strict';

	angular.module('wayonara.social').directive('wnBanner', WayonaraBanner);
	WayonaraBanner.$inject = ['$log'];

	function WayonaraBanner($log){
		return {
			restrict: 'EA',
			replace: true,
			template: '<div ng-bind-html="label"></div>',
			scope: {
				label: "@",
				onClose: "&"
			},
			controller: function($scope, $log){
				$scope.onCloseCallback = function(event){
					$scope.onClose();
				};
			},
			link: function(scope, element){
				element.on('click', function(event){
					scope.onCloseCallback(event);
				});
			}
		};
	}
})();
