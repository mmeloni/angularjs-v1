(function(){
    'use strict';

    angular.module('wayonara.tour').controller('TourEditorController', TourEditorController);

    TourEditorController.$inject = ['$timeout', '$scope','$log', 'UserService','TourService','tourResolved','$filter', '$compile', 'TravelBox', 'TravelBoxPlace','TimelineNode','$state', '$rootScope', 'translationResolved', 'WayonaraTutorialService', 'WayonaraTutorialHelperService', 'constants'];
    function TourEditorController($timeout, $scope, $log, UserService, TourService, tourResolved, $filter, $compile, TravelBox, TravelBoxPlace, TimelineNode, $state, $rootScope, translationResolved, WayonaraTutorialService, WayonaraTutorialHelperService, constants) {

        $scope.shards = { count: 0 };

        var currentState = $state.current.name;

        triageWayonaraTutorialStep(currentState);
        $scope.$on('$stateChangeSuccess', function(event, toState) {
            var newState = toState.name;
            $log.debug('#### $stateChangeSuccess', newState);
            triageWayonaraTutorialStep(newState);
        });

        var travelBox = new TravelBox();
        $scope.translation = translationResolved;

        //Oggetto creato con i places
        travelBox.create(tourResolved.shardsId, tourResolved.shardsRepository);
        $scope.travelBox = travelBox;

        $log.debug('TourEditorController -- TravelBox', $scope.travelBox);

        //--Remote Data
        $scope.user = UserService.getUser();
        $scope.tour = tourResolved;
        $scope.tourCover = constants._AWS_CDN.shardImgPath + '_cover_tour_' + $scope.tour.id + '.jpeg';

        //initialize tour participants: $scope con participants in NavbarTourController
        $scope.addedParticipants = $scope.tour.participants;
        //in case of a change in tour.participants we have to clean timeline quoted vectors
        $scope.$watch('addedParticipants', function(newValue, oldValue) {
            var update = false;
            if(newValue.length != oldValue.length){
                for(var i = 0; i <tourResolved.timeline.length; i++) {
                    if($scope.tour.timeline[i].model.category == 'vehicle'){
                        delete $scope.tour.timeline[i].model.resultSelected;
                        update = true;
                    }
                }
                if(update){
                    TourService.updateTour($scope.tour).then(function(){
                        // NOTE SIMO: Commented as note for mmeloni because this solution that he has implemented forces a state change but it doesn't to be correct. Accordingly to him, keep note for his future reminder
                        //$state.go('tour.edit.quote',{ index:$state.params.index },{reload:true});
                    });
                }
            }
        }, true);
        //--Timeline
        $scope.tourTimelineTree = (tourResolved.timeline!==null) ? tourResolved.timeline : [];
        $scope.selectedNode = null;

        $log.debug('--- TourEditorController - $scope.tourTimelineTree -', $scope.tourTimelineTree);

        //--Travelbox
        $scope.placesImported = $filter('filter')($scope.places, {'imported':true});
        $scope.placesNotImported = $filter('filter')($scope.places, {'imported':false});

        //Posti da visualizzare
        //$scope.placesToDisplay = $scope.placesNotImported;

        $scope.travelBoxPlaces = $scope.travelBox.travelBoxPlaces;

        //Stati per la visualizzazione della travelboxView
        $scope.travelboxStates = ['travel-box-places', 'travel-box-stages', 'travel-box-stage-detail'];

        //Stato di default all'ingresso nella pagina
        $scope.travelboxSelection = $scope.travelboxStates[0];

        $scope.notImported = function(){
            $scope.placesToDisplay = $scope.placesNotImported;
        };

        $scope.timeline = function(){
            $scope.placesToDisplay = $scope.placesImported;
        };

        $scope.clickHandler = function(node, tree){
            //--Updates travelbox
            $scope.switchTravelBoxView(node, tree);

            $scope.selectedNode = node;
        };

        $scope.removeHandler = function(node, tree){
            if(node.model.category == 'vehicle' && node.model.hasOwnProperty('resultSelected')){
                $state.go('tour.edit.plan');
            }
        };

        //Fa cambiare la vista alla selezione del place
        $scope.switchTravelBoxView = function(node, tree){
            var selectedPlaceId = node.model.id;

            $log.debug('--  TourEditorController.switchTravelBoxView - node.index', node.index);
            $log.debug('--  TourEditorController.switchTravelBoxView - node', node);
            $log.debug('--  TourEditorController.switchTravelBoxView - tree', tree);
            $log.debug('--  TourEditorController.switchTravelBoxView - selectedPlaceId', selectedPlaceId);
            $log.debug('--  TourEditorController.switchTravelBoxView - node.model', node.model);

            //se clicco su un nodo vettore, vado al quote con i parametri dei place connessi
            if(node.model.category == 'vehicle') {
                $log.debug('--  TourEditorController.switchTravelBoxView - if(node.model.category == vehicle) - GO TO EDIT QUOTE', node.index);
                $state.go('tour.edit.quote',{ index:node.index },{reload:true});
            } else{
                $scope.travelboxSelection = $scope.travelboxStates[1];
                $log.debug('--  TourEditorController.switchTravelBoxView - else(node.model.category == vehicle) - $scope.travelboxSelection', $scope.travelboxSelection);
                $scope.selectedTravelBoxPlace = $scope.travelBox.getTravelBoxPlaceByPlaceId(selectedPlaceId);
                $state.go('tour.edit.plan', { index:node.index });
                $rootScope.$broadcast('WN_EVT_SELECTED_TRAVELBOX_PLACE', { travelBoxPlacePressed: { selectedTravelBoxPlace: $scope.selectedTravelBoxPlace, travelboxSelection: $scope.travelboxSelection } });
            }
        };

        $scope.showShardDetails = function(attrs){
            $log.debug('Inside showShardDetails');
            $scope.travelboxSelection = $scope.travelboxStates[2];
            $scope.selectedShard = attrs.shard;
            $rootScope.$broadcast('WN_EVT_SELECTED_TRAVELBOX_SHARD', { 'travelBoxShardPressed': {'selectedPlaceShard':$scope.selectedShard, 'travelboxSelection':$scope.travelboxSelection} });
        };

        $scope.addPlace = function(){
            WayonaraTutorialHelperService.setAddPlaceModalOpen(true);
            var $tourShardImportWrapper = angular.element('.tour-shard-importer');
            var $importPanel = '<wn-import-shard-panel tour-model="tour" refresh-method="refresh(tour);" wn-controller="TourShardImportController"></wn-import-shard-panel>';

            $tourShardImportWrapper.append($compile($importPanel)($scope));

            TweenLite.fromTo($tourShardImportWrapper, 0.6, {top:'100%', display:'block'}, {top:0});
        };

        $scope.dragPlace = function(attrs){
            var draggable = attrs.element;
            var model = attrs.node;
            var $dropArea = angular.element('.wn-timeline');
            var $wrapper = angular.element('.wn-timeline-wrapper');

            if(draggable.hitTest($dropArea, '50%')){
                $log.debug('TourEditorController.dragPlace() - Timeline reached!', model);
                TweenLite.to($wrapper, 0.1, {css:{className:'+=drop-hit'}});
            }
            else{
                TweenLite.to($wrapper, 0.1, {css:{className:'-=drop-hit'}});
            }
        };

        $scope.releaseShard = function(attrs){
            var draggable = attrs.element;
            var model = attrs.node;
            var $dropArea = angular.element('.wn-timeline');
            var $wrapper = angular.element('.wn-timeline-wrapper');
            var inlineProps = 'position, top, left, width, height, padding';

            if(draggable.hitTest($dropArea, '50%')){
                var newTimelineNode = null;
                if(model instanceof TravelBoxPlace) {
                    newTimelineNode = {
                        id:model.place.id,
                        type:model.place.bit,
                        name: model.place.title,
                        nearestPoiId: model.shardsList[0].nearestPoiId,
                        category:'shard',
                        'children':[]
                    };

                    $scope.tourTimelineTree.push({model:newTimelineNode});

                }
                else{
                    newTimelineNode = {
                        id:model.id,
                        type:model.bit,
                        name: model.title,
                        category:'shard'
                    };

                    var shardsCollection = $scope.tourTimelineTree[$scope.selectedNode.getIndex()].shardsCollection;
                    if(typeof(shardsCollection) === 'undefined' || shardsCollection == null){
                        shardsCollection = [];
                        shardsCollection.push(model);
                    }
                    else{
                        shardsCollection.push(model);
                    }

                    $scope.tourTimelineTree[$scope.selectedNode.getIndex()].shardsCollection = shardsCollection;
                    $scope.tourTimelineTree[$scope.selectedNode.getIndex()].model.children.push({model:newTimelineNode});
                }

                $scope.$apply(function(){
                    $log.debug('TourEditorController.releasePlace() - ', $scope.tourTimelineTree, attrs);
                    $rootScope.$broadcast('WN_EVT_TIMELINE_ADD_NODE', {'node': newTimelineNode});
                });

                TweenLite.to(draggable.target, 0.5, {
                    scale: 0,
                    opacity:0,
                    onComplete: function(){
                        TweenLite.to(draggable.target, 0.5, {x: attrs.origin.x, y: attrs.origin.y, scale:1, clearProps:inlineProps});
                        TweenLite.to($wrapper, 0.1, {css:{className:'-=drop-hit'}});
                    }
                });
            }
            else{
                TweenLite.to(draggable.target, 0.5, {
                    x: attrs.origin.x,
                    y: attrs.origin.y,
                    onComplete: function(){
                        TweenLite.to(draggable.target, 0.5, {opacity:0, clearProps:inlineProps});
                    }
                });
            }
        };

        $scope.refresh = function(data){
            var travelBox = new TravelBox();
            travelBox.create(data.shardsId, data.shardsRepository);
            $scope.travelBox = travelBox;
            $scope.travelBoxPlaces = $scope.travelBox.travelBoxPlaces;
            WayonaraTutorialService.setCurrentStep(WayonaraTutorialService.triageStepByTour({ shardsId: data.shardsId }));
        };

        $scope.removePlace = function(travelboxPlace){
            $log.debug('TourEditorController.removePlace() -', travelboxPlace);
            var shardsList = travelboxPlace.getShardsList();

            if(tourResolved.shardsId != null){
                for(var i = 0; i < shardsList.length; i++){
                    var index = tourResolved.shardsId.indexOf(shardsList[i].id);

                    if (index > -1) {
                        $scope.tour.shardsId.splice(index, 1);
                    }
                }

                TourService.updateTour($scope.tour).then(
                    function(response) {
                        var travelBox = new TravelBox();
                        travelBox.create(response.data.shardsId, response.data.shardsRepository);
                        $scope.travelBox = travelBox;
                        $scope.travelBoxPlaces = $scope.travelBox.travelBoxPlaces;
                    }
                );
            }
        };

        $scope.removeStage = function(attrs){
            $log.debug('TourEditorController.removeStage() -', attrs);

            if(tourResolved.shardsId != null){
                var index = tourResolved.shardsId.indexOf(attrs.id);

                if (index > -1) {
                    $scope.tour.shardsId.splice(index, 1);
                }

                TourService.updateTour($scope.tour).then(
                    function(response) {
                        var travelBox = new TravelBox();
                        travelBox.create(response.data.shardsId, response.data.shardsRepository);
                        $scope.travelBox = travelBox;
                        $scope.travelBoxPlaces = $scope.travelBox.travelBoxPlaces;
                    }
                );
            }
        };

        $scope.autosave = function(){
            $log.debug('autosave slave: ', $scope.tourTimelineTree);
            $scope.tour.timeline = $scope.tourTimelineTree;
            TourService.updateTour($scope.tour);
        };

        function triageWayonaraTutorialStep(currentState) {
            $timeout(function () {
                var newStep;
                switch (currentState) {
                    case 'tour.edit.quote':
                        newStep = 'quoteEmpty';
                        break;
                    case 'tour.edit.plan':
                        newStep = WayonaraTutorialService.triageStepByTour(tourResolved)
                        break;
                    case 'tour.edit.selected':
                        newStep = 'done';
                        break;
                    default:
                        newStep = 'whoops';
                }
                WayonaraTutorialService.setCurrentStep(newStep);
            }, 100);
        }
    }
})();
