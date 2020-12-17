(function(){
    'use strict';

    angular.module('wayonara.commons').directive('wnBreadcrumb', WayonaraBreadcrumb);
    WayonaraBreadcrumb.$inject = ['$log', '$animate'];

    function WayonaraBreadcrumb($log, $animate){
        return {
            restrict:'EA',
            replace: true,
            templateUrl: 'web/commons/breadcrumb/breadcrumb.html',
            scope:{
                onClick: "&",
                onHome:"&",
                navigationDisable: "=",
                wnBreadcrumbList: "="
            },
            controller: function($scope, $log, $rootScope, $state){
                $log.debug("WayonaraBreadcrumb.init(), ", $scope, $state);
                $scope.info = {};

                $scope.onClickCallback = function(breadcrumb, index){
                    $log.debug("WayonaraBreadcrumb.onClickCallback() - ", breadcrumb, index);
                    if(typeof($scope.navigationDisable) === 'undefined' || $scope.navigationDisable === null || !$scope.navigationDisable){
                        $rootScope.$broadcast("WN_EVT_BREADCRUMB_SUB", { "breadcrumbPressed": {"breadcrumb":breadcrumb, "index":index} });

                        //--We just need to cut off the exceeding breadcrumbs
                        //$scope.wnBreadcrumbList.length = index+1;
                        $scope.onClick({elem: breadcrumb});
                        $log.debug('WayonaraBreadcrumb.onClickCallback - $scope.wnBreadcrumbList', $scope.wnBreadcrumbList);
                    }
                };

                $scope.homeClick = function(event){
                    $rootScope.$broadcast("WN_EVT_BREADCRUMB_HOME");
                    //if(typeof($scope.navigationDisable) === 'undefined' || $scope.navigationDisable === null || !$scope.navigationDisable) {
                    //	$scope.wnBreadcrumbList.length = 0;
                    //}

                    $scope.info.wnBreadcrumbList = [];
                };

                //--Build the breadcrumbs
                $scope.$on('$stateChangeSuccess', function () {
                    $log.debug("WayonaraBreadcrumb - on stateChangeSuccess", $state);
                    $scope.generateBreadcrumbsFromState();
                });

                $scope.$on('WN_EVT_SELECTED_TRAVELBOX_PLACE', function (event, args) {
                    var selectedPlaceTitle = args.travelBoxPlacePressed.selectedTravelBoxPlace.place.title;

                    if($scope.info.wnBreadcrumbList === undefined) {
                        $scope.info.wnBreadcrumbList = [];
                    }

                    var selectedPlaceBreadcrumb = {
                        label: selectedPlaceTitle,
                        icon: 'place'
                    };

                    $scope.info.wnBreadcrumbList.push(selectedPlaceBreadcrumb);

                    $log.debug("WayonaraBreadcrumb.$on('WN_EVT_SELECTED_TRAVELBOX_PLACE') - selectedPlaceTitle", selectedPlaceTitle);
                    $log.debug("WayonaraBreadcrumb.$on('WN_EVT_SELECTED_TRAVELBOX_PLACE') - event, args", event, args);
                });

                $scope.generateBreadcrumbsFromState = function() {
                    $scope.info.wnBreadcrumbList = $state.$current.breadcrumbs;
                    $log.debug("WayonaraBreadcrumb.generateBreadcrumbsFromState() - ", $scope.info.wnBreadcrumbList);
                };

                //--Fallback: it allows breadcrumbs to be available on the first page load
                $scope.generateBreadcrumbsFromState();
            },
            link: function(scope, element){
                //--Define the animation timeline
                $log.debug("WayonaraBreadcrumb.link() -", scope);

                var animationTimeline = new TimelineMax();

                $animate.on('enter', element, function(target, event){
                    $log.debug("Breadcrumb animation!", target, event);

                    if(event == "start"){
                        animationTimeline
                            .from(target, 0.2, {opacity:1, left:"-50px", scale:0.8})
                            .to(target, 0.2, {left: "5px", zIndex:10, scale:1, force3D:false})
                            .to(target, 0.1, {left:0, scale:1, force3D:false});
                    }
                });

                //--Home click listener
                var $home = element.find(".home");

                $home.on('click', function(event){
                    $log.debug("WayonaraBreadcrumb.homeClick() -", event);
                    scope.homeClick(event);
                });
            }
        }
    }
})();
