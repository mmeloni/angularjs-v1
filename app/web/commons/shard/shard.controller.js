/**
 * Shard Controller.
 *
 * @author Michele Meloni, Maurizio Vacca, Paolo Mastinu
 * @version 0.2
 */
(function () {
    'use strict';

    angular.module('wayonara.social')
        .controller('ShardController', ShardController);

    ShardController.$inject = [
        '$log',
        '$mdToast',
        '$scope',
        '$state',
        '$uibModal',
        'constants',
        'BoardService',
        'ModalService',
        'ShardService',
        'TranslationService',
        'UserService',
        'ToastService',
        'TourService',
        'LoadingStateService',
        'TrackingService'
    ];

    function ShardController(
        $log,
        $mdToast,
        $scope,
        $state,
        $uibModal,
        constants,
        BoardService,
        ModalService,
        ShardService,
        TranslationService,
        UserService,
        ToastService,
        TourService,
        LoadingStateService,
        TrackingService
    ) {

        $scope.shard = $scope.ngModel;
        $log.debug('ShardController shard:', $scope.shard);

        $scope.viewer = UserService.getUser();
        $scope.imgFormat = ShardService.getTilePicture($scope.tileSize);

        $scope.translation = TranslationService.getTranslationLabels();
        $scope.isPopoverPlaceOpen = false;
        $scope.isPopoverUserOpen = false;

        if ($scope.shard.title == 'tour_title_empty') {
            $scope.shard.title = $scope.translation.tour_title_empty;
        }
        if ($scope.shard.description == 'tour_description_empty') {
            $scope.shard.description = $scope.translation.tour_description_empty;
        }

        $scope.like = {
            iconClasses: $scope.shard.likeUser === true ? 'wn-icon wn-icon-like wn-icon-like-color vertical-align-middle' : 'wn-icon wn-icon-like vertical-align-middle'
        }

        //--Creates the dynamic menu
        $scope.menuOptions = [];
        $scope.tourStatus = {};

        $scope.popoverPlaceTemplate = 'web/commons/ui-components/popover/popover-place/ng1-popover-place.template.html';
        $scope.popoverUserTemplate = 'web/commons/ui-components/popover/popover-user/ng1-popover-user.template.html';

        //menuOptions action declarations
        $scope.deleteTour = function (event) {
            $log.debug('ShardController - removeTour - event target closest');
            $log.debug(event);
            var $shardElement = event.target.closest('.wn-tile');
            TourService.deleteTour($scope.shard);
            $scope.gridManager.remove($shardElement);
            $scope.gridManager.layout();
        };

        $scope.removeFromBoard = function (event) {
            $log.debug('ShardController.removeFromBoard() - event', event);

            var $shardElement = event.target.closest('.wn-tile');
            var boardId = $state.params.boardId;
            var shard = $scope.ngModel;

            BoardService.getBoardById(boardId)
                .then(
                    function (response) {
                        // Recupero la board dalla quale cancellare lo shard
                        var board = response.data;

                        var shardsId = [];

                        shardsId.push(shard.id);

                        var boardRequest = {
                            board: board,
                            shardsId: shardsId
                        };

                        /** Devo controllare se la shard rimasta nella board è l'ultima e in caso affermativo
                         * avvertire l'utente che cancellando questo shard cancellerà anche la board
                         **/
                        //** Se lo shard che cancello è l'ultimo viene cancellata anche la board **/
                        // NOTE - SIMO: why show this important warning inside a toast which disappear after x seconds?
                        if (board.shards.length === 1) {
                            $mdToast.show({
                                controller: 'ToastRemoveShardFromBoardController',
                                templateUrl: 'web/commons/toast/toast-remove-shard-from-board.html',
                                parent: angular.element('.header'),
                                hideDelay: 4000,
                                locals: {
                                    message: $scope.translation.shardDeleting,
                                    board: board,
                                    shard: shard,
                                    boardRequest: boardRequest
                                }
                            });
                        } else {
                            BoardService.deleteShardFromBoard(boardRequest).then(
                                function (response) {
                                    if (response.status === 200) {
                                        // $state.go('profile.view.boards');
                                        $state.go('profileByView', {
                                            userNid: $scope.viewer.nid,
                                            viewType: 'boards'
                                        });
                                    }
                                }
                            );

                            $scope.gridManager.remove($shardElement);
                            $scope.gridManager.layout();
                        }
                    }
                )
                .catch(
                    function (error) {
                        $log.debug('-- shard.controller - removeFromBoard error in getBoardById ', error);
                    }
                )
        };

        $scope.report = function () {
            ShardService.reportShard($scope.shard).then(function (response) {
                ToastService.raiseInfo($scope.translation.shardReported);
            });
        };

        if (typeof($scope.shard) !== 'undefined' && $scope.shard != null) {
            switch ($scope.shard.bit) {
                case constants._SHARD_BIT_MASK.stage:
                case constants._SHARD_BIT_MASK.attraction:
                case constants._SHARD_BIT_MASK.hotel:
                    if ($scope.shard.user !== null && $scope.shard.user.nid === UserService.getUser().nid) {
                        // TODO: delete shard not yet implemented
                        // $scope.menuOptions.push({
                        //     action: $scope.remove,
                        //     label: $scope.translation.del,
                        //     description: $scope.translation.deleteThisShard
                        // });
                    }
                    else {
                        $scope.menuOptions.push({
                            action: $scope.report,
                            label: $scope.translation.report,
                            description: $scope.translation.reportThisShard
                        });
                    }
                    if ($scope.shard.user !== null && $scope.shard.user.nid === UserService.getUser().nid && $state.$current.includes.board === true) {
                        $scope.menuOptions.push({
                            action: $scope.removeFromBoard,
                            label: $scope.translation.deleteFromBoard,
                            description: $scope.translation.deleteThisFromBoard
                        });
                    }

                    break;
                case constants._SHARD_BIT_MASK.tour:
                    $scope.tourStatus = {
                        label: ($scope.shard.status === 1) ? 'Draft' : '',
                        class: ($scope.shard.status === 1) ? 'statusDraft' : ''
                    };

                    // only tour creator can delete shad tour
                    if ($scope.shard.user !== null && $scope.shard.user.nid === UserService.getUser().nid) {
                        $scope.menuOptions.push({
                            action: $scope.deleteTour,
                            label: $scope.translation.deleteTour,
                            description: $scope.translation.deleteThisTour
                        });
                    }
                    else {
                        $scope.menuOptions.push({
                            action: $scope.report,
                            label: $scope.translation.report,
                            description: $scope.translation.reportThisShard
                        });
                    }
                    break;
            }
        }

        $scope.showDetails = function () {
            LoadingStateService.startLoading();
            switch ($scope.shard.bit) {
                case constants._SHARD_BIT_MASK.stage:
                case constants._SHARD_BIT_MASK.attraction:
                case constants._SHARD_BIT_MASK.hotel:
                    ShardService.getShardById($scope.shard.id)
                        .then(function (response) {
                            LoadingStateService.stopLoading();
                            ModalService.openShardDetail(response.data, $scope.viewer);
                        })
                        .catch(function () {
                            LoadingStateService.stopLoading();
                        });
                    break;
                case constants._SHARD_BIT_MASK.tour:
                    goToTour({ tourId: $scope.shard.id });
                    break;
            }
        };

        $scope.viewOwner = function (user) {
            //$state.go('profile.view', { userId: user.nid });
            $state.go('profileById', { userNid: user.nid });
        };

        $scope.toggleLike = function () {
            var toggle = !$scope.shard.likeUser;
            $scope.shard.likeUser = toggle;

            ShardService.toggleLike($scope.shard.id).then(function (response) {
                $log.debug('-- ShardController -  ShardService.toggleLike response', response);

                if (response.data.status === true) {
                    $log.debug('-- ShardController -  ShardService.toggleLike - like added');
                    $scope.shard.likeNumber++;
                    $scope.like.iconClasses = 'wn-icon wn-icon-like wn-icon-like-color vertical-align-middle';
                }
                else {
                    $log.debug('-- ShardController -  ShardService.toggleLike - like removed');
                    $scope.like.iconClasses = 'wn-icon wn-icon-like vertical-align-middle';
                    $scope.shard.likeNumber--;
                }
            });
        };

        $scope.plan = function () {
            TrackingService.trigger('clickOnPlan');
            $log.debug('-- shard.controller.js - plan $scope.shard', $scope.shard);
            ModalService.openPlan($scope.shard);
        }

        function goToTour(toParams) {
            if ($scope.shard.user.nid === $scope.viewer.nid) {
                $state.go('tour.edit.plan', toParams);
            } else {
                $state.go('tour.view', toParams);
            }
        }
    }
}());
