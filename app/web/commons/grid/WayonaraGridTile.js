(function(){
	'use strict';

	angular.module('wayonara.social').directive('wnTile', WayonaraTile);

	WayonaraTile.$inject = ['$log', '$compile', '$templateRequest'];
	function WayonaraTile($log, $compile, $templateRequest){
		return {
			restrict: 'E',
			template: '<div class="wn-tile"></div>',
			controller: '@',
			name: 'tileController',
			scope:{
				onAdd: '&',
				onRemove: '&',
				ngModel:'=',
				gridIdentity:'=',
				tileTmplUrl: '@',
				tileSize:'@'
			},
			require:['^ngModel'],
			replace: true,
			link: function(scope, element){
				$log.debug('WayonaraTile - link:', scope, element);
				$templateRequest(scope.tileTmplUrl).then(function(template){
					var $tileContent = angular.element(template);
					element.append($compile($tileContent)(scope));
				});
			}
		};
	}
})();
