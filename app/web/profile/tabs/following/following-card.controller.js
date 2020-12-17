/**
 * Created by paolomastinu on 15/04/16.
 */

(function() {
    'use strict';

    angular.module('wayonara.social').controller('FollowingCardController', FollowingCardController);

    FollowingCardController.$inject = [
        '$state',
        '$scope',
        'UserService',
        '$log',
        'TranslationService',
        'FollowService'
    ];
    function FollowingCardController(
        $state,
        $scope,
        UserService,
        $log,
        TranslationService,
        FollowService
    ) {
        $scope.buttonToshow = null;
        $scope.dropDownActions = [];
        $scope.translation = TranslationService.getTranslationLabels();

        $scope.translation = TranslationService.getTranslationLabels();

        $scope.actor = UserService.getUser();
        $log.debug('-- FollowingCardController - $scope.actor',$scope.actor);

        // NOTE SIMO: temporary fix until grid is refactored
        $scope.targetForImage = {
            nid: $scope.ngModel.user.nid
        };

        $log.debug('-- FollowingCardController - $scope.targetForImage',$scope.targetForImage);
        $log.debug('-- FollowingCardController - $scope.ngModel.user',$scope.ngModel.user);
        $log.debug('-- FollowingCardController - $scope.target',$scope.target);

        UserService.loadUserFullData($scope.ngModel.user.nid).then(function(response) {
            $scope.target = response;
            $log.debug('-- FollowingCardController - $scope.target',$scope.target);

            if($scope.target.nid !== $scope.actor.nid) {
                if($scope.target.isFollowed === true) {
                    $scope.buttonToshow = { class:'primary', action:'unfollow', params: $scope.target.nid, label: $scope.translation.following };
                }
                if($scope.target.isFollowed === false) {
                    $scope.buttonToshow = { class:'wn-btn-neutral', action:'follow', params: $scope.target.nid, label: $scope.translation.follow };
                }
                if($scope.target.isBlocked === true) {
                    var dropDownActionTo = { class:'', action:'unblock', params: $scope.target.nid, label: $scope.translation.unblock };
                    $scope.dropDownActions.push(dropDownActionTo);
                }
                if($scope.target.isBlocked === false) {
                    var dropDownActionTo = { class:'', action:'block', params: $scope.target.nid, label: $scope.translation.block };
                    $scope.dropDownActions.push(dropDownActionTo);
                }
            }
        });


        $scope.follow = function(targetNid) {
            FollowService.follow(targetNid).then(
                function(response) {
                    $scope.buttonToshow = { class:'primary', action:'unfollow', params: targetNid, label:'Following' };
                }
            );
        };

        $scope.unfollow = function(targetNid) {
            FollowService.unfollow(targetNid).then(
                function(response) {
                    $scope.buttonToshow = { class:'wn-btn-neutral', action:'follow', params: targetNid, label:'Follow' };
                }
            );
        };

        $scope.block = function(userToBlockNid) {
            UserService.blockUser(userToBlockNid).then(
                function(response) {
                    $log.debug('-- following-card.controller - blockUser - userToBlockNid', userToBlockNid, respone);
                }
            );
        };

        $scope.unblock = function(userToUnBlockNid) {
            UserService.unblockUser(userToUnBlockNid).then(
                function(response) {
                    $log.debug('-- following-card.controller - unblockUser - userToUnBlockNid', userToUnBlockNid, respone);
                }
            );
        };

        $scope.editProfile = function() {
            $state.go('profileEdit');
        };

        $scope.viewProfile = function() {
            // $state.go('profile.view', { userId: $scope.target.nid });
            $state.go('profileById', { userNid: user.nid });
        };
    }
}());
