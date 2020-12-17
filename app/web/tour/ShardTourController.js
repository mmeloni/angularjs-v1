/**
 * Shard Controller.
 *
 * @author Michele Meloni, Maurizio Vacca
 * @version 0.2
 */
(function () {
    'use strict';

    angular.module('wayonara.social').controller('ShardTourController', ShardTourController);

    ShardTourController.$inject = ['$scope', '$state', '$log', 'ShardService', 'UserService', 'TranslationService'];

    function ShardTourController($scope, $state, $log, ShardService, UserService, TranslationService) {
        var translation = TranslationService.getTranslationLabels();
        $scope.translation = translation;

        if ($scope.shard.title == 'tour_title_empty') {
            $scope.shard.title = translation.tour_title_empty;
        }
        if ($scope.shard.description == 'tour_description_empty') {
            $scope.shard.description = translation.tour_description_empty;
        }

        $scope.menuOptions = [];

        /** Controlliamo che l'utente che guarda il tour sia l'owner per mostrargli published or draft **/
        if ($scope.shard.user.nid === $scope.viewer.nid) {
            $scope.OwnerOrParticipant = true;
            $scope.menuOptions.push({
                'action': $scope.deleteTour,
                'label': translation.deleteTour,
                'description': translation.deleteThisTour
            });
        }
        else {
            $scope.menuOptions.push({
                'action': $scope.report,
                'label': translation.report,
                'description': translation.reportThisShard
            });
        }

        $scope.ownerHover = false;
        $scope.viewer = UserService.getUser();
        $scope.viewOwner = function (user) {
            $state.go('profileById', { userNid: user.nid });
        };

        $scope.toggleLike = function (shard) {
            $log.debug('toggleLike -- ShardController');
            $log.debug(shard);
            var toggle = !shard.likeUser;
            ShardService.toggleLike(shard.id).then(function (response) {
                $log.debug(response);
                shard.likeUser = toggle;
                if (toggle) {
                    shard.likeNumber++;
                }
                else {
                    shard.likeNumber--;
                }
            });
        };

        $scope.report = function (shardTour) {
            $log.debug('Report---');
            $log.debug(shardTour);
        };

        $scope.hide = function (shardTour) {
            $log.debug('Hide---');
            $log.debug(shardTour);
        };

        $scope.goToTourDetail = function (tour) {
            $log.log('goToTourDetail');
            var value = $('.shard-o-saic, .search .shard-o-saic, .stream .shard-o-saic').css('width');
            $('.shard-o-saic, .search .shard-o-saic, .stream .shard-o-saic').css({ 'width': value });
            $state.go('tour.view', { tourId: tour.id });
        }

        var statusLabel = ($scope.shard.status == 1) ? 'Draft' : 'Published';
        var statusClass = ($scope.shard.status == 1) ? 'statusDraft' : 'statusPublished';

        $scope.OwnerOrParticipant = false;
        $scope.tourStatus = { 'label': statusLabel, 'class': statusClass };
    }
})();
