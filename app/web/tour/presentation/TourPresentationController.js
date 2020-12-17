(function(){
    'use strict';

    angular.module('wayonara.social').controller('TourPresentationController', Controller);

    Controller.$inject = ['$scope', '$rootScope', '$log', 'tourResolved', 'ToastService','TourService','$state','$compile','$mdDialog', 'translationResolved', 'constants', 'ModalService'];
    function Controller($scope, $rootScope, $log, tourResolved, ToastService, TourService, $state, $compile, $mdDialog, translationResolved, constants, ModalService){

        $scope.translation = translationResolved;

        $scope.checkedShards = {};
        $scope.totalCheckedShards = 0;
        $scope.tour = tourResolved;
        $scope.tourCover = constants._AWS_CDN.shardImgPath + '_cover_tour_' + $scope.tour.id + '.jpeg';

        $log.debug('TourPresentationController - init...', $scope);

        //Movimento timeline
        $scope.$on('$destroy', function(){
            angular.element(window).off('scroll.fixedTimeline' + $scope.$id);
        });

        /* listeners */
        var timelineTopOffset = 0;
        var timelineHeight = 0;

        /* Anchor the timeline to the navbar */
        angular.element(window).on('scroll.fixedTimeline' + $scope.$id, function(){
            var topScrolling = $(this).scrollTop();
            var $timelineSection = $('#tourTimelineSection');

            timelineTopOffset = (timelineTopOffset > 0) ? timelineTopOffset : $timelineSection.offset().top;
            timelineHeight = (timelineHeight > 0) ? timelineHeight : $timelineSection.height();

            if(topScrolling >= (timelineTopOffset + timelineHeight - 99)){
                if(!$timelineSection.hasClass('fixed')){
                    $scope.animateTimeline(true);
                }
            }
            else{
                if($timelineSection.hasClass('fixed')){
                    $scope.animateTimeline(false);
                }
            }
        });

        $scope.$on('wn_evt_checkedShardTourView', function(event, args){
            var checkedShardObject = args.checkedShard;
            //Controllo se lo shard c'è già lo inserisco altrimenti lo tolgo
            var indexOfShard = $scope.checkedShards[checkedShardObject.position].indexOf(checkedShardObject.shard);
            if(indexOfShard == -1){
                $scope.checkedShards[checkedShardObject.position].push(checkedShardObject.shard);
                $scope.totalCheckedShards += 1;
            }
            else{
                $scope.checkedShards[checkedShardObject.position].splice(indexOfShard, 1);
                $scope.totalCheckedShards -= 1;
            }

            $log.debug('checkedShards', $scope.checkedShards);
        });

        $scope.animateTimeline = function(active){
            var $timelineSection = $('#tourTimelineSection');

            if(active){
                $timelineSection.addClass('fixed');
            }
            else {
                $timelineSection.removeClass('fixed');
            }
        };

        $scope.clickHandler = function(node, tree){
            var anchorId = '#tourViewSection-' + node.index;
            $('html, body').animate({
                scrollTop: $(anchorId).offset().top
            }, 1000);
        };

        $scope.openMultiUploadModal = function(mainStage, timelineTreeIndex) {
            $scope.resetCheckedShards();
            $scope.placeId = mainStage.model.id;
            $scope.nearestPoiId = mainStage.model.nearestPoiId;
            $scope.placeName = mainStage.model.name;

            if (mainStage.shardsCollection === undefined) {
                mainStage.shardsCollection = [];
            }

            ModalService.openShardNewMultiple(mainStage, $scope.tour, timelineTreeIndex);
        }

        $scope.showImportPanel = function(mainStage, index){
            $scope.resetCheckedShards();
            if(!mainStage.shardsCollection){
                mainStage.shardsCollection = []
            }
            $scope.importAttrs = {mainStage: mainStage, index:index};
            var $tourShardImportWrapper = angular.element('.tour-shard-importer');
            var $importPanel = '<wn-import-shard-panel tour="tour" tour-model="tour" wn-controller="TourPresentation.importController" panel-tpl="presentation-import-panel" attrs="importAttrs"></wn-import-shard-panel>';

            $tourShardImportWrapper.append($compile($importPanel)($scope));

            TweenLite.fromTo($tourShardImportWrapper, 0.6, {top:'100%', display:'block'}, {top:0});
        };

        $scope.resetCheckedShards = function(){
            $scope.totalCheckedShards = 0;
            var $checks = angular.element('.checkbox-container');
            $checks.removeClass('shard-checked');
            for(var k = 0; k < $scope.tour.timeline.length; k++){
                $scope.checkedShards[k] = [];
            }
        };

        $scope.removeShards = function(){
            for (var key in $scope.checkedShards) {
                for(var i = 0; i < $scope.checkedShards[key].length; i++){
                    var shardIndexOnShardCollection = $scope.tour.timeline[key].shardsCollection.indexOf($scope.checkedShards[key][i]);
                    if(shardIndexOnShardCollection != -1){
                        $scope.tour.timeline[key].shardsCollection.splice(shardIndexOnShardCollection, 1);
                    }
                }
            }

            $rootScope.$broadcast('WN_EVT_RENDER_GRID');

            //Aggiorno il tour
            TourService.updateTour($scope.tour).then(
                function(response) {
                    $log.debug('Tour title modified');
                    ToastService.raiseInfo(translationResolved.shardRemovedFromTourView);
                    //Svuoto gli array della cancellazione
                    $scope.totalCheckedShards = 0;

                    //Costruisco l'oggetto checked shards
                    for(var k = 0; k < $scope.tour.timeline.length; k++){
                        $scope.checkedShards[k] = [];
                    }
                    //Svuoto gli array della cancellazione
                }
            );
        };

        /* Init the chedked shards */
        $scope.resetCheckedShards();
    }
})();
