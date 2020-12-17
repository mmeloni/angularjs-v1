/**
 * @author Paolo Mastinu, Maurizio Vacca
 */
(function() {
    'use strict';

    angular.module('wayonara.social').directive('wnImportShardPanel', TourShardImportDirective);

    TourShardImportDirective.$inject = ['$log', 'WayonaraTutorialHelperService'];
    function TourShardImportDirective($log, WayonaraTutorialHelperService) {
        return {
            restrict: 'EA',
            templateUrl: function(elem, attrs) {
                var tplUri = 'web/tour/edit/import-shard-panel/';
                if(typeof attrs.panelTpl!=='undefined'){
                    tplUri = tplUri + attrs.panelTpl + '.html';
                }
                else{
                    tplUri = tplUri + 'template.html';
                }

                return tplUri;
            },
            replace: true,
            controller: '@',
            name: 'wnController',
            scope: {
                tour: '=',
                tourModel: '=',
                refreshMethod: '&',
                attrs:'='
            },
            link: function(scope, elem) {
                /* It will be commons among every controller */
                scope.close = function () {
                    var $tourShardImportSection = $('.tour-shard-importer');

                    TweenLite.fromTo($tourShardImportSection, 0.6, {top:0}, {
                        top:'100%',
                        onComplete: function(){
                            $tourShardImportSection.empty();
                            $tourShardImportSection.hide();
                        }
                    });

                    WayonaraTutorialHelperService.setAddPlaceModalOpen(false);
                    scope.refreshMethod({tour: scope.tourModel});
                };
            }
        };
    }
}());

(function() {
    'use strict';

    angular.module('wayonara.social').controller('TourPresentation.importController', Controller);

    Controller.$inject = ['$scope', '$rootScope', '$log', 'constants', 'UserService', 'ShardService', 'TourService', 'ToastService', 'TranslationService'];
    function Controller($scope, $rootScope, $log, constants, UserService, ShardService, TourService, ToastService, TranslationService) {
        $log.debug('TourPresentation.importController - init', $scope);
        $scope.user = UserService.getUser();
        $scope.currentPage = 1;

        $scope.translation = TranslationService.getTranslationLabels();

        $scope.loadUserDiary = function () {
            $log.debug('TourPresentation.importController.loadUserDiary() - ', $scope.attrs);
            ShardService.retrieveShardsByGeoId($scope.user.nid, constants._SHARD_BIT_MASK.stage, 1, $scope.attrs.mainStage.model.id).then(
                function(response){
                    $log.debug('Getting shards from diary - response.data',response.data);
                    $scope.shards = response.data.shards;
                    angular.element($('.import-from-diary-tour-edit-view')).on('scroll.infiniteScrolling.' + $scope.$id, function() {
                        if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                            $scope.getNextPage();
                        }
                    })

                }
            );
        };

        /* Paginazione */
        $scope.$on('$destroy',function () {
            $log.debug('Destroying all listeners...');
            angular.element(window).off('scroll.infiniteScrolling.'+$scope.$id);
        });

        $scope.getNextPage = function () {
            var nextPage = $scope.currentPage + 1;
            var api = null;
            api = ShardService.retrieveShardsByGeoId($scope.user.nid, nextPage, $scope.attrs.mainStage.model.id, 40);

            api.then(function(response){
                var jsonData = response.data;
                $log.debug('Content for page ' + nextPage);
                $log.debug(jsonData);

                if(jsonData.length > 0){
                    $scope.shards = $scope.shards.concat(jsonData);
                    $scope.currentPage++;
                }
            });
        };
        /* Paginazione */

        $scope.selectSingleShard = function (shard) {
            $scope.checkedShards = [];
            $log.debug('TourPresentation.importController.singleSelection()', shard);

            $scope.checkedShards.push(shard);
            $scope.addToPresentation();
        };

        $scope.addToPresentation = function () {
            $log.debug('TourPresentation.importController.addToPresentation()', $scope.checkedShards);

            if(typeof $scope.tour.timeline[$scope.attrs.index].shardsCollection === 'undefined'){
                $scope.tour.timeline[$scope.attrs.index].shardsCollection = [];
            }

            angular.forEach($scope.checkedShards, function(shard) {
                /*
                 * Update the tour adding all the new shards
                 */
                $log.debug('TourPresentation.importController.addToPresentation()', shard, $scope.tour.timeline, $scope.attrs.index);
                $scope.tour.timeline[$scope.attrs.index].shardsCollection.push(shard);
                TourService.updateTour($scope.tour);
            });

            ToastService.raiseInfo($scope.translation.shardAddedToTour);

            $rootScope.$broadcast('WN_EVT_RENDER_GRID');
        };

        $scope.loadUserDiary();
    }
}());
