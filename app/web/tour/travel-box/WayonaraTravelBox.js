(function () {
    'use strict';

    angular.module('wayonara.tour').directive('wnTravelBoxFolder', WayonaraTravelBoxFolder);
    WayonaraTravelBoxFolder.$inject = ['$log'];

    function WayonaraTravelBoxFolder($log) {
        return {
            restrict: 'EA',
            templateUrl: 'web/tour/travel-box/travel-box-folder.html',
            scope: {
                'ngModel': '=',
                'isAreaOfOrigin': '=',
                'onDrag': '&',
                'onRelease': '&',
                'onPress': '&',
                'onDelete': '&'
            },
            replace: true,
            controller: 'TravelBoxFolderController',
            link: function (scope, element) {
                var $draggableArea = element.find('.dnd-placeholder');

                Draggable.create($draggableArea, {
                    edgeResistance: 1,
                    onPress: scope.onPressCallback,
                    onDragStart: scope.onDragStartCallback,
                    onDrag: scope.onDragCallback,
                    onDragEnd: scope.onDragEndCallback,
                    onRelease: scope.onReleaseCallback,
                    onClick: scope.onClickCallback,
                    zIndexBoost: false
                });

                element.on('mouseenter', function (event) {
                    scope.toggleActions(event);
                });
                element.on('mouseleave', function (event) {
                    scope.toggleActions(event);
                });
            }
        };
    }
})();

(function () {
    'use strict';

    angular.module('wayonara.tour').controller('TravelBoxFolderController', Controller);
    Controller.$inject = ['$scope', '$log', 'TranslationService', 'constants', 'TravelBoxService'];

    function Controller($scope, $log, TranslationService, constants, TravelBoxService) {
        $scope.translation = TranslationService.getTranslationLabels();
        $scope.actionsToggled = false;
        $scope.activeOverlay = 'default';
        $scope.shardImagePath = constants._AWS_CDN.shardImgPath;

        var shardTitleArrays = TravelBoxService.getShardTitleArrays($scope.ngModel.shardsList)

        TravelBoxService.init([$scope.ngModel]);
        $scope.placeStatistics = {
            attractions: {
                count: TravelBoxService.getCountShardAttractions(),
                list: shardTitleArrays.attractions.join(' - ')
            },
            hotels: {
                count: TravelBoxService.getCountShardHotels(),
                list: shardTitleArrays.hotels.join(' - ')
            },
            stages: {
                count: TravelBoxService.getCountShardStages(),
                list: shardTitleArrays.stages.join(' - ')
            }
        };

        $log.debug('WayonaraTravelBoxFolder - ', $scope.ngModel);

        $scope.onPressCallback = function (event) {
            $log.debug('WayonaraTravelBoxFolder.onPressCallback() - ', event, this, $scope.ngModel);
            var callbackParams = {
                'attrs': {
                    'event': event,
                    'element': this,
                    'node': $scope.ngModel
                }
            };

            var coords = {
                x: event.pageX,
                y: event.clientY
            };

            $log.debug('WayonaraTravelBoxFolder.onPressCallback() - ', coords);

            TweenLite.set(this.target, {
                position: 'fixed',
                width: '40px',
                height: '40px',
                padding: '0'
            });
            $scope.onPress(callbackParams);
        };

        $scope.onDragStartCallback = function (event) {
            $log.debug('WayonaraTravelBoxFolder.onDragStartCallback() - ', event);
            var coords = {
                x: event.pageX,
                y: event.clientY
            };

            TweenLite.set(this.target, { left: coords.x, top: coords.y, opacity: 1 });
            TweenLite.fromTo(this.target, 0.4, { scale: 1.4 }, { scale: 1 });
        };

        $scope.onDragCallback = function (event) {
            $log.debug('WayonaraTravelBoxFolder.onDragCallback() - ', event);
            var callbackParams = {
                'attrs': {
                    'event': event,
                    'element': this,
                    'node': $scope.ngModel
                }
            };

            $scope.onDrag(callbackParams);
        };

        $scope.onDragEndCallback = function (event) {

        };

        $scope.delete = function () {
            $scope.activeOverlay = 'confirm-delete';
        };

        $scope.confirmDelete = function (event) {
            $scope.activeOverlay = 'default';
            var callbackParams = {
                'attrs': {
                    'model': $scope.ngModel
                }
            };

            var $folder = angular.element('#folder' + $scope.ngModel.place.id);

            TweenLite.to($folder, 0.3, {
                scale: 0,
                onComplete: function () {
                    $folder.remove();
                }
            });

            $scope.onDelete(callbackParams);
        };

        $scope.cancelDelete = function () {
            $scope.activeOverlay = 'default';
        };

        $scope.onReleaseCallback = function (event) {
            $log.debug('WayonaraTravelBoxFolder.onReleaseCallback() - ', event);
            var callbackParams = {
                'attrs': {
                    'event': event,
                    'element': this,
                    'node': $scope.ngModel
                }
            };
            $scope.onRelease(callbackParams);
        };

        $scope.onClickCallback = function (event) {

        };

        $scope.toggleActions = function (event) {
            var $folder = $(event.currentTarget);
            var $actions = $folder.find('.actions-wrapper');
            $log.debug(event, $scope.actionsToggled);

            if (!$scope.actionsToggled) {
                TweenLite.fromTo($actions, 0.2, { x: 5, y: -5 }, { x: 0, y: 0, opacity: 1 });
            }
            else {
                TweenLite.to($actions, 0.2, { x: 5, y: -5, opacity: 0 });
            }

            $scope.actionsToggled = !$scope.actionsToggled;
        };
    }
})();

(function () {
    'use strict';

    angular.module('wayonara.tour').directive('wnTravelBox', WayonaraTravelBox);
    WayonaraTravelBox.$inject = ['$log'];

    function WayonaraTravelBox($log) {
        return {
            restrict: 'EA',
            templateUrl: 'web/tour/travel-box/travel-box.html',
            scope: {
                'ngModel': '=',
                'onFolderDelete': '&',
                'onFolderAdd': '&',
                'onFolderDrag': '&',
                'onFolderRelease': '&',
                'travelboxActiveSelection': '=',
                'activeTravelBoxPlace': '=',
                'onFileClick': '&',
                'onFileDelete': '&',
                'tourResolved': '='
            },
            controller: 'TravelBoxController',
            replace: true,
            link: function (scope, element) {
            }
        };
    }
})();

(function () {
    'use strict';

    angular.module('wayonara.tour').controller('TravelBoxController', Controller);
    Controller.$inject = ['$scope', '$log', 'ShardService', 'PlaceService', '$compile', 'TranslationService', 'TourService', 'TravelBoxService', 'UserService', '$state'];

    function Controller($scope, $log, ShardService, PlaceService, $compile, TranslationService, TourService, TravelBoxService, UserService, $state) {
        $scope.translation = TranslationService.getTranslationLabels();
        $scope.config = {
            'minCols': 3,
            'minWidth': 936
        };

        $scope.places = $scope.ngModel.travelBoxPlaces;

        var currentUser = UserService.getUser();
        $scope.hasAreaOfOrigin = false;
        if (typeof currentUser.city !== 'undefined' && currentUser.city !== null) {
            $scope.hasAreaOfOrigin = true;
            $scope.currentUserAreaOfOriginId = parseInt(currentUser.city.id, 10); // Should be a number, is not. Will be when we port everything.
        }

        $log.debug('-- TravelBoxController - $scope.tourResolved', $scope.tourResolved);
        $log.debug('-- TravelBoxController - $scope.places', $scope.places);

        $scope.tourTitleItem = {
            label: $scope.translation.travelBox.tourName,
            value: $scope.tourResolved.title
        };

        $scope.priceItem = {
            label: $scope.translation.travelBox.totalPrice,
            value: TourService.getTotalPrice($scope.tourResolved) + '€'
        };

        TravelBoxService.init($scope.places);

        $scope.statisticsItem = [
            {
                label: $scope.translation.travelBox.cities,
                value: TravelBoxService.getCountShardStages()
            },
            {
                label: $scope.translation.travelBox.transports,
                value: TourService.countQuotedVectors($scope.tourResolved)
            },
            {
                label: $scope.translation.travelBox.hotels,
                value: TravelBoxService.getCountShardHotels()
            },
            {
                label: $scope.translation.travelBox.attractions,
                value: TravelBoxService.getCountShardAttractions()
            }
        ];

        $log.debug('-- TravelBoxController - $scope.statistics', $scope.statistics);

        $scope.travelboxStates = ['travel-box-places', 'travel-box-stages', 'travel-box-stage-detail'];

        $scope.travelboxSelection = $scope.travelboxActiveSelection;

        /** Gestione Breadcrumb **/
        $scope.$on('WN_EVT_BREADCRUMB_HOME', function (event, args) {
            $scope.backToShardList(0);
        });

        $scope.$on('WN_EVT_BREADCRUMB_SUB', function (event, args) {
            //var breadcrumb = args.breadcrumbPressed.breadcrumb;
            var index = args.breadcrumbPressed.index;

            $scope.backToShardList(index + 1);
        });
        /** Gestione Breadcrumb **/

        $scope.$on('WN_EVT_SELECTED_TRAVELBOX_PLACE', function (event, args) {
            $scope.travelboxSelection = args.travelBoxPlacePressed.travelboxSelection;

            $scope.selectedPlaceStages = args.travelBoxPlacePressed.selectedTravelBoxPlace;

            $scope.fileTitleItem = {
                label: $scope.translation.city,
                value: $scope.selectedPlaceStages.place.title
            };

            var placeObjectForTravelboxService = [{
                place: $scope.selectedPlaceStages.place,
                shardsList: $scope.selectedPlaceStages.shardsList
            }]

            TravelBoxService.init(placeObjectForTravelboxService);
            $scope.fileStatisticsItem = [
                {
                    label: $scope.translation.travelBox.cities,
                    value: TravelBoxService.getCountShardStages()
                },
                {
                    label: $scope.translation.travelBox.hotels,
                    value: TravelBoxService.getCountShardHotels()
                },
                {
                    label: $scope.translation.travelBox.attractions,
                    value: TravelBoxService.getCountShardAttractions()
                }
            ];

            $scope.$apply();
        });

        $scope.$on('WN_EVT_SELECTED_TRAVELBOX_SHARD', function (event, args) {
            $scope.travelboxSelection = args.travelBoxShardPressed.travelboxSelection;
            $scope.selectedPlaceShard = args.travelBoxShardPressed.selectedPlaceShard;
            //Riprendo i dettagli della shard
            ShardService.getShardById($scope.selectedPlaceShard.id).then(
                function (response) {
                    $scope.selectedPlaceShardWithDetails = response.data;
                    $log.debug('selectedPlaceShardWithDetails', response);
                    //Appendo la direttiva
                    var $shardWrapper = angular.element('.shard-img-wrapper');
                    $shardWrapper.append('<wn-image shard=selectedPlaceShardWithDetails img-format="\'_cover_\'" err-src="../assets/img/shard-empty.png"></wn-image>');

                    var $avatarWrapper = angular.element('.deprecated.avatar-wrapper');
                    $avatarWrapper.append('<wn-image user=selectedPlaceShardWithDetails.user img-format="\'_avatar_\'" err-src="../assets/img/user_empty.png"></wn-image>');

                    $compile($shardWrapper.contents())($scope);
                    $compile($avatarWrapper.contents())($scope);
                }
            );
            //Riprendo i dati del place
            PlaceService.loadPlaceFullData($scope.selectedPlaceShard.id).then(
                function (response) {
                    $scope.selectedPlaceShardWithPlaceDetails = response.data;
                    $log.debug('selectedPlaceShardWithDetails', response);
                }
            );
            $log.debug('Inside Timeline stage selected');
            $log.debug($scope.travelboxSelection);
            $log.debug($scope.selectedPlaceShard);
            $scope.$apply();
        });

        $scope.backToShardList = function (number) {
            $scope.travelboxSelection = $scope.travelboxStates[number];
        };

        $scope.goToUserProfile = function (event) {
            event.preventDefault();
            $state.go('profileEdit');
        };

        $scope.$watch('ngModel.travelBoxPlaces', function (n, o) {
            $log.debug('TravelBoxController - ', o, n);
            $scope.places = $scope.ngModel.travelBoxPlaces;

            // necessary because updates are binded to scope watch
            TravelBoxService.init($scope.places);

            $scope.statisticsItem = [
                {
                    label: $scope.translation.travelBox.cities,
                    value: TravelBoxService.getCountShardStages()
                },
                {
                    label: $scope.translation.travelBox.transports,
                    value: TourService.countQuotedVectors($scope.tourResolved)
                },
                {
                    label: $scope.translation.travelBox.hotels,
                    value: TravelBoxService.getCountShardHotels()
                },
                {
                    label: $scope.translation.travelBox.attractions,
                    value: TravelBoxService.getCountShardAttractions()
                }
            ];
        }, true);

        /* FOLDERS */
        $scope.onFolderPressCallback = function (attrs) {
            var element = attrs.element;
            $scope.selectedPlace = {
                x: element.x,
                y: element.y
            };

            $log.debug('Node pressed:', element, $scope.selectedPlace);
        };

        $scope.onFolderDragCallback = function (attrs) {
            $scope.onFolderDrag({ attrs: attrs });
        };

        $scope.onFolderDeleteCallback = function (attrs) {
            $log.debug('TravelBoxController.onFolderDeleteCallback() -', attrs);
            $scope.onFolderDelete({ travelboxPlace: attrs.model });
        };

        $scope.onFolderAddCallback = function () {
            $scope.onFolderAdd();
        };

        $scope.onFolderReleaseCallback = function (attrs) {
            attrs.origin = $scope.selectedPlace;
            $scope.onFolderRelease({ attrs: attrs });
        };

        /* FILES */
        $scope.onFileReleaseCallback = function (attrs) {
            attrs.origin = $scope.selectedPlace;
            $scope.onFolderRelease({ attrs: attrs });
        };

        $scope.onFileClickCallback = function (attrs) {
            $log.debug('onFileClickCallback inside');
            $log.debug(attrs);
            $scope.onFileClick(attrs);
        };


        $scope.onFilePressCallback = function (attrs) {
            var element = attrs.element;
            $scope.selectedPlace = {
                x: element.x,
                y: element.y
            };

            $log.debug('Node pressed:', element, $scope.selectedPlace);
        };

        $scope.onFileDeleteCallback = function (attrs) {
            $log.debug('Inside onFileDeleteCallback, the shard to delete is: ', attrs.model);
            var shardToDelete = attrs.model;
            $scope.onFileDelete({ 'attrs': shardToDelete });
        }

    }
})();

(function () {
    'use strict';

    angular.module('wayonara.tour').directive('wnTravelBoxFile', WayonaraTravelBoxFile);
    WayonaraTravelBoxFile.$inject = ['$log'];

    function WayonaraTravelBoxFile($log) {
        $log.debug('Inside WayonaraTravelBoxFile');
        return {
            restrict: 'EA',
            templateUrl: 'web/tour/travel-box/travel-box-file.html',
            scope: {
                'ngModel': '=',
                'wnSelectedPlace': '=',
                'wnSelectedFile': '=',
                'onDrag': '&',
                'onRelease': '&',
                'onPress': '&',
                'onDelete': '&',
                'onClick': '&'
            },
            replace: true,
            controller: 'TravelBoxFileController',
            link: function (scope, element) {
                var $draggableArea = element.find('.dnd-placeholder');

                Draggable.create($draggableArea, {
                    edgeResistance: 1,
                    onPress: scope.onPressCallback,
                    onDragStart: scope.onDragStartCallback,
                    onDrag: scope.onDragCallback,
                    onDragEnd: scope.onDragEndCallback,
                    onRelease: scope.onReleaseCallback,
                    onClick: scope.onClickCallback,
                    zIndexBoost: false,
                    zIndex: 20
                });

                element.on('mouseenter', function (event) {
                    scope.toggleActions(event);
                });
                element.on('mouseleave', function (event) {
                    scope.toggleActions(event);
                });
            }
        };
    }
})();

(function () {
    'use strict';

    angular.module('wayonara.tour').controller('TravelBoxFileController', Controller);
    Controller.$inject = ['$scope', '$log', 'TranslationService'];

    function Controller($scope, $log, TranslationService) {
        $scope.translation = TranslationService.getTranslationLabels();
        $scope.actionsToggled = false;
        $scope.activeOverlay = 'default';

        $log.debug('TravelBoxFileController - ', $scope);

        $scope.$watch('ngModel.travelBoxStages', function (n, o) {
            $log.debug('TravelBoxController - $scope.$watch(\'ngModel.travelBoxStages\')', o, n);
            $scope.places = $scope.ngModel.travelBoxStages;
        }, true);

        $scope.onPressCallback = function (event) {
            $log.debug('WayonaraTravelBoxFolder.onPressCallback() - ', event, this, $scope.ngModel);
            var callbackParams = {
                'attrs': {
                    'event': event,
                    'element': this,
                    'node': $scope.ngModel
                }
            };

            var coords = {
                x: event.pageX,
                y: event.clientY
            };

            $log.debug('WayonaraTravelBoxFolder.onPressCallback() - ', coords);

            TweenLite.set(this.target, {
                position: 'fixed',
                width: '40px',
                height: '40px',
                padding: '0'
            });
            $scope.onPress(callbackParams);
        };

        $scope.onDragStartCallback = function (event) {
            $log.debug('WayonaraTravelBoxFile.onDragStartCallback() - ', event);
            var coords = {
                x: event.pageX,
                y: event.clientY
            };

            TweenLite.set(this.target, { left: coords.x, top: coords.y, opacity: 1 });
            TweenLite.fromTo(this.target, 0.4, { scale: 1.4 }, { scale: 1 });
        };

        $scope.onAddCallback = function () {
            $scope.onFileAdd();
        };

        $scope.onReleaseCallback = function (event) {
            $log.debug('WayonaraTravelBoxFolder.onReleaseCallback() - ', event);
            var callbackParams = {
                'attrs': {
                    'event': event,
                    'element': this,
                    'node': $scope.ngModel
                }
            };
            $scope.onRelease(callbackParams);
        };

        $scope.onClickCallback = function (event) {
            var json = { 'attrs': { 'shard': $scope.ngModel } };
            $log.debug('onClickCallback inside');
            $log.debug(json);
            $scope.onClick({ 'attrs': json });
        };

        $scope.delete = function () {
            $scope.activeOverlay = 'confirm-delete';
        };

        $scope.confirmDelete = function (event) {
            $scope.activeOverlay = 'default';
            var callbackParams = {
                'attrs': {
                    'model': $scope.ngModel
                }
            };

            var $fileToRemove = angular.element('#file' + $scope.ngModel.id);

            TweenLite.to($fileToRemove, 0.3, {
                scale: 0,
                onComplete: function () {
                    $fileToRemove.remove();
                }
            });

            $scope.onDelete(callbackParams);
        };

        $scope.cancelDelete = function () {
            $scope.activeOverlay = 'default';
        };

        $scope.toggleActions = function (event) {
            var $folder = $(event.currentTarget);
            var $actions = $folder.find('.actions-wrapper');
            $log.debug(event, $scope.actionsToggled);

            if (!$scope.actionsToggled) {
                TweenLite.fromTo($actions, 0.2, { x: 5, y: -5 }, { x: 0, y: 0, opacity: 1 });
            }
            else {
                TweenLite.to($actions, 0.2, { x: 5, y: -5, opacity: 0 });
            }

            $scope.actionsToggled = !$scope.actionsToggled;
        };
    }
})();
