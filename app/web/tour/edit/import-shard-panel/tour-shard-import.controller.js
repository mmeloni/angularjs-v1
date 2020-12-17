/**
 * Created by paolomastinu on 24/02/16.
 * refactor by Simone Pitzianti
 */
(function () {
    'use strict';

    angular.module('wayonara.social').controller('TourShardImportController', TourShardImportController);

    TourShardImportController.$inject = [
        '$scope',
        '$log',
        'ShardService',
        'TranslationService',
        'SessionService',
        'UserService',
        '$filter',
        'TourService',
        'ToastService',
        'WayonaraTutorialService',
        'constants'
    ];

    function TourShardImportController(
        $scope,
        $log,
        ShardService,
        TranslationService,
        SessionService,
        UserService,
        $filter,
        TourService,
        ToastService,
        WayonaraTutorialService,
        constants
    ) {
        $scope.user = UserService.getUser();

        $scope.toAddShards = [];
        $scope.toAddShardsSelected = 0;
        $scope.cmdOrCtrl = false;
        $scope.searchTags = [];
        $scope.shardImagePath = constants._AWS_CDN.shardImgPath;
        $scope.activatePagination = true;
        $scope.nextPage = null;
        $scope.addingShard = false;

        // default: none selected
        $scope.selected = 'diary';
        $scope.shards = TourService.getUserTourShards($scope.user.nid, constants._SHARD_BIT_MASK.stage, 1, null, null).then(
            function (response) {
                $log.debug('-- TourService - fromDiaries $scope.shards', $scope.shards);
                $scope.shards = response.data.shards;
            }
        );

        $scope.translation = TranslationService.getTranslationLabels();

        WayonaraTutorialService.setCurrentStep('planIt');

        //Check for cmd pressed
        $(document).on('keydown', function (e) {
            if (e.ctrlKey || e.metaKey) {
                $scope.cmdOrCtrl = true;
                $('#bottomBarPlan').show();
            }
        });

        $(document).on('keyup', function (e) {
            if (e.keyCode == 91 || e.keyCode == 17) {
                $scope.cmdOrCtrl = false;
                if ($scope.toAddShards.length <= 0) {
                    $('#bottomBarPlan').hide();
                }
            }
        });

        //from Wayonara
        $scope.fromWayonara = function () {
            $scope.currentPage = 1;
            $log.debug('-- TourService - fromWayonara');

            TourService.getUserTourShards(null, constants._SHARD_BIT_MASK.stage, 1, null, $scope.needle).then(
                function (response) {
                    $log.debug('-- TourService - fromWayonara $scope.shards', $scope.shards);
                    $scope.shards = response.data.shards;
                }
            );

            $scope.selected = 'wayonara';
        };

        //from diaries
        $scope.fromDiaries = function () {
            $log.debug('-- TourService - fromDiaries');

            TourService.getUserTourShards($scope.user.nid, constants._SHARD_BIT_MASK.stage, 1, null, null).then(
                function (response) {
                    $log.debug('-- TourService - fromDiaries $scope.shards', $scope.shards);
                    $scope.shards = response.data.shards;
                }
            );

            $scope.selected = 'diary';
        };


        $scope.doSearchFromDiary = function () {
            if ($scope.searchTags.length > 0) {
                $scope.needle = '';
                for (var index = 0; index < $scope.searchTags.length; index++) {
                    var tag = $scope.searchTags[index];
                    $scope.needle += (tag.hasOwnProperty('neo4jId'))
                        ? tag.neo4jId
                        : tag.label;

                    if (index < $scope.searchTags.length - 1) {
                        $scope.needle += '&';
                    }
                }

                $log.debug('Search string: ' + $scope.needle);

                TourService.getUserTourShards($scope.user.nid, constants._SHARD_BIT_MASK.stage, 1, null, $scope.needle).then(
                    function (response) {
                        $log.debug('-- TourService - doSearchFromDiary - $scope.searchTags.length > 0 - response.data', response.data);
                        $scope.shards = response.data.shards;
                    }
                );
            }
            else {
                TourService.getUserTourShards($scope.user.nid, constants._SHARD_BIT_MASK.stage, 1, null, $scope.needle).then(
                    function (response) {
                        $log.debug('-- TourService - doSearchFromDiary - $scope.searchTags.length <= 0 - response.data', response.data);
                        $scope.shards = response.data.shards;
                    }
                );
            }
        };

        $scope.doSearchFromWayonara = function () {
            if ($scope.searchTags.length > 0) {
                $scope.needle = '';
                for (var index = 0; index < $scope.searchTags.length; index++) {
                    var tag = $scope.searchTags[index];
                    $scope.needle += (tag.hasOwnProperty('neo4jId'))
                        ? tag.neo4jId
                        : tag.label;

                    if (index < $scope.searchTags.length - 1) {
                        $scope.needle += '&';
                    }

                }

                $log.debug('Search string needle: ' + $scope.needle);
                $log.debug('Search tags: ' + $scope.searchTags);

                TourService.getUserTourShards(null, constants._SHARD_BIT_MASK.stage, 1, null, $scope.needle).then(
                    function (response) {
                        $scope.shards = response.data.shards;
                        $log.debug('-- TourService - doSearchFromWayonara - $scope.searchTags.length > 0 - response.data', response.data);
                        $log.debug($scope.shards);
                    }
                );
            }
            else {
                TourService.getUserTourShards($scope.user.nid, constants._SHARD_BIT_MASK.stage, 1, null, $scope.needle).then(
                    function (response) {
                        $log.debug(response.data);
                        $scope.shards = response.data.shards;
                        $log.debug('-- TourService - doSearchFromWayonara - $scope.searchTags.length <= 0', response.data);
                        $log.debug($scope.shards);
                    }
                );
            }
        };

        $scope.getNextPage = function () {
            var nextPage = $scope.currentPage + 1;
            if ($scope.nextPage != nextPage) {
                switch ($scope.selected) {
                    case 'wayonara':
                        TourService.getUserTourShards($scope.user.nid, constants._SHARD_BIT_MASK.stage, 1, null, $scope.needle).then(
                            function (response) {
                                $log.debug('Getting shards from diary - response.data', response.data);
                                $log.debug('Getting shards from diary');
                                $scope.shards = response.data.shards;
                            }
                        );
                        break;
                    case 'diary':
                        TourService.getUserTourShards($scope.user.nid, constants._SHARD_BIT_MASK.stage, 1, null, $scope.needle).then(
                            function (response) {
                                $log.debug(response.data);
                                $scope.shards = response.data.shards;
                                $log.debug('Getting all shards from wayonara');
                                $log.debug($scope.shards);
                            }
                        );
                        break;
                }
                $scope.nextPage = nextPage;
            }
        };

        $scope.poiFilter = function () {
            $scope.shards = $filter('filter')($scope.shardsAll, { 'type': 'POI' });
        };

        $scope.hotelFilter = function () {
            $scope.shards = $filter('filter')($scope.shardsAll, { 'type': 'HOTEL' });
        };

        $scope.toggleCmdPanel = function (event, shard) {
            var $panel = $(event.currentTarget).find('.import-shard-panel-wall-shard-front-selected');

            if (event.ctrlKey || event.metaKey) {
                if ($.inArray(shard, $scope.toAddShards) >= 0) {
                    $scope.toAddShards.splice($.inArray(shard, $scope.toAddShards), 1);
                    $panel.hide();
                    $scope.toAddShardsSelected = $scope.toAddShardsSelected - 1;
                }
                else {
                    $panel.show();
                    $scope.toAddShards.push(shard);
                    $scope.toAddShardsSelected = $scope.toAddShardsSelected + 1;
                }
            }

            if ($scope.toAddShards.length > 0) {
                $('#bottomBarPlan').show();
            }
            else {
                $('#bottomBarPlan').hide();
            }
        };

        $scope.planSingleShard = function (shard) {
            if ($scope.tourModel.shardsId == null) {
                $scope.tourModel.shardsId = [];
            }
            if ($.inArray(shard.id, $scope.tourModel.shardsId) !== -1) {
                ToastService.raiseInfo($scope.translation.placeAlreadyAdded);
            }
            else {
                $scope.addingShard = true;
                $scope.tourModel.shardsId.push(shard.id);

                TourService.updateTour($scope.tourModel).then(
                    function (response) {
                        $log.debug(response);

                        ToastService.raiseInfo($scope.translation.shardAddedToTour);

                        $scope.tourModel = [];
                        $scope.tourModel = response.data;
                        $scope.addingShard = false;
                    },
                    function (evt) {
                        $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    }
                );
            }
        };

        $scope.planAll = function () {
            if ($scope.tourModel.shardsId == null) {
                $scope.tourModel.shardsId = [];
            }

            for (var i = 0; i < $scope.toAddShards.length; i++) {
                if ($.inArray($scope.toAddShards[i].id, $scope.tourModel.shardsId) === -1) {
                    $scope.tourModel.shardsId.push($scope.toAddShards[i].id);
                }
            }
            $scope.addingShard = true;
            TourService.updateTour($scope.tourModel).then(
                function (response) {
                    $log.debug('Multiple shards added to tour');
                    $log.debug(response);
                    $('#bottomBarPlan').hide();
                    $(document).find('.import-shard-panel-wall-shard-front-selected').hide();
                    $scope.toAddShards = [];
                    $scope.toAddShardsSelected = 0;
                    ToastService.raiseInfo($scope.translation.shardsAddedToTour);
                    $scope.tourModel = [];
                    $scope.tourModel = response.data;
                    $scope.addingShard = false;
                },
                function (evt) {
                    $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                }
            );

        };

        $scope.showPlan = function (event, shard) {
            var $panel = $(event.currentTarget).find('.import-shard-panel-wall-shard-front-selected');
            if ($scope.cmdOrCtrl) {
                if ($.inArray(shard, $scope.toAddShards) == -1) {
                    $panel.find('.import-shard-panel-wall-shard-front-selected').show();
                }
            }
            else {
                $(event.currentTarget).find('.import-shard-panel-wall-shard-front-content-text').hide();
                $(event.currentTarget).find('.import-shard-panel-wall-shard-front-content-plan').show();
            }
        };

        $scope.showText = function (event, shard) {
            var $panel = $(event.currentTarget).find('.import-shard-panel-wall-shard-front-selected');
            if ($scope.cmdOrCtrl) {
                if ($.inArray(shard, $scope.toAddShards) == -1) {
                    $panel.hide();
                }
            }
            else {
                if ($.inArray(shard, $scope.toAddShards) == -1) {
                    $panel.hide();
                }
                $(event.currentTarget).find('.import-shard-panel-wall-shard-front-content-text').show();
                $(event.currentTarget).find('.import-shard-panel-wall-shard-front-content-plan').hide();
            }
        };

        /** Search Section **/
        $scope.omniSearch = function (needle) {

            $log.debug('Starting searching for: ' + needle);
            var locale = TranslationService.getCurrentLocale();

            if (needle !== '') {
                $scope.needle = needle;
                return ShardService.getAutocompleteData(needle, locale, constants._AUTOCOMPLETE_ROLES_BIT_MASK.city).then(function (response) {
                    $log.debug('response', response);
                    $log.debug('pois', response.data['pois']);

                    $scope.searchResults = response.data['pois'];
                    return $scope.searchResults
                });
            }
        };

        $scope.initOmnisearch = function () {
            $scope.searchBox = $('#searchbox');
            $scope.searchInput = $scope.searchBox.find('input');

            if ($scope.searchTags.length > 0) {
                $log.debug('InitOmniSearch...');
                $scope.searchInput.attr('placeholder', '');
                $scope.searchBox.attr('placeholder', '');
            }

            $scope.searchBox.on('focus', function () {
                //$log.debug('Focus----');
            });

            $scope.searchBox.on('blur', function () {
                $log.debug('Blur----', $scope.searchTags);

                if ($scope.searchTags.length > 0) {
                    $scope.searchInput.removeAttr('placeholder');
                }
            });

            $scope.searchInput.on('keypress', function (event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                //$log.debug(keycode);
                /**if(keycode == '13') {
                $scope.doSearch();
                }   **/
            });
        };

        $scope.addToOmnisearch = function (tag) {
            //tag types: u: users / c: cities
            if (tag.tagType === 'user') {
                $log.debug('Viewing Profile---', tag.nid);
                $state.go('profileById', { userNid: user.nid });
            } else {
                $log.debug('Tag added---', tag);
                $scope.searchBox.find('input').removeAttr('placeholder');
            }

        };

        $scope.removeFromOmnisearch = function (tag) {
            $log.debug('Tag removed---');

            if ($scope.searchTags.length < 1) {
                $scope.searchInput.attr('placeholder', $scope.translation.search_on + ' Wayonara');
            }

            //$scope.doSearch();
        };
        /** Search Section **/

        //div contenente la scroll
        $('.tour-wall').scroll(function () {

            if ($(window).scrollTop() + $(window).height() == $(document).height()) {
                if ($scope.activatePagination == true) {
                    $log.debug('beccato');
                    $scope.activatePagination = false;
                    $scope.getNextPage();
                }
            }
        });

    }
}());
