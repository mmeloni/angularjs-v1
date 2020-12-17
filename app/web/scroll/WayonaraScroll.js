(function(){
	'use strict';

	angular.module('wayonara.social').directive('wnScroll', WayonaraScroll);
	WayonaraScroll.$inject = ['$log', '$rootScope'];

	function WayonaraScroll($log, $rootScope){
		return {
			restrict: 'A',
			scope: {
				"wnScrollUpCallback":"&",
				"wnScrollDownCallback":"&"
			},
			controller: function($scope, $log){
				$scope.currentSection = 0;
				$scope.$panels = [];
				$scope.isScrolling = false;

				$scope.$on('$destroy',function(){
					$log.debug("Destroying all listeners...");
					angular.element(window).off('mousewheel.wnScroll DOMMouseScroll.wnScroll');
				});

				/**
				 * scroll down: transform: translate3d(0px, -100%, 0px);
				 * scroll up: translate3d(0px, 0px, 0px);
				 */
				$scope.scrollTo = function(event){
					var wheelDelta = (event.originalEvent.type == 'mousewheel')
						? event.originalEvent.wheelDelta
						: -(event.originalEvent.detail);

					$log.debug("wnScroll.ctrl.scrollTo() - ", event, wheelDelta, $scope.currentSection);

					if(wheelDelta < 0){
						$scope.scrollDown();
					}
					else{
						$scope.scrollUp();
					}
				};

				$scope.scrollUp = function(){
					var args = {
						selectedSection: ""
					};

					if($scope.currentSection > 0) {
						var nextSection = $scope.currentSection-1;

						TweenLite.to($scope.$panels[$scope.currentSection], 1.2, {y:"-100%"});
						TweenLite.to($scope.$panels[$scope.currentSection], 1.2, {y:"+100%"});
						TweenLite.to($scope.$panels[nextSection], 1.2, {
							y:"0%",
							onComplete: function(){
								$scope.isScrolling = false;
								TweenMax.set($scope.$panels[$scope.currentSection], {css:{className: "+=inactive"}});
								TweenLite.set($scope.$panels[$scope.currentSection], {css:{className: "-=active"}});

								//--Updates the current section
								$scope.currentSection = nextSection;
								args.selectedSection = {
									"DOMNode": $scope.$panels[$scope.currentSection]
								};

								TweenLite.set($scope.$panels[$scope.currentSection], {css:{className: "-=inactive"}});
								TweenLite.set($scope.$panels[$scope.currentSection], {css:{className: "+=active"}});

								//--Callback
								$scope.wnScrollUpCallback(args);
								$rootScope.$broadcast("WN_EVT_SECTION_SCROLL_UP", args);
							}
						});
					}
					else {
						$scope.isScrolling = false;
					}
				};

				$scope.scrollDown = function(){
					var args = {
						selectedSection: ""
					};

					if($scope.currentSection < $scope.maxSections - 1){
						var nextSection = $scope.currentSection+1;

						TweenLite.to($scope.$panels[$scope.currentSection], 1.2, {y:"-100%"});
						TweenLite.fromTo($scope.$panels[nextSection], 1.2, {y:"+100%"}, {
							y:"0%",
							onComplete: function(){
								$scope.isScrolling = false;
								TweenMax.set($scope.$panels[$scope.currentSection], {css:{className: "+=inactive"}});
								TweenLite.set($scope.$panels[$scope.currentSection], {css:{className: "-=active"}});

								//--Updates the current section
								$scope.currentSection = nextSection;
								args.selectedSection = {
									"DOMNode": $scope.$panels[$scope.currentSection]
								};

								TweenLite.set($scope.$panels[$scope.currentSection], {css:{className: "-=inactive"}});
								TweenLite.set($scope.$panels[$scope.currentSection], {css:{className: "+=active"}});

								//--Callback
								$scope.wnScrollDownCallback(args);
								$rootScope.$broadcast("WN_EVT_SECTION_SCROLL_DOWN", args);
							}
						});
					}
					else {
						$scope.isScrolling = false;
					}
				};
			},
			link: function(scope, element){
				scope.$panels = element.find('section.scrolling-panel');
				scope.maxSections = scope.$panels.length;

				for(var i = 0; i < scope.maxSections; i++){
					var j = scope.maxSections - i;
					$(scope.$panels[i]).css({zIndex: j});
				}

				$log.debug("wnScroll.link() - ", scope, element);

				TweenMax.set(scope.$panels, {css:{className: "+=inactive"}});
				TweenLite.set(scope.$panels[scope.currentSection], {css:{className: "-=inactive"}});
				TweenLite.set(scope.$panels[scope.currentSection], {css:{className: "+=active"}});


				element.on('mousewheel.wnScroll DOMMouseScroll.wnScroll',function(event){
					event.preventDefault();
					event.stopImmediatePropagation();
					if(!scope.isScrolling) {
						scope.isScrolling = true;
						scope.scrollTo(event);
					}
				});
			}
		}
	}
})();