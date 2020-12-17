(function() {
	'use strict';

	angular.module('wayonara.commons').directive('wnModalWindow', WnModalWindow);

	WnModalWindow.$inject = ['$log', '$templateRequest', '$compile', '$document'];
	function WnModalWindow($log, $templateRequest, $compile, $document) {
		return {
			restrict: 'E',
			scope: {
				item:'=',
				wnModalWindowTpl: '@'
			},
			controller: '@',
			name: 'controller',
			replace: true,
			link: function(scope, element) {
				$templateRequest('web/commons/modal-window/templates/' + scope.wnModalWindowTpl + '.html').then(function (template) {
					scope.open = function($modal) {
						TweenLite.fromTo($modal, 0.4, { opacity:0, scale:1.5 }, { opacity:1, scale:1 });
					};

					scope.close = function($modal) {
						TweenLite.to($modal, 0.4, {
							opacity:0, scale:1.5,
							onComplete:function() {
								$modal.remove();
								scope.restoreAppState();
							}
						});
					};

					scope.$modal = $compile(template)(scope);
					element.replaceWith(scope.$modal);
					scope.boot();
				});
			}
		};
	}
}());
