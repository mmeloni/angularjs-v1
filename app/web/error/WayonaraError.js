(function(){
	'use strict';

	angular.module('wayonara.social').directive('wnError', WayonaraError);
	WayonaraError.$inject = ['$log'];

	function WayonaraError($log){
		return {
			restrict: 'E',
			templateUrl: 'web/error/error.html',
			scope: {},
			controller: 'wnError.Ctrl',
			link: function(scope, elem){
				$log.debug("WayonaraError.link() - ", scope, elem);
				scope.init();
			}
		};
	}
})();

(function(){
	'use strict';

	angular.module('wayonara.social').controller('wnError.Ctrl', Controller);
	Controller.$inject = ['$scope', '$log', 'TranslationService', 'SessionService', '$state'];

	/**
	 *
	 * @param $scope
	 * @param $log
	 * @param {TranslationService} TranslationService
	 * @param {SessionService} SessionService
	 * @param $state
	 * @constructor
	 */
	function Controller($scope, $log, TranslationService, SessionService, $state){
		$log.debug("wnError.Ctrl - ", $scope);
		$scope.config = {
			starsCoords:[
				{top: "490px", left: "40%"},
				{top: "475px", left: "35%"},
				{top: "420px", left: "30%"},
				{top: "370px", left: "37%"},
				{top: "370px", left: "42%"},
				{top: "490px", right: "40%"},
				{top: "475px", right: "35%"},
				{top: "420px", right: "30%"},
				{top: "370px", right: "37%"},
				{top: "370px", right: "42%"}
			]
		};

		$scope.init = function(){
			//--Load translations and starts the intro animation
			TranslationService.getTranslationLabels('EN').then(function(result){
				$scope.translation = result;
			});

			/* Stars */
			var $stars = $(".star");

			//--Set the stars position
			for(var index = 0; index < $stars.length; index++){
				TweenLite.set($($stars[index]), {css: $scope.config.starsCoords[index]});
			}
		};

		$scope.goToStream = function(){
			$state.go("stream");
		};

		$scope.historyBack = function(){
			var previousState = SessionService.getPreviousState();
			$state.go(previousState.name, previousState.params);
		};
	}
})();

(function(){
	'use strict';

	angular.module('wayonara.social').controller('wnError.NavbarCtrl', Controller);
	Controller.$inject = ['$scope', '$log', '$state'];

	/**
	 *
	 * @param $scope
	 * @param $log
	 * @param $state
	 * @constructor
	 */
	function Controller($scope, $log, $state){
		$scope.backToWayonaraHome = function(){
			$log.debug("BackToWayonaraState", $state);
			if($state.current.name === "login"){
				$state.go($state.current, {}, {reload: true});
			}
			else{
				$state.go("home");
			}
		};
	}
})();
